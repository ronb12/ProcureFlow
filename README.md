# ProcureFlow

**From request to receipt—audited, automated, on time.**

*A Product of Bradley Virtual Solutions, LLC*

ProcureFlow is a production-quality web application that implements a comprehensive Purchase Card Management System for MWR (Morale, Welfare, and Recreation) facilities. It digitizes the entire procurement workflow from request creation to audit package generation while maintaining strict DOD MWR compliance standards and ensuring 100% audit readiness.

## ⚠️ Important Notice

This is a **demonstration system** for educational and evaluation purposes only. It is **NOT** intended for production use with actual financial systems. No actual card numbers (PAN) are stored or processed.

## 🏢 Product Summary

ProcureFlow streamlines the MWR procurement process through a comprehensive digital workflow with full DOD MWR compliance:

- **Requester** → Creates and submits purchase requests for MWR facilities
- **Approver (AO)** → Reviews and approves/denies requests with policy compliance validation
- **Cardholder** → Creates purchase orders, processes purchases, and uploads receipts
- **Reconciliation** → Monthly cycle closure with complete audit package generation
- **Auditor** → Reviews audit packages and ensures DOD MWR compliance
- **Administrator** → Manages system compliance and generates audit reports

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript, React Query, Zod, TailwindCSS, shadcn/ui
- **Backend**: Firebase (Auth, Firestore, Storage, Cloud Functions v2 on Node 20)
- **Authentication**: Firebase Auth (email/password + Google + Microsoft)
- **CI/CD**: GitHub Actions → Firebase Hosting + Functions deployment
- **Testing**: Vitest (units) + Playwright (e2e)
- **PWA**: Manifest + service worker for offline capabilities

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project with Authentication, Firestore, Storage, and Functions enabled

### 1. Clone and Install

```bash
git clone <repository-url>
cd ProcureFlow
pnpm install
```

### 2. Firebase Setup

```bash
# Login to Firebase
firebase login

# Initialize project (if not already done)
firebase init

# Set your project ID in .firebaserc
```

### 3. Environment Configuration

```bash
# Copy environment template
cp env.example .env.local

# Edit .env.local with your Firebase config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Deploy Firebase Rules

```bash
# Deploy Firestore and Storage rules
firebase deploy --only firestore:rules,storage

# Deploy Cloud Functions
cd functions
pnpm install
pnpm run build
cd ..
firebase deploy --only functions
```

### 5. Seed Demo Data

```bash
# Seed organizations, users, and sample data
pnpm run seed

