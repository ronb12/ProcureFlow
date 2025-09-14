const { chromium } = require('playwright');

async function testFreshLogin() {
  console.log('🔍 Testing fresh login with cleared session...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  // Create a fresh context to clear any existing session
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capture all console messages
  page.on('console', msg => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`[${timestamp}] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });
  
  try {
    console.log('📱 Step 1: Going to home page with fresh session...');
    await page.goto('https://procureflow-demo.web.app', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    
    let currentUrl = page.url();
    console.log('📍 Initial URL:', currentUrl);
    
    // Check if we're redirected to login
    if (currentUrl.includes('/login')) {
      console.log('✅ Redirected to login page');
      
      console.log('📱 Step 2: Filling and submitting login form...');
      await page.fill('input[type="email"]', 'approver@procureflow.demo');
      await page.fill('input[type="password"]', 'demo123');
      await page.click('button[type="submit"]');
      
      console.log('📱 Step 3: Waiting for redirect after login...');
      await page.waitForTimeout(5000);
      
      const finalUrl = page.url();
      console.log('🎯 Final URL after login:', finalUrl);
      
      if (finalUrl.includes('/approvals')) {
        console.log('🎉 SUCCESS: Correctly routed to /approvals');
      } else if (finalUrl.includes('/requests')) {
        console.log('❌ FAILURE: Incorrectly routed to /requests');
      } else {
        console.log('⚠️ UNKNOWN: Routed to:', finalUrl);
      }
    } else {
      console.log('⚠️ Not redirected to login, checking if user is already logged in');
      
      // Check if there's user information on the page
      const pageContent = await page.textContent('body');
      if (pageContent.includes('approver') || pageContent.includes('requester')) {
        console.log('✅ User appears to be logged in');
        console.log('📍 Current URL:', currentUrl);
      } else {
        console.log('❌ No user information found, might be an issue');
      }
    }
    
    // Take screenshot
    await page.screenshot({ path: 'fresh-login-test.png' });
    console.log('📸 Screenshot saved as fresh-login-test.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    console.log('⏳ Keeping browser open for 10 seconds...');
    await page.waitForTimeout(10000);
    await browser.close();
  }
}

testFreshLogin().catch(console.error);
