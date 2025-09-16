// Script to check Firebase data for auditor
// Run this in the browser console on the ProcureFlow site

async function checkAuditorData() {
    console.log('🔍 Checking Firebase data for auditor...');
    
    try {
        // Check if Firebase is available
        if (typeof firebase === 'undefined') {
            console.error('❌ Firebase not loaded. Please run this on the ProcureFlow site.');
            return;
        }

        // Get current user
        const user = firebase.auth().currentUser;
        if (!user) {
            console.log('ℹ️ No user logged in. Please login first.');
            return;
        }

        console.log(`👤 Current user: ${user.email} (${user.uid})`);

        // Check Firestore document
        console.log('🔍 Checking Firestore document...');
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('✅ Firestore document found!');
            console.log('📋 Document data:', userData);
            
            // Verify key fields
            const checks = [
                { field: 'role', expected: 'auditor', actual: userData.role },
                { field: 'email', expected: 'auditor@procureflow.demo', actual: userData.email },
                { field: 'name', expected: 'Alice Brown', actual: userData.name },
                { field: 'orgId', expected: 'org_cdc', actual: userData.orgId },
                { field: 'approvalLimit', expected: 0, actual: userData.approvalLimit }
            ];
            
            console.log('🔍 Field verification:');
            checks.forEach(check => {
                const passed = check.actual === check.expected;
                console.log(`${passed ? '✅' : '❌'} ${check.field}: ${check.actual} ${passed ? '' : `(expected: ${check.expected})`}`);
            });
            
            // Check if all fields are correct
            const allPassed = checks.every(check => check.actual === check.expected);
            if (allPassed) {
                console.log('🎉 All field verifications passed!');
            } else {
                console.log('⚠️ Some field verifications failed');
            }
            
        } else {
            console.log('❌ Firestore document not found!');
            console.log('This means the auditor user exists in Firebase Auth but not in Firestore.');
        }

        // Test audit packages page access
        console.log('🔍 Testing audit packages page access...');
        try {
            const response = await fetch('/audit-packages/', {
                method: 'HEAD',
                credentials: 'include'
            });
            
            if (response.ok) {
                console.log('✅ Audit packages page is accessible');
            } else {
                console.log(`❌ Audit packages page not accessible: ${response.status}`);
            }
        } catch (error) {
            console.log(`❌ Error testing page access: ${error.message}`);
        }

    } catch (error) {
        console.error('❌ Error checking auditor data:', error);
    }
}

// Run the check
checkAuditorData();
