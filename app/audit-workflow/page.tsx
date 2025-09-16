'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AuditWorkflowPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Audit Workflow System</h1>
              <p className="mt-2 text-gray-600">
                How the audit system retrieves purchase packages and manages the audit process
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/dashboard'}
              >
                Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/audit-packages'}
              >
                Audit Packages
              </Button>
            </div>
          </div>
        </div>

        {/* Data Flow Diagram */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How Audit System Retrieves Purchase Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Purchase Reconciliation</h3>
                  <p className="text-sm text-gray-600">
                    When a cardholder completes purchase reconciliation, the system creates a record in the <code className="bg-gray-100 px-1 rounded">purchases</code> collection with status "reconciled". This is the optimal time for auditing as all documentation is complete.
                  </p>
                  <div className="mt-2 p-3 bg-gray-50 rounded text-xs font-mono">
                    Collection: purchases<br/>
                    Status: reconciled (primary) | purchased (preliminary)<br/>
                    Fields: reqId, cardholderId, merchant, finalTotal, receipts, etc.
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Automatic Audit Trigger</h3>
                  <p className="text-sm text-gray-600">
                    The audit system automatically queries the purchases collection for reconciled packages (primary) and purchased packages (preliminary for high-risk items).
                  </p>
                  <div className="mt-2 p-3 bg-gray-50 rounded text-xs font-mono">
                    Query: purchases.where('status', 'in', ['reconciled', 'purchased'])<br/>
                    Order: status desc, createdAt desc<br/>
                    Priority: Reconciled packages first<br/>
                    Filter: auditStatus != 'resolved'
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Data Enrichment</h3>
                  <p className="text-sm text-gray-600">
                    For each purchase, the system retrieves related data from requests, users, and existing audit findings to create a complete audit package.
                  </p>
                  <div className="mt-2 p-3 bg-gray-50 rounded text-xs font-mono">
                    Related Data:<br/>
                    • Request details (requests collection)<br/>
                    • Cardholder info (users collection)<br/>
                    • Existing findings (auditFindings collection)<br/>
                    • Compliance checks (calculated)
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Audit Package Creation</h3>
                  <p className="text-sm text-gray-600">
                    The system creates a comprehensive audit package with all necessary data for auditors to review and create findings.
                  </p>
                  <div className="mt-2 p-3 bg-gray-50 rounded text-xs font-mono">
                    Audit Package includes:<br/>
                    • Purchase details & amounts<br/>
                    • Document status & compliance checks<br/>
                    • Cardholder & approver information<br/>
                    • Existing findings & responses<br/>
                    • Calculated audit score
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Workflow */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Complete Audit Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Auditor Side */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Auditor Responsibilities</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Review Purchase Package</p>
                      <p className="text-xs text-gray-600">Examine all documents and compliance data</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs font-bold">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Create Audit Findings</p>
                      <p className="text-xs text-gray-600">Document any issues or non-compliance</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs font-bold">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Issue Findings to Cardholder</p>
                      <p className="text-xs text-gray-600">Send findings for cardholder response</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs font-bold">4</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Review Cardholder Response</p>
                      <p className="text-xs text-gray-600">Evaluate cardholder's response to findings</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs font-bold">5</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Provide Auditor Response</p>
                      <p className="text-xs text-gray-600">Accept, reject, or request more information</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs font-bold">6</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Final Resolution</p>
                      <p className="text-xs text-gray-600">Mark findings as resolved or escalate</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cardholder Side */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Cardholder Responsibilities</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Receive Audit Findings</p>
                      <p className="text-xs text-gray-600">View findings on dashboard or audit findings page</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-bold">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Review Findings</p>
                      <p className="text-xs text-gray-600">Examine each finding and recommendations</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-bold">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Respond to Findings</p>
                      <p className="text-xs text-gray-600">Acknowledge, dispute, resolve, or request extension</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-bold">4</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Provide Supporting Documents</p>
                      <p className="text-xs text-gray-600">Upload additional documentation if needed</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-bold">5</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Wait for Auditor Review</p>
                      <p className="text-xs text-gray-600">Auditor reviews response and provides feedback</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-bold">6</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Final Resolution</p>
                      <p className="text-xs text-gray-600">Findings marked as resolved or need further action</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response Types */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Response Types and Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Cardholder Response Types</h3>
                <div className="space-y-2">
                  <div className="p-3 border rounded">
                    <p className="font-medium text-sm">Acknowledge</p>
                    <p className="text-xs text-gray-600">Cardholder accepts the finding and will address it</p>
                  </div>
                  <div className="p-3 border rounded">
                    <p className="font-medium text-sm">Dispute</p>
                    <p className="text-xs text-gray-600">Cardholder disagrees with the finding and provides explanation</p>
                  </div>
                  <div className="p-3 border rounded">
                    <p className="font-medium text-sm">Resolve</p>
                    <p className="text-xs text-gray-600">Cardholder claims the issue has been fixed</p>
                  </div>
                  <div className="p-3 border rounded">
                    <p className="font-medium text-sm">Request Extension</p>
                    <p className="text-xs text-gray-600">Cardholder needs more time to address the finding</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Auditor Response Types</h3>
                <div className="space-y-2">
                  <div className="p-3 border rounded">
                    <p className="font-medium text-sm">Accept</p>
                    <p className="text-xs text-gray-600">Auditor accepts cardholder's response and resolves finding</p>
                  </div>
                  <div className="p-3 border rounded">
                    <p className="font-medium text-sm">Reject</p>
                    <p className="text-xs text-gray-600">Auditor rejects response and keeps finding open</p>
                  </div>
                  <div className="p-3 border rounded">
                    <p className="font-medium text-sm">Request More Info</p>
                    <p className="text-xs text-gray-600">Auditor needs additional information or documentation</p>
                  </div>
                  <div className="p-3 border rounded">
                    <p className="font-medium text-sm">Escalate</p>
                    <p className="text-xs text-gray-600">Auditor escalates finding to higher authority</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Collections */}
        <Card>
          <CardHeader>
            <CardTitle>Firebase Collections Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Source Collections</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="font-medium text-sm">purchases</p>
                    <p className="text-xs text-gray-600">Main source of purchase data for auditing</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="font-medium text-sm">requests</p>
                    <p className="text-xs text-gray-600">Request details and approval information</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="font-medium text-sm">users</p>
                    <p className="text-xs text-gray-600">Cardholder and approver information</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Audit Collections</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="font-medium text-sm">auditFindings</p>
                    <p className="text-xs text-gray-600">Audit findings created by auditors</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="font-medium text-sm">cardholderResponses</p>
                    <p className="text-xs text-gray-600">Cardholder responses to findings</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="font-medium text-sm">auditorResponses</p>
                    <p className="text-xs text-gray-600">Auditor responses to cardholder responses</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
