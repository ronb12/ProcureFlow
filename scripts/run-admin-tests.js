#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 Running Admin User Management Tests...\n');

try {
  // Check if Playwright is installed
  try {
    execSync('npx playwright --version', { stdio: 'pipe' });
  } catch (error) {
    console.log('📦 Installing Playwright...');
    execSync('npx playwright install', { stdio: 'inherit' });
  }

  // Run the admin user management tests
  console.log('🚀 Starting test server and running tests...\n');
  
  const testCommand = 'npx playwright test tests/e2e/admin-user-management.spec.ts --headed --reporter=html';
  
  console.log(`Running: ${testCommand}\n`);
  
  execSync(testCommand, { 
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
  
  console.log('\n✅ Admin User Management Tests Completed Successfully!');
  console.log('📊 Test results saved to playwright-report/index.html');
  
} catch (error) {
  console.error('\n❌ Admin User Management Tests Failed:');
  console.error(error.message);
  process.exit(1);
}
