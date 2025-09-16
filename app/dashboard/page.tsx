'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { PWAInstallButton } from '@/components/ui/pwa-install-button';
import { AppHeader } from '@/components/ui/app-header';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  FileText,
  CheckCircle,
  ShoppingCart,
  BarChart3,
  Plus,
  Clock,
  AlertCircle,
  AlertTriangle,
  Shield,
  TrendingUp,
} from 'lucide-react';

// Mock data - in real app this would come from API
const mockStats = {
  myRequests: {
    total: 12,
    draft: 2,
    submitted: 3,
    inReview: 1,
    approved: 2,
    purchased: 3,
    reconciled: 1,
  },
  pendingApprovals: 5,
  cardholderQueue: 8,
  reconciliationStatus: {
    open: 3,
    closed: 1,
    missingReceipts: 2,
  },
  // Audit-specific statistics
  auditPackages: {
    total: 24,
    auditReady: 8,
    pendingReview: 6,
    nonCompliant: 3,
    compliant: 7,
    incomplete: 2,
  },
  complianceMonitoring: {
    criticalIssues: 5,
    warnings: 12,
    resolved: 18,
    totalIssues: 35,
  },
  dodMwrCompliance: {
    compliantPackages: 15,
    needsReview: 6,
    missingDocuments: 3,
    totalPackages: 24,
  },
};

const mockRecentRequests = [
  {
    id: '1',
    vendor: 'Home Depot',
    total: 1250.0,
    status: 'AO Review' as const,
    createdAt: new Date('2024-01-15'),
    needBy: new Date('2024-01-20'),
  },
  {
    id: '2',
    vendor: 'Office Depot',
    total: 450.0,
    status: 'Purchased' as const,
    createdAt: new Date('2024-01-14'),
    needBy: new Date('2024-01-18'),
  },
  {
    id: '3',
    vendor: "Lowe's",
    total: 2100.0,
    status: 'Draft' as const,
    createdAt: new Date('2024-01-13'),
    needBy: new Date('2024-01-25'),
  },
];

// Mock audit activity data
const mockAuditActivity = [
  {
    id: '1',
    packageId: 'REQ-2024-001',
    action: 'Package Reviewed',
    status: 'compliant' as const,
    createdAt: new Date('2024-01-15'),
    issues: 0,
  },
  {
    id: '2',
    packageId: 'REQ-2024-002',
    action: 'Compliance Check',
    status: 'non_compliant' as const,
    createdAt: new Date('2024-01-14'),
    issues: 3,
  },
  {
    id: '3',
    packageId: 'REQ-2024-003',
    action: 'DOD MWR Review',
    status: 'audit_ready' as const,
    createdAt: new Date('2024-01-13'),
    issues: 1,
  },
];

