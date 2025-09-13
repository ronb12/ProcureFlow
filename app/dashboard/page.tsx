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

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

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

    // My Requests - for all users
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

    // Pending Approvals - for approvers and admins
    if (['approver', 'admin'].includes(user.role)) {
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
    if (['cardholder', 'admin'].includes(user.role)) {
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
    if (['cardholder', 'admin'].includes(user.role)) {
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
    if (['cardholder', 'admin'].includes(user.role)) {
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
            Here's what's happening with your procurement requests.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => router.push('/requests/new')}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Request</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/requests')}
              className="flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>View All Requests</span>
            </Button>
            {['approver', 'admin'].includes(user.role) && (
              <Button
                variant="outline"
                onClick={() => router.push('/approvals')}
                className="flex items-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Review Approvals</span>
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {roleCards.map((card, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {card.stats[0]?.value || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
                <div className="mt-4 space-y-1">
                  {card.stats.map((stat, statIndex) => (
                    <div
                      key={statIndex}
                      className="flex justify-between text-xs"
                    >
                      <span className="text-muted-foreground">
                        {stat.label}
                      </span>
                      <span className={stat.color}>{stat.value}</span>
                    </div>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => router.push(card.href)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent Requests</span>
              </CardTitle>
              <CardDescription>
                Your latest procurement requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentRequests.map(request => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push('/requests')}
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
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => router.push('/requests')}
              >
                View All Requests
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
                Your procurement activity this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
