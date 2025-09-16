// Auto-login script for auditor testing
// Run this in the browser console on the ProcureFlow app

async function autoLoginAuditor() {
    console.log('🚀 Starting automatic auditor login test...');
    
    try {
        // Check if Firebase is available
        if (typeof firebase === 'undefined') {
            console.error('❌ Firebase not loaded. Please run this on the ProcureFlow site.');
            return;
        }

        const email = 'auditor@procureflow.demo';
        const password = 'demo123';
        const name = 'Alice Brown';

        console.log(`🔍 Attempting to sign in as: ${email}`);

        // Try to sign in
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        console.log('✅ Successfully signed in as auditor!');
        console.log('UID:', user.uid);
        console.log('Email:', user.email);
        console.log('Display Name:', user.displayName);

        // Check Firestore document
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('✅ Firestore document found:');
            console.log('Role:', userData.role);
            console.log('Name:', userData.name);
            console.log('Org ID:', userData.orgId);
            console.log('Approval Limit:', userData.approvalLimit);
            
            // Navigate to audit packages page
            console.log('🔄 Navigating to audit packages page...');
            window.location.href = '/audit-packages';
            
        } else {
            console.log('⚠️ Firestore document not found, creating one...');
            
            // Create Firestore document
            await firebase.firestore().collection('users').doc(user.uid).set({
                name: name,
                email: email,
                role: 'auditor',
                orgId: 'org_cdc',
                approvalLimit: 0,
                phone: '555-0006',
                department: 'Compliance',
                title: 'Compliance Auditor',
                createdAt: new Date(),
                updatedAt: new Date()
            });
            
            console.log('✅ Firestore document created!');
            console.log('🔄 Navigating to audit packages page...');
            window.location.href = '/audit-packages';
        }

    } catch (error) {
        console.error('❌ Login failed:', error.message);
        console.log('Error code:', error.code);
        
        if (error.code === 'auth/user-not-found') {
            console.log('👤 User not found, creating auditor user...');
            await createAuditorUser();
        } else if (error.code === 'auth/wrong-password') {
            console.log('🔑 Wrong password. Please check the password.');
        } else if (error.code === 'auth/invalid-email') {
            console.log('📧 Invalid email format.');
        } else {
            console.log('❌ Unexpected error:', error);
        }
    }
}

async function createAuditorUser() {
    try {
        const email = 'auditor@procureflow.demo';
        const password = 'demo123';
        const name = 'Alice Brown';

        console.log('👤 Creating auditor user...');

        // Create Firebase Auth user
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Update display name
        await user.updateProfile({
            displayName: name
        });

        console.log('✅ Firebase Auth user created with UID:', user.uid);

        // Create Firestore document
        await firebase.firestore().collection('users').doc(user.uid).set({
            name: name,
            email: email,
            role: 'auditor',
            orgId: 'org_cdc',
            approvalLimit: 0,
            phone: '555-0006',
            department: 'Compliance',
            title: 'Compliance Auditor',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log('✅ Firestore document created!');
        console.log('🔄 Navigating to audit packages page...');
        window.location.href = '/audit-packages';

    } catch (error) {
        console.error('❌ Error creating auditor user:', error.message);
    }
}

// Auto-run the function
console.log('🎯 Auto-login script loaded. Running...');
autoLoginAuditor();
