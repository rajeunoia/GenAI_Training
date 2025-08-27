// Playwright test for OAuth flow
const { chromium } = require('playwright');

const VERCEL_URL = 'https://turingdata-genai-training.vercel.app';

async function testOAuthFlow() {
  console.log('🎭 Starting Playwright OAuth Test...');
  console.log('=====================================\n');

  const browser = await chromium.launch({ 
    headless: false, // Set to true for CI
    slowMo: 1000 // Slow down for better visibility
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Test 1: Check if the debug endpoint works
    console.log('📋 Test 1: Checking OAuth Debug Endpoint...');
    await page.goto(`${VERCEL_URL}/api/auth/debug`);
    
    const debugContent = await page.textContent('body');
    console.log('Debug response:', debugContent);
    
    const debugData = JSON.parse(debugContent);
    console.log('Environment check:');
    console.log(`  ✅ Client ID: ${debugData.hasClientId ? 'Set' : '❌ Missing'}`);
    console.log(`  ✅ Client Secret: ${debugData.hasClientSecret ? 'Set' : '❌ Missing'}`);
    console.log(`  ✅ Session Secret: ${debugData.hasSessionSecret ? 'Set' : '❌ Missing'}`);
    console.log(`  📍 Callback URL: ${debugData.callbackURL}`);
    
    // Test 2: Load home page
    console.log('\n📋 Test 2: Loading Home Page...');
    await page.goto(VERCEL_URL);
    await page.waitForLoadState('networkidle');
    
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
    // Check if Google sign-in button exists
    const signInButton = await page.locator('text=Sign in with Google').first();
    const hasSignInButton = await signInButton.count() > 0;
    console.log(`Google Sign-in button found: ${hasSignInButton ? '✅ Yes' : '❌ No'}`);
    
    if (!hasSignInButton) {
      console.log('Checking for alternative sign-in elements...');
      const authElements = await page.locator('[href*="google"], [onclick*="google"], button:has-text("Sign"), button:has-text("Login")').count();
      console.log(`Found ${authElements} potential auth elements`);
    }
    
    // Test 3: Test static routes
    console.log('\n📋 Test 3: Testing Static Routes...');
    
    const routes = [
      { path: '/training', name: 'Training Page' },
      { path: '/evaluation/1', name: 'Week 1 Evaluation' },
      { path: '/evaluation/2', name: 'Week 2 Evaluation' }
    ];
    
    for (const route of routes) {
      try {
        await page.goto(`${VERCEL_URL}${route.path}`);
        await page.waitForLoadState('networkidle');
        const routeTitle = await page.title();
        console.log(`  ✅ ${route.name}: Loaded (${routeTitle})`);
      } catch (error) {
        console.log(`  ❌ ${route.name}: Failed - ${error.message}`);
      }
    }
    
    // Test 4: Test API endpoints
    console.log('\n📋 Test 4: Testing API Endpoints...');
    
    const apiRoutes = [
      { path: '/api/health', name: 'Health Check' },
      { path: '/api/auth/status', name: 'Auth Status' }
    ];
    
    for (const route of apiRoutes) {
      try {
        const response = await page.goto(`${VERCEL_URL}${route.path}`);
        const content = await page.textContent('body');
        console.log(`  ✅ ${route.name}: ${response.status()} - ${content.substring(0, 100)}...`);
      } catch (error) {
        console.log(`  ❌ ${route.name}: Failed - ${error.message}`);
      }
    }
    
    // Test 5: Try OAuth flow (without actually completing it)
    console.log('\n📋 Test 5: Testing OAuth Initiation...');
    await page.goto(VERCEL_URL);
    
    // Listen for requests to Google
    page.on('request', request => {
      if (request.url().includes('accounts.google.com')) {
        console.log(`  🔍 Google OAuth request: ${request.url().substring(0, 100)}...`);
      }
    });
    
    page.on('response', response => {
      if (response.url().includes('accounts.google.com') || response.url().includes('/api/auth/')) {
        console.log(`  📡 Response: ${response.status()} ${response.url().substring(0, 100)}...`);
      }
    });
    
    // Try to click the sign-in button (if found)
    if (hasSignInButton) {
      console.log('  🔗 Attempting to click Google sign-in...');
      await signInButton.click();
      
      // Wait to see if we get redirected to Google
      try {
        await page.waitForURL('**/accounts.google.com/**', { timeout: 5000 });
        console.log('  ✅ Successfully redirected to Google OAuth');
      } catch (error) {
        console.log('  ❌ No redirect to Google detected');
        console.log(`  Current URL: ${page.url()}`);
      }
    }
    
    console.log('\n🎯 Test Summary:');
    console.log('================');
    console.log('1. Check the debug endpoint results above');
    console.log('2. Verify all environment variables are "Set"');
    console.log('3. Ensure static routes load correctly');
    console.log('4. Confirm API endpoints respond');
    console.log('5. Test OAuth initiation flow');
    
    // Keep browser open for manual inspection
    console.log('\n🔍 Browser will stay open for 30 seconds for manual inspection...');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Install and run instructions
if (require.main === module) {
  console.log('To run this test:');
  console.log('1. npm install playwright');
  console.log('2. npx playwright install chromium');
  console.log('3. node test-oauth-playwright.js');
  console.log('');
  
  testOAuthFlow().catch(console.error);
}

module.exports = testOAuthFlow;