# Assign user roles (sets custom claims)
pnpm run assign-roles
```

### 6. Start Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## 📋 POST-INSTALL CHECKLIST

1. ✅ Create Firebase project and enable required services
2. ✅ Set environment variables in `.env.local`
3. ✅ Enable Authentication providers (Email, Google, Microsoft)
4. ✅ Deploy Firestore rules and Storage rules
5. ✅ Deploy Cloud Functions
6. ✅ Run `pnpm run seed` to create demo data
7. ✅ Run `pnpm run assign-roles` to set user permissions
8. ✅ Login as each role to verify functionality:
   - **Admin**: `admin@procureflow.demo` / `demo123`
   - **Requester**: `requester@procureflow.demo` / `demo123`
   - **Approver**: `approver@procureflow.demo` / `demo123`
   - **Cardholder**: `cardholder@procureflow.demo` / `demo123`
   - **Auditor**: `auditor@procureflow.demo` / `demo123`

## 🏗 Architecture

### Data Model

- **Users**: Role-based access with custom claims
- **Organizations**: Multi-tenant support
- **Requests**: Core workflow entity with items subcollection
- **Approvals**: Approval tracking and comments
- **Purchases**: Cardholder purchase records
- **Cycles**: Monthly reconciliation periods
- **Audit**: Immutable event log

### Security

- **RBAC**: Strict role-based access control via Firebase custom claims
- **Firestore Rules**: Server-side validation and authorization
- **Storage Rules**: Private bucket with signed URLs only
- **No PAN Storage**: Card numbers never stored (process artifacts only)

### State Machine

Valid request transitions:

```
Draft → Submitted → AO Review → Approved → Cardholder Purchasing → Purchased → Reconciled → Closed
```

## 🎯 Key Features

### 🔍 **DOD MWR Compliance System**
- **Complete Audit Package Generation** - 10 required documents per transaction
- **Real-time Compliance Validation** - 10 core compliance checks
- **6-Year Document Retention** - Secure, tamper-proof storage
- **External Audit Readiness** - 100% audit-ready packages
- **Policy Enforcement** - Automated DOD MWR rule validation

### 👤 **For MWR Requesters**
- Create and manage purchase requests for MWR facilities
- Add items with SKU, quantity, and pricing
- Upload supporting documents with validation
- Track request status and compliance history
- Receive real-time compliance feedback

### ✅ **For MWR Approvers (AOs)**
- Review pending requests with compliance indicators
- Approve, deny, or return requests with detailed comments
- View policy compliance warnings and violations
- Provide certification statements for audit packages
- Monitor approval limits and policy adherence

### 💳 **For MWR Cardholders**
- **Manual Purchase Order Creation** - Quality control and error prevention
- Process approved purchases with compliance validation
- Upload receipt images with legibility checks
- Manage reconciliation cycles with complete documentation
- Resolve compliance issues before they become problems

### 🔍 **For MWR Auditors**
- **Comprehensive Audit Package Review** - Complete document validation
- **Real-time Compliance Monitoring** - System-wide compliance tracking
- **Audit Package Management** - Search, filter, and export capabilities
- **Compliance Reporting** - Detailed audit reports and analytics
- **Issue Resolution** - Track and resolve compliance problems

### ⚙️ **For MWR Administrators**
- **System-wide Compliance Management** - Monitor all audit packages
- **Policy Configuration** - Set compliance rules and thresholds
- **User Management** - Role-based access and permissions
- **Audit Report Generation** - External audit support
- **Compliance Analytics** - Trend analysis and recommendations

## 📱 PWA Features

- **Offline Support**: Draft requests saved locally
- **Mobile-First**: Optimized for mobile devices
- **Camera Integration**: Direct receipt capture
- **Push Notifications**: Status change alerts
- **Install Prompt**: Add to home screen

## 🧪 Testing

```bash
# Run unit tests
pnpm test

# Run e2e tests
pnpm run test:e2e

# Run tests with UI
pnpm run test:ui
```

## 🚀 Deployment

### Automatic (GitHub Actions)

Push to `main` branch triggers automatic deployment to Firebase.

### Manual

```bash
# Build and deploy
pnpm run build
pnpm run deploy

# Deploy specific services
pnpm run deploy:hosting
pnpm run deploy:functions
pnpm run deploy:rules
```

## 📊 Exports & Audit Packages

### **Standard Exports**
1. **CSV Export**: Purchase data in spreadsheet format
2. **Receipts ZIP**: All receipt files packaged for download

### **Audit Package Exports**
3. **Complete Audit Package**: Full DOD MWR compliance package
4. **Document Collection**: All 10 required documents per transaction
5. **Compliance Report**: Detailed compliance validation results
6. **Audit Trail Export**: Complete transaction history and changes

Exports are stored in Firebase Storage with signed URLs for secure access and 6-year retention.

## 🔧 Development

### Project Structure

```
ProcureFlow/
├── app/                    # Next.js App Router pages
├── components/            # Reusable UI components
├── lib/                   # Utilities, types, and Firebase config
├── functions/             # Cloud Functions (Node.js 20)
├── scripts/               # Seeding and utility scripts
├── tests/                 # Test files
├── public/                # Static assets and PWA files
└── .github/workflows/     # CI/CD configuration
```

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm test         # Run unit tests
pnpm test:e2e     # Run e2e tests
pnpm seed         # Seed demo data
pnpm assign-roles # Assign user roles
pnpm deploy       # Deploy to Firebase
```

