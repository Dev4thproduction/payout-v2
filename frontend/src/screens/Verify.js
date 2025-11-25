import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Edit, Trash2 } from "lucide-react";
import MaterialTable from '@material-table/core';
import {
  fetchProcesses,
  fetchVerifications,
  submitVerification,
  deleteVerification,
  setProcess,
  setLocation,
  setPrice,
  setModalOpen,
  setEditingId,
  setSearchTerm,
} from "../actions/verifyActions";

const Verify = () => {
  const dispatch = useDispatch();
  const {
    processes,
    verifications,
    process,
    location,
    price,
    isModalOpen,
    editingId,
    searchTerm,
    loading,
    error,
    success,
  } = useSelector((state) => state.verify);

  // MaterialTable configuration
  const tableIcons = {
    Add: () => <Plus size={18} />,
    Edit: () => <Edit size={16} />,
    Delete: () => <Trash2 size={16} />,
    Search: () => <div />, // Hide default search icon
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const headCells = [
    {
      title: 'Process',
      field: 'process',
      render: rowData => (
        <span className="font-medium">
          {rowData.process?.client?.name || "Unknown"} - {rowData.process?.product?.name || "Unknown"}
        </span>
      ),
      cellStyle: {
        fontSize: 13,
        minWidth: 250
      }
    },
    {
      title: 'Location',
      field: 'location',
      render: rowData => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {rowData.location}
        </span>
      ),
      cellStyle: {
        fontSize: 13
      }
    },
    {
      title: 'Price',
      field: 'price',
      render: rowData => (
        <span className="font-medium text-green-600">
          {formatPrice(rowData.price)}
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
            onClick={() => handleEdit(rowData)}
            className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded"
            title="Edit Verification"
            disabled={loading}
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(rowData._id)}
            className="text-red-600 hover:text-red-800 transition-colors p-1 rounded"
            title="Delete Verification"
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

  useEffect(() => {
    dispatch(fetchProcesses());
    dispatch(fetchVerifications());
  }, [dispatch]);

  const handleSubmit = () => {
    if (!process || !location || !price) return;
    dispatch(submitVerification(editingId, process, location, price));
  };

  const handleEdit = (verification) => {
    dispatch(setEditingId(verification._id));
    dispatch(setProcess(verification.process?._id || ""));
    dispatch(setLocation(verification.location || ""));
    dispatch(setPrice(verification.price || ""));
    dispatch(setModalOpen(true));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this verification?")) {
      dispatch(deleteVerification(id));
    }
  };

  const handleOpenModal = () => {
    dispatch(setModalOpen(true));
    dispatch(setEditingId(null));
    dispatch(setProcess(""));
    dispatch(setLocation(""));
    dispatch(setPrice(""));
  };

  // Filter verifications based on search term
  const filteredVerifications = verifications.filter((v) => {
    const name = `${v.process?.client?.name || ""} - ${v.process?.product?.name || ""}`;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Verify Price</h1>
        <button
          onClick={handleOpenModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2"
          disabled={loading}
        >
          <Plus size={18} />
          Verify Process
        </button>
      </div>

      {/* Success/Error Messages */}
      {error && !isModalOpen && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && !isModalOpen && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* MaterialTable */}
      <div className="mt-6">
        <MaterialTable
          icons={tableIcons}
          title={''}
          columns={headCells}
          data={filteredVerifications}
          isLoading={loading}
          options={{
            exportButton: false,
            search: true,
            exportAllData: false,
            rowStyle: {
              height: '50px',
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
            dispatch(setSearchTerm(searchText || ''));
          }}
          localization={{
            body: {
              emptyDataSourceMessage: searchTerm
                ? "No matching verifications found."
                : "No verifications found. Add a verification to get started.",
            },
            toolbar: {
              searchPlaceholder: "Search processes..."
            }
          }}
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              {editingId ? "Edit Verification" : "Verify Process"}
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Process
                </label>
                <select
                  value={process}
                  onChange={(e) => dispatch(setProcess(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  <option value="" disabled>
                    {loading ? "Loading..." : "Select Process"}
                  </option>
                  {processes.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.client?.name} - {p.product?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  value={location}
                  onChange={(e) => dispatch(setLocation(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  <option value="" disabled>
                    Select Location
                  </option>
                  <option value="City">City</option>
                  <option value="Deep Geography">Deep Geography</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => dispatch(setPrice(e.target.value))}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    dispatch(setModalOpen(false));
                    dispatch(setEditingId(null));
                    dispatch(setProcess(""));
                    dispatch(setLocation(""));
                    dispatch(setPrice(""));
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!process || !location || !price || loading}
                  className={`${
                    !process || !location || !price || loading
                      ? "bg-indigo-300 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {loading ? "Submitting..." : editingId ? "Update" : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verify;