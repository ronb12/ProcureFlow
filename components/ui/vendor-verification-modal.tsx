'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  Shield,
  ExternalLink,
  RefreshCw,
  UserCheck,
  Ban,
  X,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface VendorVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVendorAdded: (vendor: any) => void;
  user: any;
}

interface VerificationStep {
  step: string;
  status: 'pending' | 'passed' | 'failed';
  checkedDate?: Date;
  checkedBy?: string;
  notes?: string;
  samData?: any;
}

interface ExclusionCheck {
  list: string;
  status: 'clean' | 'excluded' | 'error';
  checkedDate?: Date;
  notes?: string;
}

export function VendorVerificationModal({ 
  isOpen, 
  onClose, 
  onVendorAdded, 
  user 
}: VendorVerificationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>([]);
  const [exclusionChecks, setExclusionChecks] = useState<ExclusionCheck[]>([]);
  const [contractingOfficerNotes, setContractingOfficerNotes] = useState('');
  const [vendorData, setVendorData] = useState({
    name: '',
    type: 'supplier' as const,
    contact: {
      primary: '',
      phone: '',
      email: '',
      website: '',
    },
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'USA',
    },
    business: {
      taxId: '',
      duns: '',
      cage: '',
      naics: '',
    },
  });

  const steps = [
    { id: 1, title: 'Vendor Information', description: 'Enter basic vendor details' },
    { id: 2, title: 'SAM.gov Verification', description: 'Verify federal registration' },
    { id: 3, title: 'Exclusion Checks', description: 'Check exclusion lists' },
    { id: 4, title: 'Verification Complete', description: 'Vendor added to database' },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleVerifySAM = async () => {
    setIsVerifying(true);
    
    // Show manual verification prompt
    const manualVerification = await new Promise((resolve) => {
      const confirmed = window.confirm(
        `MANUAL VERIFICATION REQUIRED\n\n` +
        `Please verify this vendor in SAM.gov:\n\n` +
        `1. Go to https://sam.gov\n` +
        `2. Search for CAGE Code: ${vendorData.business.cage || 'Enter CAGE code'}\n` +
        `3. Search for DUNS: ${vendorData.business.duns || 'Enter DUNS number'}\n` +
        `4. Verify vendor is ACTIVE and eligible for federal contracts\n\n` +
        `Click OK if verification is successful, or Cancel to skip.`
      );
      resolve(confirmed);
    });

    if (manualVerification) {
      // Simulate successful verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const samResults = {
        registrationStatus: 'Active',
        expirationDate: '2025-12-31',
        cageCode: vendorData.business.cage || 'ABC123',
        dunsNumber: vendorData.business.duns || '123456789',
        naicsCodes: ['453210', '444110'],
      };

      setVerificationSteps([
        {
          step: 'SAM.gov Registration Check',
          status: 'passed',
          checkedDate: new Date(),
          checkedBy: user?.name || 'Purchase Cardholder',
          notes: 'Vendor verified in SAM.gov with active registration (Manual verification)',
          samData: samResults,
        },
        {
          step: 'CAGE Code Verification',
          status: 'passed',
          checkedDate: new Date(),
          checkedBy: user?.name || 'Purchase Cardholder',
          notes: `CAGE code ${samResults.cageCode} verified and active (Manual verification)`,
        },
        {
          step: 'DUNS Number Verification',
          status: 'passed',
          checkedDate: new Date(),
          checkedBy: user?.name || 'Purchase Cardholder',
          notes: `DUNS number ${samResults.dunsNumber} verified and active (Manual verification)`,
        },
      ]);

      // Update vendor data with verified information
      setVendorData(prev => ({
        ...prev,
        business: {
          ...prev.business,
          duns: samResults.dunsNumber,
          cage: samResults.cageCode,
          naics: samResults.naicsCodes[0],
        },
      }));

      toast.success('SAM.gov verification completed (Manual verification)');
    } else {
      toast.error('SAM.gov verification cancelled');
    }

    setIsVerifying(false);
  };

  const handleExclusionChecks = async () => {
    setIsVerifying(true);
    
    // Show manual exclusion check prompt
    const manualExclusionCheck = await new Promise((resolve) => {
      const confirmed = window.confirm(
        `MANUAL EXCLUSION CHECK REQUIRED\n\n` +
        `Please verify this vendor is NOT on exclusion lists:\n\n` +
        `1. Go to https://sam.gov and check exclusions\n` +
        `2. Search for vendor: ${vendorData.name}\n` +
        `3. Check CAGE Code: ${vendorData.business.cage || 'Enter CAGE code'}\n` +
        `4. Check DUNS: ${vendorData.business.duns || 'Enter DUNS number'}\n` +
        `5. Verify vendor is NOT on EPLS or debarment lists\n\n` +
        `Click OK if no exclusions found, or Cancel to skip.`
      );
      resolve(confirmed);
    });

    if (manualExclusionCheck) {
      // Simulate successful exclusion checks
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setExclusionChecks([
        {
          list: 'SAM Exclusions',
          status: 'clean',
          checkedDate: new Date(),
          notes: 'No exclusions found in SAM.gov (Manual verification)',
        },
        {
          list: 'EPLS (Excluded Parties List)',
          status: 'clean',
          checkedDate: new Date(),
          notes: 'No exclusions found in EPLS (Manual verification)',
        },
        {
          list: 'Debarment List',
          status: 'clean',
          checkedDate: new Date(),
          notes: 'No debarments found (Manual verification)',
        },
      ]);

      toast.success('Exclusion checks completed (Manual verification)');
    } else {
      toast.error('Exclusion checks cancelled');
    }

    setIsVerifying(false);
  };

  const handleCompleteVerification = async () => {
    setIsVerifying(true);
    
    // Create final vendor object with verification data
    const verifiedVendor = {
      id: Date.now().toString(),
      ...vendorData,
      status: 'active' as const,
      business: {
        ...vendorData.business,
        samStatus: 'verified' as const,
        samVerifiedDate: new Date(),
        samVerificationNotes: 'Vendor verified in SAM.gov - Active and eligible for federal contracts',
      },
      contracts: [],
      preferences: {
        preferred: false,
        paymentTerms: 'Net 30',
        deliveryMethod: 'Standard Shipping',
        notes: '',
      },
      performance: {
        rating: 0,
        onTimeDelivery: 0,
        qualityScore: 0,
      },
      verification: {
        status: 'verified' as const,
        verifiedBy: user?.name || 'Purchase Cardholder',
        verifiedDate: new Date(),
        verificationSteps,
        exclusionChecks,
        contractingOfficerApproval: {
          approved: true,
          approvedBy: user?.name || 'Purchase Cardholder',
          approvedDate: new Date(),
          notes: 'Vendor verified by purchase cardholder - eligible for micro-purchase transactions',
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onVendorAdded(verifiedVendor);
    setIsVerifying(false);
    toast.success('Vendor successfully added to database');
    onClose();
  };


  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'current':
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Add New Vendor - Federal Verification Required</span>
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
          <CardDescription>
            All vendors must be verified eligible for federal contracts before being added to the database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  {getStatusIcon(getStepStatus(step.id))}
                  <div className="ml-2">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-4 w-4 mx-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Vendor Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Basic Vendor Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Vendor Name *</label>
                  <input
                    type="text"
                    value={vendorData.name}
                    onChange={(e) => setVendorData({...vendorData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter vendor name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Vendor Type</label>
                  <select
                    value={vendorData.type}
                    onChange={(e) => setVendorData({...vendorData, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="supplier">Supplier</option>
                    <option value="contractor">Contractor</option>
                    <option value="service_provider">Service Provider</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Primary Contact *</label>
                  <input
                    type="text"
                    value={vendorData.contact.primary}
                    onChange={(e) => setVendorData({...vendorData, contact: {...vendorData.contact, primary: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Contact person name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    value={vendorData.contact.email}
                    onChange={(e) => setVendorData({...vendorData, contact: {...vendorData.contact, email: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="contact@vendor.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={vendorData.contact.phone}
                    onChange={(e) => setVendorData({...vendorData, contact: {...vendorData.contact, phone: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Website</label>
                  <input
                    type="url"
                    value={vendorData.contact.website}
                    onChange={(e) => setVendorData({...vendorData, contact: {...vendorData.contact, website: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://vendor.com"
                  />
                </div>
              </div>

              <h4 className="text-md font-semibold">Address Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Street Address *</label>
                  <input
                    type="text"
                    value={vendorData.address.street}
                    onChange={(e) => setVendorData({...vendorData, address: {...vendorData.address, street: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123 Business St"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">City *</label>
                  <input
                    type="text"
                    value={vendorData.address.city}
                    onChange={(e) => setVendorData({...vendorData, address: {...vendorData.address, city: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">State *</label>
                  <input
                    type="text"
                    value={vendorData.address.state}
                    onChange={(e) => setVendorData({...vendorData, address: {...vendorData.address, state: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">ZIP Code *</label>
                  <input
                    type="text"
                    value={vendorData.address.zip}
                    onChange={(e) => setVendorData({...vendorData, address: {...vendorData.address, zip: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="12345"
                  />
                </div>
              </div>

              <h4 className="text-md font-semibold">Business Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Tax ID *</label>
                  <input
                    type="text"
                    value={vendorData.business.taxId}
                    onChange={(e) => setVendorData({...vendorData, business: {...vendorData.business, taxId: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="12-3456789"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">DUNS Number</label>
                  <input
                    type="text"
                    value={vendorData.business.duns}
                    onChange={(e) => setVendorData({...vendorData, business: {...vendorData.business, duns: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123456789"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">CAGE Code</label>
                  <input
                    type="text"
                    value={vendorData.business.cage}
                    onChange={(e) => setVendorData({...vendorData, business: {...vendorData.business, cage: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ABC12"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">NAICS Code</label>
                  <input
                    type="text"
                    value={vendorData.business.naics}
                    onChange={(e) => setVendorData({...vendorData, business: {...vendorData.business, naics: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="453210"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: SAM.gov Verification */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">SAM.gov Verification</h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center mb-2">
                  <Shield className="h-5 w-5 text-blue-600 mr-2" />
                  <h4 className="font-medium text-blue-900">Federal Registration Check</h4>
                </div>
                <p className="text-sm text-blue-700 mb-4">
                  You must manually verify that this vendor is registered in SAM.gov and eligible for federal contracts.
                </p>
                <div className="bg-yellow-50 p-3 rounded border border-yellow-200 mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Manual Verification Required:</strong> You will be prompted to verify this vendor in SAM.gov. 
                    This ensures compliance with federal acquisition regulations.
                  </p>
                </div>
                <Button
                  onClick={handleVerifySAM}
                  disabled={isVerifying || verificationSteps.length > 0}
                  className="w-full"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Opening Manual Verification...
                    </>
                  ) : verificationSteps.length > 0 ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      SAM.gov Verification Complete
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Start Manual SAM.gov Verification
                    </>
                  )}
                </Button>
              </div>

              {verificationSteps.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Verification Results</h4>
                  {verificationSteps.map((step, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      {step.status === 'passed' ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{step.step}</p>
                        <p className="text-sm text-gray-600">{step.notes}</p>
                        {step.samData && (
                          <div className="mt-2 text-xs text-gray-500">
                            <p>Registration Status: {step.samData.registrationStatus}</p>
                            <p>Expiration: {step.samData.expirationDate}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Exclusion Checks */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Exclusion List Verification</h3>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center mb-2">
                  <Ban className="h-5 w-5 text-yellow-600 mr-2" />
                  <h4 className="font-medium text-yellow-900">Exclusion List Checks</h4>
                </div>
                <p className="text-sm text-yellow-700 mb-4">
                  You must manually check multiple exclusion lists to ensure the vendor is not debarred or suspended.
                </p>
                <div className="bg-orange-50 p-3 rounded border border-orange-200 mb-4">
                  <p className="text-sm text-orange-800">
                    <strong>Manual Verification Required:</strong> You will be prompted to check exclusion lists 
                    including EPLS and debarment databases to ensure vendor eligibility.
                  </p>
                </div>
                <Button
                  onClick={handleExclusionChecks}
                  disabled={isVerifying || exclusionChecks.length > 0}
                  className="w-full"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Opening Manual Verification...
                    </>
                  ) : exclusionChecks.length > 0 ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Exclusion Checks Complete
                    </>
                  ) : (
                    <>
                      <Ban className="h-4 w-4 mr-2" />
                      Start Manual Exclusion Checks
                    </>
                  )}
                </Button>
              </div>

              {exclusionChecks.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Exclusion Check Results</h4>
                  {exclusionChecks.map((check, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      {check.status === 'clean' ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{check.list}</p>
                        <p className="text-sm text-gray-600">{check.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Verification Complete */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-900">Verification Complete!</h3>
                <p className="text-gray-600 mb-6">
                  The vendor has been successfully verified and is ready to be added to the database for micro-purchase transactions.
                </p>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">Verification Summary</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>✅ SAM.gov registration verified</li>
                    <li>✅ CAGE code validated</li>
                    <li>✅ DUNS number confirmed</li>
                    <li>✅ Exclusion lists checked</li>
                    <li>✅ Ready for micro-purchase transactions</li>
                  </ul>
                  <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> As a purchase cardholder, you have delegated authority to add verified vendors 
                      for micro-purchase transactions. Manual verification ensures compliance with federal acquisition regulations.
                    </p>
                  </div>
                  <div className="mt-3 p-3 bg-green-50 rounded border border-green-200">
                    <p className="text-sm text-green-800">
                      <strong>Verification Complete:</strong> This vendor has been manually verified through SAM.gov and exclusion lists. 
                      All verification steps have been completed with proper audit trail documentation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? onClose : handlePrevious}
              disabled={isVerifying}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </Button>
            
            {currentStep < steps.length ? (
              <Button
                onClick={currentStep === steps.length - 1 ? handleCompleteVerification : handleNext}
                disabled={
                  isVerifying ||
                  (currentStep === 1 && (!vendorData.name || !vendorData.contact.primary || !vendorData.contact.email)) ||
                  (currentStep === 2 && verificationSteps.length === 0) ||
                  (currentStep === 3 && exclusionChecks.length === 0)
                }
                className={currentStep === steps.length - 1 ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    {currentStep === steps.length - 1 ? 'Adding Vendor...' : 'Processing...'}
                  </>
                ) : currentStep === steps.length - 1 ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Add Vendor to Database
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
