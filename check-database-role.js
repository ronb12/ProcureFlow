const { chromium } = require('playwright');

async function checkDatabaseRole() {
  console.log('🔍 Checking what role is actually stored in the database...');
  
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
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    
    console.log('📱 Step 2: Filling and submitting login form...');
    await page.fill('input[type="email"]', 'approver@procureflow.demo');
    await page.fill('input[type="password"]', 'demo123');
    await page.click('button[type="submit"]');
    
    console.log('📱 Step 3: Waiting for authentication...');
    await page.waitForTimeout(3000);
    
    console.log('📱 Step 4: Going to debug page to see user details...');
    await page.goto('https://procureflow-demo.web.app/debug', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    
    // Look for user information in the debug page
    const debugContent = await page.textContent('body');
    console.log('📄 Debug page content:');
    console.log(debugContent);
    
    // Check if we can find role information
    if (debugContent.includes('"role":')) {
      console.log('✅ Found role information in debug page');
      // Extract the role from the JSON
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
    await page.screenshot({ path: 'database-role-check.png' });
    console.log('📸 Screenshot saved as database-role-check.png');
    
  } catch (error) {
    console.error('❌ Check failed:', error);
  } finally {
    console.log('⏳ Keeping browser open for 10 seconds...');
    await page.waitForTimeout(10000);
    await browser.close();
  }
}

checkDatabaseRole().catch(console.error);
