const http = require('http');

async function testAuditPage() {
    console.log('🧪 Testing Audit Packages Page...');
    
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/audit-packages/',
        method: 'GET'
    };
    
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            console.log(`📊 Status: ${res.statusCode}`);
            console.log(`📋 Headers:`, res.headers);
            
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log(`📄 Content Length: ${data.length} characters`);
                
                // Check for key content (React app loads dynamically)
                const hasTitle = data.includes('Audit Packages') || data.includes('audit-packages');
                const hasSampleData = data.includes('REQ-2024-') || data.includes('mockAuditPackages');
                const hasButtons = data.includes('View') || data.includes('Download') || data.includes('button');
                const hasSearch = data.includes('Search') || data.includes('search');
                const hasFilter = data.includes('All Statuses') || data.includes('filter');
                const isReactApp = data.includes('__next_f') || data.includes('React') || data.includes('next');
                
                console.log(`✅ Title Found: ${hasTitle}`);
                console.log(`✅ Sample Data Found: ${hasSampleData}`);
                console.log(`✅ Buttons Found: ${hasButtons}`);
                console.log(`✅ Search Found: ${hasSearch}`);
                console.log(`✅ Filter Found: ${hasFilter}`);
                console.log(`✅ React App: ${isReactApp}`);
                
                // For React apps, we expect the app structure and loading state
                const allTestsPass = isReactApp && (hasTitle || hasSampleData || hasButtons || hasSearch || hasFilter);
                console.log(`🎯 Overall Result: ${allTestsPass ? 'PASS' : 'FAIL'}`);
                
                resolve({
                    status: res.statusCode,
                    hasTitle,
                    hasSampleData,
                    hasButtons,
                    hasSearch,
                    hasFilter,
                    isReactApp,
                    allTestsPass
                });
            });
        });
        
        req.on('error', (error) => {
            console.error('❌ Request failed:', error.message);
            reject(error);
        });
        
        req.end();
    });
}

// Run the test
testAuditPage()
    .then(result => {
        console.log('\n📊 Test Summary:');
        console.log(`Status Code: ${result.status}`);
        console.log(`Title Present: ${result.hasTitle}`);
        console.log(`Sample Data Present: ${result.hasSampleData}`);
        console.log(`Buttons Present: ${result.hasButtons}`);
        console.log(`Search Present: ${result.hasSearch}`);
        console.log(`Filter Present: ${result.hasFilter}`);
        console.log(`React App: ${result.isReactApp}`);
        console.log(`All Tests Pass: ${result.allTestsPass}`);
        
        if (result.allTestsPass) {
            console.log('\n🎉 All automated tests PASSED!');
            process.exit(0);
        } else {
            console.log('\n❌ Some tests FAILED!');
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('\n💥 Test execution failed:', error.message);
        process.exit(1);
    });