## 🔒 Security & Compliance

### **Authentication & Authorization**
- **Multi-Provider Auth**: Firebase Auth (Email, Google, Microsoft)
- **Role-Based Access Control**: 5 distinct user roles with custom claims
- **Session Management**: Secure JWT tokens with proper validation
- **Access Control**: Granular permissions per resource and action

### **Data Security**
- **End-to-End Encryption**: All data encrypted in transit and at rest
- **Secure Storage**: Private Firebase Storage bucket with signed URLs
- **Data Validation**: Zod schemas for all inputs and API endpoints
- **HTTPS Only**: All communications encrypted

### **Audit & Compliance**
- **Immutable Audit Trail**: Complete, tamper-proof event logging
- **DOD MWR Compliance**: Full adherence to military procurement standards
- **6-Year Retention**: Secure document retention as required by DOD
- **Compliance Monitoring**: Real-time policy validation and enforcement
- **Audit Package Security**: Encrypted audit packages with access controls

## 📈 Monitoring & Analytics

### **System Monitoring**
- **Firebase Analytics**: User behavior tracking and usage patterns
- **Cloud Functions Logs**: Server-side monitoring and performance
- **Error Tracking**: Comprehensive error logging and alerting
- **Performance Metrics**: Real-time performance monitoring

### **Compliance Monitoring**
- **Real-Time Compliance**: Continuous policy validation monitoring
- **Audit Package Status**: Track completion and compliance status
- **Issue Tracking**: Monitor and resolve compliance problems
- **Compliance Dashboards**: Visual compliance status and trends

### **Audit Analytics**
- **Compliance Reports**: Detailed compliance status reports
- **Trend Analysis**: Compliance patterns and improvements
- **Audit Readiness**: System-wide audit readiness metrics
- **Performance Analytics**: Process efficiency and optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License & Copyright

**© 2024 Bradley Virtual Solutions, LLC. All rights reserved.**

This software is proprietary to Bradley Virtual Solutions, LLC and is protected by copyright laws and international treaties. Unauthorized reproduction, distribution, or modification is strictly prohibited.

### **Usage Rights**
- **Educational Use**: This demonstration system is provided for educational and evaluation purposes only
- **Commercial Use**: Requires written permission from Bradley Virtual Solutions, LLC
- **Government Use**: Available under government contract terms and conditions
- **Modification**: No modifications allowed without express written consent

## 🆘 Support

For questions or issues:

1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information
4. Contact: support@bradleyvirtualsolutions.com

## 🔄 Version History

- **v1.0.0**: Initial release with core workflow functionality
- **v1.1.0**: Added PWA support and offline capabilities
- **v1.2.0**: Enhanced audit logging and compliance features
- **v2.0.0**: Complete DOD MWR audit package system with full compliance

---

## 🏢 About Bradley Virtual Solutions, LLC

**Bradley Virtual Solutions, LLC** specializes in developing enterprise-grade software solutions for government and military organizations. Our expertise in compliance systems, audit management, and secure document handling makes us the ideal partner for MWR procurement modernization.

### **Our Services**
- **Custom Software Development**: Tailored solutions for government needs
- **Compliance Systems**: DOD, federal, and state compliance automation
- **Audit Management**: Complete audit trail and package generation
- **Security Solutions**: Military-grade security and data protection
- **System Integration**: Seamless integration with existing infrastructure

### **Contact Information**
- **Website**: [www.bradleyvirtualsolutions.com](https://www.bradleyvirtualsolutions.com)
- **Email**: support@bradleyvirtualsolutions.com
- **Phone**: (555) 123-4567
- **Address**: 123 Business Park Dr, Suite 100, Anytown, ST 12345

---

**Built with ❤️ by Bradley Virtual Solutions, LLC**

*Empowering Government Through Technology*
