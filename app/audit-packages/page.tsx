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
    criticalIssues: 0,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-22',
    cardholder: 'John Smith',
    cardholderId: 'cardholder1',
    cardholderEmail: 'john.smith@dod.mil',
    cardholderPhone: '555-0101',
    approver: 'Jane Doe',
    approverId: 'approver1',
    vendor: 'Office Supplies Inc.',
    vendorId: 'vendor1',
    amount: 1250.00,
    description: 'Office supplies for Q1 2024',
    facility: {
      name: 'Fort Bragg MWR',
      code: 'FB-MWR-001',
      address: '2175 Reilly Road, Fort Bragg, NC 28310',
      installation: 'Fort Bragg',
      state: 'NC',
      zipCode: '28310'
    },
    documents: [
      'Purchase Request',
      'Approval Document',
      'Purchase Order',
      'Receipt',
      'Delivery Confirmation',
      'Reconciliation Document'
    ],
    complianceChecks: [
      'Micro-purchase limit check: PASSED',
      'Split purchase detection: PASSED',
      'Blocked merchant check: PASSED',
      'Vendor approval status: PASSED',
      'Delivery address validation: PASSED'
    ]
  },
  {
    id: '2',
    requestId: 'REQ-2024-002',
    status: 'incomplete',
    auditScore: 45,
    totalIssues: 8,
    criticalIssues: 4,
    createdAt: '2024-01-18',
    updatedAt: '2024-01-20',
    cardholder: 'Mike Johnson',
    cardholderId: 'cardholder2',
    cardholderEmail: 'mike.johnson@dod.mil',
    cardholderPhone: '555-0102',
    approver: 'Sarah Wilson',
    approverId: 'approver2',
    vendor: 'Tech Solutions LLC',
    vendorId: 'vendor2',
    amount: 2500.00,
    description: 'Computer equipment for new office',
    facility: {
      name: 'Camp Lejeune MWR',
      code: 'CL-MWR-002',
      address: '1000 Holcomb Boulevard, Camp Lejeune, NC 28547',
      installation: 'Camp Lejeune',
      state: 'NC',
      zipCode: '28547'
    },
    documents: [
      'Purchase Request',
      'Approval Document',
      'Purchase Order (Incomplete)',
      'Receipt (Missing)',
      'Delivery Confirmation (Missing)',
      'Reconciliation Document (Missing)'
    ],
    complianceChecks: [
      'Micro-purchase limit check: PASSED',
      'Split purchase detection: PASSED',
      'Blocked merchant check: PASSED',
      'Vendor approval status: PASSED',
      'Delivery address validation: FAILED'
    ]
  },
  {
    id: '3',
    requestId: 'REQ-2024-003',
    status: 'compliant',
    auditScore: 88,
    totalIssues: 0,
    criticalIssues: 0,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-25',
    cardholder: 'Alice Brown',
    cardholderId: 'cardholder3',
    cardholderEmail: 'alice.brown@dod.mil',
    cardholderPhone: '555-0103',
    approver: 'Bob Green',
    approverId: 'approver3',
    vendor: 'Office Depot',
    vendorId: 'vendor3',
    amount: 750.00,
    description: 'Office furniture and supplies',
    facility: {
      name: 'Fort Hood MWR',
      code: 'FH-MWR-003',
      address: '39000 Battalion Avenue, Fort Hood, TX 76544',
      installation: 'Fort Hood',
      state: 'TX',
      zipCode: '76544'
    },
    documents: [
      'Purchase Request',
      'Approval Document',
      'Purchase Order',
      'Receipt',
      'Delivery Confirmation',
      'Reconciliation Document'
    ],
    complianceChecks: [
      'Micro-purchase limit check: PASSED',
      'Split purchase detection: PASSED',
      'Blocked merchant check: PASSED',
      'Vendor approval status: PASSED',
      'Delivery address validation: PASSED'
    ]
  },
  {
    id: '4',
    requestId: 'REQ-2024-004',
    status: 'pending_review',
    auditScore: 75,
    totalIssues: 2,
    criticalIssues: 0,
    createdAt: '2024-01-22',
    updatedAt: '2024-01-28',
    cardholder: 'Carol Davis',
    cardholderId: 'cardholder4',
    cardholderEmail: 'carol.davis@dod.mil',
    cardholderPhone: '555-0104',
    approver: 'David Wilson',
    approverId: 'approver4',
    vendor: 'Amazon Business',
    vendorId: 'vendor4',
    amount: 1800.00,
    description: 'IT equipment and software licenses',
    facility: {
      name: 'Fort Campbell MWR',
      code: 'FC-MWR-004',
      address: '1501 Wickham Avenue, Fort Campbell, KY 42223',
      installation: 'Fort Campbell',
      state: 'KY',
      zipCode: '42223'
    },
    documents: [
      'Purchase Request',
      'Approval Document',
      'Purchase Order',
      'Receipt (Pending)',
      'Delivery Confirmation',
      'Reconciliation Document (Pending)'
    ],
    complianceChecks: [
      'Micro-purchase limit check: PASSED',
      'Split purchase detection: PASSED',
      'Blocked merchant check: PASSED',
      'Vendor approval status: PASSED',
      'Delivery address validation: PASSED'
    ]
  },
  {
    id: '5',
    requestId: 'REQ-2024-005',
    status: 'non_compliant',
    auditScore: 25,
    totalIssues: 15,
    criticalIssues: 10,
    createdAt: '2024-01-25',
    updatedAt: '2024-01-30',
    cardholder: 'Eve Miller',
    cardholderId: 'cardholder5',
    cardholderEmail: 'eve.miller@dod.mil',
    cardholderPhone: '555-0105',
    approver: 'Frank Taylor',
    approverId: 'approver5',
    vendor: 'Unapproved Vendor LLC',
    vendorId: 'vendor5',
    amount: 5000.00,
    description: 'Equipment purchase exceeding limits',
    facility: {
      name: 'Fort Stewart MWR',
      code: 'FS-MWR-005',
      address: '42 Warriors Walk, Fort Stewart, GA 31314',
      installation: 'Fort Stewart',
      state: 'GA',
      zipCode: '31314'
    },
    documents: [
      'Purchase Request (Incomplete)',
      'Approval Document (Missing)',
      'Purchase Order (Invalid)',
      'Receipt (Missing)',
      'Delivery Confirmation (Missing)',
      'Reconciliation Document (Missing)'
    ],
    complianceChecks: [
      'Micro-purchase limit check: FAILED',
      'Split purchase detection: FAILED',
      'Blocked merchant check: FAILED',
      'Vendor approval status: FAILED',
      'Delivery address validation: FAILED'
    ]
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

export default function StaticAuditPackagesPage() {
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [filteredPackages, setFilteredPackages] = useState(mockAuditPackages);
  const [currentFilter, setCurrentFilter] = useState('all');

  const handleViewPackage = (pkg: any) => {
    console.log('View package clicked:', pkg.requestId);
    setSelectedPackage(pkg);
    setShowModal(true);
  };

  const handleFilterIssues = () => {
    const packagesWithIssues = mockAuditPackages.filter(pkg => pkg.totalIssues > 0);
    setFilteredPackages(packagesWithIssues);
    setCurrentFilter('issues');
    console.log('Filtered to packages with issues:', packagesWithIssues.length);
  };

  const handleFilterCritical = () => {
    const criticalPackages = mockAuditPackages.filter(pkg => pkg.criticalIssues > 0);
    setFilteredPackages(criticalPackages);
    setCurrentFilter('critical');
    console.log('Filtered to critical packages:', criticalPackages.length);
  };

  const handleResetFilter = () => {
    setFilteredPackages(mockAuditPackages);
    setCurrentFilter('all');
    console.log('Reset filter - showing all packages');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPackage(null);
  };

  const handleDownloadPackage = async (pkg: any) => {
    console.log('Download package clicked:', pkg.requestId);
    
    try {
      // Dynamic import to avoid SSR issues
      const { jsPDF } = await import('jspdf');
      
      const doc = new jsPDF();
      
      // Add DOD MWR header with logo placeholder
      doc.setFillColor(0, 51, 102); // Navy blue
      doc.rect(0, 0, 210, 30, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('DEPARTMENT OF DEFENSE', 20, 12);
      doc.text('MORALE, WELFARE & RECREATION', 20, 20);
      doc.text('AUDIT PACKAGE REPORT', 20, 28);

      // Reset text color
      doc.setTextColor(0, 0, 0);

      // Add facility and cardholder information
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('FACILITY & CARDHOLDER INFORMATION', 20, 45);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      let yPos = 55;

      const facilityInfo = [
        `Facility: ${pkg.facility?.name || 'N/A'}`,
        `Facility Code: ${pkg.facility?.code || 'N/A'}`,
        `Installation: ${pkg.facility?.installation || 'N/A'}`,
        `Address: ${pkg.facility?.address || 'N/A'}`,
        `State: ${pkg.facility?.state || 'N/A'}`,
        `Zip Code: ${pkg.facility?.zipCode || 'N/A'}`,
        '',
        `Cardholder: ${pkg.cardholder}`,
        `Email: ${pkg.cardholderEmail || 'N/A'}`,
        `Phone: ${pkg.cardholderPhone || 'N/A'}`,
        `Approver: ${pkg.approver}`,
        `Vendor: ${pkg.vendor}`,
        `Request ID: ${pkg.requestId}`,
        `Generated: ${new Date().toLocaleDateString()}`
      ];

      facilityInfo.forEach(line => {
        doc.text(line, 20, yPos);
        yPos += 6;
      });

      // Add package overview
      yPos += 10;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('AUDIT PACKAGE OVERVIEW', 20, yPos);

      yPos += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      const overviewData = [
        `Status: ${pkg.status.replace('_', ' ').toUpperCase()}`,
        `Audit Score: ${pkg.auditScore}/100`,
        `Total Issues: ${pkg.totalIssues}`,
        `Critical Issues: ${pkg.criticalIssues}`,
        `Amount: $${pkg.amount.toLocaleString()}`,
        `Description: ${pkg.description}`,
        `Created: ${pkg.createdAt}`,
        `Updated: ${pkg.updatedAt}`
      ];

      overviewData.forEach(line => {
        doc.text(line, 20, yPos);
        yPos += 6;
      });

      // Add compliance status with color coding
      yPos += 10;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('COMPLIANCE STATUS', 20, yPos);

      yPos += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      const statusColor = pkg.auditScore >= 80 ? 'COMPLIANT' : pkg.auditScore >= 60 ? 'NEEDS ATTENTION' : 'NON-COMPLIANT';
      const statusColorCode = pkg.auditScore >= 80 ? [0, 128, 0] : pkg.auditScore >= 60 ? [255, 165, 0] : [255, 0, 0];
      
      doc.setTextColor(statusColorCode[0], statusColorCode[1], statusColorCode[2]);
      doc.text(`Overall Status: ${statusColor}`, 20, yPos);
      doc.setTextColor(0, 0, 0);
      
      yPos += 8;
      doc.text(`Issues Found: ${pkg.totalIssues}`, 20, yPos);
      yPos += 6;
      doc.text(`Critical Issues: ${pkg.criticalIssues}`, 20, yPos);

      // Add documents section
      if (pkg.documents && pkg.documents.length > 0) {
        yPos += 15;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('REQUIRED DOCUMENTS', 20, yPos);
        yPos += 10;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        pkg.documents.forEach((docItem: string) => {
          const status = docItem.includes('Missing') || docItem.includes('Incomplete') || docItem.includes('Invalid') || docItem.includes('Pending');
          if (status) {
            doc.setTextColor(255, 0, 0);
          } else {
            doc.setTextColor(0, 128, 0);
          }
          doc.text(`- ${docItem}`, 20, yPos);
          doc.setTextColor(0, 0, 0);
          yPos += 6;
        });
      }

      // Add compliance checks section
      if (pkg.complianceChecks && pkg.complianceChecks.length > 0) {
        yPos += 15;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('COMPLIANCE CHECKS', 20, yPos);
        yPos += 10;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        pkg.complianceChecks.forEach((check: string) => {
          const passed = check.includes('PASSED');
          if (passed) {
            doc.setTextColor(0, 128, 0);
          } else {
            doc.setTextColor(255, 0, 0);
          }
          doc.text(`- ${check}`, 20, yPos);
          doc.setTextColor(0, 0, 0);
          yPos += 6;
        });
      }

      // Add audit recommendations
      yPos += 15;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('AUDIT RECOMMENDATIONS', 20, yPos);

      yPos += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      const recommendations = [];
      if (pkg.auditScore < 80) {
        recommendations.push('• Immediate corrective action required');
        recommendations.push('• Review all compliance requirements');
        recommendations.push('• Provide additional documentation as needed');
      }
      if (pkg.criticalIssues > 0) {
        recommendations.push('• Address critical issues immediately');
        recommendations.push('• Escalate to supervisor if necessary');
      }
      if (pkg.totalIssues > 5) {
        recommendations.push('• Comprehensive review of procedures required');
        recommendations.push('• Consider additional training for cardholder');
      }
      if (recommendations.length === 0) {
        recommendations.push('• Package meets all compliance requirements');
        recommendations.push('• No further action required');
      }

      recommendations.forEach(rec => {
        doc.text(rec, 20, yPos);
        yPos += 6;
      });

      // Add footer
      yPos = doc.internal.pageSize.height - 30;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Generated by ProcureFlow - DOD MWR Purchase Card Management System', 20, yPos);
      doc.text('This document is for audit purposes only and contains sensitive information', 20, yPos + 5);
      doc.text(`Report ID: AUDIT-${pkg.requestId}-${Date.now()}`, 20, yPos + 10);

      // Save the PDF
      doc.save(`DOD-MWR-Audit-${pkg.facility?.code || 'UNKNOWN'}-${pkg.requestId}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to JSON download
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
    }
  };

  const handleRefresh = () => {
    console.log('Refresh clicked');
    window.location.reload();
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
            <div className="space-y-3">
              {/* First Row - Navigation and System Actions */}
              <div className="flex items-center space-x-2 flex-wrap">
                <Button
                  variant="outline"
                  onClick={handleGoToDashboard}
                  className="flex items-center space-x-2"
                >
                  <span>Dashboard</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Logout functionality
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('user');
                      window.location.href = '/login';
                    }
                  }}
                  className="flex items-center space-x-2"
                >
                  <span>Logout</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/audit-findings-auditor'}
                  className="flex items-center space-x-2 bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                >
                  <span>📋 Review Findings</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/audit-compliance'}
                  className="flex items-center space-x-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                >
                  <span>🎯 100% Compliance</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/audit-workflow'}
                  className="flex items-center space-x-2 bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                >
                  <span>📋 Workflow Guide</span>
                </Button>
              </div>

              {/* Second Row - Audit Actions and Filters */}
              <div className="flex items-center space-x-2 flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => {
                    // Generate audit report
                    const compliantCount = mockAuditPackages.filter(pkg => pkg.auditScore >= 80).length;
                    const totalCount = mockAuditPackages.length;
                    const complianceRate = Math.round((compliantCount / totalCount) * 100);
                    alert(`Audit Summary Report:\n\nTotal Packages: ${totalCount}\nCompliant: ${compliantCount}\nCompliance Rate: ${complianceRate}%\n\nReport generated: ${new Date().toLocaleString()}`);
                  }}
                  className="flex items-center space-x-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                >
                  <span>📊 Generate Report</span>
                </Button>
                       <Button
                         variant="outline"
                         onClick={handleFilterIssues}
                         className="flex items-center space-x-2 bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                       >
                         <span>⚠️ Issues ({mockAuditPackages.filter(pkg => pkg.totalIssues > 0).length})</span>
                       </Button>
                       <Button
                         variant="outline"
                         onClick={handleFilterCritical}
                         className="flex items-center space-x-2 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                       >
                         <span>🚨 Critical ({mockAuditPackages.filter(pkg => pkg.criticalIssues > 0).length})</span>
                       </Button>
                <Button
                  variant="outline"
                  onClick={handleResetFilter}
                  className="flex items-center space-x-2"
                >
                  <span>Reset Filter</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  className="flex items-center space-x-2"
                >
                  <span>Refresh</span>
                </Button>
              </div>
            </div>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-4">
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="all">All Statuses</option>
                  <option value="audit_ready">Audit Ready</option>
                  <option value="compliant">Compliant</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="non_compliant">Non-Compliant</option>
                  <option value="incomplete">Incomplete</option>
                </select>
                <Button
                  variant="outline"
                  onClick={() => {
                    const searchInput = document.querySelector('input[placeholder="Search by Request ID..."]') as HTMLInputElement;
                    const statusSelect = document.querySelector('select') as HTMLSelectElement;
                    if (searchInput) searchInput.value = '';
                    if (statusSelect) statusSelect.value = 'all';
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

               {/* Audit Statistics */}
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                 <Card>
                   <CardContent className="pt-6">
                     <div className="flex items-center">
                       <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                         <span className="text-green-600 text-sm font-bold">✓</span>
                       </div>
                       <div className="ml-3">
                         <p className="text-sm font-medium text-gray-500">Audits Completed</p>
                         <p className="text-2xl font-bold text-green-600">
                           {mockAuditPackages.filter(pkg => pkg.status === 'compliant' || pkg.auditScore >= 80).length}
                         </p>
                         <p className="text-xs text-gray-500">Ready for closure</p>
                       </div>
                     </div>
                   </CardContent>
                 </Card>

                 <Card>
                   <CardContent className="pt-6">
                     <div className="flex items-center">
                       <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                         <span className="text-yellow-600 text-sm font-bold">⏱</span>
                       </div>
                       <div className="ml-3">
                         <p className="text-sm font-medium text-gray-500">Pending Review</p>
                         <p className="text-2xl font-bold text-yellow-600">
                           {mockAuditPackages.filter(pkg => pkg.status === 'pending_review' || pkg.status === 'audit_ready').length}
                         </p>
                         <p className="text-xs text-gray-500">Awaiting audit</p>
                       </div>
                     </div>
                   </CardContent>
                 </Card>

                 <Card>
                   <CardContent className="pt-6">
                     <div className="flex items-center">
                       <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                         <span className="text-red-600 text-sm font-bold">🚨</span>
                       </div>
                       <div className="ml-3">
                         <p className="text-sm font-medium text-gray-500">Critical Issues</p>
                         <p className="text-2xl font-bold text-red-600">
                           {mockAuditPackages.reduce((sum, pkg) => sum + pkg.criticalIssues, 0)}
                         </p>
                         <p className="text-xs text-gray-500">Require immediate attention</p>
                       </div>
                     </div>
                   </CardContent>
                 </Card>

                 <Card>
                   <CardContent className="pt-6">
                     <div className="flex items-center">
                       <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                         <span className="text-blue-600 text-sm font-bold">📊</span>
                       </div>
                       <div className="ml-3">
                         <p className="text-sm font-medium text-gray-500">Audit Score</p>
                         <p className="text-2xl font-bold text-blue-600">
                           {Math.round(mockAuditPackages.reduce((sum, pkg) => sum + pkg.auditScore, 0) / mockAuditPackages.length)}
                         </p>
                         <p className="text-xs text-gray-500">Average score</p>
                       </div>
                     </div>
                   </CardContent>
                 </Card>
               </div>

        {/* Filter Indicator */}
        {currentFilter !== 'all' && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600 font-medium">
                  {currentFilter === 'issues' ? '⚠️ Showing packages with issues' : 
                   currentFilter === 'critical' ? '🚨 Showing critical issues' : 'Filtered view'}
                </span>
                <span className="text-blue-500 text-sm">
                  ({filteredPackages.length} of {mockAuditPackages.length} packages)
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilter}
                className="text-blue-600 border-blue-300 hover:bg-blue-100"
              >
                Show All
              </Button>
            </div>
          </div>
        )}

        {/* Packages List */}
        <div className="space-y-4">
          {filteredPackages.map((pkg) => (
            <Card key={pkg.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(pkg.status)}`}></div>
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
          ))}
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

      {/* Modal for viewing package details */}
      {showModal && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedPackage.requestId} - Package Details
              </h2>
              <Button
                variant="outline"
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕ Close
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Package Overview */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Package Overview</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedPackage.status)}`}></div>
                      <span className="font-medium">Status: {selectedPackage.status.replace('_', ' ').toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="font-medium">Audit Score: </span>
                      <span className={`${selectedPackage.auditScore >= 80 ? 'text-green-600' : selectedPackage.auditScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {selectedPackage.auditScore}/100
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Total Issues: </span>
                      <span className={selectedPackage.totalIssues > 0 ? 'text-red-600' : 'text-green-600'}>
                        {selectedPackage.totalIssues}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Critical Issues: </span>
                      <span className={selectedPackage.criticalIssues > 0 ? 'text-red-600' : 'text-green-600'}>
                        {selectedPackage.criticalIssues}
                      </span>
                    </div>
                    {selectedPackage.amount && (
                      <div>
                        <span className="font-medium">Amount: </span>
                        <span>${selectedPackage.amount.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedPackage.cardholder && (
                      <div>
                        <span className="font-medium">Cardholder: </span>
                        <span>{selectedPackage.cardholder}</span>
                      </div>
                    )}
                    {selectedPackage.approver && (
                      <div>
                        <span className="font-medium">Approver: </span>
                        <span>{selectedPackage.approver}</span>
                      </div>
                    )}
                    {selectedPackage.vendor && (
                      <div>
                        <span className="font-medium">Vendor: </span>
                        <span>{selectedPackage.vendor}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Compliance Status */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Compliance Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${selectedPackage.auditScore >= 80 ? 'bg-green-500' : selectedPackage.auditScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                      <span className={selectedPackage.auditScore >= 80 ? 'text-green-600' : selectedPackage.auditScore >= 60 ? 'text-yellow-600' : 'text-red-600'}>
                        {selectedPackage.auditScore >= 80 ? 'COMPLIANT' : selectedPackage.auditScore >= 60 ? 'NEEDS ATTENTION' : 'NON-COMPLIANT'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedPackage.auditScore >= 80 
                        ? 'All compliance checks passed successfully.' 
                        : selectedPackage.auditScore >= 60 
                        ? 'Some issues require attention before approval.'
                        : 'Multiple critical issues must be resolved.'
                      }
                    </div>
                    {selectedPackage.complianceChecks && (
                      <div className="mt-3">
                        <div className="text-sm font-medium text-gray-700 mb-2">Compliance Checks:</div>
                        <div className="space-y-1">
                          {selectedPackage.complianceChecks.slice(0, 3).map((check: string, index: number) => (
                            <div key={index} className="flex items-center space-x-2 text-xs">
                              <div className={`w-1.5 h-1.5 rounded-full ${check.includes('PASSED') ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              <span className={check.includes('PASSED') ? 'text-green-600' : 'text-red-600'}>
                                {check}
                              </span>
                            </div>
                          ))}
                          {selectedPackage.complianceChecks.length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{selectedPackage.complianceChecks.length - 3} more checks
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Documents Status */}
              {selectedPackage.documents && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4">Required Documents</h3>
                    <div className="space-y-2">
                      {selectedPackage.documents.slice(0, 4).map((doc: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${doc.includes('Missing') || doc.includes('Incomplete') || doc.includes('Invalid') || doc.includes('Pending') ? 'bg-red-500' : 'bg-green-500'}`}></div>
                          <span className={`text-sm ${doc.includes('Missing') || doc.includes('Incomplete') || doc.includes('Invalid') || doc.includes('Pending') ? 'text-red-600' : 'text-gray-900'}`}>
                            {doc}
                          </span>
                        </div>
                      ))}
                      {selectedPackage.documents.length > 4 && (
                        <div className="text-xs text-gray-500">
                          +{selectedPackage.documents.length - 4} more documents
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              {selectedPackage.description && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4">Description</h3>
                    <p className="text-sm text-gray-700">{selectedPackage.description}</p>
                    {selectedPackage.createdAt && (
                      <div className="mt-3 text-xs text-gray-500">
                        <p>Created: {selectedPackage.createdAt}</p>
                        {selectedPackage.updatedAt && <p>Updated: {selectedPackage.updatedAt}</p>}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => handleDownloadPackage(selectedPackage)}
              >
                Download PDF
              </Button>
              <Button
                onClick={() => {
                  closeModal();
                  window.location.href = `/audit-packages/${selectedPackage.id}`;
                }}
              >
                View Full Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}