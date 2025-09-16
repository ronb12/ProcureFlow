'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  mockAuditFindings, 
  mockAuditPackageStatuses, 
  getFindingsForCardholder, 
  getSeverityColor, 
  getStatusColor,
  type AuditFinding,
  type CardholderResponse
} from '@/lib/audit-findings';

export default function AuditFindingsPage() {
  const [selectedFinding, setSelectedFinding] = useState<AuditFinding | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [responseType, setResponseType] = useState<'acknowledge' | 'dispute' | 'resolve' | 'request_extension'>('acknowledge');

  // Mock current user - in real app, this would come from auth
  const currentCardholderId = 'cardholder1';
  const cardholderFindings = getFindingsForCardholder(currentCardholderId);
  const packageStatuses = mockAuditPackageStatuses.filter(status => status.cardholderId === currentCardholderId);

  const handleRespondToFinding = (finding: AuditFinding) => {
    setSelectedFinding(finding);
    setResponseText('');
    setResponseType('acknowledge');
    setShowResponseModal(true);
  };

  const handleSubmitResponse = () => {
    if (!selectedFinding || !responseText.trim()) return;

    // In a real app, this would save to the database
    console.log('Submitting response:', {
      findingId: selectedFinding.id,
      responseType,
      responseText,
      cardholderId: currentCardholderId
    });

    alert(`Response submitted for finding: ${selectedFinding.title}`);
    setShowResponseModal(false);
    setSelectedFinding(null);
    setResponseText('');
  };

  const getOverallStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'findings_issued': return 'bg-yellow-100 text-yellow-800';
      case 'cardholder_response': return 'bg-blue-100 text-blue-800';
      case 'disputed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Audit Findings</h1>
              <p className="mt-2 text-gray-600">
                Review and respond to audit findings for your purchase requests
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
                onClick={() => window.location.href = '/requests'}
              >
                My Requests
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-sm font-bold">!</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Open Findings</p>
                  <p className="text-2xl font-bold text-red-600">
                    {cardholderFindings.filter(f => f.status === 'open').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-sm font-bold">⚠</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {cardholderFindings.filter(f => f.status === 'in_progress').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-bold">✓</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {cardholderFindings.filter(f => f.status === 'resolved').length}
                  </p>
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
                  <p className="text-sm font-medium text-gray-500">Total Findings</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {cardholderFindings.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Package Status Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Package Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {packageStatuses.map((status) => (
                <div key={status.packageId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(status.criticalFindings > 0 ? 'critical' : 'low')}`}></div>
                    <div>
                      <h3 className="font-semibold">{status.requestId}</h3>
                      <p className="text-sm text-gray-600">
                        Score: {status.auditScore}/100 | 
                        Findings: {status.totalFindings} | 
                        Critical: {status.criticalFindings}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOverallStatusColor(status.overallStatus)}`}>
                      {status.overallStatus.replace('_', ' ').toUpperCase()}
                    </span>
                    {status.responseDueDate && (
                      <span className="text-sm text-gray-500">
                        Due: {status.responseDueDate.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Audit Findings List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Audit Findings</h2>
          {cardholderFindings.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-500">No audit findings found for your requests.</p>
              </CardContent>
            </Card>
          ) : (
            cardholderFindings.map((finding) => (
              <Card key={finding.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getSeverityColor(finding.severity)}`}></div>
                        <h3 className="text-lg font-semibold text-gray-900">{finding.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(finding.status)}`}>
                          {finding.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Request:</strong> {finding.requestId} | 
                          <strong> Category:</strong> {finding.category} | 
                          <strong> Severity:</strong> {finding.severity}
                        </p>
                        <p className="text-gray-700 mb-2">{finding.description}</p>
                        <p className="text-sm text-blue-600">
                          <strong>Recommendation:</strong> {finding.recommendation}
                        </p>
                      </div>

                      {finding.cardholderResponse && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-1">Your Response:</h4>
                          <p className="text-sm text-gray-700 mb-2">{finding.cardholderResponse.responseText}</p>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(finding.cardholderResponse.status)}`}>
                              {finding.cardholderResponse.status.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500">
                              {finding.cardholderResponse.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )}

                      {finding.dueDate && (
                        <p className="text-sm text-orange-600 mt-2">
                          <strong>Response Due:</strong> {finding.dueDate.toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="ml-4">
                      {finding.status === 'open' && (
                        <Button
                          onClick={() => handleRespondToFinding(finding)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Respond
                        </Button>
                      )}
                      {finding.status === 'resolved' && (
                        <span className="text-green-600 text-sm font-medium">✓ Resolved</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Response Modal */}
        {showResponseModal && selectedFinding && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Respond to Finding: {selectedFinding.title}
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setShowResponseModal(false)}
                >
                  ✕ Close
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Response Type
                  </label>
                  <select
                    value={responseType}
                    onChange={(e) => setResponseType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="acknowledge">Acknowledge Finding</option>
                    <option value="dispute">Dispute Finding</option>
                    <option value="resolve">Mark as Resolved</option>
                    <option value="request_extension">Request Extension</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Response
                  </label>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Please provide your response to this audit finding..."
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowResponseModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitResponse}
                    disabled={!responseText.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Submit Response
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
