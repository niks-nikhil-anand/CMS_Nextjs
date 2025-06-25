"use client";
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  IndianRupee,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  Loader2,
  Trash2,
  AlertTriangle,
  TrendingUp,
  History,
  CheckCircle,
} from "lucide-react";

const DonorDetailsPage = () => {
  const [donorId, setDonorId] = useState(null);
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    donation_amount: "",
    donation_date: "",
    payment_method: "",
    notes: "",
  });

  // Delete confirmation
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Mock data for demonstration
  const mockDonor = {
    _id: "685c47d798975cd972b461b5",
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 9876543210",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:45:00Z",
    additionalFields: {
      address: "123 Main Street, Mumbai, Maharashtra 400001",
      donation_amount: 5000,
      donation_date: "2024-01-15",
      payment_method: "UPI",
      notes:
        "Regular donor, prefers digital payments. Very supportive of our cause.",
    },
  };

  // Fetch donor details
  const fetchDonor = async () => {
    if (!donorId) return;

    try {
      setLoading(true);

      // Simulate API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, using mock data
      const donorData = mockDonor;
      setDonor(donorData);

      // Map the form data correctly based on the API response structure
      setFormData({
        fullName: donorData.fullName || "",
        email: donorData.email || "",
        phone: donorData.phone || "",
        address:
          donorData.additionalFields?.address ||
          donorData.allFields?.address ||
          "",
        donation_amount: (
          donorData.additionalFields?.donation_amount ||
          donorData.allFields?.donation_amount ||
          ""
        ).toString(),
        donation_date:
          donorData.additionalFields?.donation_date ||
          donorData.allFields?.donation_date ||
          "",
        payment_method:
          donorData.additionalFields?.payment_method ||
          donorData.allFields?.payment_method ||
          "",
        notes:
          donorData.additionalFields?.notes || donorData.allFields?.notes || "",
      });
      setError("");
    } catch (err) {
      setError("Failed to fetch donor details");
      console.error("Error fetching donor:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update donor
  const handleSave = async () => {
    try {
      setSaving(true);
      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        additionalFields: {
          address: formData.address,
          donation_amount: parseFloat(formData.donation_amount) || 0,
          donation_date: formData.donation_date,
          payment_method: formData.payment_method,
          notes: formData.notes,
        },
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update local state
      setDonor((prev) => ({
        ...prev,
        ...updateData,
        updatedAt: new Date().toISOString(),
      }));

      setEditing(false);
      setError("");
    } catch (err) {
      setError("Failed to update donor");
      console.error("Error updating donor:", err);
    } finally {
      setSaving(false);
    }
  };

  // Delete donor
  const handleDelete = async () => {
    try {
      setDeleting(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate redirect to donors list
      alert("Donor deleted successfully! Redirecting to donors list...");
      setShowDeleteDialog(false);
    } catch (err) {
      setError("Failed to delete donor");
      console.error("Error deleting donor:", err);
    } finally {
      setDeleting(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Get payment method badge classes
  const getPaymentMethodBadgeClasses = (method) => {
    switch (method) {
      case "Credit Card":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Debit Card":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "Bank Transfer":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "UPI":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "PayPal":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
      case "Cash":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Check":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(numAmount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle back navigation
  const handleBack = () => {
    alert("Navigating back to donors list...");
  };

  // Helper function to get nested field value
  const getFieldValue = (field) => {
    if (!donor) return "";
    return donor.additionalFields?.[field] || donor.allFields?.[field] || "";
  };

  useEffect(() => {
    // Extract donorId from URL - for demo purposes, we'll use a mock ID
    const id = "685c47d798975cd972b461b5";
    setDonorId(id);
  }, []);

  useEffect(() => {
    if (donorId) {
      fetchDonor();
    }
  }, [donorId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-400" />
          <span className="text-lg text-gray-700 dark:text-gray-300">
            Loading donor details...
          </span>
        </div>
      </div>
    );
  }

  if (!donor) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Donor not found
          </h2>
          <button
            onClick={handleBack}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Donors
          </button>
        </div>
      </div>
    );
  }

  const donationAmount = parseFloat(getFieldValue("donation_amount")) || 0;
  const donationDate = getFieldValue("donation_date");
  const paymentMethod = getFieldValue("payment_method");
  const address = getFieldValue("address");
  const notes = getFieldValue("notes");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <User className="h-8 w-8 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {editing ? "Edit Donor" : "Donor Details"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {editing
                    ? "Modify donor information"
                    : "View and manage donor information"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {!editing ? (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setEditing(false);
                    // Reset form data to original values
                    setFormData({
                      fullName: donor.fullName || "",
                      email: donor.email || "",
                      phone: donor.phone || "",
                      address: address,
                      donation_amount: donationAmount.toString(),
                      donation_date: donationDate,
                      payment_method: paymentMethod,
                      notes: notes,
                    });
                  }}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 transition-colors"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{saving ? "Saving..." : "Save Changes"}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Donor Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Donation Amount
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(donationAmount)}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Registration Date
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatDate(donor.createdAt)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <History className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Last Updated
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatDate(donor.updatedAt)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Donor Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Donor Information
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {editing
                ? "Edit the donor details below"
                : "Basic information about the donor"}
            </p>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      {donor.fullName}
                    </span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                {editing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      {donor.email}
                    </span>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      {donor.phone}
                    </span>
                  </div>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              {editing ? (
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-start space-x-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                  <span className="text-gray-900 dark:text-white">
                    {address || "No address provided"}
                  </span>
                </div>
              )}
            </div>

            {/* Donation Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Donation Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Donation Amount
                </label>
                {editing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={formData.donation_amount}
                    onChange={(e) =>
                      handleInputChange("donation_amount", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <IndianRupee className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {formatCurrency(donationAmount)}
                    </span>
                  </div>
                )}
              </div>

              {/* Donation Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Donation Date
                </label>
                {editing ? (
                  <input
                    type="date"
                    value={formData.donation_date}
                    onChange={(e) =>
                      handleInputChange("donation_date", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      {formatDate(donationDate)}
                    </span>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Method
                </label>
                {editing ? (
                  <select
                    value={formData.payment_method}
                    onChange={(e) =>
                      handleInputChange("payment_method", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select payment method</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Check">Check</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <CreditCard className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    {paymentMethod ? (
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentMethodBadgeClasses(paymentMethod)}`}
                      >
                        {paymentMethod}
                      </span>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">
                        No payment method specified
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              {editing ? (
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={3}
                  placeholder="Add any notes about this donor..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-start space-x-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                  <span className="text-gray-900 dark:text-white">
                    {notes || "No notes available."}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm w-full p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Confirm Deletion
                </h3>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this donor? This action cannot
                be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 transition-colors"
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />
                  ) : null}
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorDetailsPage;
