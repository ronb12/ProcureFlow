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

export default function AuditFindingsAuditorPage() {
  const [selectedFinding, setSelectedFinding] = useState<AuditFinding | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [responseType, setResponseType] = useState<'accept' | 'reject' | 'request_more_info' | 'escalate'>('accept');

  // Mock current auditor - in real app, this would come from auth
  const currentAuditorId = 'auditor1';
  
  // Get all findings that need auditor attention
  const allFindings = mockAuditFindings;
  const pendingAuditorReview = allFindings.filter(finding => 
    finding.cardholderResponse && finding.cardholderResponse.status === 'pending_review'
  );
  const auditorResponded = allFindings.filter(finding => 
    finding.auditorResponse
  );

  const handleRespondToCardholder = (finding: AuditFinding) => {
    setSelectedFinding(finding);
    setResponseText('');
    setResponseType('accept');
    setShowResponseModal(true);
  };

  const handleSubmitAuditorResponse = () => {
    if (!selectedFinding || !responseText.trim()) return;

    // In a real app, this would save to the database
    console.log('Submitting auditor response:', {
      findingId: selectedFinding.id,
      responseType,
      responseText,
      auditorId: currentAuditorId
    });

    alert(`Auditor response submitted for finding: ${selectedFinding.title}`);
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
              <h1 className="text-3xl font-bold text-gray-900">Audit Findings - Auditor View</h1>
              <p className="mt-2 text-gray-600">
                Review cardholder responses and provide auditor feedback
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

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-bold">📋</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Pending Review</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {pendingAuditorReview.length}
                  </p>
                  <p className="text-xs text-gray-500">Awaiting your response</p>
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
                  <p className="text-sm font-medium text-gray-500">Responded</p>
                  <p className="text-2xl font-bold text-green-600">
                    {auditorResponded.length}
                  </p>
                  <p className="text-xs text-gray-500">Your responses</p>
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
                    {allFindings.filter(f => f.severity === 'critical').length}
                  </p>
                  <p className="text-xs text-gray-500">High priority</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-sm font-bold">📊</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Findings</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {allFindings.length}
                  </p>
                  <p className="text-xs text-gray-500">All findings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Auditor Review */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Pending Your Review</h2>
          {pendingAuditorReview.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-500">No findings pending your review.</p>
              </CardContent>
            </Card>
          ) : (
            pendingAuditorReview.map((finding) => (
              <Card key={finding.id} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
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

                      {/* Cardholder Response */}
                      {finding.cardholderResponse && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-1">Cardholder Response:</h4>
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
                      <Button
                        onClick={() => handleRespondToCardholder(finding)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Review Response
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Your Responses */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Responses</h2>
          {auditorResponded.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-500">No responses submitted yet.</p>
              </CardContent>
            </Card>
          ) : (
            auditorResponded.map((finding) => (
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
                          <strong> Category:</strong> {finding.category}
                        </p>
                      </div>

                      {/* Your Response */}
                      {finding.auditorResponse && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-1">Your Response:</h4>
                          <p className="text-sm text-gray-700 mb-2">{finding.auditorResponse.responseText}</p>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {finding.auditorResponse.responseType.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500">
                              {finding.auditorResponse.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      <span className="text-green-600 text-sm font-medium">✓ Responded</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Auditor Response Modal */}
        {showResponseModal && selectedFinding && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Respond to Cardholder: {selectedFinding.title}
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
                    <option value="accept">Accept Response</option>
                    <option value="reject">Reject Response</option>
                    <option value="request_more_info">Request More Information</option>
                    <option value="escalate">Escalate to Supervisor</option>
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
                    placeholder="Provide your feedback on the cardholder's response..."
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
                    onClick={handleSubmitAuditorResponse}
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
