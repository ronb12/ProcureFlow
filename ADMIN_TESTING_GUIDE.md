# Admin User Management Testing Guide

This guide covers automated testing for all admin user management features using Playwright.

## 🧪 Test Overview

The admin user management tests verify:
- ✅ User interface elements and layout
- ✅ User creation, editing, and deletion
- ✅ Role management and permissions
- ✅ Search and filtering functionality
- ✅ Status management (active/inactive)
- ✅ Form validation and error handling
- ✅ Responsive design across devices
- ✅ Access control and security

## 🚀 Quick Start

### 1. Setup Test Environment
```bash
# Run the automated setup script
npm run test:admin:setup
```

### 2. Start Firebase Emulators
```bash
# Start Firebase emulators in one terminal
npm run emulators
```

### 3. Run Admin Tests
```bash
# Run all admin user management tests
npm run test:admin

# Run tests with browser visible (headed mode)
npm run test:admin:headed

# Run tests in debug mode (step through)
npm run test:admin:debug
```

## 📋 Test Scenarios

### Core User Management Tests

#### 1. **Page Display and Navigation**
- ✅ User management page loads correctly
- ✅ All UI elements are visible and properly positioned
- ✅ Navigation between admin sections works
- ✅ Page title and descriptions are correct

#### 2. **User Statistics Dashboard**
- ✅ Total users count displays correctly
- ✅ Active users count is accurate
- ✅ Admin users count is correct
- ✅ Inactive users count is accurate
- ✅ Statistics update when users are modified

#### 3. **User Table Display**
- ✅ All users are displayed in the table
- ✅ User information is correctly formatted
- ✅ Role badges have correct colors
- ✅ Status indicators are properly colored
- ✅ Approval limits are shown for applicable users
- ✅ Last login dates are formatted correctly

#### 4. **Search and Filtering**
- ✅ Search by user name works correctly
- ✅ Search by email address works correctly
- ✅ Role filtering works for all roles
- ✅ Combined search and filter work together
- ✅ Clear search resets the view

#### 5. **User Creation**
- ✅ Add User button opens modal
- ✅ Modal displays correct form fields
- ✅ Form validation works for required fields
- ✅ Role selection includes all available roles
- ✅ Approval limit can be set appropriately
- ✅ New user appears in table after creation
- ✅ Success message is displayed

#### 6. **User Editing**
- ✅ Edit button opens modal with user data
- ✅ Form is pre-populated with existing data
- ✅ All fields can be modified
- ✅ Changes are saved correctly
- ✅ Updated user appears in table
- ✅ Success message is displayed

#### 7. **User Status Management**
- ✅ Toggle active/inactive status works
- ✅ Status changes are reflected in table
- ✅ Status colors update correctly
- ✅ Statistics update when status changes
- ✅ Success message is displayed

#### 8. **User Deletion**
- ✅ Delete button triggers confirmation dialog
- ✅ Confirmation dialog has correct message
- ✅ User is removed from table after confirmation
- ✅ Statistics update after deletion
- ✅ Success message is displayed

### Advanced Feature Tests

#### 9. **Form Validation**
- ✅ Required fields show validation errors
- ✅ Email format validation works
- ✅ Approval limit validation works
- ✅ Role selection validation works
- ✅ Form cannot be submitted with invalid data

#### 10. **Modal Management**
- ✅ Modal opens and closes correctly
- ✅ Cancel button closes modal without saving
- ✅ Modal data is reset when closed
- ✅ Multiple modal operations work correctly

#### 11. **Error Handling**
- ✅ Network errors are handled gracefully
- ✅ Validation errors are displayed clearly
- ✅ User feedback is provided for all actions
- ✅ System remains stable after errors

#### 12. **Access Control**
- ✅ Non-admin users are redirected away
- ✅ Access denied message is shown for unauthorized users
- ✅ Admin-only features are protected
- ✅ Role-based permissions are enforced

### Responsive Design Tests

#### 13. **Mobile Compatibility**
- ✅ Page works on mobile devices (375px width)
- ✅ Table is horizontally scrollable
- ✅ Buttons are accessible and properly sized
- ✅ Modal is usable on small screens

#### 14. **Tablet Compatibility**
- ✅ Page works on tablet devices (768px width)
- ✅ Layout adapts appropriately
- ✅ All features remain accessible
- ✅ Touch interactions work correctly

