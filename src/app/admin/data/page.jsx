"use client"
import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Heart,
  Loader2,
  X,
  Users
} from 'lucide-react';

const DonorPage = () => {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Sorting States
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [donorsPerPage] = useState(10);
  
  // Delete State
  const [deletingDonorId, setDeletingDonorId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [donorToDelete, setDonorToDelete] = useState(null);

  // Fetch donors from API
  const fetchDonors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/data');

      if (!response.ok) {
        throw new Error('Failed to fetch donors');
      }
      const data = await response.json();
      console.log(data);
      setDonors(data.donors || data);
      setError('');
    } catch (err) {
      setError('Failed to fetch donors');
      console.error('Error fetching donors:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete donor
  const handleDeleteDonor = async (donorId) => {
    try {
      setDeletingDonorId(donorId);
      const response = await fetch(`/api/donorData/${donorId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete donor');
      }
      await fetchDonors(); // Refresh the list
      setShowDeleteDialog(false);
    } catch (err) {
      setError('Failed to delete donor');
      console.error('Error deleting donor:', err);
    } finally {
      setDeletingDonorId(null);
    }
  };

  // View donor
  const handleViewDonor = (donorId) => {
    window.location.href = `/admin/donorData/${donorId}`;
  };

  // Sort donors
  const sortDonors = (donors) => {
    return [...donors].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  };

  // Filter and search donors
  useEffect(() => {
    let filtered = donors;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(donor =>
        donor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.phone?.includes(searchTerm)
      );
    }

    // Apply status filter (based on recent activity - created in last 30 days = active)
    if (statusFilter !== 'all') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      filtered = filtered.filter(donor => {
        const isRecentlyActive = new Date(donor.createdAt) > thirtyDaysAgo;
        if (statusFilter === 'active') return isRecentlyActive;
        if (statusFilter === 'inactive') return !isRecentlyActive;
        return true;
      });
    }

    // Apply sorting
    filtered = sortDonors(filtered);

    setFilteredDonors(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [donors, searchTerm, statusFilter, sortField, sortDirection]);

  // Pagination logic
  const indexOfLastDonor = currentPage * donorsPerPage;
  const indexOfFirstDonor = indexOfLastDonor - donorsPerPage;
  const currentDonors = filteredDonors.slice(indexOfFirstDonor, indexOfLastDonor);
  const totalPages = Math.ceil(filteredDonors.length / donorsPerPage);

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  // Get status badge classes (based on recent activity)
  const getStatusBadgeClasses = (createdAt) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const isRecentlyActive = new Date(createdAt) > thirtyDaysAgo;
    
    return isRecentlyActive
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Open delete dialog
  const openDeleteDialog = (donor) => {
    setDonorToDelete(donor);
    setShowDeleteDialog(true);
  };

  // Get additional field value
  const getAdditionalFieldValue = (donor, fieldKey) => {
    return donor.additionalFields?.get?.(fieldKey) || donor.additionalFields?.[fieldKey] || 'N/A';
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-400" />
          <span className="text-lg text-gray-700 dark:text-gray-300">Loading donors...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-[85vh] bg-gray-50 dark:bg-gray-900 overflow-y-auto transition-colors duration-200">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <Heart className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Donor Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage and view all donors</p>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>Total Donors: {donors.length}</span>
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
              Active: {donors.filter(d => {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return new Date(d.createdAt) > thirtyDaysAgo;
              }).length}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Search & Filters</h2>
          </div>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full lg:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active (Recent)</option>
              <option value="inactive">Inactive (Older)</option>
            </select>
          </div>
        </div>

        {/* Donors Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Donors ({filteredDonors.length})
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {currentDonors.length} of {filteredDonors.length} donors
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <button 
                      onClick={() => handleSort('fullName')}
                      className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <span>Full Name</span>
                      {getSortIcon('fullName')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button 
                      onClick={() => handleSort('email')}
                      className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <span>Email</span>
                      {getSortIcon('email')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button 
                      onClick={() => handleSort('phone')}
                      className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <span>Phone</span>
                      {getSortIcon('phone')}
                    </button>
                  </th>
                 
                  <th className="px-6 py-3 text-left">
                    <button 
                      onClick={() => handleSort('createdAt')}
                      className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <span>Created Date</span>
                      {getSortIcon('createdAt')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentDonors.map((donor) => (
                  <tr key={donor.id || donor._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {donor.fullName}
                      </div>
                      {donor.additionalFields && Object.keys(donor.additionalFields).length > 0 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          +{Object.keys(donor.additionalFields).length} additional fields
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {donor.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {donor.phone}
                      </div>
                    </td>
                    
                  
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(donor.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewDonor(donor.id || donor._id)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded cursor-pointer"
                          title="View Donor"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(donor)}
                          disabled={deletingDonorId === (donor.id || donor._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-50 cursor-pointer"
                          title="Delete Donor"
                        >
                          {deletingDonorId === (donor.id || donor._id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing {indexOfFirstDonor + 1} to {Math.min(indexOfLastDonor, filteredDonors.length)} of {filteredDonors.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delete Dialog */}
        {showDeleteDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Donor
                </h3>
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete <strong>{donorToDelete?.fullName}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteDonor(donorToDelete.id || donorToDelete._id)}
                  disabled={deletingDonorId === (donorToDelete?.id || donorToDelete?._id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 flex items-center space-x-2"
                >
                  {deletingDonorId === (donorToDelete?.id || donorToDelete?._id) ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorPage;