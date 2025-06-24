"use client"
import React, { useState, useEffect, useRef } from 'react';
import {
  UserPlus,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle,
  Mail,
  User,
  Lock,
  Shield,
  Search,
  X,
  Users
} from 'lucide-react';

const AddCandidatePage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'Candidate',
    managerId: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  
  // Manager search states
  const [managerSearch, setManagerSearch] = useState('');
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [showManagerDropdown, setShowManagerDropdown] = useState(false);
  const [loadingManagers, setLoadingManagers] = useState(false);
  const managerSearchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Search managers
  const searchManagers = async (searchTerm) => {
    if (searchTerm.trim().length < 2) {
      setManagers([]);
      return;
    }

    setLoadingManagers(true);
    try {
      const response = await fetch(`/api/users/manager`);
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setManagers(data.managers || []);
      } else {
        setManagers([]);
      }
    } catch (error) {
      console.error('Error searching managers:', error);
      setManagers([]);
    } finally {
      setLoadingManagers(false);
    }
  };

  // Handle manager search input - simplified
  const handleManagerSearch = (e) => {
    const value = e.target.value;
    setManagerSearch(value);
    setShowManagerDropdown(true);
  };

  // Handle click outside dropdown
  const selectManager = (manager) => {
    setSelectedManager(manager);
    setFormData(prev => ({
      ...prev,
      managerId: manager._id
    }));
    setManagerSearch('');
    setShowManagerDropdown(false);
    setManagers([]);
    
    // Clear manager error if exists
    if (errors.managerId) {
      setErrors(prev => ({
        ...prev,
        managerId: ''
      }));
    }
  };

  // Remove selected manager
  const removeSelectedManager = () => {
    setSelectedManager(null);
    setFormData(prev => ({
      ...prev,
      managerId: ''
    }));
  };

  // Debounce manager search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (managerSearch.trim().length >= 2) {
        searchManagers(managerSearch);
      } else {
        setManagers([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [managerSearch]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          managerSearchRef.current && !managerSearchRef.current.contains(event.target)) {
        setShowManagerDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    if (!formData.managerId) {
      newErrors.managerId = 'Please select a team leader or manager';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setSuccess(false);
    setMessage('');
    
    try {
      const response = await fetch('/api/users/candidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create candidate');
      }
      
      setSuccess(true);
      setMessage('Candidate created successfully!');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        role: 'Candidate',
        managerId: ''
      });
      setSelectedManager(null);
      
    } catch (err) {
      setSuccess(false);
      setMessage(err.message || 'Failed to create candidate');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      role: 'Candidate',
      managerId: ''
    });
    setErrors({});
    setSuccess(false);
    setMessage('');
    setSelectedManager(null);
    setManagerSearch('');
    setManagers([]);
    setShowManagerDropdown(false);
  };

  return (
   <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <UserPlus className="h-8 w-8 text-gray-700 dark:text-gray-300" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Candidate</h1>
                <p className="text-gray-600 dark:text-gray-400">Create a new candidate account in the system</p>
              </div>
            </div>
          </div>

          {/* Success/Error Messages */}
          {message && (
            <div className={`rounded-lg p-4 border ${
              success 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}>
              <div className="flex items-center space-x-2">
                {success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                )}
                <p className={`font-medium ${
                  success 
                    ? 'text-green-800 dark:text-green-200' 
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  {message}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Candidate Information</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Fill in the details below to create a new candidate account
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex flex-col space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Full Name</span>
                        <span className="text-red-500">*</span>
                      </div>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter candidate's full name"
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.fullName 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>Email Address</span>
                        <span className="text-red-500">*</span>
                      </div>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter candidate's email address"
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4" />
                        <span>Password</span>
                        <span className="text-red-500">*</span>
                      </div>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter a secure password"
                        className={`w-full px-3 py-2 pr-10 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.password 
                            ? 'border-red-300 dark:border-red-600' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Password must be at least 8 characters long
                    </p>
                  </div>

                  {/* Role */}
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span>Role</span>
                        <span className="text-red-500">*</span>
                      </div>
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.role 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <option value="Candidate">Candidate</option>
                    </select>
                    {errors.role && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.role}</p>
                    )}
                  </div>
                </div>

                {/* Team Leader/Manager Selection */}
                <div className="flex flex-col space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Team Leader / Manager</span>
                      <span className="text-red-500">*</span>
                    </div>
                  </label>
                  
                  {/* Selected Manager Tag */}
                  {selectedManager && (
                    <div className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex items-center space-x-2 flex-1">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            {selectedManager.fullName}
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            {selectedManager.email}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeSelectedManager}
                        className="p-1 text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Manager Search Input */}
                  {!selectedManager && (
                    <div className="relative" ref={managerSearchRef}>
                      <div className="relative">
                        <input
                          type="text"
                          value={managerSearch}
                          onChange={handleManagerSearch}
                          onFocus={() => setShowManagerDropdown(true)}
                          placeholder="Search for team leader or manager..."
                          className={`w-full px-3 py-2 pl-10 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.managerId 
                              ? 'border-red-300 dark:border-red-600' 
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        {loadingManagers && (
                          <Loader2 className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 animate-spin" />
                        )}
                      </div>

                      {/* Dropdown */}
                      {showManagerDropdown && (managerSearch.length >= 2 || managers.length > 0) && (
                        <div 
                          ref={dropdownRef}
                          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                        >
                          {managers.length === 0 && !loadingManagers && managerSearch.length >= 2 && (
                            <div className="p-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                              No managers found for "{managerSearch}"
                            </div>
                          )}
                          {managers.map((manager) => (
                            <button
                              key={manager._id}
                              type="button"
                              onClick={() => selectManager(manager)}
                              className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-3 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                            >
                              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              </div>
                              <div className="flex flex-col">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {manager.fullName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {manager.email}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {errors.managerId && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.managerId}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Search and select a team leader or manager to assign to this candidate
                  </p>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={loading}
                    className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reset Form
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Creating Candidate...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        <span>Create Candidate</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Additional Information Card */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex flex-col space-y-2">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Important Information
                </h3>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <ul className="list-disc list-inside space-y-1">
                    <li>The candidate will receive login credentials via email after account creation</li>
                    <li>You must assign a team leader or manager to the candidate</li>
                    <li>Use the search field to find and select managers by name or email</li>
                    <li>Password must be at least 8 characters long for security</li>
                    <li>Ensure the email address is valid as it will be used for account verification</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AddCandidatePage;