## 🔧 Test Configuration

### Test Data
The tests use the following test data:
- **Admin User**: admin@procureflow.demo / demo123
- **Test Users**: Various mock users with different roles
- **Organizations**: CDC, SAC, Navy, Army, Marines

### Test Environment
- **Base URL**: http://localhost:3000
- **Browser**: Chromium, Firefox, WebKit
- **Viewports**: Desktop, Tablet, Mobile
- **Timeout**: 30 seconds per test

### Test Files
- `tests/e2e/admin-user-management.spec.ts` - Main test file
- `scripts/setup-admin-tests.js` - Setup script
- `scripts/run-admin-tests.js` - Test runner

## 📊 Test Results

### Running Tests
```bash
# Run all tests
npm run test:admin

# Run specific test
npx playwright test tests/e2e/admin-user-management.spec.ts --grep "should create new user"

# Run with specific browser
npx playwright test tests/e2e/admin-user-management.spec.ts --project=chromium

# Run in headed mode for debugging
npm run test:admin:headed
```

### Test Reports
- **HTML Report**: `playwright-report/index.html`
- **Screenshots**: Captured on test failures
- **Videos**: Recorded for failed tests
- **Traces**: Available for debugging

## 🐛 Debugging Tests

### Common Issues

#### 1. **Tests Fail to Start**
```bash
# Check if dependencies are installed
npm install

# Install Playwright browsers
npx playwright install

# Check if test files exist
ls tests/e2e/admin-user-management.spec.ts
```

#### 2. **Login Issues**
```bash
# Verify admin credentials
# Email: admin@procureflow.demo
# Password: demo123

# Check if user exists in database
npm run get-user-uids
```

#### 3. **Modal Not Opening**
- Check browser console for JavaScript errors
- Verify modal component is properly imported
- Check if test selectors are correct

#### 4. **Element Not Found**
- Use Playwright Inspector to debug selectors
- Check if elements are visible and enabled
- Verify timing issues with waitForSelector

### Debug Commands
```bash
# Run tests in debug mode
npm run test:admin:debug

# Run specific test in debug mode
npx playwright test tests/e2e/admin-user-management.spec.ts --debug --grep "should create new user"

# Open Playwright Inspector
npx playwright test --debug
```

## 🔍 Test Maintenance

### Adding New Tests
1. Add test cases to `admin-user-management.spec.ts`
2. Follow existing test patterns and naming conventions
3. Include proper assertions and error handling
4. Test both positive and negative scenarios

### Updating Tests
1. Update selectors when UI changes
2. Modify test data when requirements change
3. Add new test scenarios for new features
4. Remove obsolete tests

### Test Data Management
1. Use consistent test data across tests
2. Clean up test data after each test run
3. Use unique identifiers to avoid conflicts
4. Mock external dependencies when possible

## 📈 Performance Testing

### Load Testing
```bash
# Run tests with multiple workers
npx playwright test tests/e2e/admin-user-management.spec.ts --workers=4

# Run tests in parallel
npx playwright test tests/e2e/admin-user-management.spec.ts --fully-parallel
```

### Performance Metrics
- Test execution time
- Page load times
- Modal open/close times
- Form submission times
- Search/filter response times

## 🚨 Continuous Integration

### GitHub Actions
```yaml
name: Admin User Management Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx playwright install
      - run: npm run test:admin:setup
      - run: npm run emulators &
      - run: npm run test:admin
```

### Pre-commit Hooks
```bash
# Install pre-commit hook
npm install --save-dev husky lint-staged

# Add to package.json
"husky": {
  "hooks": {
    "pre-commit": "lint-staged"
  }
},
"lint-staged": {
  "tests/**/*.ts": ["playwright test --staged"]
}
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://playwright.dev/docs/best-practices)
- [Test Selectors Guide](https://playwright.dev/docs/selectors)
- [Debugging Guide](https://playwright.dev/docs/debug)

## 🆘 Support

For test-related issues:
1. Check the test logs and error messages
2. Verify the test environment setup
3. Run tests in debug mode to identify issues
4. Check the Playwright documentation
5. Review the test code for potential issues

The admin user management tests provide comprehensive coverage of all admin functionality and ensure the system works correctly across different scenarios and devices.
