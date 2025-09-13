// Simple script to create test user for ProcureFlow
// Run this in the browser console on the ProcureFlow site

async function createTestUser() {
    try {
        console.log('Creating test user...');
        
        // Import Firebase modules (if not already loaded)
        const { createUserWithEmailAndPassword, updateProfile } = window.firebase?.auth || {};
        const { doc, setDoc } = window.firebase?.firestore || {};
        
        if (!createUserWithEmailAndPassword) {
            console.error('Firebase not loaded. Please run this on the ProcureFlow site.');
            return;
        }

        const email = 'test@procureflow.demo';
        const password = 'demo123';
        const name = 'Test User (All Roles)';

        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update display name
        await updateProfile(user, {
            displayName: name
        });

        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            name: name,
            email: email,
            role: 'requester', // Default role
            orgId: 'org_cdc',
            approvalLimit: 5000,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log('✅ Test user created successfully!');
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('You can now login and use the debug page to switch roles.');

    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            console.log('ℹ️ User already exists. You can login with: test@procureflow.demo / demo123');
        } else {
            console.error('❌ Error creating user:', error.message);
        }
    }
}

// Run the function
createTestUser();
