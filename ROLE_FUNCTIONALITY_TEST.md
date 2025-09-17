# ProcureFlow Role Functionality Test

## 🧪 **Complete Role Testing Guide**

### **🌐 Application URL:**
https://procureflow-demo.web.app

---

## 📋 **Test Credentials**

### **Individual Role Users:**
- **Admin**: `admin@procureflow.demo` / `demo123`
- **Requester**: `requester@procureflow.demo` / `demo123`
- **Approver**: `approver@procureflow.demo` / `demo123`
- **Cardholder**: `cardholder@procureflow.demo` / `demo123`
- **Auditor**: `auditor@procureflow.demo` / `demo123`

### **Test User (Role Switching):**
- **Test User**: `test@procureflow.demo` / `demo123`
- **Use with**: `/debug` page for role switching

---

## 🔍 **Role-by-Role Testing**

### **1. 👤 Requester Role Test**

#### **Login:** `requester@procureflow.demo` / `demo123`

#### **Expected Navigation:**
- ✅ Requests
- ✅ Dashboard
- ✅ Profile
- ✅ Notifications
- ❌ Approvals (hidden)
- ❌ Purchases (hidden)
- ❌ Audit Packages (hidden)
- ❌ Admin (hidden)

#### **Test Steps:**
1. **Login** with requester credentials
2. **Verify navigation** shows only requester items
3. **Click "Requests"** → Should go to `/requests`
4. **Click "Dashboard"** → Should go to `/dashboard`
5. **Click "Profile"** → Should go to `/profile`
6. **Click "Notifications"** → Should go to `/notifications`
7. **Try accessing** `/approvals` → Should be blocked or show error
8. **Try accessing** `/purchases` → Should be blocked or show error
9. **Try accessing** `/admin` → Should be blocked or show error

#### **Expected Results:**
- ✅ All requester pages load successfully
- ✅ Role-specific pages are accessible
- ✅ Non-requester pages are blocked
- ✅ Navigation works correctly

---

### **2. ✅ Approver Role Test**

#### **Login:** `approver@procureflow.demo` / `demo123`

#### **Expected Navigation:**
- ✅ Requests
- ✅ **Approvals** (role-specific)
- ✅ Dashboard
- ✅ Profile
- ✅ Notifications
- ❌ Purchases (hidden)
- ❌ Audit Packages (hidden)
- ❌ Admin (hidden)

#### **Test Steps:**
1. **Login** with approver credentials
2. **Verify navigation** shows "Approvals" button
3. **Click "Approvals"** → Should go to `/approvals`
4. **Verify approvals page** loads with approver content
5. **Click "Requests"** → Should go to `/requests`
6. **Click "Dashboard"** → Should go to `/dashboard`
7. **Try accessing** `/purchases` → Should be blocked
8. **Try accessing** `/admin` → Should be blocked

#### **Expected Results:**
- ✅ Approvals page loads with approver-specific content
- ✅ Can view and approve requests
- ✅ Cannot access cardholder or admin pages
- ✅ Navigation shows approver-specific items

---

### **3. 💳 Cardholder Role Test**

#### **Login:** `cardholder@procureflow.demo` / `demo123`

#### **Expected Navigation:**
- ✅ Requests
- ✅ **Purchases** (role-specific)
- ✅ Dashboard
- ✅ Profile
- ✅ Notifications
- ❌ Approvals (hidden)
- ❌ Audit Packages (hidden)
- ❌ Admin (hidden)

#### **Test Steps:**
1. **Login** with cardholder credentials
2. **Verify navigation** shows "Purchases" button
3. **Click "Purchases"** → Should go to `/purchases`
4. **Verify purchases page** loads with cardholder content
5. **Try accessing** `/purchase-orders` → Should be accessible
6. **Try accessing** `/approvals` → Should be blocked
7. **Try accessing** `/admin` → Should be blocked

#### **Expected Results:**
- ✅ Purchases page loads with cardholder content
- ✅ Can process purchases and create POs
- ✅ Cannot access approver or admin pages
- ✅ Navigation shows cardholder-specific items

---

### **4. 🔍 Auditor Role Test**

#### **Login:** `auditor@procureflow.demo` / `demo123`

#### **Expected Navigation:**
- ✅ Requests
- ✅ **Audit Packages** (role-specific)
- ✅ Dashboard
- ✅ Profile
- ✅ Notifications
- ❌ Approvals (hidden)
- ❌ Purchases (hidden)
- ❌ Admin (hidden)

