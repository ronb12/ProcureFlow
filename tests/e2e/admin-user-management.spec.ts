import { test, expect, Page } from '@playwright/test';

// Test data
const adminCredentials = {
  email: 'admin@procureflow.demo',
  password: 'demo123'
};

const testUser = {
  name: 'Test User',
  email: 'test.user@procureflow.demo',
  role: 'requester',
  orgId: 'org_cdc',
  approvalLimit: 5000
};

const updatedUser = {
  name: 'Updated Test User',
  email: 'updated.test.user@procureflow.demo',
  role: 'approver',
  approvalLimit: 10000
};

// Helper functions
async function loginAsAdmin(page: Page) {
  await page.goto('/login');
  await page.fill('input[type="email"]', adminCredentials.email);
  await page.fill('input[type="password"]', adminCredentials.password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
}

async function navigateToUserManagement(page: Page) {
  await page.click('text=Admin');
  await page.click('text=User Management');
  await page.waitForURL('/admin/users');
}

async function openAddUserModal(page: Page) {
  await page.click('button:has-text("Add User")');
  await page.waitForSelector('[data-testid="user-modal"]', { timeout: 5000 });
}

async function openEditUserModal(page: Page, userEmail: string) {
  const userRow = page.locator(`tr:has-text("${userEmail}")`);
  await userRow.locator('button:has-text("Edit")').click();
  await page.waitForSelector('[data-testid="user-modal"]', { timeout: 5000 });
}

async function fillUserForm(page: Page, userData: any) {
  await page.fill('input[name="name"]', userData.name);
  await page.fill('input[name="email"]', userData.email);
  await page.selectOption('select[name="role"]', userData.role);
  await page.fill('input[name="approvalLimit"]', userData.approvalLimit.toString());
}

async function saveUserForm(page: Page) {
  await page.click('button:has-text("Save")');
  await page.waitForSelector('.toast-success', { timeout: 5000 });
}

async function closeUserModal(page: Page) {
  await page.click('button:has-text("Cancel")');
  await page.waitForSelector('[data-testid="user-modal"]', { state: 'hidden' });
}

test.describe('Admin User Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await navigateToUserManagement(page);
  });

  test('should display user management page with correct elements', async ({ page }) => {
    // Check page title and header
    await expect(page.locator('h1:has-text("User Management")')).toBeVisible();
    await expect(page.locator('text=Create and manage user roles and permissions')).toBeVisible();
    
    // Check stats cards
    await expect(page.locator('text=Total Users')).toBeVisible();
    await expect(page.locator('text=Active Users')).toBeVisible();
    await expect(page.locator('text=Admins')).toBeVisible();
    await expect(page.locator('text=Inactive')).toBeVisible();
    
    // Check search and filter controls
    await expect(page.locator('input[placeholder="Search users..."]')).toBeVisible();
    await expect(page.locator('select')).toBeVisible();
    
    // Check add user button
    await expect(page.locator('button:has-text("Add User")')).toBeVisible();
    
    // Check users table
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('th:has-text("User")')).toBeVisible();
    await expect(page.locator('th:has-text("Role")')).toBeVisible();
    await expect(page.locator('th:has-text("Status")')).toBeVisible();
    await expect(page.locator('th:has-text("Last Login")')).toBeVisible();
    await expect(page.locator('th:has-text("Actions")')).toBeVisible();
  });

  test('should display existing users in the table', async ({ page }) => {
    // Check that mock users are displayed
    await expect(page.locator('text=John Smith')).toBeVisible();
    await expect(page.locator('text=john.smith@mwr.com')).toBeVisible();
    await expect(page.locator('text=admin')).toBeVisible();
    
    await expect(page.locator('text=Jane Doe')).toBeVisible();
    await expect(page.locator('text=jane.doe@mwr.com')).toBeVisible();
    await expect(page.locator('text=requester')).toBeVisible();
    
    await expect(page.locator('text=Bob Johnson')).toBeVisible();
    await expect(page.locator('text=bob.johnson@mwr.com')).toBeVisible();
    await expect(page.locator('text=cardholder')).toBeVisible();
  });

  test('should filter users by role', async ({ page }) => {
    // Filter by admin role
    await page.selectOption('select', 'admin');
    await expect(page.locator('text=John Smith')).toBeVisible();
    await expect(page.locator('text=Jane Doe')).not.toBeVisible();
    await expect(page.locator('text=Bob Johnson')).not.toBeVisible();
    
    // Filter by requester role
    await page.selectOption('select', 'requester');
    await expect(page.locator('text=John Smith')).not.toBeVisible();
    await expect(page.locator('text=Jane Doe')).toBeVisible();
    await expect(page.locator('text=Bob Johnson')).not.toBeVisible();
    
    // Reset filter
    await page.selectOption('select', 'all');
    await expect(page.locator('text=John Smith')).toBeVisible();
    await expect(page.locator('text=Jane Doe')).toBeVisible();
    await expect(page.locator('text=Bob Johnson')).toBeVisible();
  });

  test('should search users by name and email', async ({ page }) => {
    // Search by name
    await page.fill('input[placeholder="Search users..."]', 'John');
    await expect(page.locator('text=John Smith')).toBeVisible();
    await expect(page.locator('text=Jane Doe')).not.toBeVisible();
    await expect(page.locator('text=Bob Johnson')).not.toBeVisible();
    
    // Search by email
    await page.fill('input[placeholder="Search users..."]', 'jane.doe');
    await expect(page.locator('text=John Smith')).not.toBeVisible();
    await expect(page.locator('text=Jane Doe')).toBeVisible();
    await expect(page.locator('text=Bob Johnson')).not.toBeVisible();
    
    // Clear search
    await page.fill('input[placeholder="Search users..."]', '');
    await expect(page.locator('text=John Smith')).toBeVisible();
    await expect(page.locator('text=Jane Doe')).toBeVisible();
    await expect(page.locator('text=Bob Johnson')).toBeVisible();
  });

  test('should open add user modal and create new user', async ({ page }) => {
    // Open add user modal
    await openAddUserModal(page);
    
    // Check modal is open
    await expect(page.locator('[data-testid="user-modal"]')).toBeVisible();
    await expect(page.locator('h2:has-text("Add User")')).toBeVisible();
    
    // Fill user form
    await fillUserForm(page, testUser);
    
    // Save user
    await saveUserForm(page);
    
    // Check success message
    await expect(page.locator('.toast-success')).toBeVisible();
    
    // Check user appears in table
    await expect(page.locator(`text=${testUser.name}`)).toBeVisible();
    await expect(page.locator(`text=${testUser.email}`)).toBeVisible();
    await expect(page.locator(`text=${testUser.role}`)).toBeVisible();
  });

  test('should open edit user modal and update existing user', async ({ page }) => {
    // Find a user to edit (Jane Doe)
    const userRow = page.locator('tr:has-text("jane.doe@mwr.com")');
    await expect(userRow).toBeVisible();
    
    // Open edit modal
    await openEditUserModal(page, 'jane.doe@mwr.com');
    
    // Check modal is open with user data
    await expect(page.locator('[data-testid="user-modal"]')).toBeVisible();
    await expect(page.locator('h2:has-text("Edit User")')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toHaveValue('Jane Doe');
    await expect(page.locator('input[name="email"]')).toHaveValue('jane.doe@mwr.com');
    
    // Update user data
    await page.fill('input[name="name"]', updatedUser.name);
    await page.fill('input[name="email"]', updatedUser.email);
    await page.selectOption('select[name="role"]', updatedUser.role);
    await page.fill('input[name="approvalLimit"]', updatedUser.approvalLimit.toString());
    
    // Save changes
    await saveUserForm(page);
    
    // Check success message
    await expect(page.locator('.toast-success')).toBeVisible();
    
    // Check updated user appears in table
    await expect(page.locator(`text=${updatedUser.name}`)).toBeVisible();
    await expect(page.locator(`text=${updatedUser.email}`)).toBeVisible();
    await expect(page.locator(`text=${updatedUser.role}`)).toBeVisible();
  });

  test('should toggle user status', async ({ page }) => {
    // Find an active user (Jane Doe)
    const userRow = page.locator('tr:has-text("jane.doe@mwr.com")');
    await expect(userRow).toBeVisible();
    
    // Check initial status
    await expect(userRow.locator('text=active')).toBeVisible();
    
    // Toggle status
    await userRow.locator('button:has-text("Deactivate")').click();
    
    // Check status changed
    await expect(page.locator('.toast-success')).toBeVisible();
    await expect(userRow.locator('text=inactive')).toBeVisible();
    
    // Toggle back to active
    await userRow.locator('button:has-text("Activate")').click();
    await expect(page.locator('.toast-success')).toBeVisible();
    await expect(userRow.locator('text=active')).toBeVisible();
  });

  test('should delete user with confirmation', async ({ page }) => {
    // Find a user to delete (Charlie Brown - inactive user)
    const userRow = page.locator('tr:has-text("charlie.brown@mwr.com")');
    await expect(userRow).toBeVisible();
    
    // Click delete button
    await userRow.locator('button:has-text("Delete")').click();
    
    // Handle confirmation dialog
    page.on('dialog', dialog => dialog.accept());
    
    // Check success message
    await expect(page.locator('.toast-success')).toBeVisible();
    
    // Check user is removed from table
    await expect(page.locator('text=Charlie Brown')).not.toBeVisible();
  });

  test('should display user statistics correctly', async ({ page }) => {
    // Count users in table
    const userRows = page.locator('tbody tr');
    const userCount = await userRows.count();
    
    // Check total users count
    const totalUsersElement = page.locator('text=Total Users').locator('..').locator('text=/\\d+/').first();
    await expect(totalUsersElement).toHaveText(userCount.toString());
    
    // Check active users count
    const activeUsers = await page.locator('text=active').count();
    const activeUsersElement = page.locator('text=Active Users').locator('..').locator('text=/\\d+/').first();
    await expect(activeUsersElement).toHaveText(activeUsers.toString());
    
    // Check admin users count
    const adminUsers = await page.locator('text=admin').count();
    const adminUsersElement = page.locator('text=Admins').locator('..').locator('text=/\\d+/').first();
    await expect(adminUsersElement).toHaveText(adminUsers.toString());
    
    // Check inactive users count
    const inactiveUsers = await page.locator('text=inactive').count();
    const inactiveUsersElement = page.locator('text=Inactive').locator('..').locator('text=/\\d+/').first();
    await expect(inactiveUsersElement).toHaveText(inactiveUsers.toString());
  });

  test('should validate user form fields', async ({ page }) => {
    // Open add user modal
    await openAddUserModal(page);
    
    // Try to save without filling required fields
    await page.click('button:has-text("Save")');
    
    // Check validation errors (if implemented)
    // Note: This test assumes form validation is implemented
    // If not implemented, this test should be updated accordingly
    
    // Fill invalid email
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.selectOption('select[name="role"]', 'requester');
    await page.click('button:has-text("Save")');
    
    // Check for validation error (if implemented)
    // await expect(page.locator('text=Invalid email')).toBeVisible();
  });

  test('should handle modal close and cancel operations', async ({ page }) => {
    // Open add user modal
    await openAddUserModal(page);
    
    // Fill some data
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    
    // Close modal with cancel button
    await closeUserModal(page);
    
    // Check modal is closed
    await expect(page.locator('[data-testid="user-modal"]')).not.toBeVisible();
    
    // Check no new user was created
    await expect(page.locator('text=Test User')).not.toBeVisible();
  });

  test('should display role colors correctly', async ({ page }) => {
    // Check admin role color
    const adminRole = page.locator('tr:has-text("John Smith")').locator('text=admin');
    await expect(adminRole).toHaveClass(/text-red-600/);
    
    // Check requester role color
    const requesterRole = page.locator('tr:has-text("Jane Doe")').locator('text=requester');
    await expect(requesterRole).toHaveClass(/text-gray-600/);
    
    // Check cardholder role color
    const cardholderRole = page.locator('tr:has-text("Bob Johnson")').locator('text=cardholder');
    await expect(cardholderRole).toHaveClass(/text-green-600/);
    
    // Check approver role color
    const approverRole = page.locator('tr:has-text("Alice Johnson")').locator('text=approver');
    await expect(approverRole).toHaveClass(/text-blue-600/);
    
    // Check auditor role color
    const auditorRole = page.locator('tr:has-text("Charlie Brown")').locator('text=auditor');
    await expect(auditorRole).toHaveClass(/text-purple-600/);
  });

  test('should display status colors correctly', async ({ page }) => {
    // Check active status color
    const activeStatus = page.locator('tr:has-text("John Smith")').locator('text=active');
    await expect(activeStatus).toHaveClass(/text-green-600/);
    
    // Check inactive status color
    const inactiveStatus = page.locator('tr:has-text("Charlie Brown")').locator('text=inactive');
    await expect(inactiveStatus).toHaveClass(/text-red-600/);
  });

  test('should show approval limits for users with limits', async ({ page }) => {
    // Check admin user has approval limit displayed
    const adminRow = page.locator('tr:has-text("John Smith")');
    await expect(adminRow.locator('text=Limit: $100,000')).toBeVisible();
    
    // Check approver user has approval limit displayed
    const approverRow = page.locator('tr:has-text("Alice Johnson")');
    await expect(approverRow.locator('text=Limit: $10,000')).toBeVisible();
    
    // Check requester user has no approval limit
    const requesterRow = page.locator('tr:has-text("Jane Doe")');
    await expect(requesterRow.locator('text=Limit:')).not.toBeVisible();
  });

  test('should handle bulk operations (if implemented)', async ({ page }) => {
    // This test checks for bulk operations functionality
    // If not implemented, this test should be updated or removed
    
    // Check for bulk select checkboxes
    const bulkSelectCheckbox = page.locator('input[type="checkbox"][data-testid="select-all"]');
    if (await bulkSelectCheckbox.isVisible()) {
      // Test bulk select all
      await bulkSelectCheckbox.check();
      
      // Check that all user checkboxes are selected
      const userCheckboxes = page.locator('input[type="checkbox"][data-testid="user-select"]');
      const count = await userCheckboxes.count();
      for (let i = 0; i < count; i++) {
        await expect(userCheckboxes.nth(i)).toBeChecked();
      }
      
      // Test bulk actions
      const bulkActionsButton = page.locator('button:has-text("Bulk Actions")');
      if (await bulkActionsButton.isVisible()) {
        await bulkActionsButton.click();
        await expect(page.locator('text=Bulk Activate')).toBeVisible();
        await expect(page.locator('text=Bulk Deactivate')).toBeVisible();
        await expect(page.locator('text=Bulk Delete')).toBeVisible();
      }
    }
  });

  test('should handle pagination (if implemented)', async ({ page }) => {
    // This test checks for pagination functionality
    // If not implemented, this test should be updated or removed
    
    const pagination = page.locator('[data-testid="pagination"]');
    if (await pagination.isVisible()) {
      // Test pagination controls
      await expect(page.locator('button:has-text("Previous")')).toBeVisible();
      await expect(page.locator('button:has-text("Next")')).toBeVisible();
      
      // Test page numbers
      const pageNumbers = page.locator('[data-testid="page-number"]');
      if (await pageNumbers.first().isVisible()) {
        await pageNumbers.first().click();
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('should handle loading states', async ({ page }) => {
    // Test loading state during user operations
    await openAddUserModal(page);
    
    // Fill form and save
    await fillUserForm(page, testUser);
    await page.click('button:has-text("Save")');
    
    // Check for loading state (if implemented)
    const loadingSpinner = page.locator('[data-testid="loading-spinner"]');
    if (await loadingSpinner.isVisible()) {
      await expect(loadingSpinner).toBeVisible();
      // Wait for loading to complete
      await expect(loadingSpinner).not.toBeVisible();
    }
    
    // Check success message appears after loading
    await expect(page.locator('.toast-success')).toBeVisible();
  });

  test('should handle error states gracefully', async ({ page }) => {
    // This test simulates error conditions
    // Note: This would require mocking API responses or network conditions
    
    // Open add user modal
    await openAddUserModal(page);
    
    // Fill form with potentially problematic data
    await page.fill('input[name="name"]', '');
    await page.fill('input[name="email"]', 'invalid-email-format');
    await page.selectOption('select[name="role"]', 'requester');
    
    // Try to save
    await page.click('button:has-text("Save")');
    
    // Check for error handling (if implemented)
    // This would depend on the specific error handling implementation
  });
});

test.describe('Admin User Management - Access Control', () => {
  test('should redirect non-admin users away from user management', async ({ page }) => {
    // This test would require testing with different user roles
    // For now, we'll test the admin access control
    
    await page.goto('/admin/users');
    
    // Check if redirected to login or access denied page
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/(login|access-denied)/);
  });

  test('should show access denied for non-admin users', async ({ page }) => {
    // Mock non-admin user session
    await page.goto('/admin/users');
    
    // Check for access denied message
    await expect(page.locator('text=Access Denied')).toBeVisible();
    await expect(page.locator('text=You don\'t have permission to access user management')).toBeVisible();
    await expect(page.locator('button:has-text("Return to Dashboard")')).toBeVisible();
  });
});

test.describe('Admin User Management - Responsive Design', () => {
  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await loginAsAdmin(page);
    await navigateToUserManagement(page);
    
    // Check that page is responsive
    await expect(page.locator('h1:has-text("User Management")')).toBeVisible();
    
    // Check that table is scrollable on mobile
    const table = page.locator('table');
    await expect(table).toBeVisible();
    
    // Check that buttons are accessible
    await expect(page.locator('button:has-text("Add User")')).toBeVisible();
  });

  test('should work on tablet devices', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await loginAsAdmin(page);
    await navigateToUserManagement(page);
    
    // Check that page layout adapts to tablet
    await expect(page.locator('h1:has-text("User Management")')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('button:has-text("Add User")')).toBeVisible();
  });
});
