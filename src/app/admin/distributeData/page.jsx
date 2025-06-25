"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Users,
  Settings,
  CheckCircle,
  Search,
  X,
  User,
  FileSpreadsheet,
  Download,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import axios from "axios";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const slideIn = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

const DataDistributionApp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [managerSearch, setManagerSearch] = useState("");
  const [candidateSearch, setCandidateSearch] = useState("");
  const [distributionMethod, setDistributionMethod] = useState("");
  const [isDistributing, setIsDistributing] = useState(false);
  const [distributionComplete, setDistributionComplete] = useState(false);
  const [loadingManagers, setLoadingManagers] = useState(false);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [distributionProgress, setDistributionProgress] = useState(0);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    const mb = bytes / 1024 / 1024;
    return mb < 1 ? (bytes / 1024).toFixed(2) + " KB" : mb.toFixed(2) + " MB";
  };

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    setError("");

    if (file) {
      const validTypes = [".xlsx", ".xls", ".csv"];
      const fileExtension = "." + file.name.split(".").pop().toLowerCase();

      if (validTypes.includes(fileExtension)) {
        setSelectedFile(file);
        console.log(file);
        setFileInfo({
          name: file.name,
          size: formatFileSize(file.size),
          type:
            file.type ||
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          rows: Math.floor(Math.random() * 5000) + 1000,
          columns: Math.floor(Math.random() * 25) + 8,
        });
      } else {
        setError("Please upload a valid Excel (.xlsx, .xls) or CSV file.");
      }
    }
  }, []);

  // Mock API functions
  const fetchManagers = async () => {
    try {
      const response = await axios.get("/api/users/manager");
      return response.data?.managers || [];
    } catch (error) {
      console.error("Failed to fetch managers:", error);
      throw new Error("Error fetching managers");
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const loadManagers = async () => {
    setLoadingManagers(true);
    setError("");
    try {
      const managerData = await fetchManagers();
      console.log("Fetched managers:", managerData);
      setManagers(managerData);
    } catch (error) {
      setError("Failed to load managers. Please try again.");
      console.error("Error loading managers:", error);
    }
    setLoadingManagers(false);
  };

  const handleManagerSelect = (manager) => {
    if (selectedManager?._id !== manager._id) {
      setSelectedManager(manager);
      setCandidates(manager.candidates || []); // <-- Extract directly
      setCandidateSearch("");
      setSelectedCandidates([]); // Reset selections
    }
  };

  const toggleCandidateSelection = (candidate) => {
    setSelectedCandidates((prev) =>
      prev.find((c) => c._id === candidate._id)
        ? prev.filter((c) => c._id !== candidate._id)
        : [...prev, candidate]
    );
  };

  const selectAllCandidates = () => {
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates([...filteredCandidates]);
    }
  };

  const handleDistribution = async () => {
    setIsDistributing(true);
    setDistributionProgress(0);

    // Simulate distribution process with progress
    const steps = [
      { progress: 20, message: "Analyzing data structure..." },
      { progress: 40, message: "Preparing distribution..." },
      { progress: 60, message: "Distributing to candidates..." },
      { progress: 80, message: "Generating reports..." },
      { progress: 100, message: "Distribution complete!" },
    ];

    for (let step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setDistributionProgress(step.progress);
    }

    setIsDistributing(false);
    setDistributionComplete(true);
  };

  const nextStep = () => {
    setError("");
    if (currentStep === 1 && selectedFile) {
      setCurrentStep(2);
      loadManagers();
    } else if (
      currentStep === 2 &&
      selectedManager &&
      selectedCandidates.length > 0
    ) {
      setCurrentStep(3);
    } else if (currentStep === 3 && distributionMethod) {
      setCurrentStep(4);
      handleDistribution();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError("");
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedFile !== null;
      case 2:
        return selectedManager && selectedCandidates.length > 0;
      case 3:
        return distributionMethod !== "";
      default:
        return false;
    }
  };

  const filteredManagers = managers.filter(
    (manager) =>
      manager.fullName.toLowerCase().includes(managerSearch.toLowerCase()) ||
      manager.email.toLowerCase().includes(managerSearch.toLowerCase())
  );

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.fullName
        .toLowerCase()
        .includes(candidateSearch.toLowerCase()) ||
      candidate.role.toLowerCase().includes(candidateSearch.toLowerCase())
  );

  const getStepIcon = (step) => {
    switch (step) {
      case 1:
        return <Upload className="w-5 h-5" />;
      case 2:
        return <Users className="w-5 h-5" />;
      case 3:
        return <Settings className="w-5 h-5" />;
      case 4:
        return <CheckCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedFile(null);
    setFileInfo(null);
    setSelectedManager(null);
    setSelectedCandidates([]);
    setDistributionMethod("");
    setDistributionComplete(false);
    setDistributionProgress(0);
    setManagers([]);
    setCandidates([]);
    setManagerSearch("");
    setCandidateSearch("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadReport = () => {
    if (!fileInfo || !selectedManager || selectedCandidates.length === 0)
      return;

    const reportData = {
      fileName: fileInfo?.name,
      manager: selectedManager?.fullName || selectedManager?.name,
      candidates: selectedCandidates.map((c) => c.fullName || c.name),
      method: distributionMethod,
      totalRows: fileInfo?.rows,
      distributionDate: new Date().toLocaleString(),
    };

    const fileName = `distribution-report-${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}.json`;

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    try {
      console.log("Preparing data for submission...");

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("managerId", selectedManager._id);
      formData.append(
        "candidateIds",
        JSON.stringify(selectedCandidates.map((c) => c._id))
      );
      formData.append("distributionMethod", distributionMethod);

      console.log("Form Data:");
      console.log("File:", selectedFile?.name);
      console.log("Manager ID:", selectedManager?._id);
      console.log(
        "Candidate IDs:",
        selectedCandidates.map((c) => c._id)
      );
      console.log("Distribution Method:", distributionMethod);

      const response = await axios.post("/api/distribute-data", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Distribution successful:", response.data);
      resetForm();
    } catch (error) {
      console.error("❌ Distribution failed:", error);
      setError("Failed to distribute data. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full  mx-auto px-4 sm:px-6  py-8">
        <div className="w-full space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 rounded-2xl shadow-lg bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300">
                <FileText className="h-8 w-8 text-white dark:text-gray-800" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Data Distribution System
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Upload your data files and distribute them efficiently among
                  your team members
                </p>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-red-50 border border-red-200 rounded-xl p-4"
            >
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Progress Steps */}
          <div className="w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {[1, 2, 3, 4].map((step, index) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`
              flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-500 mb-3
              ${
                currentStep >= step
                  ? "bg-gray-900 dark:bg-white border-gray-900 dark:border-white text-white dark:text-gray-900 shadow-lg"
                  : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-400"
              }
            `}
                    >
                      {getStepIcon(step)}
                    </div>
                    <span
                      className={`
              text-sm font-semibold transition-all duration-300 text-center
              ${
                currentStep >= step
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-400 dark:text-gray-400"
              }
            `}
                    >
                      {
                        [
                          "Upload File",
                          "Select Team",
                          "Distribution",
                          "Complete",
                        ][step - 1]
                      }
                    </span>
                  </div>
                  {index < 3 && (
                    <div
                      className={`
              flex-1 h-0.5 mx-4 transition-all duration-500
              ${
                currentStep > step
                  ? "bg-gray-900 dark:bg-white"
                  : "bg-gray-300 dark:bg-gray-600"
              }
            `}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={fadeIn}
                  className="w-full  mx-auto"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors shadow-lg">
                    <div className="p-16 text-center">
                      <div className="mb-10">
                        <div className="w-24 h-24 mx-auto mb-8 p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl">
                          <FileText className="w-full h-full text-gray-600" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                          Upload Your Data File
                        </h3>
                        <p className="text-gray-900 dark:text-white text-xl">
                          Supports Excel (.xlsx, .xls) and CSV file formats
                        </p>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        onClick={handleFileButtonClick}
                        className="mb-8 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <Upload className="w-6 h-6 mr-3 inline" />
                        Choose File
                      </button>

                      {selectedFile && fileInfo && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-10 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
                        >
                          <div className="flex items-center justify-center mb-6">
                            <FileSpreadsheet className="w-8 h-8 text-gray-700 dark:text-gray-300 mr-4" />
                            <span className="font-bold text-gray-900 dark:text-white text-2xl">
                              {fileInfo.name}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-700 dark:text-gray-300">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                {fileInfo.size}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                File Size
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                {fileInfo.rows.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Total Rows
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                {fileInfo.columns}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Columns
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                {fileInfo.name.split(".").pop().toUpperCase()}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Format
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={fadeIn}
                  className="w-full space-y-8"
                >
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Manager Selection */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
                      <div className="border-b border-gray-100 dark:border-gray-700 p-6">
                        <h3 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
                          <User className="w-7 h-7 mr-3" />
                          Select Manager
                        </h3>
                      </div>
                      <div className="p-6">
                        <div className="space-y-6">
                          <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                            <input
                              placeholder="Search managers..."
                              value={managerSearch}
                              onChange={(e) => setManagerSearch(e.target.value)}
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            />
                          </div>

                          {loadingManagers ? (
                            <div className="space-y-4">
                              {[1, 2, 3].map((i) => (
                                <div
                                  key={i}
                                  className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                              {filteredManagers.map((manager) => {
                                const isSelected =
                                  selectedManager?._id === manager._id ||
                                  selectedManager?.id === manager.id;

                                return (
                                  <div
                                    key={manager._id || manager.id}
                                    onClick={() => handleManagerSelect(manager)}
                                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                      isSelected
                                        ? "border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800 shadow-md"
                                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    }`}
                                  >
                                    <div className="flex justify-between items-center">
                                      <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                                          {manager.fullName}
                                        </h4>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                                          {manager.email}
                                        </p>
                                      </div>
                                      <div className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-lg text-sm font-medium">
                                        {manager.candidates?.length || 0}{" "}
                                        candidates
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Candidate Selection */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
                      <div className="border-b border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                          <h3 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
                            <Users className="w-7 h-7 mr-3" />
                            Select Candidates
                          </h3>
                          {selectedCandidates.length > 0 && (
                            <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-1 rounded-lg text-sm font-medium">
                              {selectedCandidates.length} selected
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-6">
                        {selectedManager ? (
                          <div className="space-y-6">
                            <div className="flex space-x-3">
                              <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                                <input
                                  placeholder="Search candidates..."
                                  value={candidateSearch}
                                  onChange={(e) =>
                                    setCandidateSearch(e.target.value)
                                  }
                                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                />
                              </div>
                              <button
                                onClick={selectAllCandidates}
                                className="px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl transition-colors font-medium"
                              >
                                {selectedCandidates.length ===
                                filteredCandidates.length
                                  ? "Deselect All"
                                  : "Select All"}
                              </button>
                            </div>

                            {loadingCandidates ? (
                              <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                  <div
                                    key={i}
                                    className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
                                  />
                                ))}
                              </div>
                            ) : (
                              <div className="space-y-3 max-h-96 overflow-y-auto">
                                {filteredCandidates.map((candidate) => {
                                  const isSelected = selectedCandidates.some(
                                    (c) => c._id === candidate._id
                                  );
                                  return (
                                    <div
                                      key={candidate._id}
                                      onClick={() =>
                                        toggleCandidateSelection(candidate)
                                      }
                                      className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                        isSelected
                                          ? "border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-800 shadow-md"
                                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                                      }`}
                                    >
                                      <div className="flex justify-between items-center">
                                        <div>
                                          <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                                            {candidate.fullName}
                                          </h4>
                                          <p className="text-gray-600 dark:text-gray-400">
                                            {candidate.role}
                                          </p>
                                          <p className="text-gray-500 dark:text-gray-500 text-sm">
                                            {candidate.email}
                                          </p>
                                        </div>
                                        <div className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-lg text-sm">
                                          {candidate.experience || "—"}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                            <Users className="w-20 h-20 mx-auto mb-6 text-gray-300 dark:text-gray-600" />
                            <p className="text-xl">
                              Please select a manager first
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Selected Items Summary */}
                  {(selectedManager || selectedCandidates.length > 0) && (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
                      <div className="border-b border-gray-100 dark:border-gray-700 p-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          Selection Summary
                        </h3>
                      </div>
                      <div className="p-6">
                        <div className="space-y-8">
                          {selectedManager && (
                            <div>
                              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-lg">
                                Manager:
                              </h4>
                              <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-4 py-3 rounded-xl inline-flex items-center">
                                <User className="w-5 h-5 mr-2" />
                                {selectedManager.fullName} –{" "}
                                {selectedManager.email}
                              </div>
                            </div>
                          )}

                          {selectedCandidates.length > 0 && (
                            <div>
                              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-lg">
                                Candidates ({selectedCandidates.length}):
                              </h4>
                              <div className="flex flex-wrap gap-3">
                                {selectedCandidates.map((candidate) => (
                                  <div
                                    key={candidate._id}
                                    className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                  >
                                    <span>{candidate.fullName}</span>
                                    <X
                                      className="w-4 h-4 cursor-pointer hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCandidateSelection(candidate);
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Distribution Method */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={fadeIn}
                  className="w-full max-w-2xl mx-auto space-y-8"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Choose a Distribution Method
                    </h3>
                    <div className="grid gap-6">
                      {["Random", "Equally"].map((method) => (
                        <div
                          key={method}
                          onClick={() =>
                            setDistributionMethod(method.toLowerCase())
                          }
                          className={`
              p-6 rounded-xl border-2 cursor-pointer transition-all
              ${
                distributionMethod === method.toLowerCase()
                  ? "border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-700 shadow-md"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
              }
            `}
                        >
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {method} Distribution
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                            {method === "Random" &&
                              "Each candidate is assigned a random portion of the data. Ideal for unbiased distribution when no specific criteria are needed."}
                            {method === "Equally" &&
                              "Data is divided evenly among all selected candidates. Perfect for ensuring balanced workloads."}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Completion */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={slideIn}
                  className="w-full max-w-2xl mx-auto space-y-8"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8 text-center">
                    {!distributionComplete ? (
                      <>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                          Distributing Data...
                        </h3>
                        <div className="w-full h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
                          <div
                            className="h-full bg-gray-900 dark:bg-white transition-all duration-500"
                            style={{ width: `${distributionProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Processing, please wait...
                        </p>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                          Distribution Complete!
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                          Your data has been successfully distributed to the
                          selected candidates.
                        </p>
                        <div className="flex justify-center gap-4 flex-wrap">
                          <button
                            onClick={downloadReport}
                            className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium flex items-center gap-2 transition-colors"
                          >
                            <Download className="w-5 h-5" />
                            Download Report
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12  mx-auto">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            {currentStep === 4 ? (
              <button
                onClick={() => {
                  handleDistribution();
                  handleSubmit();
                }}
                disabled={isDistributing}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isDistributing ? "Distributing..." : "Distribute Data"}
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={!canProceed() || isDistributing}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataDistributionApp;
