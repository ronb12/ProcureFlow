# Admin Setup Guide

This guide covers the complete admin setup and testing for ProcureFlow, including all the fixes and enhancements made to ensure proper admin functionality.

## 🔧 Issues Fixed

### 1. **Firestore Indexes** ✅
- Added 15+ missing composite indexes for admin queries
- Covers all major query patterns used by admin functions
- Includes indexes for requests, purchases, users, audit logs, and more

### 2. **Security Rules Performance** ✅
- Updated Firestore rules to use custom claims first, with document fallback
- Eliminates unnecessary database reads for role checking
- Maintains backward compatibility

### 3. **Role Assignment Script** ✅
- Fixed to work with actual user UIDs from Firestore
- Automatically maps demo emails to roles
- Includes fallback to seeded user IDs

### 4. **Comprehensive Sample Data** ✅
- Added 8+ diverse sample requests across all statuses
- Created sample purchases, purchase orders, and audit data
- Added system metrics and admin notifications
- Included compliance testing data (blocked vendors, split purchases)

## 🚀 Quick Start

### 1. Deploy Firebase Configuration
```bash
# Deploy updated rules and indexes
firebase deploy --only firestore:rules,firestore:indexes,storage

# Deploy Cloud Functions
firebase deploy --only functions
```

### 2. Seed Base Data
```bash
# Create organizations, users, and basic sample data
pnpm run seed
```

### 3. Assign User Roles
```bash
# Assign roles to users based on their email addresses
pnpm run assign-roles
```

### 4. Create Admin Dashboard Data
```bash
# Create comprehensive admin testing data
pnpm run admin-data
```

## 👥 Admin Users

The system includes several admin test users:

| Email | Role | Organization | Approval Limit |
|-------|------|--------------|----------------|
| `admin@procureflow.demo` | Admin | CDC | $100,000 |
| `james.kirk@navy.mil` | Admin | Navy | $100,000 |

## 📊 Sample Data Overview

### Organizations
- **CDC** (Centers for Disease Control and Prevention)
- **SAC** (Strategic Air Command) 
- **Navy** (United States Navy)
- **Army** (United States Army)
- **Marines** (United States Marine Corps)

### Request Statuses Covered
- ✅ Draft (2 requests)
- ✅ Submitted (1 request)
- ✅ AO Review (3 requests)
- ✅ Approved (2 requests)
- ✅ Cardholder Purchasing (1 request)
- ✅ Purchased (3 requests)
- ✅ Reconciled (1 request)
- ✅ Closed (1 request)
- ✅ Denied (1 request)
- ✅ Returned (1 request)

### Admin Testing Scenarios
- **High-Value Requests**: $125,000 aircraft equipment
- **Split Purchase Detection**: Multiple purchases from same vendor
- **Blocked Vendor Testing**: Requests from blocked vendors
- **Multi-Organization**: Requests across different organizations
- **Compliance Alerts**: Various compliance violations
- **Audit Trail**: Complete audit events for all actions

## 🔍 Admin Dashboard Features

### System Overview
- Total requests and value across all organizations
- Processing time metrics
- Approval rates and compliance scores
- Active users and organization counts

### Request Management
- View all requests across organizations
- Filter by status, organization, date range
- Bulk actions for approvals/denials
- Request details and audit trail

### User Management
- View all users across organizations
- Assign/update roles and approval limits
- Organization management
- User activity tracking

### Compliance & Audit
- Real-time compliance monitoring
- Audit log viewing and filtering
- Split purchase detection
- Blocked vendor management

### Analytics & Reporting
- Monthly trends and metrics
- Top vendors and spending patterns
- Status breakdowns
- Performance indicators

## 🛠️ Admin Functions

### Cloud Functions Available
- `stateTransition`: Handle request status changes
- `createApproval`: Create approval records
- `recordPurchase`: Record purchase transactions
- `exportCycleCsv`: Export cycle data to CSV
- `exportCycleReceiptsZip`: Export receipts as ZIP
- `scheduleMonthlyClose`: Automated cycle management

### Security Features
- Role-based access control (RBAC)
- Custom claims for performance
- Audit logging for all actions
- Policy checks and compliance validation
- Multi-tenant organization support

## 📈 Performance Optimizations

### Firestore Indexes
All critical admin queries are now properly indexed:
- User queries by organization and role
- Request queries by status, organization, and date
- Purchase queries by cardholder and date
- Audit queries by entity and timestamp
- Message queries by participants and date

### Security Rules
- Custom claims for fast role checking
- Fallback to document reads when needed
- Consistent admin detection across services
- Optimized query patterns

## 🧪 Testing Admin Features

### 1. Login as Admin
```bash
# Use admin credentials
Email: admin@procureflow.demo
Password: demo123
```

### 2. Test Admin Dashboard
- View system overview metrics
- Check all requests across organizations
- Review user management interface
- Test audit log functionality

### 3. Test Admin Actions
- Create new users and assign roles
- Update system settings
- View compliance alerts
- Export data and reports

### 4. Test Multi-Organization
- Switch between different organizations
- Verify data isolation
- Test cross-organization admin access

## 🔐 Security Considerations

### Admin Permissions
- Full access to all collections
- Can create/update/delete users
- Can modify system settings
- Can view all audit logs
- Can export all data

### Data Protection
- Organization-based data isolation
- Audit trail for all admin actions
- Role validation on all operations
- Secure file upload handling

## 📝 Maintenance

### Regular Tasks
- Monitor system metrics
- Review compliance alerts
- Update blocked vendor lists
- Manage user roles and permissions
- Review audit logs

### Monthly Tasks
- Run cycle close functions
- Generate compliance reports
- Review system performance
- Update approval limits as needed

## 🆘 Troubleshooting

### Common Issues
1. **Role Assignment Fails**: Run `pnpm run assign-roles` again
2. **Missing Data**: Run `pnpm run admin-data` to create test data
3. **Permission Errors**: Check custom claims are set correctly
4. **Query Errors**: Ensure indexes are deployed with `firebase deploy --only firestore:indexes`

### Debug Commands
```bash
# Check user roles
pnpm run get-user-uids

# Re-seed data
pnpm run seed && pnpm run assign-roles

# Create admin data
pnpm run admin-data
```

## 📞 Support

For admin-related issues:
1. Check the audit logs for error details
2. Verify user roles and permissions
3. Ensure all indexes are deployed
4. Check Firebase console for errors

The admin system is now fully functional with comprehensive sample data and proper security configurations.
