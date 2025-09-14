# ProcureFlow Login Credentials

## 🔐 **Correct Way to Test Role-Based Pages**

### **❌ Common Mistake:**
- Using `test@procureflow.demo` / `demo123` and expecting it to show approver pages
- The test user defaults to 'requester' role

### **✅ Correct Approach:**

#### **Option 1: Use Specific Role Credentials**
Login with the specific role user credentials:

- **Admin**: `admin@procureflow.demo` / `demo123`
- **Requester**: `requester@procureflow.demo` / `demo123`
- **Approver**: `approver@procureflow.demo` / `demo123`
- **Cardholder**: `cardholder@procureflow.demo` / `demo123`
- **Auditor**: `auditor@procureflow.demo` / `demo123`

#### **Option 2: Use Test User with Role Switching**
1. Login with `test@procureflow.demo` / `demo123`
2. Go to `/debug` page
3. Enable Test Mode
4. Switch to the desired role (e.g., "approver")
5. Navigate to see role-specific pages

---

## 🧪 **Testing Approver Role Specifically**

### **Method 1: Direct Login**
1. Go to https://procureflow-demo.web.app
2. Login with: `approver@procureflow.demo` / `demo123`
3. You should see:
   - **Navigation**: Requests, **Approvals**, Dashboard, Profile, Notifications
   - **Default page**: Dashboard (not requests page)
   - **Access to**: `/approvals` page

### **Method 2: Test User + Role Switch**
1. Login with: `test@procureflow.demo` / `demo123`
2. Go to `/debug` page
3. Click "Enable Test Mode"
4. Click "approver" button
5. Navigate to see approver-specific pages

---

## 📋 **Expected Results by Role**

### **When logged in as `approver@procureflow.demo`:**
- **Navigation shows**: Requests, **Approvals**, Dashboard, Profile, Notifications
- **Can access**: `/approvals` page
- **Cannot access**: `/purchases`, `/audit-packages`, `/admin`

### **When logged in as `test@procureflow.demo` + switched to approver:**
- **Navigation shows**: Requests, **Approvals**, Dashboard, Profile, Notifications
- **Header shows**: "(Debug: approver)"
- **Can access**: `/approvals` page
- **Cannot access**: `/purchases`, `/audit-packages`, `/admin`

---

## 🚨 **Troubleshooting**

### **If you see requester pages when logged in as approver:**
1. **Check the URL** - Make sure you're on the right site
2. **Clear browser cache** - Ctrl+Shift+R
3. **Verify credentials** - Use `approver@procureflow.demo` / `demo123`
4. **Check browser console** - Look for any errors

### **If role switching doesn't work:**
1. **Go to `/debug` page** first
2. **Click "Enable Test Mode"** button
3. **Then click the role button** (e.g., "approver")
4. **Verify header shows** "(Debug: approver)"

### **If pages are blank:**
1. **Clear browser cache** completely
2. **Try incognito/private mode**
3. **Check for JavaScript errors** in console
4. **Refresh the page** after switching roles

---

## 🎯 **Quick Test Steps**

1. **Login as approver**: `approver@procureflow.demo` / `demo123`
2. **Verify navigation** shows "Approvals" button
3. **Click "Approvals"** - should go to `/approvals` page
4. **Verify page loads** without errors
5. **Check you can't access** `/purchases` or `/admin` pages

**The key is using the correct role-specific login credentials!** 🎉
