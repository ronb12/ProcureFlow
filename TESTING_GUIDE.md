# ProcureFlow Testing Guide

## Quick Testing Setup

### **Single Login for All Roles**

For testing purposes, you can use the same login credentials for all roles:

**Email**: `test@procureflow.demo`  
**Password**: `demo123`

### **Role Testing Methods**

#### **Method 1: Use Existing Demo Users (Current)**
```
Admin: admin@procureflow.demo / demo123
Requester: requester@procureflow.demo / demo123
Approver: approver@procureflow.demo / demo123
Cardholder: cardholder@procureflow.demo / demo123
Auditor: auditor@procureflow.demo / demo123
```

#### **Method 2: Single User with Role Switching (Recommended)**
1. **Login once** with `test@procureflow.demo` / `demo123`
2. **Use the debug page** at `/debug` to switch roles
3. **Test all features** without multiple logins

### **Testing Workflow**

#### **1. Admin Testing**
- Login as admin
- Navigate to `/admin` - User management
- Navigate to `/audit-packages` - Audit package management
- Test system-wide features

#### **2. Requester Testing**
- Switch to requester role
- Navigate to `/requests/new` - Create new request
- Navigate to `/requests` - View all requests
- Test request creation workflow

#### **3. Approver Testing**
- Switch to approver role
- Navigate to `/approvals` - Review pending approvals
- Test approval workflow
- Test policy compliance checks

#### **4. Cardholder Testing**
- Switch to cardholder role
- Navigate to `/purchases` - View purchase queue
- Navigate to `/purchase-orders` - Create purchase orders
- Test purchase processing workflow

#### **5. Auditor Testing**
- Switch to auditor role
- Navigate to `/audit-packages` - Review audit packages
- Navigate to `/audit` - View audit logs
- Test compliance reporting

### **Debug Page Features**

The debug page (`/debug`) provides:
- **Role switching** - Change user role instantly
- **Data seeding** - Add test data
- **System status** - Check system health
- **Feature testing** - Test specific features

### **Test Data**

The system includes comprehensive test data:
- **Sample requests** - Various statuses and amounts
- **Mock audit packages** - Complete compliance examples
- **User accounts** - All roles with proper permissions
- **Organizations** - MWR facility data

### **Testing Checklist**

#### **Core Workflow Testing**
- [ ] Create purchase request
- [ ] Submit for approval
- [ ] Review and approve request
- [ ] Create purchase order
- [ ] Process purchase
- [ ] Upload receipt
- [ ] Complete reconciliation
- [ ] Generate audit package

#### **Compliance Testing**
- [ ] Test micro purchase limits
- [ ] Test split purchase detection
- [ ] Test blocked merchant checks
- [ ] Test vendor approval validation
- [ ] Test document requirements

#### **UI/UX Testing**
- [ ] Test mobile responsiveness
- [ ] Test PWA features
- [ ] Test offline functionality
- [ ] Test accessibility features
- [ ] Test navigation between roles

#### **Security Testing**
- [ ] Test role-based access control
- [ ] Test data encryption
- [ ] Test audit logging
- [ ] Test session management
- [ ] Test file upload security

### **Common Testing Scenarios**

#### **Scenario 1: Complete Purchase Cycle**
1. Login as requester
2. Create new purchase request
3. Switch to approver, approve request
4. Switch to cardholder, create PO
5. Process purchase, upload receipt
6. Complete reconciliation
7. Switch to auditor, review audit package

#### **Scenario 2: Compliance Violation Testing**
1. Create request exceeding micro purchase limit
2. Test split purchase detection
3. Test blocked merchant validation
4. Test incomplete documentation handling

#### **Scenario 3: Mobile Testing**
1. Access on mobile device
2. Test PWA installation
3. Test offline functionality
4. Test camera integration for receipts

### **Troubleshooting**

#### **Common Issues**
- **Role not switching**: Clear browser cache, refresh page
- **Data not loading**: Check network connection, refresh
- **Features not working**: Verify role permissions
- **Mobile issues**: Test in different browsers

#### **Reset Testing Environment**
```bash
# Reset all test data
pnpm run seed
pnpm run assign-roles
```

### **Performance Testing**

#### **Load Testing**
- Test with multiple concurrent users
- Test large document uploads
- Test complex audit package generation
- Test system responsiveness

#### **Browser Testing**
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

### **Accessibility Testing**

#### **WCAG Compliance**
- Test with screen readers
- Test keyboard navigation
- Test color contrast
- Test font scaling

### **Security Testing**

#### **Authentication Testing**
- Test login/logout
- Test session timeout
- Test password requirements
- Test multi-factor authentication (if enabled)

#### **Authorization Testing**
- Test role-based access
- Test permission boundaries
- Test data isolation
- Test audit logging

---

**Note**: This testing guide is designed for development and evaluation purposes. For production deployment, follow proper security and compliance procedures.
