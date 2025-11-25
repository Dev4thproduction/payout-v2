import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MaterialTable from '@material-table/core';
import {
  fetchUsers,
  fetchVerifications,
  fetchPayouts,
  savePayout,
  deletePayout
} from "../actions/verificationActions.js";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Briefcase,
  MapPin,
  FileText,
  ClipboardList,
  User,
  Calendar,
  ChevronDown,
} from "lucide-react";

const Verification = () => {
  const dispatch = useDispatch();
  const { users, verifications, payouts, loading, error } = useSelector(
    (state) => state.verification
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [verification, setVerification] = useState("");
  const [month, setMonth] = useState("");
  const [numCases, setNumCases] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // MaterialTable configuration
  const tableIcons = {
    Add: () => <Plus size={18} />,
    Edit: () => <Edit size={16} />,
    Delete: () => <Trash2 size={16} />,
    Search: () => <div />, // Hide default search icon
  };

  // Calculate salary based on numCases and price
  const calculateSalary = (numCases, price) => {
    if (!numCases || !price) return "";
    return (Number(numCases) * Number(price)).toString();
  };

  // Format month display
  const formatMonth = (monthValue) => {
    if (!monthValue) return "N/A";
    
    try {
      const dateStr = monthValue.includes('-01') ? monthValue : monthValue + "-01";
      const date = new Date(dateStr);
      
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
    } catch (error) {
      console.error("Error formatting month:", monthValue, error);
      return "N/A";
    }
  };

  const headCells = [
    {
      title: 'Month',
      field: 'month',
      render: rowData => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {formatMonth(rowData.month)}
        </span>
      ),
      cellStyle: {
        fontSize: 13,
        minWidth: 120
      }
    },
    {
      title: 'Name',
      field: 'name',
      cellStyle: {
        fontSize: 13,
        fontWeight: 'bold'
      }
    },
    {
      title: 'Process',
      field: 'process',
      render: rowData => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {rowData.verification && rowData.verification.process
            ? `${rowData.verification.process.client.name} - ${rowData.verification.process.product.name}`
            : "N/A"}
        </span>
      ),
      cellStyle: {
        fontSize: 13,
        minWidth: 200
      }
    },
    {
      title: 'Cases',
      field: 'numCases',
      type: 'numeric',
      cellStyle: {
        fontSize: 13,
        textAlign: 'center'
      }
    },
    {
      title: 'Location',
      field: 'location',
      render: rowData => rowData.verification ? rowData.verification.location : "N/A",
      cellStyle: {
        fontSize: 13
      }
    },
    {
      title: 'Price',
      field: 'price',
      render: rowData => (
        <span className="font-medium">
          ₹{rowData.verification ? rowData.verification.price : "N/A"}
        </span>
      ),
      cellStyle: {
        fontSize: 13
      }
    },
    {
      title: 'Salary',
      field: 'salary',
      render: rowData => (
        <span className="font-medium text-green-600">
          ₹{rowData.verification && rowData.verification.price
            ? calculateSalary(rowData.numCases, rowData.verification.price)
            : "N/A"}
        </span>
      ),
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
            onClick={() => handleEditClick(rowData)}
            className="text-indigo-600 hover:text-indigo-800 transition-colors p-1 rounded"
            title="Edit Case"
            disabled={loading}
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(rowData._id)}
            className="text-red-600 hover:text-red-800 transition-colors p-1 rounded"
            title="Delete Case"
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

  // Generate last 4 months options
  const generateMonthOptions = () => {
    const months = [];
    const today = new Date();
    
    for (let i = 0; i < 4; i++) {
      const year = today.getFullYear();
      const month = today.getMonth() - i;
      
      const date = new Date(year, month, 1);
      
      const monthYear = date.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
      
      const monthValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      months.push({
        label: monthYear,
        value: monthValue
      });
    }
    
    return months;
  };

  const monthOptions = generateMonthOptions();

  const resetForm = () => {
    setName("");
    setVerification("");
    setMonth("");
    setNumCases("");
    setLocation("");
    setPrice("");
  };

  const openAddModal = () => {
    resetForm();
    setIsEditing(false);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (item) => {
    setIsEditing(true);
    setEditingId(item._id);
    setName(item.name);
    setVerification(item.verification._id);
    setMonth(item.month || "");
    setNumCases(item.numCases);
    setLocation(item.verification.location || "");
    setPrice(item.verification.price || "");
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this case?")) {
      try {
        await dispatch(deletePayout(id)).unwrap();
        // Success feedback could be added here
      } catch (error) {
        console.error("Error deleting case:", error);
        // Error feedback could be added here
      }
    }
  };

  // Filter cases based on search term and selected month
  const filteredCases = payouts.filter((item) => {
    const matchesSearch = 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.verification?.process?.name &&
        item.verification.process.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));
    
    const matchesMonth = selectedMonth === "" || item.month === selectedMonth;
    
    return matchesSearch && matchesMonth;
  });

  // Load all data on component mount
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchVerifications());
    dispatch(fetchPayouts());
  }, [dispatch]);

  const handleVerificationChange = (value) => {
    setVerification(value);

    const selectedVerification = verifications.find((v) => v._id === value);
    if (selectedVerification) {
      setLocation(selectedVerification.location || "");
      setPrice(selectedVerification.price || "");
    } else {
      setLocation("");
      setPrice("");
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name,
        verification,
        month,
        numCases: Number(numCases),
      };

      await dispatch(savePayout({ 
        payload, 
        isEditing, 
        id: editingId 
      }));

      // Refresh the payouts list
      dispatch(fetchPayouts());
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving case:", error);
      // Error feedback could be added here
    }
  };

  // Show loading state
  if (loading && payouts.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error loading data</p>
          <p className="mt-2">{error}</p>
          <button 
            onClick={() => {
              dispatch(fetchUsers());
              dispatch(fetchVerifications());
              dispatch(fetchPayouts());
            }}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Payout Verification
          </h2>
          <div className="flex items-center gap-4">
            {/* <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
              {filteredCases.length} Active Cases
            </span> */}
            <button
              onClick={openAddModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2"
              disabled={loading}
            >
              <Plus size={18} />
              Add New Case
            </button>
          </div>
        </div>

        {/* Month Filter Dropdown */}
        <div className="mb-6">
          <div className="relative w-full md:w-48">
            <button
              onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg hover:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
            >
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-gray-400" />
                <span className="text-gray-700">
                  {selectedMonth 
                    ? formatMonth(selectedMonth)
                    : "All Months"}
                </span>
              </div>
              <ChevronDown 
                size={16} 
                className={`text-gray-400 transition-transform ${
                  isMonthDropdownOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>
            
            {isMonthDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setSelectedMonth("");
                    setIsMonthDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors border-b border-gray-100"
                >
                  All Months
                </button>
                {monthOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedMonth(option.value);
                      setIsMonthDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MaterialTable */}
        <div className="mt-6">
          <MaterialTable
            icons={tableIcons}
            title={''}
            columns={headCells}
            data={filteredCases}
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
                backgroundColor: '#f9fafb',
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
                  <div className="flex flex-col items-center justify-center py-8">
                    <ClipboardList size={32} className="text-gray-400 mb-2" />
                    <p className="text-gray-500 font-medium">No cases found</p>
                    <p className="text-gray-400 text-sm">
                      Try adjusting your search or add a new case
                    </p>
                  </div>
                ),
              },
              toolbar: {
                searchPlaceholder: "Search by name or process..."
              }
            }}
          />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {isEditing ? "Edit Case" : "Add New Case"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Name Dropdown */}
              <div className="relative">
                <User
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <select
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 w-full py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user._id} value={user.name}>
                      {user.name} 
                    </option>
                  ))}
                </select>
              </div>

              {/* Process Dropdown */}
              <div className="relative">
                <FileText
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <select
                  value={verification}
                  onChange={(e) => handleVerificationChange(e.target.value)}
                  className="pl-10 w-full py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  <option value="">Select Process</option>
                  {verifications.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.process && v.process.client && v.process.product
                        ? `${v.process.client.name} - ${
                            v.process.product.name
                          } (${v.location || "No Location"})`
                        : "Unknown Process"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month Dropdown */}
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="pl-10 w-full py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  <option value="">Select Month</option>
                  {monthOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of Cases */}
              <div className="relative">
                <ClipboardList
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="number"
                  placeholder="Number of Cases"
                  value={numCases}
                  onChange={(e) => setNumCases(e.target.value)}
                  className="pl-10 w-full py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                />
              </div>

              {/* Location (disabled) */}
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  disabled
                  className="pl-10 w-full py-2 border border-gray-300 rounded bg-gray-50 text-gray-600 focus:outline-none"
                />
              </div>

              {/* Price (disabled) */}
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-400 text-lg">
                  ₹
                </span>
                <input
                  type="text"
                  placeholder="Price"
                  value={price}
                  disabled
                  className="pl-10 w-full py-2 border border-gray-300 rounded bg-gray-50 text-gray-600 focus:outline-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading 
                  ? "Processing..." 
                  : isEditing 
                    ? "Update Case" 
                    : "Add Case"
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verification;