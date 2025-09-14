const { chromium } = require('playwright');

async function fullLoginTest() {
  console.log('🚀 Starting full login test for Approver...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1500
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capture all console messages
  page.on('console', msg => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`[${timestamp}] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });
  
  try {
    console.log('📱 Step 1: Navigating to login page...');
    await page.goto('https://procureflow-demo.web.app/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    
    console.log('📱 Step 2: Waiting for login form...');
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.waitForSelector('input[type="password"]', { timeout: 10000 });
    
    console.log('📱 Step 3: Filling credentials...');
    await page.fill('input[type="email"]', 'approver@procureflow.demo');
    await page.fill('input[type="password"]', 'demo123');
    
    console.log('📱 Step 4: Clicking login button...');
    await page.click('button[type="submit"]');
    
    console.log('📱 Step 5: Waiting for authentication...');
    // Wait for any navigation or state change
    await page.waitForTimeout(5000);
    
    // Check current URL
    let currentUrl = page.url();
    console.log('📍 Current URL after login attempt:', currentUrl);
    
    // If still on login page, wait a bit more
    if (currentUrl.includes('/login')) {
      console.log('⏳ Still on login page, waiting for redirect...');
      await page.waitForTimeout(5000);
      currentUrl = page.url();
      console.log('📍 URL after additional wait:', currentUrl);
    }
    
    // Check if we're redirected
    if (!currentUrl.includes('/login')) {
      console.log('✅ Successfully redirected from login page!');
      console.log('🎯 Final URL:', currentUrl);
      
      // Check if it's the correct page
      if (currentUrl.includes('/approvals')) {
        console.log('🎉 SUCCESS: Approver correctly routed to /approvals');
      } else if (currentUrl.includes('/requests')) {
        console.log('❌ FAILURE: Approver incorrectly routed to /requests');
      } else {
        console.log('⚠️ UNKNOWN: Approver routed to:', currentUrl);
      }
    } else {
      console.log('❌ Still on login page - login may have failed');
      
      // Check for error messages
      const errorElements = await page.$$('[class*="error"], [class*="Error"], .text-red-500, .text-red-600');
      if (errorElements.length > 0) {
        console.log('⚠️ Found error elements on login page');
        for (const element of errorElements) {
          const text = await element.textContent();
          if (text && text.trim()) {
            console.log('Error text:', text.trim());
          }
        }
      }
    }
    
    // Navigate to debug page to check user state
    console.log('📱 Step 6: Checking debug page for user state...');
    await page.goto('https://procureflow-demo.web.app/debug', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    
    // Check debug page content
    const debugContent = await page.textContent('body');
    if (debugContent.includes('approver')) {
      console.log('✅ Found "approver" role in debug page');
    } else if (debugContent.includes('requester')) {
      console.log('❌ Found "requester" role in debug page (this is the problem!)');
    } else {
      console.log('⚠️ No clear role information found in debug page');
    }
    
    // Take final screenshot
    await page.screenshot({ path: 'full-login-test-final.png' });
    console.log('📸 Final screenshot saved as full-login-test-final.png');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  } finally {
    console.log('⏳ Keeping browser open for 15 seconds for observation...');
    await page.waitForTimeout(15000);
    await browser.close();
  }
}

fullLoginTest().catch(console.error);
