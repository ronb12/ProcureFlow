#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔧 Setting up Admin User Management Tests...\n');

async function setupAdminTests() {
  try {
    // 1. Check if we're in the right directory
    if (!fs.existsSync('package.json')) {
      throw new Error('Please run this script from the project root directory');
    }

    // 2. Install dependencies if needed
    console.log('📦 Checking dependencies...');
    if (!fs.existsSync('node_modules')) {
      console.log('Installing dependencies...');
      execSync('npm install', { stdio: 'inherit' });
    }

    // 3. Install Playwright if not installed
    console.log('🎭 Checking Playwright installation...');
    try {
      execSync('npx playwright --version', { stdio: 'pipe' });
    } catch (error) {
      console.log('Installing Playwright...');
      execSync('npx playwright install', { stdio: 'inherit' });
    }

    // 4. Check if test files exist
    console.log('📁 Checking test files...');
    const testFile = 'tests/e2e/admin-user-management.spec.ts';
    if (!fs.existsSync(testFile)) {
      throw new Error(`Test file not found: ${testFile}`);
    }

    // 5. Check if admin page exists
    console.log('🔍 Checking admin pages...');
    const adminPage = 'app/admin/users/page.tsx';
    if (!fs.existsSync(adminPage)) {
      throw new Error(`Admin page not found: ${adminPage}`);
    }

    // 6. Create test data if needed
    console.log('🌱 Setting up test data...');
    try {
      execSync('npm run seed', { stdio: 'pipe' });
      console.log('✅ Test data seeded successfully');
    } catch (error) {
      console.log('⚠️  Warning: Could not seed test data. You may need to run "npm run seed" manually.');
    }

    // 7. Assign roles if needed
    console.log('👥 Setting up user roles...');
    try {
      execSync('npm run assign-roles', { stdio: 'pipe' });
      console.log('✅ User roles assigned successfully');
    } catch (error) {
      console.log('⚠️  Warning: Could not assign roles. You may need to run "npm run assign-roles" manually.');
    }

    // 8. Create admin dashboard data
    console.log('📊 Setting up admin dashboard data...');
    try {
      execSync('npm run admin-data', { stdio: 'pipe' });
      console.log('✅ Admin dashboard data created successfully');
    } catch (error) {
      console.log('⚠️  Warning: Could not create admin data. You may need to run "npm run admin-data" manually.');
    }

    // 9. Check Firebase configuration
    console.log('🔥 Checking Firebase configuration...');
    if (!fs.existsSync('firebase.json')) {
      throw new Error('Firebase configuration not found. Please ensure firebase.json exists.');
    }

    if (!fs.existsSync('firestore.rules')) {
      throw new Error('Firestore rules not found. Please ensure firestore.rules exists.');
    }

    if (!fs.existsSync('firestore.indexes.json')) {
      throw new Error('Firestore indexes not found. Please ensure firestore.indexes.json exists.');
    }

    // 10. Check environment variables
    console.log('🔐 Checking environment variables...');
    if (!fs.existsSync('.env.local')) {
      console.log('⚠️  Warning: .env.local not found. Please ensure Firebase environment variables are set.');
      console.log('   You can copy env.example to .env.local and fill in your Firebase config.');
    }

    console.log('\n✅ Admin User Management Test Setup Complete!');
    console.log('\n📋 Next Steps:');
    console.log('1. Ensure your Firebase project is running (npm run emulators)');
    console.log('2. Run the admin tests: npm run test:admin');
    console.log('3. For headed mode: npm run test:admin:headed');
    console.log('4. For debug mode: npm run test:admin:debug');
    console.log('\n🔗 Test Credentials:');
    console.log('   Email: admin@procureflow.demo');
    console.log('   Password: demo123');
    console.log('\n📊 Test Results:');
    console.log('   Results will be saved to playwright-report/index.html');

  } catch (error) {
    console.error('\n❌ Setup Failed:');
    console.error(error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure you\'re in the project root directory');
    console.log('2. Run "npm install" to install dependencies');
    console.log('3. Run "npx playwright install" to install browsers');
    console.log('4. Check that all required files exist');
    console.log('5. Ensure Firebase is properly configured');
    process.exit(1);
  }
}

setupAdminTests();
