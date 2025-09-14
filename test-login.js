const { chromium } = require('playwright');

async function testApproverLogin() {
  console.log('🚀 Starting automated login test for Approver...');
  
  const browser = await chromium.launch({ 
    headless: false, // Set to true to run headless
    slowMo: 1000 // Slow down actions for visibility
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to the local development server
    console.log('📱 Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    
    // Check if we're on the login page or if we need to navigate there
    const currentUrl = page.url();
    console.log('📍 Current URL:', currentUrl);
    
    if (!currentUrl.includes('/login')) {
      console.log('🔄 Redirecting to login page...');
      await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForLoadState('networkidle', { timeout: 30000 });
    }
    
    // Fill in the approver credentials
    console.log('✍️ Filling in approver credentials...');
    await page.fill('input[type="email"]', 'approver@procureflow.demo');
    await page.fill('input[type="password"]', 'demo123');
    
    // Click the login button
    console.log('🔐 Clicking login button...');
    await page.click('button[type="submit"]');
    
    // Wait for navigation after login
    console.log('⏳ Waiting for login to complete...');
    await page.waitForLoadState('networkidle');
    
    // Check the final URL
    const finalUrl = page.url();
    console.log('🎯 Final URL after login:', finalUrl);
    
    // Check for console logs
    console.log('📋 Checking console logs...');
    page.on('console', msg => {
      if (msg.type() === 'log') {
        console.log('🖥️ Console:', msg.text());
      }
    });
    
    // Wait a bit more to see any routing logs
    await page.waitForTimeout(3000);
    
    // Check if we're on the correct page
    if (finalUrl.includes('/approvals')) {
      console.log('✅ SUCCESS: Approver was correctly routed to /approvals');
    } else if (finalUrl.includes('/requests')) {
      console.log('❌ FAILURE: Approver was incorrectly routed to /requests');
    } else {
      console.log('⚠️ UNKNOWN: Approver was routed to:', finalUrl);
    }
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'approver-login-test.png' });
    console.log('📸 Screenshot saved as approver-login-test.png');
    
    // Check the page title and content
    const title = await page.title();
    console.log('📄 Page title:', title);
    
    // Look for role-specific content
    const pageContent = await page.textContent('body');
    if (pageContent.includes('Approvals') || pageContent.includes('approver')) {
      console.log('✅ Found approver-specific content on the page');
    } else {
      console.log('❌ No approver-specific content found');
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  } finally {
    // Keep browser open for a few seconds to see the result
    console.log('⏳ Keeping browser open for 5 seconds...');
    await page.waitForTimeout(5000);
    await browser.close();
  }
}

// Run the test
testApproverLogin().catch(console.error);
