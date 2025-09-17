const puppeteer = require('puppeteer');

async function simpleTest() {
  console.log('🚀 Starting Simple Test...');
  
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      console.log('📱 Console:', msg.text());
    });

    page.on('pageerror', error => {
      console.error('❌ Error:', error.message);
    });

    console.log('📄 Navigating to localhost:3001...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });
    
    console.log('📄 Current URL:', page.url());
    console.log('📄 Page title:', await page.title());
    
    // Take a screenshot
    await page.screenshot({ path: 'test-screenshot.png' });
    console.log('📸 Screenshot saved as test-screenshot.png');
    
    // Wait for user to see the page
    console.log('⏳ Waiting 10 seconds for manual inspection...');
    await page.waitForTimeout(10000);
    
    await browser.close();
    console.log('✅ Test completed');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

simpleTest();
