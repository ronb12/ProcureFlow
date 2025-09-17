# Role-Based Navigation Test Guide

## 🧪 Testing Role-Based Page Access

### **Test User Credentials:**
- **Email**: `test@procureflow.demo`
- **Password**: `demo123`

### **How to Test:**
1. **Login** with the demo user credentials
2. **Go to** `/debug` page
3. **Enable Test Mode** and switch between roles
4. **Verify** that the navigation menu changes based on the selected role
5. **Test** accessing different pages based on the role

---

## 📋 Role-Based Navigation Matrix

### **👤 Requester Role**
**Visible Navigation Items:**
- ✅ Requests
- ✅ Dashboard
- ✅ Profile
- ✅ Notifications

**Hidden Navigation Items:**
- ❌ Approvals (approver/admin only)
- ❌ Purchases (cardholder/admin only)
- ❌ Audit Packages (auditor/admin only)
- ❌ Admin (admin only)

**Accessible Pages:**
- `/requests` - View and create requests
- `/requests/new` - Create new request
- `/dashboard` - Personal dashboard
- `/profile` - User profile
- `/notifications` - View notifications

---

### **✅ Approver Role**
**Visible Navigation Items:**
- ✅ Requests
- ✅ **Approvals** (role-specific)
- ✅ Dashboard
- ✅ Profile
- ✅ Notifications

**Hidden Navigation Items:**
- ❌ Purchases (cardholder/admin only)
- ❌ Audit Packages (auditor/admin only)
- ❌ Admin (admin only)

**Accessible Pages:**
- `/requests` - View requests
- `/approvals` - Review and approve requests
- `/dashboard` - Personal dashboard
- `/profile` - User profile
- `/notifications` - View notifications

---

### **💳 Cardholder Role**
**Visible Navigation Items:**
- ✅ Requests
- ✅ **Purchases** (role-specific)
- ✅ Dashboard
- ✅ Profile
- ✅ Notifications

**Hidden Navigation Items:**
- ❌ Approvals (approver/admin only)
- ❌ Audit Packages (auditor/admin only)
- ❌ Admin (admin only)

**Accessible Pages:**
- `/requests` - View requests
- `/purchases` - Process purchases
- `/purchase-orders` - Create and manage POs
- `/dashboard` - Personal dashboard
- `/profile` - User profile
- `/notifications` - View notifications

---

### **🔍 Auditor Role**
**Visible Navigation Items:**
- ✅ Requests
- ✅ **Audit Packages** (role-specific)
- ✅ Dashboard
- ✅ Profile
- ✅ Notifications

**Hidden Navigation Items:**
- ❌ Approvals (approver/admin only)
- ❌ Purchases (cardholder/admin only)
- ❌ Admin (admin only)

**Accessible Pages:**
- `/requests` - View requests
- `/audit-packages` - Review audit packages
- `/audit` - View audit logs
- `/dashboard` - Personal dashboard
- `/profile` - User profile
- `/notifications` - View notifications

---

### **👑 Admin Role**
**Visible Navigation Items:**
- ✅ Requests
- ✅ **Approvals** (admin access)
- ✅ **Purchases** (admin access)
- ✅ **Audit Packages** (admin access)
- ✅ **Admin** (admin only)
- ✅ Dashboard
- ✅ Profile
- ✅ Notifications

**Accessible Pages:**
- `/requests` - View all requests
- `/approvals` - Review approvals
- `/purchases` - View purchases
- `/purchase-orders` - Manage POs
- `/audit-packages` - Review audit packages
- `/audit` - View audit logs
- `/admin` - System administration
- `/admin/users` - User management
- `/create-user` - Create new users
- `/dashboard` - System dashboard
- `/profile` - User profile
- `/notifications` - View notifications
- `/settings` - System settings

---

## 🧪 Step-by-Step Test Process

### **1. Login Test**
1. Go to https://procureflow-demo.web.app
2. Login with `test@procureflow.demo` / `demo123`
3. Verify you're logged in successfully

### **2. Debug Page Test**
1. Navigate to `/debug`
2. Click "Enable Test Mode"
3. Verify role switcher appears

### **3. Role Switching Test**
1. **Switch to Requester** - Verify only Requests, Dashboard, Profile, Notifications show
2. **Switch to Approver** - Verify Approvals button appears
3. **Switch to Cardholder** - Verify Purchases button appears
4. **Switch to Auditor** - Verify Audit Packages button appears
5. **Switch to Admin** - Verify all buttons appear including Admin

### **4. Page Access Test**
1. **As Approver** - Click Approvals, verify page loads
2. **As Cardholder** - Click Purchases, verify page loads
3. **As Auditor** - Click Audit Packages, verify page loads
4. **As Admin** - Click Admin, verify page loads

### **5. Visual Indicator Test**
1. Verify header shows current role
2. When debug role is active, verify "(Debug: [role])" appears
3. Verify role switching updates the display immediately

---

## ✅ Expected Results

- **Navigation menu** changes based on selected role
- **Role-specific pages** are accessible only to appropriate roles
- **Visual indicators** show current role correctly
- **Page content** loads without JavaScript errors
- **Role switching** works instantly without page refresh

---

## 🚨 Troubleshooting

### **If Navigation Doesn't Change:**
1. Clear browser cache (Ctrl+Shift+R)
2. Check browser console for errors
3. Verify debug mode is enabled
4. Try refreshing the page

### **If Pages Don't Load:**
1. Check for JavaScript errors in console
2. Verify Firebase hosting is updated
3. Try accessing pages directly via URL
4. Check network tab for failed requests

### **If Role Switching Doesn't Work:**
1. Verify you're on the `/debug` page
2. Check that "Enable Test Mode" is clicked
3. Verify the role buttons are clickable
4. Check browser console for errors

