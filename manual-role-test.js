const { chromium } = require('playwright');

async function manualRoleTest() {
  console.log('🔍 Manual role selection test...');
  
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
  
  try {
    console.log('📱 Step 1: Going to login page...');
    await page.goto('https://procureflow-demo.web.app/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    
    console.log('📱 Step 2: Filling approver email...');
    await page.fill('input[type="email"]', 'approver@procureflow.demo');
    
    console.log('📱 Step 3: Waiting for role auto-selection...');
    await page.waitForTimeout(2000);
    
    // Take screenshot to see the current state
    await page.screenshot({ path: 'manual-role-test-1.png' });
    console.log('📸 Screenshot 1 saved');
    
    console.log('📱 Step 4: Looking for role selector elements...');
    const roleElements = await page.evaluate(() => {
      const elements = [];
      
      // Look for various possible role selector elements
      const selectors = [
        'select',
        '[role="combobox"]',
        '[data-testid*="role"]',
        '[class*="role"]',
        'button[class*="role"]',
        'div[class*="role"]'
      ];
      
      selectors.forEach(selector => {
        const found = document.querySelectorAll(selector);
        found.forEach((el, index) => {
          elements.push({
            selector: selector,
            index: index,
            tagName: el.tagName,
            className: el.className,
            textContent: el.textContent?.substring(0, 100),
            value: el.value || 'no value'
          });
        });
      });
      
      return elements;
    });
    
    console.log('🔍 Found role elements:', roleElements);
    
    console.log('📱 Step 5: Checking if role is selected...');
    const roleCheck = await page.evaluate(() => {
      // Look for any text that might indicate the selected role
      const bodyText = document.body.textContent;
      const roleIndicators = ['approver', 'Approving Official', 'admin', 'Administrator', 'requester', 'Requester'];
      
      const foundRoles = roleIndicators.filter(role => bodyText.includes(role));
      
      return {
        bodyText: bodyText.substring(0, 500),
        foundRoles: foundRoles,
        hasRoleSelector: document.querySelector('select') !== null,
        hasDropdown: document.querySelector('[role="combobox"]') !== null
      };
    });
    
    console.log('📊 Role check results:', roleCheck);
    
    // Take final screenshot
    await page.screenshot({ path: 'manual-role-test-2.png' });
    console.log('📸 Screenshot 2 saved');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    console.log('⏳ Keeping browser open for 15 seconds...');
    await page.waitForTimeout(15000);
    await browser.close();
  }
}

manualRoleTest().catch(console.error);
