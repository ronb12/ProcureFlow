'use client';

import { useState, useEffect } from 'react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { StatusBadge } from './status-badge';
import { AuditPackage, MWR_AUDIT_REQUIREMENTS } from '@/lib/audit-package';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Download,
  Eye,
  Clock,
  Shield,
  AlertCircle,
  CheckCircle2,
  XCircle2,
  Info
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';

interface AuditPackageViewerProps {
  auditPackage: AuditPackage;
  onDownload?: () => void;
  onViewDocument?: (documentType: string) => void;
  onFixIssue?: (issue: string) => void;
  readonly?: boolean;
}

export function AuditPackageViewer({
  auditPackage,
  onDownload,
  onViewDocument,
  onFixIssue,
  readonly = false
}: AuditPackageViewerProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'audit_ready':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'compliant':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending_review':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'non_compliant':
        return <XCircle2 className="h-5 w-5 text-red-600" />;
      case 'incomplete':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getDocumentStatus = (doc: any) => {
    if (!doc.present) return { status: 'missing', color: 'red', icon: XCircle };
    if (!doc.compliant) return { status: 'non-compliant', color: 'red', icon: XCircle };
    if (!doc.complete) return { status: 'incomplete', color: 'yellow', icon: AlertTriangle };
    return { status: 'complete', color: 'green', icon: CheckCircle };
  };

  const getComplianceStatus = (check: any) => {
    if (!check.compliant) return { status: 'failed', color: 'red', icon: XCircle };
    if (!check.passed) return { status: 'warning', color: 'yellow', icon: AlertTriangle };
    return { status: 'passed', color: 'green', icon: CheckCircle };
  };

  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(auditPackage.status)}
              <div>
                <CardTitle>Audit Package Overview</CardTitle>
                <CardDescription>
                  Request #{auditPackage.requestId} - {formatDate(auditPackage.createdAt)}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <StatusBadge status={auditPackage.status} />
              {auditPackage.auditScore && (
                <div className="text-sm font-medium">
                  Score: {auditPackage.auditScore}/100
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{auditPackage.totalIssues}</div>
              <div className="text-sm text-gray-600">Total Issues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{auditPackage.criticalIssues}</div>
              <div className="text-sm text-gray-600">Critical Issues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{auditPackage.warnings}</div>
              <div className="text-sm text-gray-600">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(auditPackage.documents).filter(doc => doc.present).length}
              </div>
              <div className="text-sm text-gray-600">Documents</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Required Documents</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('documents')}
            >
              {expandedSections.has('documents') ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </CardHeader>
        {expandedSections.has('documents') && (
          <CardContent>
            <div className="space-y-4">
              {Object.entries(auditPackage.documents).map(([docType, doc]) => {
                const status = getDocumentStatus(doc);
                const StatusIcon = status.icon;
                
                return (
                  <div key={docType} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <StatusIcon className={`h-5 w-5 text-${status.color}-600`} />
                      <div>
                        <div className="font-medium capitalize">
                          {docType.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-gray-600">
                          {doc.present ? 'Present' : 'Missing'} • 
                          {doc.complete ? ' Complete' : ' Incomplete'} • 
                          {doc.compliant ? ' Compliant' : ' Non-compliant'}
                        </div>
                        {doc.issues.length > 0 && (
                          <div className="text-sm text-red-600 mt-1">
                            Issues: {doc.issues.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {doc.fileUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewDocument?.(docType)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      )}
                      {!readonly && doc.issues.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onFixIssue?.(doc.issues[0])}
                        >
                          Fix
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Compliance Checks Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Compliance Checks</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('compliance')}
            >
              {expandedSections.has('compliance') ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </CardHeader>
        {expandedSections.has('compliance') && (
          <CardContent>
            <div className="space-y-4">
              {Object.entries(auditPackage.complianceChecks).map(([checkType, check]) => {
                const status = getComplianceStatus(check);
                const StatusIcon = status.icon;
                
                return (
                  <div key={checkType} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <StatusIcon className={`h-5 w-5 text-${status.color}-600`} />
                      <div>
                        <div className="font-medium capitalize">
                          {checkType.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-gray-600">
                          {check.passed ? 'Passed' : 'Failed'} • 
                          {check.compliant ? ' Compliant' : ' Non-compliant'}
                        </div>
                        {check.issues.length > 0 && (
                          <div className="text-sm text-red-600 mt-1">
                            Issues: {check.issues.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                    {!readonly && check.issues.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onFixIssue?.(check.issues[0])}
                      >
                        Fix
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Actions Section */}
      {!readonly && (
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Button
                onClick={onDownload}
                disabled={auditPackage.status !== 'audit_ready'}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download Audit Package</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Print Report</span>
              </Button>
            </div>
            {auditPackage.status !== 'audit_ready' && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div className="text-sm text-yellow-800">
                    Audit package is not ready for download. Please address all issues first.
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* DOD MWR Compliance Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900">DOD MWR Compliance</h3>
              <p className="text-sm text-blue-800 mt-1">
                This audit package ensures compliance with DOD MWR policies and guidelines. 
                All required documents and compliance checks are validated according to 
                military procurement standards.
              </p>
              <div className="mt-2 text-xs text-blue-700">
                <strong>Retention Period:</strong> 6 years | 
                <strong> Audit Ready:</strong> {auditPackage.status === 'audit_ready' ? 'Yes' : 'No'} | 
                <strong> Last Updated:</strong> {formatDate(auditPackage.updatedAt)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