#### **Test Steps:**
1. **Login** with auditor credentials
2. **Verify navigation** shows "Audit Packages" button
3. **Click "Audit Packages"** → Should go to `/audit-packages`
4. **Verify audit packages page** loads with auditor content
5. **Try accessing** `/audit` → Should be accessible
6. **Try accessing** `/approvals` → Should be blocked
7. **Try accessing** `/admin` → Should be blocked

#### **Expected Results:**
- ✅ Audit Packages page loads with auditor content
- ✅ Can review audit packages and compliance
- ✅ Cannot access approver or admin pages
- ✅ Navigation shows auditor-specific items

---

### **5. 👑 Admin Role Test**

#### **Login:** `admin@procureflow.demo` / `demo123`

#### **Expected Navigation:**
- ✅ Requests
- ✅ **Approvals** (admin access)
- ✅ **Purchases** (admin access)
- ✅ **Audit Packages** (admin access)
- ✅ **Admin** (admin only)
- ✅ Dashboard
- ✅ Profile
- ✅ Notifications

#### **Test Steps:**
1. **Login** with admin credentials
2. **Verify navigation** shows ALL buttons
3. **Click "Admin"** → Should go to `/admin`
4. **Click "Approvals"** → Should go to `/approvals`
5. **Click "Purchases"** → Should go to `/purchases`
6. **Click "Audit Packages"** → Should go to `/audit-packages`
7. **Try accessing** `/admin/users` → Should be accessible
8. **Try accessing** `/create-user` → Should be accessible

#### **Expected Results:**
- ✅ All pages are accessible
- ✅ Admin panel loads with full functionality
- ✅ Can manage users and system settings
- ✅ Navigation shows all available options

---

## 🔄 **Role Switching Test (Debug Mode)**

#### **Login:** `test@procureflow.demo` / `demo123`

#### **Test Steps:**
1. **Login** with test user credentials
2. **Go to** `/debug` page
3. **Click "Enable Test Mode"**
4. **Test each role** by clicking role buttons:
   - **Requester** → Verify navigation changes
   - **Approver** → Verify "Approvals" appears
   - **Cardholder** → Verify "Purchases" appears
   - **Auditor** → Verify "Audit Packages" appears
   - **Admin** → Verify all buttons appear
5. **Verify header** shows "(Debug: [role])"
6. **Test page access** for each switched role

#### **Expected Results:**
- ✅ Role switching works instantly
- ✅ Navigation changes based on selected role
- ✅ Page access changes based on selected role
- ✅ Visual indicators show current role

---

## 🚨 **Common Issues & Troubleshooting**

### **If Navigation Doesn't Change:**
1. **Clear browser cache** (Ctrl+Shift+R)
2. **Check browser console** for JavaScript errors
3. **Verify** you're logged in with correct credentials
4. **Try incognito/private mode**

### **If Pages Don't Load:**
1. **Check for JavaScript errors** in console
2. **Verify Firebase hosting** is updated
3. **Check network tab** for failed requests
4. **Try refreshing** the page

### **If Role Switching Doesn't Work:**
1. **Go to** `/debug` page first
2. **Click "Enable Test Mode"** button
3. **Then click** the role button
4. **Verify** header shows debug role

### **If User Document Missing:**
1. **Use** `/fix-approver-user.html` tool
2. **Create** missing user documents
3. **Verify** role is set correctly in Firestore

---

## ✅ **Success Criteria**

### **All Roles Working When:**
- ✅ Navigation shows correct items for each role
- ✅ Role-specific pages load without errors
- ✅ Non-authorized pages are blocked
- ✅ Role switching works in debug mode
- ✅ Visual indicators show current role
- ✅ All page functionality works correctly

### **Application Fully Functional When:**
- ✅ All 5 roles work correctly
- ✅ All pages load without JavaScript errors
- ✅ Navigation works for all roles
- ✅ Role-based access control works
- ✅ Debug mode allows testing all roles

---

## 🎯 **Quick Verification Checklist**

- [ ] Requester: Can access requests, dashboard, profile, notifications
- [ ] Approver: Can access approvals page + requester pages
- [ ] Cardholder: Can access purchases page + requester pages
- [ ] Auditor: Can access audit packages page + requester pages
- [ ] Admin: Can access all pages including admin panel
- [ ] Debug mode: Role switching works for test user
- [ ] Navigation: Changes correctly based on role
- [ ] Pages: Load without JavaScript errors
- [ ] Access control: Blocks unauthorized pages

**Test each role systematically to confirm full functionality!** 🚀

