const { chromium } = require('playwright');

async function testRoleSelector() {
  console.log('🔍 Testing role selector auto-selection...');
  
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
    console.log('📱 Step 1: Going to login page...');
    await page.goto('https://procureflow-demo.web.app/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    
    console.log('📱 Step 2: Testing role auto-selection for different emails...');
    
    const testEmails = [
      'approver@procureflow.demo',
      'admin@procureflow.demo', 
      'cardholder@procureflow.demo',
      'auditor@procureflow.demo',
      'requester@procureflow.demo'
    ];
    
    for (const testEmail of testEmails) {
      console.log(`\n🧪 Testing email: ${testEmail}`);
      
      // Clear and fill email
      await page.fill('input[type="email"]', '');
      await page.fill('input[type="email"]', testEmail);
      
      // Wait a moment for the role to auto-select
      await page.waitForTimeout(1000);
      
      // Check what role is selected
      const selectedRole = await page.evaluate(() => {
        const roleDropdown = document.querySelector('[data-testid="role-selector"]') || 
                           document.querySelector('select') ||
                           document.querySelector('[role="combobox"]');
        
        if (roleDropdown) {
          return roleDropdown.value || roleDropdown.textContent;
        }
        
        // Look for role text in the UI
        const roleText = document.querySelector('[class*="role"]')?.textContent;
        return roleText || 'Not found';
      });
      
      console.log(`   Selected role: ${selectedRole}`);
      
      // Expected role mapping
      const expectedRoles = {
        'approver@procureflow.demo': 'approver',
        'admin@procureflow.demo': 'admin',
        'cardholder@procureflow.demo': 'cardholder',
        'auditor@procureflow.demo': 'auditor',
        'requester@procureflow.demo': 'requester'
      };
      
      const expected = expectedRoles[testEmail];
      if (selectedRole.toLowerCase().includes(expected)) {
        console.log(`   ✅ Correct role selected: ${expected}`);
      } else {
        console.log(`   ❌ Wrong role selected. Expected: ${expected}, Got: ${selectedRole}`);
      }
    }
    
    console.log('\n📱 Step 3: Testing actual login with approver...');
    await page.fill('input[type="email"]', 'approver@procureflow.demo');
    await page.fill('input[type="password"]', 'demo123');
    
    // Check role before login
    const roleBeforeLogin = await page.evaluate(() => {
      const roleText = document.querySelector('[class*="role"]')?.textContent;
      return roleText || 'Not found';
    });
    console.log(`Role selected before login: ${roleBeforeLogin}`);
    
    await page.click('button[type="submit"]');
    
    console.log('📱 Step 4: Waiting for redirect...');
    await page.waitForTimeout(5000);
    
    const finalUrl = page.url();
    console.log('🎯 Final URL:', finalUrl);
    
    if (finalUrl.includes('/approvals')) {
      console.log('🎉 SUCCESS: Approver correctly routed to /approvals');
    } else if (finalUrl.includes('/requests')) {
      console.log('❌ FAILURE: Approver incorrectly routed to /requests');
    } else {
      console.log('⚠️ UNKNOWN: Routed to:', finalUrl);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'role-selector-test.png' });
    console.log('📸 Screenshot saved as role-selector-test.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    console.log('⏳ Keeping browser open for 10 seconds...');
    await page.waitForTimeout(10000);
    await browser.close();
  }
}

testRoleSelector().catch(console.error);
