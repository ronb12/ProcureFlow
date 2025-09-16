'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  COMPREHENSIVE_AUDIT_RULES, 
  AUDIT_TRIGGERS, 
  AUDIT_SCHEDULES,
  calculateComplianceMetrics,
  type ComplianceMetrics
} from '@/lib/audit-workflow';

export default function AuditCompliancePage() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'rules' | 'triggers' | 'schedules'>('overview');

  // Mock data for demonstration
  const mockPackages = [
    { id: '1', status: 'Purchased', amount: 1500, auditStatus: 'resolved', auditScore: 95, criticalIssues: 0, resolvedIssues: 2, openIssues: 0 },
    { id: '2', status: 'Reconciled', amount: 2500, auditStatus: 'findings_issued', auditScore: 45, criticalIssues: 2, resolvedIssues: 0, openIssues: 3 },
    { id: '3', status: 'Purchased', amount: 800, auditStatus: 'resolved', auditScore: 88, criticalIssues: 0, resolvedIssues: 1, openIssues: 0 },
    { id: '4', status: 'Purchased', amount: 3000, auditStatus: 'under_review', auditScore: 0, criticalIssues: 0, resolvedIssues: 0, openIssues: 0 },
    { id: '5', status: 'Reconciled', amount: 1200, auditStatus: 'resolved', auditScore: 92, criticalIssues: 0, resolvedIssues: 1, openIssues: 0 },
  ];

  const complianceMetrics = calculateComplianceMetrics(mockPackages);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'findings_issued': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'pending_audit': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'error': return 'bg-orange-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">100% Compliance Audit System</h1>
              <p className="mt-2 text-gray-600">
                Comprehensive audit workflow ensuring every purchase package is audited
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

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Compliance Overview' },
                { id: 'rules', name: 'Audit Rules' },
                { id: 'triggers', name: 'Audit Triggers' },
                { id: 'schedules', name: 'Audit Schedules' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Compliance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-bold">📊</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Total Packages</p>
                      <p className="text-2xl font-bold text-blue-600">{complianceMetrics.totalPackages}</p>
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
                      <p className="text-sm font-medium text-gray-500">Compliance Rate</p>
                      <p className="text-2xl font-bold text-green-600">{complianceMetrics.complianceRate.toFixed(1)}%</p>
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
                      <p className="text-sm font-medium text-gray-500">Avg Audit Time</p>
                      <p className="text-2xl font-bold text-yellow-600">{complianceMetrics.averageAuditTime}h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-sm font-bold">!</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Open Findings</p>
                      <p className="text-2xl font-bold text-red-600">{complianceMetrics.openFindings}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Package Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Package Audit Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPackages.map((pkg) => (
                    <div key={pkg.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${pkg.auditScore >= 80 ? 'bg-green-500' : pkg.auditScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                        <div>
                          <h3 className="font-semibold">Package {pkg.id}</h3>
                          <p className="text-sm text-gray-600">
                            Amount: ${pkg.amount.toLocaleString()} | 
                            Score: {pkg.auditScore}/100 | 
                            Issues: {pkg.openIssues} open, {pkg.resolvedIssues} resolved
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pkg.auditStatus)}`}>
                          {pkg.auditStatus.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'rules' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Comprehensive Audit Rules ({COMPREHENSIVE_AUDIT_RULES.length} Rules)</CardTitle>
                <p className="text-sm text-gray-600">
                  These rules ensure 100% compliance by checking every purchase package
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {COMPREHENSIVE_AUDIT_RULES.map((rule) => (
                    <div key={rule.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className={`w-3 h-3 rounded-full mt-2 ${getSeverityColor(rule.severity)}`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              rule.severity === 'critical' ? 'bg-red-100 text-red-800' :
                              rule.severity === 'error' ? 'bg-orange-100 text-orange-800' :
                              rule.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {rule.severity.toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500">{rule.dueDays} days</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Category:</strong> {rule.category} | 
                          <strong> Condition:</strong> {rule.condition} | 
                          <strong> Auto-resolve:</strong> {rule.autoResolve ? 'Yes' : 'No'} | 
                          <strong> Requires Response:</strong> {rule.requiresResponse ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'triggers' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audit Triggers ({AUDIT_TRIGGERS.length} Triggers)</CardTitle>
                <p className="text-sm text-gray-600">
                  These triggers ensure every purchase package is automatically audited
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {AUDIT_TRIGGERS.map((trigger) => (
                    <div key={trigger.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        trigger.priority === 'critical' ? 'bg-red-500' :
                        trigger.priority === 'high' ? 'bg-orange-500' :
                        trigger.priority === 'medium' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">{trigger.description}</h3>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              trigger.priority === 'critical' ? 'bg-red-100 text-red-800' :
                              trigger.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              trigger.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {trigger.priority.toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              trigger.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {trigger.isActive ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Type:</strong> {trigger.triggerType.replace('_', ' ').toUpperCase()} | 
                          <strong> Condition:</strong> {trigger.condition}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'schedules' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audit Schedules ({AUDIT_SCHEDULES.length} Schedules)</CardTitle>
                <p className="text-sm text-gray-600">
                  Scheduled audits ensure comprehensive coverage and compliance
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {AUDIT_SCHEDULES.map((schedule) => (
                    <div key={schedule.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="w-3 h-3 rounded-full mt-2 bg-blue-500"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">{schedule.name}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {schedule.frequency.toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              schedule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {schedule.isActive ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Rules Applied:</strong> {schedule.auditRules.length} rules | 
                          <strong> Trigger Events:</strong> {schedule.triggerEvents.join(', ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 100% Compliance Guarantee */}
        <Card className="mt-8 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-green-900">100% Compliance Guarantee</h3>
                <p className="text-sm text-green-800 mt-1">
                  This comprehensive audit system ensures that <strong>every single purchase package</strong> is audited through multiple layers of automated and manual review. No purchase can be completed without passing through our audit workflow, guaranteeing 100% compliance with DOD MWR policies and procedures.
                </p>
                <div className="mt-2 text-xs text-green-700">
                  <strong>Coverage:</strong> Automatic triggers + Scheduled audits + Risk-based reviews + Manual audits = 100% compliance
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