export default function DashboardPage() {
  const { user, loading, originalUser } = useAuth();
  const router = useRouter();
  
  // Use original user role for role-based functionality, not debug role
  const actualRole = originalUser?.role || user?.role || 'requester';

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getRoleBasedCards = () => {
    const cards = [];

    // My Requests - only for requesters and admins
    if (actualRole && ['requester', 'admin'].includes(actualRole)) {
      cards.push({
        title: 'My Requests',
        description: `${mockStats.myRequests.total} total requests`,
        icon: FileText,
        href: '/requests',
        stats: [
          {
            label: 'Draft',
            value: mockStats.myRequests.draft,
            color: 'text-gray-600',
          },
          {
            label: 'Submitted',
            value: mockStats.myRequests.submitted,
            color: 'text-blue-600',
          },
          {
            label: 'In Review',
            value: mockStats.myRequests.inReview,
            color: 'text-yellow-600',
          },
          {
            label: 'Approved',
            value: mockStats.myRequests.approved,
            color: 'text-green-600',
          },
        ],
      });
    }

    // Pending Approvals - for approvers and admins
    if (actualRole && ['approver', 'admin'].includes(actualRole)) {
      cards.push({
        title: 'Pending Approvals',
        description: `${mockStats.pendingApprovals} requests need review`,
        icon: CheckCircle,
        href: '/approvals',
        stats: [
          { label: 'Urgent', value: 2, color: 'text-red-600' },
          { label: 'This Week', value: 3, color: 'text-orange-600' },
        ],
      });
    }

    // Cardholder Queue - for cardholders and admins
    if (actualRole && ['cardholder', 'admin'].includes(actualRole)) {
      cards.push({
        title: 'Cardholder Queue',
        description: `${mockStats.cardholderQueue} approved requests`,
        icon: ShoppingCart,
        href: '/purchases',
        stats: [
          { label: 'Ready to Purchase', value: 5, color: 'text-green-600' },
          { label: 'In Progress', value: 3, color: 'text-blue-600' },
        ],
      });
    }

    // Purchase Orders - for cardholders and admins
    if (actualRole && ['cardholder', 'admin'].includes(actualRole)) {
      cards.push({
        title: 'Purchase Orders',
        description: 'Manage purchase orders',
        icon: FileText,
        href: '/purchase-orders',
        stats: [
          { label: 'Draft', value: 2, color: 'text-gray-600' },
          { label: 'Sent', value: 3, color: 'text-blue-600' },
          { label: 'Shipped', value: 1, color: 'text-purple-600' },
          { label: 'Delivered', value: 4, color: 'text-green-600' },
        ],
      });
    }

    // Reconciliation Status - for cardholders and admins
    if (actualRole && ['cardholder', 'admin'].includes(actualRole)) {
      cards.push({
        title: 'Reconciliation',
        description: `${mockStats.reconciliationStatus.open} open cycles`,
        icon: BarChart3,
        href: '/recon',
        stats: [
          {
            label: 'Open Cycles',
            value: mockStats.reconciliationStatus.open,
            color: 'text-blue-600',
          },
          {
            label: 'Missing Receipts',
            value: mockStats.reconciliationStatus.missingReceipts,
            color: 'text-red-600',
          },
        ],
      });
    }

    // Audit Findings - for cardholders and admins
    if (actualRole && ['cardholder', 'admin'].includes(actualRole)) {
      cards.push({
        title: 'Audit Findings',
        description: 'Review and respond to audit findings',
        icon: AlertCircle,
        href: '/audit-findings',
        stats: [
          {
            label: 'Open Findings',
            value: 2,
            color: 'text-red-600',
          },
          {
            label: 'In Progress',
            value: 1,
            color: 'text-yellow-600',
          },
          {
            label: 'Resolved',
            value: 3,
            color: 'text-green-600',
          },
        ],
      });
    }

    // Audit Packages - for auditors and admins
    if (actualRole && ['auditor', 'admin'].includes(actualRole)) {
      cards.push({
        title: 'Audit Packages',
        description: `${mockStats.auditPackages.total} packages ready for review`,
        icon: Shield,
        href: '/audit-packages',
        stats: [
          {
            label: 'Audit Ready',
            value: mockStats.auditPackages.auditReady,
            color: 'text-green-600',
          },
          {
            label: 'Pending Review',
            value: mockStats.auditPackages.pendingReview,
            color: 'text-yellow-600',
          },
          {
            label: 'Non-Compliant',
            value: mockStats.auditPackages.nonCompliant,
            color: 'text-red-600',
          },
          {
            label: 'Compliant',
            value: mockStats.auditPackages.compliant,
            color: 'text-blue-600',
          },
        ],
      });
    }

    // Compliance Monitoring - for auditors and admins
    if (actualRole && ['auditor', 'admin'].includes(actualRole)) {
      cards.push({
        title: 'Compliance Monitoring',
        description: `${mockStats.complianceMonitoring.criticalIssues} critical issues found`,
        icon: AlertTriangle,
        href: '/audit-packages?filter=non_compliant',
        stats: [
          {
            label: 'Critical Issues',
            value: mockStats.complianceMonitoring.criticalIssues,
            color: 'text-red-600',
          },
          {
            label: 'Warnings',
            value: mockStats.complianceMonitoring.warnings,
            color: 'text-orange-600',
          },
          {
            label: 'Resolved',
            value: mockStats.complianceMonitoring.resolved,
            color: 'text-green-600',
          },
        ],
      });
    }

    // DOD MWR Compliance - for auditors and admins
    if (actualRole && ['auditor', 'admin'].includes(actualRole)) {
      cards.push({
        title: 'DOD MWR Compliance',
        description: `${mockStats.dodMwrCompliance.compliantPackages} packages compliant`,
        icon: CheckCircle,
        href: '/audit-packages?filter=compliant',
        stats: [
          {
            label: 'Compliant',
            value: mockStats.dodMwrCompliance.compliantPackages,
            color: 'text-green-600',
          },
          {
            label: 'Needs Review',
            value: mockStats.dodMwrCompliance.needsReview,
            color: 'text-yellow-600',
          },
          {
            label: 'Missing Docs',
            value: mockStats.dodMwrCompliance.missingDocuments,
            color: 'text-red-600',
          },
        ],
      });
    }

    return cards;
  };

  const roleCards = getRoleBasedCards();

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name || user.email?.split('@')[0] || 'User'}!
          </h1>
          <p className="mt-2 text-gray-600">
            {actualRole && ['requester', 'admin'].includes(actualRole) 
              ? "Here's what's happening with your procurement requests."
              : actualRole && ['approver', 'admin'].includes(actualRole)
              ? "Here's your approval queue and recent activity."
              : actualRole && ['cardholder', 'admin'].includes(actualRole)
              ? "Here's your purchase queue and recent activity."
              : actualRole && ['auditor', 'admin'].includes(actualRole)
              ? "Here's your audit dashboard and recent activity."
              : "Here's your dashboard overview."
            }
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            {/* Only show New Request button for requesters and admins */}
            {actualRole && ['requester', 'admin'].includes(actualRole) && (
              <Button
                onClick={() => router.push('/requests/new')}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>New Request</span>
              </Button>
            )}
            {/* Show different buttons based on user role */}
            {actualRole && ['requester', 'admin'].includes(actualRole) && (
              <Button
                variant="outline"
                onClick={() => router.push('/requests')}
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>View All Requests</span>
              </Button>
            )}
            {actualRole && ['approver', 'admin'].includes(actualRole) && (
              <Button
                variant="outline"
                onClick={() => router.push('/approvals')}
                className="flex items-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Review Pending Approvals</span>
              </Button>
            )}
            {actualRole && ['cardholder', 'admin'].includes(actualRole) && (
              <Button
                variant="outline"
                onClick={() => router.push('/purchases')}
                className="flex items-center space-x-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>View Purchase Queue</span>
              </Button>
            )}
            {actualRole && ['cardholder', 'admin'].includes(actualRole) && (
              <Button
                variant="outline"
                onClick={() => router.push('/audit-findings')}
                className="flex items-center space-x-2"
              >
                <AlertCircle className="h-4 w-4" />
                <span>Review Audit Findings</span>
              </Button>
            )}
            {actualRole && ['auditor', 'admin'].includes(actualRole) && (
              <Button
                variant="outline"
                onClick={() => router.push('/audit-packages')}
                className="flex items-center space-x-2"
              >
                <Shield className="h-4 w-4" />
                <span>View Audit Packages</span>
              </Button>
            )}
            {actualRole && ['auditor', 'admin'].includes(actualRole) && (
              <Button
                variant="outline"
                onClick={() => router.push('/audit-packages?filter=non_compliant')}
                className="flex items-center space-x-2"
              >
                <AlertTriangle className="h-4 w-4" />
                <span>Review Critical Issues</span>
              </Button>
            )}
            {actualRole && ['auditor', 'admin'].includes(actualRole) && (
              <Button
                variant="outline"
                onClick={() => router.push('/audit-packages?filter=audit_ready')}
                className="flex items-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Audit Ready Packages</span>
              </Button>
            )}
            {actualRole && ['auditor', 'admin'].includes(actualRole) && (
              <Button
                variant="outline"
                onClick={() => router.push('/audit-packages?filter=compliant')}
                className="flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>DOD MWR Compliance</span>
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {roleCards.map((card, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-gray-800">
                  {card.title}
                </CardTitle>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <card.icon className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {card.stats[0]?.value || 0}
                </div>
                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  {card.description}
                </p>
                <div className="space-y-2 mb-4">
                  {card.stats.map((stat, statIndex) => (
                    <div
                      key={statIndex}
                      className="flex justify-between items-center text-xs bg-gray-50 px-2 py-1 rounded"
                    >
                      <span className="text-gray-600 font-medium">
                        {stat.label}
                      </span>
                      <span className={`font-semibold ${stat.color}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-colors"
                  onClick={() => router.push(card.href)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity - Role-specific */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>
                  {actualRole && ['requester', 'admin'].includes(actualRole) 
                    ? 'Recent Requests' 
                    : actualRole && ['approver', 'admin'].includes(actualRole)
                    ? 'Recent Approvals'
                    : actualRole && ['cardholder', 'admin'].includes(actualRole)
                    ? 'Recent Purchases'
                    : actualRole && ['auditor', 'admin'].includes(actualRole)
                    ? 'Recent Audit Activity'
                    : 'Recent Activity'
                  }
                </span>
              </CardTitle>
              <CardDescription>
                {actualRole && ['requester', 'admin'].includes(actualRole) 
                  ? 'Your latest procurement requests'
                  : actualRole && ['approver', 'admin'].includes(actualRole)
                  ? 'Your latest approval decisions'
                  : actualRole && ['cardholder', 'admin'].includes(actualRole)
                  ? 'Your latest purchase activities'
                  : actualRole && ['auditor', 'admin'].includes(actualRole)
                  ? 'Your latest audit package reviews and compliance checks'
                  : 'Your recent activity'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {actualRole && ['auditor', 'admin'].includes(actualRole) ? (
                  // Show audit activity for auditors
                  mockAuditActivity.map(activity => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => router.push('/audit-packages')}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{activity.packageId}</span>
                          <StatusBadge status={activity.status} size="sm" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {activity.action} • {activity.issues} issues found
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {formatDate(activity.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Show regular requests for other roles
                  mockRecentRequests.map(request => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(
                      actualRole && ['requester', 'admin'].includes(actualRole) 
                        ? '/requests' 
                        : actualRole && ['approver', 'admin'].includes(actualRole)
                        ? '/approvals'
                        : '/dashboard'
                    )}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{request.vendor}</span>
                        <StatusBadge status={request.status} size="sm" />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(request.total)} • Due{' '}
                        {formatDate(request.needBy)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {formatDate(request.createdAt)}
                      </div>
                    </div>
                  </div>
                  ))
                )}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => router.push(
                  actualRole && ['auditor', 'admin'].includes(actualRole)
                    ? '/audit-packages'
                    : actualRole && ['requester', 'admin'].includes(actualRole)
                    ? '/requests'
                    : actualRole && ['approver', 'admin'].includes(actualRole)
                    ? '/approvals'
                    : actualRole && ['cardholder', 'admin'].includes(actualRole)
                    ? '/purchases'
                    : '/dashboard'
                )}
              >
                {actualRole && ['auditor', 'admin'].includes(actualRole)
                  ? 'View All Audit Packages'
                  : actualRole && ['requester', 'admin'].includes(actualRole)
                  ? 'View All Requests'
                  : actualRole && ['approver', 'admin'].includes(actualRole)
                  ? 'View All Approvals'
                  : actualRole && ['cardholder', 'admin'].includes(actualRole)
                  ? 'View All Purchases'
                  : 'View All Activity'
                }
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Quick Stats</span>
              </CardTitle>
              <CardDescription>
                {actualRole && ['auditor', 'admin'].includes(actualRole)
                  ? 'Your audit activity this month'
                  : 'Your procurement activity this month'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {actualRole && ['auditor', 'admin'].includes(actualRole) ? (
                  // Audit-specific stats
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Packages Audited</span>
                      <span className="text-lg font-bold text-green-600">24</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Compliance Rate</span>
                      <span className="text-lg font-bold text-blue-600">87%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Critical Findings</span>
                      <span className="text-lg font-bold text-red-600">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Avg. Audit Time</span>
                      <span className="text-lg font-bold">2.1 days</span>
                    </div>
                  </>
                ) : (
                  // Regular procurement stats
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Spent</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(15420.5)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Requests Submitted
                      </span>
                      <span className="text-lg font-bold">
                        {mockStats.myRequests.total}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Approval Rate</span>
                      <span className="text-lg font-bold text-green-600">92%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Avg. Processing Time
                      </span>
                      <span className="text-lg font-bold">3.2 days</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
