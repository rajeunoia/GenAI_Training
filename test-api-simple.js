// Simple API test without Playwright
const https = require('https');

const VERCEL_URL = 'https://turingdata-genai-training.vercel.app';

async function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'turingdata-genai-training.vercel.app',
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'Test-Script/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (error) => reject(error));
    req.setTimeout(10000, () => {
      req.abort();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

async function testAPI() {
  console.log('🧪 Testing Vercel Deployment APIs...');
  console.log('===================================\n');

  const tests = [
    { path: '/', name: 'Home page', expectCode: 200 },
    { path: '/api/health', name: 'Health check', expectCode: 200 },
    { path: '/api/auth/debug', name: 'OAuth Debug', expectCode: 200 },
    { path: '/api/auth/status', name: 'Auth Status', expectCode: 200 },
    { path: '/training', name: 'Training page', expectCode: 200 },
    { path: '/evaluation/1', name: 'Week 1 evaluation', expectCode: 200 },
    { path: '/dashboard', name: 'Dashboard (should redirect)', expectCode: [302, 401] }
  ];

  const results = [];

  for (const test of tests) {
    try {
      console.log(`📋 Testing ${test.name}...`);
      const response = await makeRequest(test.path);
      
      const expectedCodes = Array.isArray(test.expectCode) ? test.expectCode : [test.expectCode];
      const isExpected = expectedCodes.includes(response.statusCode);
      
      if (isExpected) {
        console.log(`  ✅ ${test.name}: ${response.statusCode} (Expected)`);
        
        // Parse JSON responses for debugging info
        if (test.path.includes('/api/')) {
          try {
            const jsonData = JSON.parse(response.body);
            if (test.path === '/api/auth/debug') {
              console.log('    🔍 OAuth Configuration:');
              console.log(`      Environment: ${jsonData.environment}`);
              console.log(`      Client ID: ${jsonData.hasClientId ? '✅ Set' : '❌ Missing'}`);
              console.log(`      Client Secret: ${jsonData.hasClientSecret ? '✅ Set' : '❌ Missing'}`);
              console.log(`      Session Secret: ${jsonData.hasSessionSecret ? '✅ Set' : '❌ Missing'}`);
              console.log(`      Callback URL: ${jsonData.callbackURL}`);
            }
            if (test.path === '/api/health') {
              console.log(`    🏥 Health: ${jsonData.status} (${jsonData.environment})`);
            }
            if (test.path === '/api/auth/status') {
              console.log(`    🔐 Auth: ${jsonData.authenticated ? 'Authenticated' : 'Not authenticated'}`);
            }
          } catch (e) {
            // Not JSON, that's fine
          }
        }
      } else {
        console.log(`  ⚠️  ${test.name}: ${response.statusCode} (Expected: ${test.expectCode})`);
      }
      
      results.push({
        test: test.name,
        status: response.statusCode,
        success: isExpected,
        body: response.body.substring(0, 200)
      });
      
    } catch (error) {
      console.log(`  ❌ ${test.name}: Error - ${error.message}`);
      results.push({
        test: test.name,
        status: 'ERROR',
        success: false,
        error: error.message
      });
    }
  }

  console.log('\n🎯 Test Summary:');
  console.log('===============');
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Successful: ${successful}/${total}`);
  console.log(`❌ Failed: ${total - successful}/${total}`);
  
  if (successful === total) {
    console.log('\n🎉 All tests passed! Your deployment is working correctly.');
  } else {
    console.log('\n🔧 Some tests failed. Check the details above.');
  }

  // OAuth-specific diagnostics
  const debugResult = results.find(r => r.test === 'OAuth Debug');
  if (debugResult && debugResult.success) {
    try {
      const debugData = JSON.parse(debugResult.body);
      console.log('\n🔍 OAuth Diagnostics:');
      
      if (!debugData.hasClientId || !debugData.hasClientSecret) {
        console.log('❌ Missing Google OAuth credentials in Vercel environment variables');
      }
      
      if (!debugData.hasSessionSecret) {
        console.log('❌ Missing session secret in Vercel environment variables');
      }
      
      if (debugData.hasClientId && debugData.hasClientSecret && debugData.hasSessionSecret) {
        console.log('✅ All OAuth environment variables are set');
        console.log('🔧 If OAuth is still failing, check Google Cloud Console settings:');
        console.log(`   Callback URL: ${debugData.callbackURL}`);
      }
    } catch (e) {
      console.log('Could not parse debug data');
    }
  }
}

testAPI().catch(console.error);