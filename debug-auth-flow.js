const { chromium } = require('playwright');

async function debugAuthFlow() {
  console.log('🔍 Starting detailed authentication flow debug...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 2000 // Slower for better observation
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capture all console messages
  page.on('console', msg => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`[${timestamp}] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });
  
  // Capture network requests
  page.on('request', request => {
    if (request.url().includes('firebase') || request.url().includes('auth')) {
      console.log(`🌐 REQUEST: ${request.method()} ${request.url()}`);
    }
  });
  
  // Capture responses
  page.on('response', response => {
    if (response.url().includes('firebase') || response.url().includes('auth')) {
      console.log(`📡 RESPONSE: ${response.status()} ${response.url()}`);
    }
  });
  
  try {
    console.log('📱 Navigating to https://procureflow-demo.web.app...');
    await page.goto('https://procureflow-demo.web.app', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    console.log('⏳ Waiting for initial page load...');
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    
    let currentUrl = page.url();
    console.log('📍 Initial URL:', currentUrl);
    
    // If we're not on login, navigate there
    if (!currentUrl.includes('/login')) {
      console.log('🔄 Navigating to login page...');
      await page.goto('https://procureflow-demo.web.app/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForLoadState('networkidle', { timeout: 30000 });
      currentUrl = page.url();
      console.log('📍 Login page URL:', currentUrl);
    }
    
    // Wait for form elements
    console.log('⏳ Waiting for login form...');
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.waitForSelector('input[type="password"]', { timeout: 10000 });
    
    // Fill credentials
    console.log('✍️ Filling credentials...');
    await page.fill('input[type="email"]', 'approver@procureflow.demo');
    await page.fill('input[type="password"]', 'demo123');
    
    // Click login
    console.log('🔐 Clicking login...');
    await page.click('button[type="submit"]');
    
    // Monitor the authentication process
    console.log('⏳ Monitoring authentication process...');
    
    // Wait for any navigation or state changes
    let attempts = 0;
    const maxAttempts = 20; // 20 seconds
    
    while (attempts < maxAttempts) {
      await page.waitForTimeout(1000);
      const newUrl = page.url();
      
      if (newUrl !== currentUrl) {
        console.log(`🔄 URL changed: ${currentUrl} → ${newUrl}`);
        currentUrl = newUrl;
        
        // If we're redirected away from login, that's good
        if (!newUrl.includes('/login')) {
          console.log('✅ Successfully redirected away from login page!');
          break;
        }
      }
      
      attempts++;
      console.log(`⏳ Waiting... (${attempts}/${maxAttempts})`);
    }
    
    // Final state
    const finalUrl = page.url();
    console.log('🎯 Final URL:', finalUrl);
    
    // Check for any error messages on the page
    const errorText = await page.textContent('body');
    if (errorText.includes('error') || errorText.includes('Error')) {
      console.log('❌ Found error text on page');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'debug-auth-flow.png' });
    console.log('📸 Screenshot saved as debug-auth-flow.png');
    
    // Check if we can see the user's role in the UI
    const roleElement = await page.$('[class*="role"], [data-testid*="role"]');
    if (roleElement) {
      const roleText = await roleElement.textContent();
      console.log('👤 User role in UI:', roleText);
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    console.log('⏳ Keeping browser open for 15 seconds for observation...');
    await page.waitForTimeout(15000);
    await browser.close();
  }
}

debugAuthFlow().catch(console.error);
