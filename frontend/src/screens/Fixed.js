import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MaterialTable from '@material-table/core';
import {
  fetchFIXED,
  deleteFIXED,
  updateFIXED,
  uploadFIXED,
} from "../actions/fixedAction.js";
import { toast } from "react-toastify";
import { Upload, Calendar, X, FileText, Trash2, Loader, Edit3, Plus, AlertTriangle } from "lucide-react";

const Fixed = () => {
  const dispatch = useDispatch();
  const { loading, data, error } = useSelector((state) => state.fixed);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [editData, setEditData] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editValidationError, setEditValidationError] = useState(""); // New state for validation

  // MaterialTable configuration
  const tableIcons = {
    Add: () => <Plus size={18} />,
    Edit: () => <Edit3 size={16} />,
    Delete: () => <Trash2 size={16} />,
    Search: () => <div />, // Hide default search icon
  };

  const headCells = [
    {
      title: 'Name',
      field: 'name',
      cellStyle: {
        fontSize: 13,
        fontWeight: 'bold'
      }
    },
    {
      title: 'Identifier',
      field: 'identifier',
      cellStyle: {
        fontSize: 13
      }
    },
    {
      title: 'Working Days',
      field: 'workingDays',
      type: 'numeric',
      cellStyle: {
        fontSize: 13,
        textAlign: 'center'
      }
    },
    {
      title: 'Leave',
      field: 'leave',
      type: 'numeric',
      cellStyle: {
        fontSize: 13,
        textAlign: 'center'
      }
    },
    {
      title: 'Unpaid Leave',
      field: 'unpaidLeave',
      type: 'numeric',
      cellStyle: {
        fontSize: 13,
        textAlign: 'center'
      }
    },
    {
      title: 'Salary',
      field: 'salary',
      type: 'numeric',
      render: rowData => `₹${rowData.salary ? Number(rowData.salary).toLocaleString('en-IN') : '0'}`,
      cellStyle: {
        fontSize: 13
      }
    },
    {
      title: 'Actions',
      field: 'actions',
      sorting: false,
      render: rowData => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(rowData)}
            className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded"
            title="Edit Record"
            disabled={loading}
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => handleDelete(rowData._id)}
            className="text-red-600 hover:text-red-800 transition-colors p-1 rounded"
            title="Delete Record"
            disabled={loading}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
      cellStyle: {
        fontSize: 13
      }
    }
  ];

  // Helper function to get current month in YYYY-MM format
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  };

  // Generate month options (All Months + current month + last 4 months)
  const getMonthOptions = () => {
    const months = [
      { value: 'all', label: 'All Months' }
    ];
    const currentDate = new Date();

    for (let i = 0; i < 5; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthValue = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthLabel = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
      months.push({ value: monthValue, label: monthLabel });
    }

    return months;
  };

  // Validation function
  const validateTotalDays = (workingDays, leave, unpaidLeave) => {
    const working = parseInt(workingDays) || 0;
    const leaveCount = parseInt(leave) || 0;
    const unpaid = parseInt(unpaidLeave) || 0;
    const total = working + leaveCount + unpaid;
    
    if (total !== 30) {
      return `Total days must equal 30. Current total: ${total} (Working Days: ${working} + Leave: ${leaveCount} + Unpaid Leave: ${unpaid})`;
    }
    return "";
  };

  useEffect(() => {
    // Set "All Months" as default
    setSelectedMonth('all');
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      // If "all" is selected, fetch data without month filter
      if (selectedMonth === 'all') {
        dispatch(fetchFIXED()); // Call without month parameter to get all data
      } else {
        dispatch(fetchFIXED(selectedMonth));
      }
    }
  }, [dispatch, selectedMonth]);

  // Validation effect for edit form
  useEffect(() => {
    if (editData) {
      const error = validateTotalDays(editData.workingDays, editData.leave, editData.unpaidLeave);
      setEditValidationError(error);
    }
  }, [editData]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleImportClick = () => {
    setShowImportModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }
    try {
      await dispatch(deleteFIXED(id));
      toast.success("Deleted successfully");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (item) => {
    setEditData(item);
    setEditValidationError(""); // Reset validation error
  };

  const handleUpdate = async () => {
    // Check validation before updating
    const validationError = validateTotalDays(editData.workingDays, editData.leave, editData.unpaidLeave);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      await dispatch(updateFIXED(editData));
      toast.success("Updated successfully");
      setEditData(null);
      setEditValidationError("");
    } catch (error) {
      toast.error(error.message || "Update failed");
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file.");
      return;
    }

    // For upload, we need a specific month, not "all"
    let uploadMonth = selectedMonth;
    if (selectedMonth === 'all') {
      // If "All Months" is selected, default to current month for upload
      uploadMonth = getCurrentMonth();
    }

    const progressCleanup = simulateProgress();
    try {
      console.log('Starting upload...');
      await dispatch(uploadFIXED(selectedFile, uploadMonth));
      setUploadProgress(100);
      toast.success("File uploaded successfully");
      setShowImportModal(false);
      setSelectedFile(null);
    } catch (error) {
      console.log('Upload error caught:', error.message);
      // Show toast error message
      toast.error(error.message || "File upload failed", {
        autoClose: 8000, // Show longer for validation errors
        position: "top-right"
      });
    } finally {
      progressCleanup();
      setTimeout(() => setUploadProgress(0), 500);
    }
  };

  const handleCancelUpload = () => {
    setShowImportModal(false);
    setSelectedFile(null);
    setUploadProgress(0);
  };

  // Filter data based on search term
  const filteredData = data?.filter(
    (item) =>
      item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.identifier?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Format month for display
  const formatMonthDisplay = (monthStr) => {
    if (!monthStr) return "";
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
    });
  };

  console.log(filteredData);

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 min-h-screen py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl mx-auto border border-gray-200">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="h-8 w-1 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full mr-3"></div>
            <h1 className="text-2xl font-bold text-gray-800">Fixed</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              {filteredData.length}{" "}
              {filteredData.length === 1 ? "Record" : "Records"} Available
            </div>
            <button
              onClick={handleImportClick}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
              disabled={loading}
            >
              <Upload size={18} />
              Import Fixed Data
            </button>
          </div>
        </div>

        {/* Month Filter */}
        <div className="mb-6">
          <div className="relative w-full md:w-48">
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm w-full"
              disabled={loading}
            >
              <option value="">Select Month</option>
              {getMonthOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Calendar
              size={18}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
        </div>

        {/* MaterialTable */}
        <div className="mt-6">
          <MaterialTable
            icons={tableIcons}
            title={''}
            columns={headCells}
            data={filteredData}
            isLoading={loading}
            options={{
              exportButton: false,
              search: true,
              exportAllData: false,
              rowStyle: {
                height: '60px',
                fontSize: 13,
              },
              paging: true,
              pageSize: 10,
              emptyRowsWhenPaging: false,
              pageSizeOptions: [10, 20, 50],
              headerStyle: {
                position: 'sticky',
                top: '0',
                fontWeight: 'bold',
                fontSize: 13,
                background: 'linear-gradient(to right, #f9fafb, #f3f4f6)',
              },
              searchFieldStyle: {
                fontSize: 13,
              },
              toolbar: true,
              showTitle: false,
              actionsColumnIndex: -1,
              searchAutoFocus: false,
              searchFieldAlignment: 'left',
            }}
            onSearchChange={(searchText) => {
              setSearchTerm(searchText || '');
            }}
            localization={{
              body: {
                emptyDataSourceMessage: (
                  <div className="flex flex-col items-center text-gray-500 py-8">
                    <FileText size={40} className="mb-3 text-gray-300" />
                    <p className="text-lg font-medium mb-1">
                      {data?.length === 0
                        ? "No fixed records found"
                        : "No matching records found"}
                    </p>
                    <p className="text-sm text-gray-400">
                      {data?.length === 0
                        ? "Upload an Excel file to import fixed data"
                        : "Try adjusting your search terms"}
                    </p>
                  </div>
                ),
              },
              toolbar: {
                searchPlaceholder: "Search by worker or identifier..."
              }
            }}
          />
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-2xl">
            <div className="relative mb-6">
              <div className="absolute top-0 left-0 w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full -ml-4"></div>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">
                  Import Fixed Data
                </h3>
                <button
                  onClick={handleCancelUpload}
                  className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="h-0.5 w-full bg-gradient-to-r from-indigo-500 to-purple-600 mt-3 rounded-full"></div>
            </div>

            {/* Validation Notice */}
            <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start text-sm text-yellow-800">
                <AlertTriangle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Important:</span> Each row must have Working Days + Leave + Unpaid Leave = 30 days total.
                </div>
              </div>
            </div>

            {/* Show selected month info */}
            <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="flex items-center text-sm text-indigo-700">
                <Calendar size={16} className="mr-2" />
                <span className="font-medium">
                  Importing for:{" "}
                  {selectedMonth === 'all'
                    ? getCurrentMonth() && getMonthOptions().find((m) => m.value === getCurrentMonth())?.label
                    : getMonthOptions().find((m) => m.value === selectedMonth)?.label}
                </span>
              </div>
              {selectedMonth === 'all' && (
                <div className="text-xs text-indigo-600 mt-1">
                  Note: File will be uploaded for current month when "All Months" is selected
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Excel File
              </label>

              {!selectedFile ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                  onClick={() => document.getElementById("file-input").click()}
                >
                  <Upload size={40} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    <span className="text-indigo-600 font-semibold">
                      Click to browse
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supports Excel files (.xlsx, .xls)
                  </p>
                  <input
                    id="file-input"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg p-4 bg-indigo-50">
                  <div className="flex items-center">
                    <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md text-white mr-3">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 truncate">
                      <p className="font-medium text-gray-700 truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        document.getElementById("file-input").value = "";
                      }}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {loading && (
              <div className="mb-6">
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelUpload}
                className="px-5 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || loading}
                className={`px-5 py-2.5 rounded-md text-sm font-medium shadow-md transition-all ${!selectedFile || loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:-translate-y-0.5"
                  } flex items-center`}
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">
                      <Loader size={18} />
                    </span>
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload size={18} className="mr-2" />
                    Upload File
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-6 text-center">
              Make sure your Excel file follows the required format.
              <a href="#" className="text-indigo-500 hover:underline ml-1">
                View sample template
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editData && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <div className="relative mb-6">
              <div className="absolute top-0 left-0 w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full -ml-4"></div>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Edit Fixed Record</h2>
                <button
                  onClick={() => {
                    setEditData(null);
                    setEditValidationError("");
                  }}
                  className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="h-0.5 w-full bg-gradient-to-r from-indigo-500 to-purple-600 mt-3 rounded-full"></div>
            </div>

            {/* Validation Error Display */}
            {editValidationError && (
              <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-start text-sm text-red-800">
                  <AlertTriangle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>{editValidationError}</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <input
                type="text"
                value={editData.name || ''}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Name"
              />
              <input
                type="text"
                value={editData.identifier || ''}
                onChange={(e) =>
                  setEditData({ ...editData, identifier: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Identifier"
              />
              <input
                type="number"
                value={editData.workingDays || ''}
                onChange={(e) =>
                  setEditData({ ...editData, workingDays: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  editValidationError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Working Days"
                min="0"
                max="30"
              />
              <input
                type="number"
                value={editData.leave || ''}
                onChange={(e) =>
                  setEditData({ ...editData, leave: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  editValidationError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Leave"
                min="0"
                max="30"
              />
              <input
                type="number"
                value={editData.unpaidLeave || ''}
                onChange={(e) =>
                  setEditData({ ...editData, unpaidLeave: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  editValidationError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Unpaid Leave"
                min="0"
                max="30"
              />
              <input
                type="number"
                value={editData.salary || ''}
                onChange={(e) =>
                  setEditData({ ...editData, salary: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Salary"
                readOnly
                title="Salary is automatically calculated"
              />
              
              {/* Total Days Display */}
              <div className="p-3 bg-gray-50 rounded-lg border">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Total Days: </span>
                  <span className={editValidationError ? 'text-red-600 font-semibold' : 'text-gray-800'}>
                    {(parseInt(editData.workingDays) || 0) + (parseInt(editData.leave) || 0) + (parseInt(editData.unpaidLeave) || 0)} / 30
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => {
                  setEditData(null);
                  setEditValidationError("");
                }}
                className="px-5 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className={`px-5 py-2.5 rounded-md text-sm font-medium shadow-md transition-all flex items-center ${
                  editValidationError || loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:-translate-y-0.5"
                }`}
                disabled={loading || !!editValidationError}
              >
                <Edit3 size={16} className="mr-2" />
                {loading ? "Updating..." : "Update Record"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fixed;