'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/ui/app-header';
import toast from 'react-hot-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Building2,
  Plus,
  Trash2,
  Search,
  MapPin,
  Users,
  Phone,
  Calendar,
} from 'lucide-react';

interface Facility {
  id: string;
  name: string;
  code: string;
  installation: string;
  installationCode: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  director: string;
  capacity: number;
  ageGroups: string[];
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

// Mock facilities data
const mockFacilities: Facility[] = [
  {
    id: '1',
    name: 'Fort Jackson CDC #1 - Main',
    code: 'FJ-CDC-001',
    installation: 'Fort Jackson',
    installationCode: 'FJ',
    address: '1234 Child Care Drive',
    city: 'Columbia',
    state: 'SC',
    zip: '29207',
    phone: '(803) 555-0101',
    director: 'Sarah Johnson',
    capacity: 120,
    ageGroups: ['Infant', 'Toddler', 'Preschool', 'School Age'],
    status: 'active',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Camp Lejeune Early Learning Center',
    code: 'CL-ELC-002',
    installation: 'Camp Lejeune',
    installationCode: 'CL',
    address: '5678 Marine Way',
    city: 'Jacksonville',
    state: 'NC',
    zip: '28542',
    phone: '(910) 555-0202',
    director: 'Michael Rodriguez',
    capacity: 95,
    ageGroups: ['Infant', 'Toddler', 'Preschool'],
    status: 'active',
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: 'Norfolk Naval Station CDC',
    code: 'NN-CDC-003',
    installation: 'Norfolk Naval Station',
    installationCode: 'NN',
    address: '9012 Navy Boulevard',
    city: 'Norfolk',
    state: 'VA',
    zip: '23511',
    phone: '(757) 555-0303',
    director: 'Jennifer Williams',
    capacity: 150,
    ageGroups: ['Infant', 'Toddler', 'Preschool', 'School Age'],
    status: 'active',
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '4',
    name: 'San Diego Naval Base CDC',
    code: 'SD-CDC-004',
    installation: 'San Diego Naval Base',
    installationCode: 'SD',
    address: '3456 Pacific Highway',
    city: 'San Diego',
    state: 'CA',
    zip: '92136',
    phone: '(619) 555-0404',
    director: 'David Chen',
    capacity: 180,
    ageGroups: ['Infant', 'Toddler', 'Preschool', 'School Age'],
    status: 'active',
    createdAt: new Date('2023-04-05'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: '5',
    name: 'Joint Base Lewis-McChord CDC',
    code: 'JBLM-CDC-005',
    installation: 'Joint Base Lewis-McChord',
    installationCode: 'JBLM',
    address: '7890 Military Drive',
    city: 'Tacoma',
    state: 'WA',
    zip: '98433',
    phone: '(253) 555-0505',
    director: 'Lisa Thompson',
    capacity: 200,
    ageGroups: ['Infant', 'Toddler', 'Preschool', 'School Age'],
    status: 'active',
    createdAt: new Date('2023-05-12'),
    updatedAt: new Date('2024-01-30'),
  },
];

export default function AdminFacilitiesPage() {
  const router = useRouter();
  const { user, loading, originalUser } = useAuth();
  
  const actualRole = originalUser?.role || user?.role;
  const [facilities, setFacilities] = useState<Facility[]>(mockFacilities);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newFacility, setNewFacility] = useState<Partial<Facility>>({
    name: '',
    code: '',
    installation: '',
    installationCode: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    director: '',
    capacity: 0,
    ageGroups: [],
    status: 'active',
  });

  // Handle authentication redirect
  useEffect(() => {
    if (!loading && (!user || !actualRole || !['admin'].includes(actualRole))) {
      router.push('/login');
    }
  }, [user, actualRole, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!actualRole || !['admin'].includes(actualRole)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // Filter facilities based on search and status
  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facility.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facility.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facility.director.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || facility.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddFacility = async () => {
    if (!newFacility.name || !newFacility.code || !newFacility.director) {
      toast.error('Please fill in required fields (Name, Code, Director)');
      return;
    }

    setIsSubmitting(true);
    try {
      const facility: Facility = {
        id: Date.now().toString(),
        name: newFacility.name!,
        code: newFacility.code!,
        installation: newFacility.installation || '',
        installationCode: newFacility.installationCode || '',
        address: newFacility.address || '',
        city: newFacility.city || '',
        state: newFacility.state || '',
        zip: newFacility.zip || '',
        phone: newFacility.phone || '',
        director: newFacility.director!,
        capacity: newFacility.capacity || 0,
        ageGroups: newFacility.ageGroups || [],
        status: newFacility.status || 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setFacilities([...facilities, facility]);
      setNewFacility({
        name: '',
        code: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        director: '',
        capacity: 0,
        ageGroups: [],
        status: 'active',
      });
      setShowAddForm(false);
      toast.success('Facility added successfully');
    } catch {
      toast.error('Failed to add facility');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFacility = (id: string) => {
    if (window.confirm('Are you sure you want to delete this facility?')) {
      setFacilities(facilities.filter(facility => facility.id !== id));
      toast.success('Facility deleted successfully');
    }
  };

  const toggleFacilityStatus = (id: string) => {
    setFacilities(facilities.map(facility => 
      facility.id === id 
        ? { ...facility, status: facility.status === 'active' ? 'inactive' : 'active', updatedAt: new Date() }
        : facility
    ));
    toast.success('Facility status updated');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Facility Management</h1>
          <p className="mt-2 text-gray-600">
            Manage DOD MWR child care facilities and their information.
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search facilities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <Button onClick={() => setShowAddForm(true)} className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Facility
            </Button>
          </div>
        </div>

        {/* Add Facility Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Facility</CardTitle>
              <CardDescription>
                Create a new DOD MWR child care facility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facility Name *</label>
                  <input
                    type="text"
                    value={newFacility.name || ''}
                    onChange={(e) => setNewFacility({...newFacility, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Fort Bragg Child Development Center"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facility Code *</label>
                  <input
                    type="text"
                    value={newFacility.code || ''}
                    onChange={(e) => setNewFacility({...newFacility, code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., FB-CDC-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Director *</label>
                  <input
                    type="text"
                    value={newFacility.director || ''}
                    onChange={(e) => setNewFacility({...newFacility, director: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Sarah Johnson"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={newFacility.capacity || ''}
                    onChange={(e) => setNewFacility({...newFacility, capacity: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={newFacility.phone || ''}
                    onChange={(e) => setNewFacility({...newFacility, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(910) 555-0101"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={newFacility.address || ''}
                    onChange={(e) => setNewFacility({...newFacility, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1234 Child Care Drive"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={newFacility.city || ''}
                    onChange={(e) => setNewFacility({...newFacility, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Fayetteville"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={newFacility.state || ''}
                    onChange={(e) => setNewFacility({...newFacility, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="NC"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    value={newFacility.zip || ''}
                    onChange={(e) => setNewFacility({...newFacility, zip: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="28310"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddFacility} disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Facility'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Facilities List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((facility) => (
            <Card key={facility.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{facility.name}</CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      {facility.code}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFacilityStatus(facility.id)}
                    >
                      {facility.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteFacility(facility.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{facility.city}, {facility.state} {facility.zip}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{facility.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Director: {facility.director}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Building2 className="h-4 w-4 mr-2" />
                    <span>Capacity: {facility.capacity} children</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Age Groups: {facility.ageGroups.join(', ')}</span>
                  </div>
                  <div className="mt-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      facility.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {facility.status}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFacilities.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No facilities found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
