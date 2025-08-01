"use client"
import React, { useState } from 'react';
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
  Users
} from 'lucide-react';

const AddManagerPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'Manager'
  });
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

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
      // Simulate API call since we don't have a real endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success response
      setSuccess(true);
      setMessage('Manager created successfully!');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        role: 'Manager'
      });
      
    } catch (err) {
      setSuccess(false);
      setMessage(err.message || 'Failed to create manager');
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
      role: 'Manager'
    });
    setErrors({});
    setSuccess(false);
    setMessage('');
  };

  return (
   <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <Users className="h-8 w-8 text-gray-700 dark:text-gray-300" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Manager/Admin</h1>
                <p className="text-gray-600 dark:text-gray-400">Create a new manager or admin account in the system</p>
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
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Manager Information</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Fill in the details below to create a new manager account
              </p>
            </div>
            
            <form className="p-6">
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
                      placeholder="Enter manager's full name"
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
                      placeholder="Enter manager's email address"
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
                      <option value="Manager">Manager</option>
                      <option value="SuperAdmin">Super Admin</option>
                    </select>
                    {errors.role && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.role}</p>
                    )}
                  </div>
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
                        <span>Creating Manager...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        <span>Create Manager</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddManagerPage;