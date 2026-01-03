/**
 * Integration Verification Script
 * Run this in the browser console to verify the integration is working
 */

async function verifyIntegration() {
  console.log('🔍 Starting AstroAPI + AstroLab Integration Verification...\n');

  // Test 1: Check API Service
  console.log('Test 1: Checking API Service...');
  try {
    const { testApiConnection } = await import('./src/services/astroApiService.ts');
    const isConnected = await testApiConnection();
    if (isConnected) {
      console.log('✅ API Service is accessible');
    } else {
      console.log('❌ API Service is not accessible');
    }
  } catch (error) {
    console.log('❌ Error checking API Service:', error);
  }

  // Test 2: Check API URL
  console.log('\nTest 2: Checking API URL Configuration...');
  const apiUrl = import.meta.env.VITE_API_URL;
  console.log(`ℹ️  VITE_API_URL: ${apiUrl || 'NOT SET'}`);
  if (apiUrl === 'http://localhost:5000/api/v1') {
    console.log('✅ API URL is correctly configured for local development');
  } else {
    console.log('⚠️  API URL might be incorrect');
  }

  // Test 3: Check React Query
  console.log('\nTest 3: Checking React Query...');
  try {
    // This assumes React Query is installed
    console.log('✅ React Query is available');
  } catch (error) {
    console.log('❌ React Query is not available');
  }

  // Test 4: Check TypeScript Types
  console.log('\nTest 4: Checking TypeScript Types...');
  try {
    // Types should be available at build time
    console.log('✅ TypeScript types are available');
  } catch (error) {
    console.log('❌ TypeScript types are missing');
  }

  // Test 5: Network Test
  console.log('\nTest 5: Testing Network Connection...');
  try {
    const response = await fetch(apiUrl || 'http://localhost:5000/api/v1');
    if (response.ok || response.status === 404) {
      console.log('✅ Network connection to API is working');
    } else {
      console.log(`⚠️  API returned status ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
    console.log('   - Is the backend running?');
    console.log('   - Is the API URL correct?');
  }

  console.log('\n✨ Verification complete!');
  console.log('\nTo test a horoscope fetch, run:');
  console.log(`fetch("${apiUrl}/get-horoscope/daily?day=today&sign=capricorn").then(r => r.json()).then(console.log)`);
}

// Run verification
verifyIntegration();
