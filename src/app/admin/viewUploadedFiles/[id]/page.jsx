"use client"
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  Calendar, 
  Database, 
  Download,
  User,
  Clock,
  Grid3X3,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  CreditCard,
  ArrowLeft
} from 'lucide-react';

const FileDistributionDashboard = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [distributedFiles, setDistributedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedFile, setExpandedFile] = useState(null);

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Extract ID from URL path
        const urlPath = window.location.pathname;
        const id = urlPath.split("/")[3];
        
        if (!id) {
          throw new Error('File ID not found in URL');
        }

        // Make API call to fetch file data
        const response = await fetch(`/api/upload-files/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        console.log(data)
        setUploadedFile(data.data.uploadedFile || data);
        setDistributedFiles(data.data.distributedFiles || []);
        
      } catch (err) {
        console.error('Error fetching file data:', err);
        setError(err.message || 'Failed to fetch file data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const toggleExpanded = (fileId) => {
    setExpandedFile(expandedFile === fileId ? null : fileId);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleBack = () => {
    window.history.back();
  };

  const getCandidateName = (candidateId) => {
    const candidate = uploadedFile?.candidates?.find(c => c._id === candidateId);
    return candidate ? candidate.email.split('@')[0] : `Candidate ${candidateId?.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-[85vh] bg-gray-50 dark:bg-gray-900 overflow-y-auto transition-colors duration-200">
      <div className="p-6">
        <div className="mx-auto space-y-6">
          {/* Header with Back Button and Dark Mode Toggle */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">File Distribution Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage and track distributed file data</p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Uploaded File Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Uploaded File Details
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Original file information and metadata
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">File Name:</span>
                    <span className="text-gray-900 dark:text-white font-mono text-sm">{uploadedFile?.fileName}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">File Type:</span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">
                      {uploadedFile?.fileType}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">File Size:</span>
                    <span className="text-gray-900 dark:text-white">{formatFileSize(uploadedFile?.fileSize)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Total Rows:</span>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm flex items-center gap-1">
                      <Database className="h-3 w-3" />
                      {uploadedFile?.totalRows}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Total Columns:</span>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm flex items-center gap-1">
                      <Grid3X3 className="h-3 w-3" />
                      {uploadedFile?.totalColumns}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Uploaded By:</span>
                    <span className="text-gray-900 dark:text-white">{uploadedFile?.uploadedByEmail}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Uploaded:</span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(uploadedFile?.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Distribution Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Distribution Summary
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Overview of file distribution across candidates
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{distributedFiles?.length}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Total Distributions</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {distributedFiles?.reduce((sum, file) => sum + file.data.length, 0)}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Total Records</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">Distribution Breakdown:</h4>
                  {distributedFiles?.map((dist, index) => (
                    <div key={dist._id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                      <span className="text-gray-900 dark:text-white">{getCandidateName(dist.candidate)}</span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">
                        {dist.data.length} records
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Distributed Files List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Download className="h-5 w-5" />
                Distributed Files
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Detailed view of each distributed file segment
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {distributedFiles?.map((distributedFile, index) => (
                  <div key={distributedFile._id} className="border border-gray-200 dark:border-gray-700 rounded-lg transition-colors duration-200">
                    <div 
                      className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => toggleExpanded(distributedFile._id)}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="font-medium text-gray-900 dark:text-white">
                              {getCandidateName(distributedFile.candidate)}
                            </span>
                            {expandedFile === distributedFile._id ? 
                              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" /> : 
                              <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            }
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {distributedFile.candidateEmail}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="font-medium text-gray-900 dark:text-white">Data Records</span>
                          </div>
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm">
                            {distributedFile.data.length} records
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="font-medium text-gray-900 dark:text-white">Distributed By</span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {distributedFile.distributedByEmail}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="font-medium text-gray-900 dark:text-white">Distributed At</span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(distributedFile.time)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded Data View */}
                    {expandedFile === distributedFile._id && (
                      <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
                        <div className="p-4">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Database className="h-4 w-4" />
                            Distributed Data ({distributedFile.data.length} records)
                          </h4>
                          <div className="space-y-3 max-h-96 overflow-y-auto">
                            {distributedFile.data.map((record, recordIndex) => (
                              <div key={record._id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-colors duration-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <User className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                      <span className="font-medium text-gray-900 dark:text-white">Personal Info</span>
                                    </div>
                                    <div className="pl-5 space-y-1">
                                      <div><span className="text-gray-600 dark:text-gray-400">Name:</span> <span className="text-gray-900 dark:text-white font-medium">{record.fullName}</span></div>
                                      <div className="flex items-center gap-1">
                                        <Mail className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-400">Email:</span> 
                                        <span className="text-gray-900 dark:text-white">{record.email}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Phone className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-400">Phone:</span> 
                                        <span className="text-gray-900 dark:text-white">{record.phone}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                      <span className="font-medium text-gray-900 dark:text-white">Address</span>
                                    </div>
                                    <div className="pl-5 text-gray-600 dark:text-gray-400 text-xs">
                                      {record.address}
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <DollarSign className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                      <span className="font-medium text-gray-900 dark:text-white">Donation Details</span>
                                    </div>
                                    <div className="pl-5 space-y-1">
                                      <div>
                                        <span className="text-gray-600 dark:text-gray-400">Amount:</span> 
                                        <span className="text-gray-900 dark:text-white font-medium ml-1">{formatCurrency(record.donation_amount)}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-600 dark:text-gray-400">Date:</span> 
                                        <span className="text-gray-900 dark:text-white ml-1">{record.donation_date}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <CreditCard className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-400">Method:</span> 
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs ml-1">
                                          {record.payment_method}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {record.notes && (
                                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                    <div className="flex items-start gap-2">
                                      <FileText className="h-3 w-3 text-gray-500 dark:text-gray-400 mt-0.5" />
                                      <div>
                                        <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Notes:</span>
                                        <p className="text-gray-900 dark:text-white text-sm mt-1">{record.notes}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400">
                                  Record #{recordIndex + 1} • Created: {formatDate(record.createdAt)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default FileDistributionDashboard;