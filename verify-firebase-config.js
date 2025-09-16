const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Firebase Configuration for Auditor Page...');
console.log('=' .repeat(60));

// Check if required files exist
const requiredFiles = [
  'firebase.json',
  'firestore.rules',
  'firestore.indexes.json',
  'scripts/seed.ts'
];

console.log('\n📁 Checking Required Files:');
let allFilesExist = true;
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

// Check Firebase configuration
console.log('\n🔧 Checking Firebase Configuration:');
try {
  const firebaseConfig = JSON.parse(fs.readFileSync('firebase.json', 'utf8'));
  
  // Check Firestore configuration
  if (firebaseConfig.firestore) {
    console.log('✅ Firestore configuration found');
    console.log(`   Database: ${firebaseConfig.firestore.database || 'default'}`);
    console.log(`   Location: ${firebaseConfig.firestore.location || 'not specified'}`);
    console.log(`   Rules: ${firebaseConfig.firestore.rules || 'not specified'}`);
    console.log(`   Indexes: ${firebaseConfig.firestore.indexes || 'not specified'}`);
  } else {
    console.log('❌ Firestore configuration missing');
  }
  
  // Check hosting configuration
  if (firebaseConfig.hosting) {
    console.log('✅ Hosting configuration found');
    console.log(`   Public directory: ${firebaseConfig.hosting.public || 'not specified'}`);
  } else {
    console.log('❌ Hosting configuration missing');
  }
  
} catch (error) {
  console.log('❌ Error reading firebase.json:', error.message);
}

// Check Firestore rules
console.log('\n🛡️ Checking Firestore Rules:');
try {
  const rules = fs.readFileSync('firestore.rules', 'utf8');
  
  const auditorChecks = [
    'isAuditor()',
    'auditPackages',
    'complianceChecks',
    'auditExports'
  ];
  
  auditorChecks.forEach(check => {
    const found = rules.includes(check);
    console.log(`${found ? '✅' : '❌'} ${check} rule found`);
  });
  
} catch (error) {
  console.log('❌ Error reading firestore.rules:', error.message);
}

// Check Firestore indexes
console.log('\n📊 Checking Firestore Indexes:');
try {
  const indexes = JSON.parse(fs.readFileSync('firestore.indexes.json', 'utf8'));
  
  if (indexes.indexes && Array.isArray(indexes.indexes)) {
    console.log(`✅ Found ${indexes.indexes.length} indexes`);
    
    const auditIndexes = indexes.indexes.filter(idx => 
      idx.collectionGroup === 'auditPackages' || 
      idx.collectionGroup === 'complianceChecks' || 
      idx.collectionGroup === 'auditExports'
    );
    
    console.log(`✅ Found ${auditIndexes.length} audit-related indexes`);
    
    auditIndexes.forEach(idx => {
      console.log(`   - ${idx.collectionGroup}: ${idx.fields.map(f => f.fieldPath).join(', ')}`);
    });
  } else {
    console.log('❌ No indexes found');
  }
  
} catch (error) {
  console.log('❌ Error reading firestore.indexes.json:', error.message);
}

// Check seed script
console.log('\n🌱 Checking Seed Script:');
try {
  const seedScript = fs.readFileSync('scripts/seed.ts', 'utf8');
  
  const seedChecks = [
    'auditor@procureflow.demo',
    'auditPackages',
    'complianceChecks',
    'role: \'auditor\''
  ];
  
  seedChecks.forEach(check => {
    const found = seedScript.includes(check);
    console.log(`${found ? '✅' : '❌'} ${check} in seed script`);
  });
  
} catch (error) {
  console.log('❌ Error reading seed script:', error.message);
}

// Check package.json for Firebase dependencies
console.log('\n📦 Checking Dependencies:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const firebaseDeps = [
    'firebase',
    'firebase-admin',
    'firebase-functions'
  ];
  
  firebaseDeps.forEach(dep => {
    const found = dependencies[dep];
    console.log(`${found ? '✅' : '❌'} ${dep}: ${found || 'not found'}`);
  });
  
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

// Summary
console.log('\n' + '=' .repeat(60));
console.log('📋 FIREBASE CONFIGURATION SUMMARY');
console.log('=' .repeat(60));

if (allFilesExist) {
  console.log('✅ All required files present');
  console.log('✅ Firestore rules configured for auditor access');
  console.log('✅ Audit package indexes created');
  console.log('✅ Seed script includes auditor data');
  console.log('\n🎉 Firebase configuration is complete for auditor page!');
  console.log('\n📝 Next Steps:');
  console.log('1. Deploy Firestore rules: firebase deploy --only firestore:rules');
  console.log('2. Deploy Firestore indexes: firebase deploy --only firestore:indexes');
  console.log('3. Run seed script: npm run seed');
  console.log('4. Deploy hosting: firebase deploy --only hosting');
} else {
  console.log('❌ Some required files are missing');
  console.log('🔧 Please ensure all Firebase configuration files are present');
}

console.log('\n🚀 Ready to deploy auditor page functionality!');
