const { chromium } = require('playwright');

async function checkUserRole() {
  console.log('🔍 Checking user role in database...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capture all console messages
  page.on('console', msg => {
    console.log(`🖥️ ${msg.type().toUpperCase()}: ${msg.text()}`);
  });
  
  try {
    console.log('📱 Navigating to https://procureflow-demo.web.app...');
    await page.goto('https://procureflow-demo.web.app', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Wait for any authentication state
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    
    // Navigate to debug page to see user details
    console.log('🔍 Navigating to debug page...');
    await page.goto('https://procureflow-demo.web.app/debug', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Wait for debug page to load
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    
    // Look for user role information on the debug page
    const userRoleText = await page.textContent('body');
    console.log('📄 Debug page content:', userRoleText);
    
    // Look for specific role information
    if (userRoleText.includes('approver')) {
      console.log('✅ Found "approver" in debug page');
    } else if (userRoleText.includes('requester')) {
      console.log('❌ Found "requester" in debug page (this is the problem!)');
    } else {
      console.log('⚠️ No clear role information found');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'debug-page-role-check.png' });
    console.log('📸 Screenshot saved as debug-page-role-check.png');
    
  } catch (error) {
    console.error('❌ Check failed:', error);
  } finally {
    console.log('⏳ Keeping browser open for 10 seconds...');
    await page.waitForTimeout(10000);
    await browser.close();
  }
}

checkUserRole().catch(console.error);
