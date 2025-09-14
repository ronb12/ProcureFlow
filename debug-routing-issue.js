const { chromium } = require('playwright');

async function debugRoutingIssue() {
  console.log('🔍 Debugging routing issue...');
  
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
    
    console.log('📱 Step 3: Waiting for authentication and redirect...');
    await page.waitForTimeout(5000);
    
    const finalUrl = page.url();
    console.log('🎯 Final URL:', finalUrl);
    
    console.log('📱 Step 4: Going to debug page to check user role...');
    await page.goto('https://procureflow-demo.web.app/debug', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    
    // Check debug page content for user role
    const debugContent = await page.textContent('body');
    console.log('📄 Debug page content (first 1000 chars):');
    console.log(debugContent.substring(0, 1000));
    
    // Look for role information in the debug content
    if (debugContent.includes('"role":')) {
      const roleMatch = debugContent.match(/"role":\s*"([^"]+)"/);
      if (roleMatch) {
        console.log('🎯 User role in database:', roleMatch[1]);
        if (roleMatch[1] === 'approver') {
          console.log('✅ Role is correct: approver');
        } else {
          console.log('❌ Role is incorrect:', roleMatch[1], '(should be approver)');
        }
      }
    } else {
      console.log('❌ No role information found in debug page');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'debug-routing-issue.png' });
    console.log('📸 Screenshot saved as debug-routing-issue.png');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    console.log('⏳ Keeping browser open for 10 seconds...');
    await page.waitForTimeout(10000);
    await browser.close();
  }
}

debugRoutingIssue().catch(console.error);
