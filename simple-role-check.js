const { chromium } = require('playwright');

async function simpleRoleCheck() {
  console.log('🔍 Simple role check...');
  
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
    console.log('📱 Step 1: Going to login page...');
    await page.goto('https://procureflow-demo.web.app/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    console.log('📱 Step 2: Filling and submitting login form...');
    await page.fill('input[type="email"]', 'approver@procureflow.demo');
    await page.fill('input[type="password"]', 'demo123');
    await page.click('button[type="submit"]');
    
    console.log('📱 Step 3: Waiting for redirect...');
    await page.waitForTimeout(5000);
    
    const finalUrl = page.url();
    console.log('🎯 Final URL:', finalUrl);
    
    // Execute JavaScript to check the user role
    console.log('📱 Step 4: Checking user role via JavaScript...');
    const userRole = await page.evaluate(() => {
      // Try to access the user object from the global scope or React DevTools
      if (window.React && window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
        console.log('React found, trying to access user state...');
      }
      
      // Try to find user information in the DOM
      const userElements = document.querySelectorAll('[data-testid*="user"], [class*="user"], [class*="role"]');
      let roleInfo = '';
      userElements.forEach(el => {
        if (el.textContent && el.textContent.includes('role')) {
          roleInfo += el.textContent + ' ';
        }
      });
      
      return {
        url: window.location.href,
        roleInfo: roleInfo,
        hasApprover: document.body.textContent.includes('approver'),
        hasRequester: document.body.textContent.includes('requester'),
        bodyText: document.body.textContent.substring(0, 500)
      };
    });
    
    console.log('📊 User role check results:', userRole);
    
    // Take screenshot
    await page.screenshot({ path: 'simple-role-check.png' });
    console.log('📸 Screenshot saved as simple-role-check.png');
    
  } catch (error) {
    console.error('❌ Check failed:', error);
  } finally {
    console.log('⏳ Keeping browser open for 10 seconds...');
    await page.waitForTimeout(10000);
    await browser.close();
  }
}

simpleRoleCheck().catch(console.error);
