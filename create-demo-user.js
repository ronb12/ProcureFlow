// Simple script to create demo user in Firebase Auth
// Run this in the browser console on the deployed site

async function createDemoUser() {
    try {
        console.log('Creating demo user...');
        
        // Check if Firebase is available
        if (typeof firebase === 'undefined') {
            console.error('Firebase not loaded. Please run this on the ProcureFlow site.');
            return;
        }

        const email = 'test@procureflow.demo';
        const password = 'demo123';
        const name = 'Test User (All Roles)';

        // Create user in Firebase Auth
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Update display name
        await user.updateProfile({
            displayName: name
        });

        // Create user document in Firestore
        await firebase.firestore().collection('users').doc(user.uid).set({
            name: name,
            email: email,
            role: 'requester', // Default role
            orgId: 'org_cdc',
            approvalLimit: 5000,
            phone: '555-0001',
            department: 'IT Department',
            title: 'Test User',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log('✅ Demo user created successfully!');
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('You can now login and use the debug page to switch roles.');

    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            console.log('ℹ️ Demo user already exists. You can login with: test@procureflow.demo / demo123');
        } else {
            console.error('❌ Error creating demo user:', error.message);
        }
    }
}

// Run the function
createDemoUser();
