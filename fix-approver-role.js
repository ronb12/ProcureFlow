const { chromium } = require('playwright');

async function fixApproverRole() {
  console.log('🔧 Fixing approver role in database...');
  
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
    
    console.log('📱 Step 2: Logging in as approver...');
    await page.fill('input[type="email"]', 'approver@procureflow.demo');
    await page.fill('input[type="password"]', 'demo123');
    await page.click('button[type="submit"]');
    
    console.log('📱 Step 3: Waiting for authentication...');
    await page.waitForTimeout(3000);
    
    console.log('📱 Step 4: Going to debug page...');
    await page.goto('https://procureflow-demo.web.app/debug', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    console.log('📱 Step 5: Executing JavaScript to update user role...');
    const result = await page.evaluate(async () => {
      try {
        // Try to access Firebase from the page
        if (window.firebase && window.firebase.firestore) {
          const db = window.firebase.firestore();
          const auth = window.firebase.auth();
          const user = auth.currentUser;
          
          if (user) {
            console.log('Updating user role for:', user.uid);
            
            // Update the user document with the correct role
            await db.collection('users').doc(user.uid).update({
              role: 'approver',
              orgId: 'org_cdc',
              approvalLimit: 10000,
              updatedAt: new Date()
            });
            
            console.log('User role updated successfully');
            return { success: true, message: 'Role updated to approver' };
          } else {
            return { success: false, message: 'No user found' };
          }
        } else {
          return { success: false, message: 'Firebase not available' };
        }
      } catch (error) {
        console.error('Error updating role:', error);
        return { success: false, message: error.message };
      }
    });
    
    console.log('📊 Update result:', result);
    
    if (result.success) {
      console.log('✅ Successfully updated user role to approver');
      
      console.log('📱 Step 6: Testing redirect after role update...');
      await page.goto('https://procureflow-demo.web.app', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(3000);
      
      const finalUrl = page.url();
      console.log('🎯 Final URL after role update:', finalUrl);
      
      if (finalUrl.includes('/approvals')) {
        console.log('🎉 SUCCESS: Now correctly routed to /approvals');
      } else if (finalUrl.includes('/requests')) {
        console.log('❌ Still routed to /requests - role update may not have taken effect');
      } else {
        console.log('⚠️ Routed to:', finalUrl);
      }
    } else {
      console.log('❌ Failed to update role:', result.message);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'fix-approver-role.png' });
    console.log('📸 Screenshot saved as fix-approver-role.png');
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
  } finally {
    console.log('⏳ Keeping browser open for 15 seconds...');
    await page.waitForTimeout(15000);
    await browser.close();
  }
}

fixApproverRole().catch(console.error);
