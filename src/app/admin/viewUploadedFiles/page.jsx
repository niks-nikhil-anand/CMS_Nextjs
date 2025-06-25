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
  FileText,
  Loader2,
  X,
  Download,
  Users,
  Database
} from 'lucide-react';

const UploadedFilesPage = () => {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('all');
  
  // Sorting States
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [filesPerPage] = useState(10);
  
  // Delete State
  const [deletingFileId, setDeletingFileId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  // Fetch files from API
  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/upload-files');

      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }


      const data = await response.json();
      console.log(data);
      setFiles(data.donors || data);
      setError('');
    } catch (err) {
      setError('Failed to fetch files');
      console.error('Error fetching files:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete file
  const handleDeleteFile = async (fileId) => {
    try {
      setDeletingFileId(fileId);
      const response = await fetch(`/api/upload-files/${fileId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete file');
      }
      await fetchFiles(); // Refresh the list
      setShowDeleteDialog(false);
    } catch (err) {
      setError('Failed to delete file');
      console.error('Error deleting file:', err);
    } finally {
      setDeletingFileId(null);
    }
  };

  // View file
  const handleViewFile = (fileId) => {
    window.location.href = `/admin/viewUploadedFiles/${fileId}`;
  };

  // Download file
  const handleDownloadFile = (fileId, fileName) => {
    window.location.href = `/api/upload-files/${fileId}/download`;
  };

  // Sort files
  const sortFiles = (files) => {
    return [...files].sort((a, b) => {
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

  // Filter and search files
  useEffect(() => {
    let filtered = files;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(file =>
        file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (file.uploadedBy?.fullName && file.uploadedBy.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply file type filter
    if (fileTypeFilter !== 'all') {
      filtered = filtered.filter(file => file.fileType === fileTypeFilter);
    }

    // Apply sorting
    filtered = sortFiles(filtered);

    setFilteredFiles(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [files, searchTerm, fileTypeFilter, sortField, sortDirection]);

  // Pagination logic
  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);
  const totalPages = Math.ceil(filteredFiles.length / filesPerPage);

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

  // Get file type badge classes
  const getFileTypeBadgeClasses = (fileType) => {
    switch (fileType) {
      case '.xlsx': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case '.xls': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case '.csv': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
  const openDeleteDialog = (file) => {
    setFileToDelete(file);
    setShowDeleteDialog(true);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-400" />
          <span className="text-lg text-gray-700 dark:text-gray-300">Loading files...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <FileText className="h-8 w-8 text-gray-700 dark:text-gray-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Files Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage and view all uploaded files</p>
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
            Total Files: {files.length}
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
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by filename or uploader..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* File Type Filter */}
            <select
              value={fileTypeFilter}
              onChange={(e) => setFileTypeFilter(e.target.value)}
              className="w-full md:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All File Types</option>
              <option value=".xlsx">Excel (.xlsx)</option>
              <option value=".xls">Excel (.xls)</option>
              <option value=".csv">CSV (.csv)</option>
            </select>
          </div>
        </div>

        {/* Files Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Files ({filteredFiles.length})
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {currentFiles.length} of {filteredFiles.length} files
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <button 
                      onClick={() => handleSort('fileName')}
                      className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <span>File Name</span>
                      {getSortIcon('fileName')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button 
                      onClick={() => handleSort('fileType')}
                      className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <span>Type</span>
                      {getSortIcon('fileType')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button 
                      onClick={() => handleSort('fileSize')}
                      className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <span>Size</span>
                      {getSortIcon('fileSize')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button 
                      onClick={() => handleSort('totalRows')}
                      className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <span>Rows</span>
                      {getSortIcon('totalRows')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button 
                      onClick={() => handleSort('totalColumns')}
                      className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <span>Columns</span>
                      {getSortIcon('totalColumns')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Manager
                    </span>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Assigned
                    </span>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button 
                      onClick={() => handleSort('createdAt')}
                      className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <span>Uploaded At</span>
                      {getSortIcon('createdAt')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {file.fileName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFileTypeBadgeClasses(file.fileType)}`}>
                        {file.fileType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {formatFileSize(file.fileSize)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {file.totalRows?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {file.totalColumns || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {file.uploadedBy?.fullName || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {((file.manager?.length || 0) + (file.candidates?.length || 0))}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(file.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewFile(file.id)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded cursor-pointer"
                          title="View File Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadFile(file.id, file.fileName)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 hover:bg-green-50 dark:hover:bg-green-900/20 rounded cursor-pointer"
                          title="Download File"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(file)}
                          disabled={deletingFileId === file.id}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-50 cursor-pointer"
                          title="Delete File"
                        >
                          {deletingFileId === file.id ? (
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
                Showing {indexOfFirstFile + 1} to {Math.min(indexOfLastFile, filteredFiles.length)} of {filteredFiles.length} results
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
                  Delete File
                </h3>
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-5 w-5 cursor-pointer" />
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete <strong>{fileToDelete?.fileName}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteFile(fileToDelete.id)}
                  disabled={deletingFileId === fileToDelete?.id}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 flex items-center space-x-2 cursor-pointer"
                >
                  {deletingFileId === fileToDelete?.id ? (
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

export default UploadedFilesPage;