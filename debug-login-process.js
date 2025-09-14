const { chromium } = require('playwright');

async function debugLoginProcess() {
  console.log('🔍 Starting detailed login process debug...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 2000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capture all console messages
  page.on('console', msg => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`[${timestamp}] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });
  
  // Capture page navigation
  page.on('framenavigated', frame => {
    if (frame === page.mainFrame()) {
      console.log(`🔄 NAVIGATION: ${frame.url()}`);
    }
  });
  
  try {
    console.log('📱 Step 1: Starting at home page...');
    await page.goto('https://procureflow-demo.web.app', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    
    let currentUrl = page.url();
    console.log('📍 Home page URL:', currentUrl);
    
    // Check if we're redirected to login
    if (currentUrl.includes('/login')) {
      console.log('✅ Redirected to login page from home');
    } else {
      console.log('⚠️ Not redirected to login, navigating manually...');
      await page.goto('https://procureflow-demo.web.app/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForLoadState('networkidle', { timeout: 30000 });
      currentUrl = page.url();
      console.log('📍 Login page URL:', currentUrl);
    }
    
    console.log('📱 Step 2: Filling login form...');
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.fill('input[type="email"]', 'approver@procureflow.demo');
    await page.fill('input[type="password"]', 'demo123');
    
    console.log('📱 Step 3: Clicking login...');
    await page.click('button[type="submit"]');
    
    console.log('📱 Step 4: Monitoring redirects...');
    
    // Monitor for any navigation changes
    let redirectCount = 0;
    const maxRedirects = 10;
    
    while (redirectCount < maxRedirects) {
      await page.waitForTimeout(1000);
      const newUrl = page.url();
      
      if (newUrl !== currentUrl) {
        redirectCount++;
        console.log(`🔄 REDIRECT ${redirectCount}: ${currentUrl} → ${newUrl}`);
        currentUrl = newUrl;
        
        // If we're redirected away from login, check where we go
        if (!newUrl.includes('/login')) {
          console.log('✅ Redirected away from login page');
          break;
        }
      }
      
      console.log(`⏳ Waiting for redirect... (${redirectCount}/${maxRedirects})`);
    }
    
    console.log('🎯 Final URL:', currentUrl);
    
    // Check the final result
    if (currentUrl.includes('/approvals')) {
      console.log('🎉 SUCCESS: Correctly routed to /approvals');
    } else if (currentUrl.includes('/requests')) {
      console.log('❌ FAILURE: Incorrectly routed to /requests');
    } else {
      console.log('⚠️ UNKNOWN: Routed to:', currentUrl);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'debug-login-process.png' });
    console.log('📸 Screenshot saved as debug-login-process.png');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    console.log('⏳ Keeping browser open for 20 seconds...');
    await page.waitForTimeout(20000);
    await browser.close();
  }
}

debugLoginProcess().catch(console.error);
