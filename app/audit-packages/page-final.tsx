'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

export default function FinalAuditPackagesPage() {
  const [auditPackages] = useState(mockAuditPackages);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleViewPackage = (pkg: any) => {
    console.log('View package clicked:', pkg.requestId);
    alert(`Viewing package: ${pkg.requestId}\nStatus: ${pkg.status}\nScore: ${pkg.auditScore}/100`);
  };

  const handleDownloadPackage = (pkg: any) => {
    console.log('Download package clicked:', pkg.requestId);
    // Create a simple download
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
    alert(`Downloaded package: ${pkg.requestId}`);
  };

  const handleRefresh = () => {
    console.log('Refresh clicked');
    alert('Data refreshed!');
  };

  const handleReset = () => {
    console.log('Reset clicked');
    setSearchTerm('');
    setStatusFilter('all');
    alert('Filters reset!');
  };

  // Filter packages
  const filteredPackages = auditPackages.filter(pkg => {
    const matchesSearch = searchTerm === '' || 
      pkg.requestId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pkg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center space-x-2"
            >
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by Request ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Packages List */}
        <div className="space-y-4">
          {filteredPackages.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Audit Packages Found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredPackages.map((pkg) => (
              <Card key={pkg.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        pkg.status === 'audit_ready' || pkg.status === 'compliant' ? 'bg-green-500' :
                        pkg.status === 'pending_review' ? 'bg-yellow-500' :
                        pkg.status === 'non_compliant' ? 'bg-red-500' :
                        'bg-orange-500'
                      }`}></div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {pkg.requestId}
                        </h3>
                        <div className="text-sm text-gray-600">
                          Status: {pkg.status.replace('_', ' ').toUpperCase()} | Score: {pkg.auditScore}/100
                        </div>
                        <div className="text-xs text-gray-500">
                          Issues: {pkg.totalIssues} total, {pkg.criticalIssues} critical
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewPackage(pkg)}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadPackage(pkg)}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* DOD MWR Compliance Notice */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">DOD MWR Compliance Requirements</h3>
                <p className="text-sm text-blue-800 mt-1">
                  All audit packages must include complete documentation and pass all compliance checks 
                  according to DOD MWR policies and guidelines. Packages are retained for 6 years 
                  and must be audit-ready before closure.
                </p>
                <div className="mt-2 text-xs text-blue-700">
                  <strong>Required Documents:</strong> Purchase Request, Approval, PO, Receipt, 
                  Delivery Confirmation, Reconciliation, Policy Compliance, Vendor Verification, 
                  Cardholder Certification, Approving Official Certification
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
