import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Edit, Trash2 } from "lucide-react";
import MaterialTable from '@material-table/core';
import { getClients } from "../actions/clientsAction";
import {
  fetchClients,
  fetchProducts,
  fetchProcesses,
  saveProcess,
  deleteProcess,
  setClient,
  setProduct,
  setRate,
  setModalOpen,
  setEditingProcessId,
  setSearchTerm,
} from "../actions/processActions";

const Process = () => {
  const dispatch = useDispatch();
  const {
    clients,
    products,
    processes,
    client,
    product,
    rate,
    isModalOpen,
    editingProcessId,
    searchTerm,
    loading,
  } = useSelector((state) => state.process);

  // MaterialTable configuration
  const tableIcons = {
    Add: () => <Plus size={18} />,
    Edit: () => <Edit size={16} />,
    Delete: () => <Trash2 size={16} />,
    Search: () => <div />, // Hide default search icon since we're using custom search
  };

  const headCells = [
    {
      title: 'Client',
      field: 'client.name',
      render: rowData => rowData.client?.name || "—",
      cellStyle: {
        fontSize: 13,
        fontWeight: 'bold'
      }
    },
    {
      title: 'Product',
      field: 'product.name',
      render: rowData => rowData.product?.name || "—",
      cellStyle: {
        fontSize: 13,
        fontWeight: 'bold'
      }
    },
    {
      title: 'Rate',
      field: 'rate',
      render: rowData => rowData.rate || "—",
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
            title="Edit Process"
            disabled={loading}
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(rowData._id)}
            className="text-red-600 hover:text-red-800 transition-colors p-1 rounded"
            title="Delete Process"
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
    dispatch(getClients());
    dispatch(fetchProducts());
    dispatch(fetchProcesses());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveProcess(editingProcessId, client, product, rate));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this process?")) {
      dispatch(deleteProcess(id));
    }
  };

  const handleEdit = (proc) => {
    dispatch(setClient(proc.client?._id || ""));
    dispatch(setProduct(proc.product?._id || ""));
    dispatch(setRate(proc.rate || ""));
    dispatch(setEditingProcessId(proc._id));
    dispatch(setModalOpen(true));
  };

  const handleOpenModal = () => {
    dispatch(setClient(""));
    dispatch(setProduct(""));
    dispatch(setRate(""));
    dispatch(setEditingProcessId(null));
    dispatch(setModalOpen(true));
  };

  // Filter processes based on search term
  const filteredProcesses = processes.filter((proc) =>
    `${proc.client?.name || ""} ${proc.product?.name || ""} ${proc.rate || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Processes</h2>
          <button
            onClick={handleOpenModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center whitespace-nowrap"
            disabled={loading}
          >
            <Plus size={18} className="mr-2" />
            Add Process
          </button>
        </div>

        {/* MaterialTable */}
        <div className="mt-6">
          <MaterialTable
            icons={tableIcons}
            title={''}
            columns={headCells}
            data={filteredProcesses}
            isLoading={loading}
            options={{
              exportButton: false,
              search: true, // Enable MaterialTable search
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
              // Update search term in Redux state for filtering
              dispatch(setSearchTerm(searchText || ''));
            }}
            localization={{
              body: {
                emptyDataSourceMessage: searchTerm
                  ? "No matching processes found."
                  : "No processes found. Add a process to get started.",
              },
              toolbar: {
                searchPlaceholder: "Search clients, products, or rates..."
              }
            }}
          />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {editingProcessId ? "Edit Process" : "Add Process"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client
                </label>
                <select
                  value={client}
                  onChange={(e) => dispatch(setClient(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="" disabled>
                    Select a client
                  </option>
                  {clients.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product
                </label>
                <select
                  value={product}
                  onChange={(e) => dispatch(setProduct(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="" disabled>
                    Select a product
                  </option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rate
                </label>
                <input
                  type="text"
                  value={rate}
                  onChange={(e) => dispatch(setRate(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter rate value"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    dispatch(setModalOpen(false));
                    dispatch(setEditingProcessId(null));
                  }}
                  className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  {loading
                    ? editingProcessId
                      ? "Updating..."
                      : "Saving..."
                    : editingProcessId
                    ? "Update"
                    : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Process;