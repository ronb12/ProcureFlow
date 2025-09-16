'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
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
  }
];

export default function WorkingAuditPackagesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [auditPackages, setAuditPackages] = useState(mockAuditPackages);
  const [isLoading, setIsLoading] = useState(false);

  // Simple loading effect
  useEffect(() => {
    if (user && user.role && ['auditor', 'admin'].includes(user.role)) {
      console.log('User authenticated, showing audit packages');
      setIsLoading(false);
    } else if (!loading && !user) {
      console.log('No user, redirecting to login');
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleViewPackage = (pkg: any) => {
    console.log('View package clicked:', pkg.requestId);
    alert(`Viewing package: ${pkg.requestId}`);
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

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-4">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!['auditor', 'admin'].includes(user.role || '')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access audit packages.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Audit Packages</h1>
        <p className="text-gray-600 mb-8">
          Manage and review DOD MWR compliance audit packages
        </p>
        
        <div className="space-y-4">
          {auditPackages.map((pkg) => (
            <Card key={pkg.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {pkg.requestId}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Status: {pkg.status} | Score: {pkg.auditScore}/100
                    </p>
                    <p className="text-xs text-gray-500">
                      Issues: {pkg.totalIssues} total, {pkg.criticalIssues} critical
                    </p>
                  </div>
                  <div className="flex space-x-2">
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
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">DOD MWR Compliance</h3>
          <p className="text-sm text-blue-800">
            All audit packages must include complete documentation and pass all compliance checks 
            according to DOD MWR policies and guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}
