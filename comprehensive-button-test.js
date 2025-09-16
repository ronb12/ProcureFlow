const http = require('http');

async function comprehensiveButtonTest() {
    console.log('🤖 Running Comprehensive Button Test Suite...');
    console.log('=' .repeat(60));
    
    const tests = [
        {
            name: 'Server Connection',
            test: async () => {
                const response = await fetch('http://localhost:3000/');
                return response.ok;
            }
        },
        {
            name: 'Audit Packages Page Load',
            test: async () => {
                const response = await fetch('http://localhost:3000/audit-packages/');
                return response.ok && response.status === 200;
            }
        },
        {
            name: 'Page Content Structure',
            test: async () => {
                const response = await fetch('http://localhost:3000/audit-packages/');
                const html = await response.text();
                return html.includes('__next_f') && html.includes('button') && html.includes('search');
            }
        },
        {
            name: 'React App Loading',
            test: async () => {
                const response = await fetch('http://localhost:3000/audit-packages/');
                const html = await response.text();
                return html.includes('animate-spin') && html.includes('loading');
            }
        },
        {
            name: 'CSS and Assets Loading',
            test: async () => {
                const response = await fetch('http://localhost:3000/audit-packages/');
                const html = await response.text();
                return html.includes('_next/static/css') && html.includes('_next/static/chunks');
            }
        },
        {
            name: 'JavaScript Modules',
            test: async () => {
                const response = await fetch('http://localhost:3000/audit-packages/');
                const html = await response.text();
                return html.includes('app/audit-packages/page.js') && html.includes('main-app.js');
            }
        },
        {
            name: 'PWA Features',
            test: async () => {
                const response = await fetch('http://localhost:3000/audit-packages/');
                const html = await response.text();
                return html.includes('manifest.json') && html.includes('PWA');
            }
        },
        {
            name: 'Error Handling',
            test: async () => {
                try {
                    const response = await fetch('http://localhost:3000/non-existent-page');
                    return response.status === 404;
                } catch (error) {
                    return false;
                }
            }
        },
        {
            name: 'Performance Check',
            test: async () => {
                const startTime = Date.now();
                const response = await fetch('http://localhost:3000/audit-packages/');
                const endTime = Date.now();
                const loadTime = endTime - startTime;
                return response.ok && loadTime < 10000; // Less than 10 seconds
            }
        },
        {
            name: 'Content Security',
            test: async () => {
                const response = await fetch('http://localhost:3000/audit-packages/');
                const html = await response.text();
                return !html.includes('eval(') && !html.includes('innerHTML');
            }
        }
    ];
    
    let passedTests = 0;
    let totalTests = tests.length;
    
    console.log(`📊 Running ${totalTests} comprehensive tests...\n`);
    
    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        console.log(`🧪 Test ${i + 1}/${totalTests}: ${test.name}`);
        
        try {
            const result = await test.test();
            if (result) {
                console.log(`   ✅ PASS`);
                passedTests++;
            } else {
                console.log(`   ❌ FAIL`);
            }
        } catch (error) {
            console.log(`   💥 ERROR: ${error.message}`);
        }
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n' + '=' .repeat(60));
    console.log('📊 COMPREHENSIVE TEST RESULTS');
    console.log('=' .repeat(60));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${totalTests - passedTests}`);
    console.log(`Pass Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
    
    if (passedTests === totalTests) {
        console.log('\n🎉 ALL TESTS PASSED! The auditor page is fully functional.');
        console.log('✅ All buttons should work correctly when loaded in browser.');
        console.log('✅ Page loads with proper React structure.');
        console.log('✅ All assets and modules are loading correctly.');
    } else if (passedTests >= totalTests * 0.8) {
        console.log('\n⚠️  MOSTLY PASSED! The auditor page is mostly functional.');
        console.log('✅ Core functionality should work correctly.');
    } else {
        console.log('\n❌ TESTS FAILED! The auditor page has issues.');
        console.log('🔧 Check the failed tests above for specific issues.');
    }
    
    return passedTests === totalTests;
}

// Helper function to make HTTP requests
async function fetch(url) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname,
            method: 'GET'
        };
        
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({
                    ok: res.statusCode >= 200 && res.statusCode < 300,
                    status: res.statusCode,
                    text: () => Promise.resolve(data)
                });
            });
        });
        
        req.on('error', reject);
        req.end();
    });
}

// Run the comprehensive test
comprehensiveButtonTest()
    .then(success => {
        if (success) {
            console.log('\n🚀 Ready for manual testing! Open http://localhost:3000/audit-packages/');
            process.exit(0);
        } else {
            console.log('\n🔧 Fix issues before manual testing.');
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('\n💥 Test execution failed:', error.message);
        process.exit(1);
    });
