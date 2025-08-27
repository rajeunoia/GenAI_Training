// Comprehensive OAuth flow test
const { test, expect } = require('@playwright/test');

const VERCEL_URL = 'https://turingdata-genai-training.vercel.app';

test.describe('OAuth Authentication Flow', () => {
  
  test('should verify OAuth configuration', async ({ page }) => {
    // Test the debug endpoint first
    await page.goto('/api/auth/debug');
    
    const debugData = await page.textContent('body');
    const config = JSON.parse(debugData);
    
    console.log('🔍 OAuth Configuration Check:');
    console.log(`Environment: ${config.environment}`);
    console.log(`Client ID: ${config.hasClientId ? '✅ Set' : '❌ Missing'}`);
    console.log(`Client Secret: ${config.hasClientSecret ? '✅ Set' : '❌ Missing'}`);
    console.log(`Session Secret: ${config.hasSessionSecret ? '✅ Set' : '❌ Missing'}`);
    console.log(`Callback URL: ${config.callbackURL}`);
    
    // Assert all required configs are present
    expect(config.hasClientId).toBe(true);
    expect(config.hasClientSecret).toBe(true);
    expect(config.hasSessionSecret).toBe(true);
    expect(config.callbackURL).toBe('https://turingdata-genai-training.vercel.app/api/auth/google/callback');
  });

  test('should load home page with sign-in button', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check page title
    const title = await page.title();
    expect(title).toContain('GenAI');
    
    // Look for Google sign-in elements
    const signInButton = page.locator('text=Sign in with Google').first();
    const hasSignIn = await signInButton.count() > 0;
    
    if (!hasSignIn) {
      // Try alternative selectors
      const authElements = await page.locator('[href*="google"], [onclick*="google"], button:has-text("Sign"), button:has-text("Login")').count();
      console.log(`Found ${authElements} potential auth elements`);
      expect(authElements).toBeGreaterThan(0);
    } else {
      expect(hasSignIn).toBe(true);
    }
  });

  test('should test OAuth initiation', async ({ page }) => {
    // Set up request/response logging
    const requests = [];
    const responses = [];
    
    page.on('request', request => {
      if (request.url().includes('google') || request.url().includes('/api/auth/')) {
        requests.push({
          url: request.url(),
          method: request.method(),
          headers: request.headers()
        });
        console.log(`🔗 Request: ${request.method()} ${request.url()}`);
      }
    });
    
    page.on('response', response => {
      if (response.url().includes('google') || response.url().includes('/api/auth/')) {
        responses.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
        console.log(`📡 Response: ${response.status()} ${response.url()}`);
      }
    });
    
    await page.goto('/');
    
    // Try to initiate OAuth
    try {
      // Look for Google OAuth initiation link
      const authLink = page.locator('[href*="/api/auth/google"]').first();
      const hasAuthLink = await authLink.count() > 0;
      
      if (hasAuthLink) {
        console.log('🔗 Found OAuth initiation link, clicking...');
        await authLink.click();
        
        // Wait for either redirect to Google or error
        try {
          await page.waitForURL('**/accounts.google.com/**', { timeout: 10000 });
          console.log('✅ Successfully redirected to Google OAuth');
        } catch (e) {
          console.log('❌ No redirect to Google detected');
          console.log(`Current URL: ${page.url()}`);
          
          // Check if we got an error page
          const bodyText = await page.textContent('body');
          if (bodyText.includes('error') || bodyText.includes('Unauthorized')) {
            console.log('🚨 Error detected on page:', bodyText.substring(0, 200));
          }
        }
      } else {
        console.log('❌ No OAuth initiation link found');
      }
      
    } catch (error) {
      console.log('❌ OAuth initiation failed:', error.message);
    }
    
    // Log all captured requests/responses
    console.log('\n📋 Captured Requests:');
    requests.forEach(req => console.log(`  ${req.method} ${req.url}`));
    
    console.log('\n📋 Captured Responses:');
    responses.forEach(res => console.log(`  ${res.status} ${res.url}`));
  });

  test('should test dashboard redirect when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should redirect to home page or show login
    await page.waitForLoadState('networkidle');
    
    const currentUrl = page.url();
    console.log(`Dashboard redirect result: ${currentUrl}`);
    
    // Should not stay on dashboard if not authenticated
    expect(currentUrl).not.toBe(`${VERCEL_URL}/dashboard`);
  });

  test('should test API endpoints', async ({ page }) => {
    const endpoints = [
      { path: '/api/health', expectedStatus: 200 },
      { path: '/api/auth/status', expectedStatus: 200 },
      { path: '/api/auth/debug', expectedStatus: 200 }
    ];
    
    for (const endpoint of endpoints) {
      console.log(`Testing ${endpoint.path}...`);
      
      const response = await page.goto(endpoint.path);
      console.log(`  Status: ${response.status()}`);
      
      if (endpoint.expectedStatus) {
        expect(response.status()).toBe(endpoint.expectedStatus);
      }
      
      // Try to parse JSON response
      try {
        const content = await page.textContent('body');
        const jsonData = JSON.parse(content);
        console.log(`  Response: ${JSON.stringify(jsonData, null, 2)}`);
      } catch (e) {
        console.log(`  Non-JSON response`);
      }
    }
  });

  test('should test static pages', async ({ page }) => {
    const staticPages = [
      '/training',
      '/evaluation/1', 
      '/evaluation/2',
      '/evaluation/3'
    ];
    
    for (const pagePath of staticPages) {
      console.log(`Testing static page: ${pagePath}`);
      
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      
      const title = await page.title();
      console.log(`  Title: ${title}`);
      
      // Check that page loaded successfully (not 404 or error)
      const bodyText = await page.textContent('body');
      expect(bodyText).not.toContain('Not Found');
      expect(bodyText).not.toContain('404');
      expect(bodyText.length).toBeGreaterThan(100); // Should have substantial content
    }
  });

});

// Test specifically for the OAuth callback error
test.describe('OAuth Callback Error Analysis', () => {
  
  test('should analyze OAuth callback error', async ({ page }) => {
    // Set up detailed logging for OAuth callback
    page.on('console', msg => console.log(`Browser console: ${msg.text()}`));
    
    page.on('requestfailed', request => {
      console.log(`❌ Failed request: ${request.url()} - ${request.failure().errorText}`);
    });
    
    // Try to directly test the OAuth callback with the error URL you provided
    const callbackUrl = '/api/auth/google/callback?code=4%2F0AVMBsJg4i_XnPxN29XpSiiGNIX_eeh3pBCI-tj5Io2UpbQTtwg_orIplVLAtvqPhunjTFA&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&authuser=1&prompt=none';
    
    console.log('🔍 Testing OAuth callback URL directly...');
    const response = await page.goto(callbackUrl);
    
    console.log(`Callback response status: ${response.status()}`);
    
    const content = await page.textContent('body');
    console.log(`Callback response content: ${content}`);
    
    // Check if it's the specific error we've been seeing
    if (content.includes('Authentication failed') && content.includes('Unauthorized')) {
      console.log('🎯 Confirmed: This is the OAuth callback error');
      console.log('🔧 This suggests the Google OAuth code is invalid or expired');
      console.log('💡 This usually means Google Cloud Console redirect URI mismatch');
    }
  });
});