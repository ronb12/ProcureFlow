# ProcureFlow

**From request to receipt—audited, automated, on time.**

ProcureFlow is a production-quality web application that implements a Purchase Card Management System for MWR (Morale, Welfare, and Recreation) facilities. It digitizes purchase requests, approvals, cardholder processing, and monthly reconciliation while maintaining strict security and compliance standards.

## ⚠️ Important Notice

This is a **demonstration system** for educational and evaluation purposes only. It is **NOT** intended for production use with actual financial systems. No actual card numbers (PAN) are stored or processed.

## 🏢 Product Summary

ProcureFlow streamlines the MWR procurement process through a digital workflow:

- **Requester** → Creates and submits purchase requests for MWR facilities
- **Approver (AO)** → Reviews and approves/denies requests  
- **Cardholder** → Processes approved purchases and uploads receipts
- **Reconciliation** → Monthly cycle closure with CSV + receipts ZIP exports

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

### For MWR Requesters
- Create and manage purchase requests for MWR facilities
- Add items with SKU, quantity, and pricing
- Upload supporting documents
- Track request status and history

### For MWR Approvers
- Review pending requests
- Approve, deny, or return requests
- Add approval comments
- View policy compliance warnings

### For MWR Cardholders
- Process approved purchases
- Record order details and final totals
- Upload receipt images
- Manage reconciliation cycles

### For MWR Auditors
- View comprehensive audit logs
- Track all system activities
- Generate compliance reports

### For MWR Administrators
- Manage users and organizations
- Configure system settings
- Set approval limits and blocked merchants
- Monitor system health

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

## 📊 Exports

The system generates two types of exports:

1. **CSV Export**: Purchase data in spreadsheet format
2. **Receipts ZIP**: All receipt files packaged for download

Exports are stored in Firebase Storage with signed URLs for secure access.

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

## 🔒 Security Considerations

- **Authentication**: Firebase Auth with multiple providers
- **Authorization**: Custom claims-based RBAC
- **Data Validation**: Zod schemas for all inputs
- **Audit Logging**: Immutable event tracking
- **Secure Storage**: Private Firebase Storage bucket
- **HTTPS Only**: All communications encrypted

## 📈 Monitoring

- **Firebase Analytics**: User behavior tracking
- **Cloud Functions Logs**: Server-side monitoring
- **Error Tracking**: Comprehensive error logging
- **Performance**: Real-time performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

© 2024 Bradley Virtual Solutions, LLC. All rights reserved.

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

---

**Built with ❤️ by Bradley Virtual Solutions, LLC**
