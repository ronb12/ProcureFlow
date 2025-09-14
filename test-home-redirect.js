const { chromium } = require('playwright');

async function testHomeRedirect() {
  console.log('🔍 Testing redirect from home page...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capture all console messages
  page.on('console', msg => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`[${timestamp}] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });
  
  try {
    console.log('📱 Step 1: Going to home page...');
    await page.goto('https://procureflow-demo.web.app', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    
    let currentUrl = page.url();
    console.log('📍 Home page URL:', currentUrl);
    
    if (currentUrl.includes('/login')) {
      console.log('✅ Redirected to login page from home');
      
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
      console.log('⚠️ Not redirected to login, user might already be logged in');
      console.log('📍 Current URL:', currentUrl);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'home-redirect-test.png' });
    console.log('📸 Screenshot saved as home-redirect-test.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    console.log('⏳ Keeping browser open for 10 seconds...');
    await page.waitForTimeout(10000);
    await browser.close();
  }
}

testHomeRedirect().catch(console.error);
