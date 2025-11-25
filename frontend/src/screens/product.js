import React, { useEffect, useState } from "react";
import { Plus, X, Edit, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import MaterialTable from '@material-table/core';
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../actions/productActions";

const Product = () => {
  const dispatch = useDispatch();

  // ✅ Redux State
  const { products, loading, error } = useSelector((state) => state.productState);

  // ✅ Local UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ProductName, setProductName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // MaterialTable configuration
  const tableIcons = {
    Add: () => <Plus size={18} />,
    Edit: () => <Edit size={16} />,
    Delete: () => <Trash2 size={16} />,
    Search: () => <div />, // Hide default search icon since we're using custom search
  };

  const headCells = [
    {
      title: 'Product Name',
      field: 'name',
      cellStyle: {
        fontSize: 13,
        fontWeight: 'bold'
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
            title="Edit Product"
            disabled={loading}
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(rowData._id)}
            className="text-red-600 hover:text-red-800 transition-colors p-1 rounded"
            title="Delete Product"
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

  // ✅ Fetch products on load
  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  const openModal = () => {
    setIsModalOpen(true);
    setProductName("");
    setIsEditing(false);
    setCurrentProductId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProductName("");
    setIsEditing(false);
    setCurrentProductId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ProductName.trim()) return;

    if (isEditing) {
      dispatch(updateProduct(currentProductId, ProductName));
    } else {
      dispatch(createProduct(ProductName));
    }
    closeModal();
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentProductId(product._id);
    setProductName(product.name);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Product?")) {
      dispatch(deleteProduct(id));
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Heading */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Products</h2>
        <button
          onClick={openModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center whitespace-nowrap"
          disabled={loading}
        >
          <Plus size={18} className="mr-2" />
          Add Product
        </button>
      </div>

      {error && !isModalOpen && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* MaterialTable */}
      <div className="mt-6">
        <MaterialTable
          icons={tableIcons}
          title={''}
          columns={headCells}
          data={filteredProducts}
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
            // Update local search query for immediate filtering
            setSearchQuery(searchText || '');
          }}
          localization={{
            body: {
              emptyDataSourceMessage: searchQuery
                ? "No matching products found."
                : "No products found. Add a product to get started.",
            },
            toolbar: {
              searchPlaceholder: "Search products..."
            }
          }}
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {isEditing ? "Edit Product" : "Add Product"}
                    </h3>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name
                      </label>
                      <input
                        type="text"
                        className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={ProductName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Enter Product name"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    disabled={loading}
                  >
                    {loading
                      ? isEditing
                        ? "Updating..."
                        : "Adding..."
                      : isEditing
                      ? "Update Product"
                      : "Add Product"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;