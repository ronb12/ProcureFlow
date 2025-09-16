'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect } from 'react';

// Mock data
const mockAuditPackages = [
  {
    id: '1',
    requestId: 'REQ-2024-001',
    status: 'audit_ready',
    auditScore: 95,
    totalIssues: 0,
    criticalIssues: 0
  },
  {
    id: '2',
    requestId: 'REQ-2024-002',
    status: 'incomplete',
    auditScore: 45,
    totalIssues: 8,
    criticalIssues: 4
  },
  {
    id: '3',
    requestId: 'REQ-2024-003',
    status: 'compliant',
    auditScore: 88,
    totalIssues: 0,
    criticalIssues: 0
  },
  {
    id: '4',
    requestId: 'REQ-2024-004',
    status: 'pending_review',
    auditScore: 75,
    totalIssues: 2,
    criticalIssues: 0
  },
  {
    id: '5',
    requestId: 'REQ-2024-005',
    status: 'non_compliant',
    auditScore: 25,
    totalIssues: 15,
    criticalIssues: 10
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'audit_ready':
    case 'compliant':
      return 'bg-green-500';
    case 'pending_review':
      return 'bg-yellow-500';
    case 'non_compliant':
      return 'bg-red-500';
    case 'incomplete':
      return 'bg-orange-500';
    default:
      return 'bg-gray-500';
  }
};

const handleViewPackage = (pkg: any) => {
  console.log('View package clicked:', pkg.requestId);
  window.location.href = `/audit-packages/${pkg.id}`;
};

const handleDownloadPackage = (pkg: any) => {
  console.log('Download package clicked:', pkg.requestId);
  const data = JSON.stringify(pkg, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `audit-package-${pkg.requestId}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const handleRefresh = () => {
  console.log('Refresh clicked');
  window.location.reload();
};

const handleReset = () => {
  console.log('Reset clicked');
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const statusSelect = document.getElementById('status-select') as HTMLSelectElement;
  if (searchInput) searchInput.value = '';
  if (statusSelect) statusSelect.value = 'all';
  // Re-render the packages
  renderPackages();
};

const handleGoToDashboard = () => {
  console.log('Go to dashboard clicked');
  window.location.href = '/dashboard';
};

const handleGoToRequests = () => {
  console.log('Go to requests clicked');
  window.location.href = '/requests';
};

const handleGoToPurchases = () => {
  console.log('Go to purchases clicked');
  window.location.href = '/purchases';
};

const filterPackages = () => {
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const statusSelect = document.getElementById('status-select') as HTMLSelectElement;
  
  const searchTerm = searchInput?.value?.toLowerCase() || '';
  const statusFilter = statusSelect?.value || 'all';
  
  return mockAuditPackages.filter(pkg => {
    const matchesSearch = searchTerm === '' || 
      pkg.requestId.toLowerCase().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || pkg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
};

const renderPackages = () => {
  const packagesContainer = document.getElementById('packages-container');
  if (!packagesContainer) return;
  
  const filteredPackages = filterPackages();
  
  packagesContainer.innerHTML = filteredPackages.map(pkg => `
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
      <div class="p-6 pt-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-3 h-3 rounded-full ${getStatusColor(pkg.status)}"></div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">${pkg.requestId}</h3>
              <div class="text-sm text-gray-600">Status: ${pkg.status.replace('_', ' ').toUpperCase()} | Score: ${pkg.auditScore}/100</div>
              <div class="text-xs text-gray-500">Issues: ${pkg.totalIssues} total, ${pkg.criticalIssues} critical</div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button 
              class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
              onclick="handleViewPackage(${JSON.stringify(pkg).replace(/"/g, '&quot;')})"
            >
              View
            </button>
            <button 
              class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
              onclick="handleDownloadPackage(${JSON.stringify(pkg).replace(/"/g, '&quot;')})"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
};

export default function StaticAuditPackagesPage() {
  // Initialize packages on component mount
  useEffect(() => {
    renderPackages();
  }, []);

  // Make functions available globally for onclick handlers
  if (typeof window !== 'undefined') {
    (window as any).handleViewPackage = handleViewPackage;
    (window as any).handleDownloadPackage = handleDownloadPackage;
    (window as any).handleRefresh = handleRefresh;
    (window as any).handleReset = handleReset;
    (window as any).handleGoToDashboard = handleGoToDashboard;
    (window as any).handleGoToRequests = handleGoToRequests;
    (window as any).handleGoToPurchases = handleGoToPurchases;
    (window as any).renderPackages = renderPackages;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Packages</h1>
          <p className="mt-2 text-gray-600">
            Manage and review DOD MWR compliance audit packages
          </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => handleGoToDashboard()}
                className="flex items-center space-x-2"
              >
                <span>Dashboard</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleGoToRequests()}
                className="flex items-center space-x-2"
              >
                <span>Requests</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleGoToPurchases()}
                className="flex items-center space-x-2"
              >
                <span>Purchases</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleRefresh()}
                className="flex items-center space-x-2"
              >
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search by Request ID..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onInput={() => renderPackages()}
                />
              </div>
              <div className="flex items-center space-x-4">
                <select
                  id="status-select"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={() => renderPackages()}
                >
                  <option value="all">All Statuses</option>
                  <option value="audit_ready">Audit Ready</option>
                  <option value="compliant">Compliant</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="non_compliant">Non-Compliant</option>
                  <option value="incomplete">Incomplete</option>
                </select>
                <Button
                  variant="outline"
                  onClick={() => handleReset()}
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Packages List */}
        <div id="packages-container" className="space-y-4">
          {/* Packages will be rendered here by JavaScript */}
        </div>

        {/* DOD MWR Compliance Info */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">DOD MWR Compliance Requirements</h3>
                <p className="text-sm text-blue-800 mt-1">
                  All audit packages must include complete documentation and pass all compliance checks according to DOD MWR policies and guidelines. Packages are retained for 6 years and must be audit-ready before closure.
                </p>
                <div className="mt-2 text-xs text-blue-700">
                  <strong>Required Documents:</strong> Purchase Request, Approval, PO, Receipt, Delivery Confirmation, Reconciliation, Policy Compliance, Vendor Verification, Cardholder Certification, Approving Official Certification
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
