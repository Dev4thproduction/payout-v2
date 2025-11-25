// src/screens/ClientsScreen.js

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Plus, X, Edit, Trash2 } from "lucide-react";
import MaterialTable from '@material-table/core';
import {
    getClients,
    addClient,
    updateClient,
    deleteClient,
    resetAddClient,
    resetUpdateClient,
    resetDeleteClient,
    setSearchQuery,
    clearError,
} from "../actions/clientsAction";

const ClientsScreen = () => {
    const dispatch = useDispatch();

    // Get data from separate reducers
    const { loadingGetClientsInfo, getClientsData, errorGetClientsInfo } = useSelector(state => state.getClientsInfo) || {};
    const { loadingAddClientInfo, addClientData, errorAddClientInfo } = useSelector(state => state.addClientInfo) || {};
    const { loadingUpdateClientInfo, updateClientData, errorUpdateClientInfo } = useSelector(state => state.updateClientInfo) || {};
    const { loadingDeleteClientInfo, deleteClientData, errorDeleteClientInfo } = useSelector(state => state.deleteClientInfo) || {};
    const { searchQuery = '' } = useSelector(state => state.clientUIInfo) || {};
    const userLogin = useSelector(state => state.userLogin);

    const [clientName, setClientName] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentClient, setCurrentClient] = useState(null);

    // Determine overall loading state
    const isLoading = loadingGetClientsInfo || loadingAddClientInfo || loadingUpdateClientInfo || loadingDeleteClientInfo;

    // Get the first available error
    const error = errorGetClientsInfo || errorAddClientInfo || errorUpdateClientInfo || errorDeleteClientInfo;

    // Use clients data with fallback to empty array
    const clients = getClientsData || [];

    // MaterialTable configuration
    const tableIcons = {
        Add: () => <Plus size={18} />,
        Edit: () => <Edit size={16} />,
        Delete: () => <Trash2 size={16} />,
        Search: () => <div />, // Hide default search icon since we're using custom search
    };

    const headCells = [
        {
            title: 'Client Name',
            field: 'name',
            cellStyle: {
                fontSize: 13,
                fontWeight: 'bold'
            }
        },
        {
            title: 'Created Date',
            field: 'createdAt',
            render: rowData => rowData.createdAt ? new Date(rowData.createdAt).toLocaleDateString() : 'N/A',
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
                        onClick={() => handleStartEditing(rowData)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded"
                        title="Edit Client"
                        disabled={isLoading}
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => handleDelete(rowData._id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-1 rounded"
                        title="Delete Client"
                        disabled={isLoading}
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
        console.log('Raw clients data:', getClientsData);
    }, [dispatch]);

    // Handle successful operations
    useEffect(() => {
        if (addClientData && !loadingAddClientInfo) {
            setIsModalOpen(false);
            setIsEditing(false);
            setCurrentClient(null);
            dispatch(resetAddClient());
            setClientName("");
            // Refresh the client list
            dispatch(getClients(searchQuery));
        }
    }, [addClientData, loadingAddClientInfo, dispatch, searchQuery]);

    useEffect(() => {
        if (updateClientData && !loadingUpdateClientInfo) {
            setIsModalOpen(false);
            setIsEditing(false);
            setCurrentClient(null);
            dispatch(resetUpdateClient());
            setClientName("");
            // Refresh the client list
            dispatch(getClients(searchQuery));
        }
    }, [updateClientData, loadingUpdateClientInfo, dispatch, searchQuery]);

    useEffect(() => {
        if (deleteClientData && !loadingDeleteClientInfo) {
            dispatch(resetDeleteClient());
            // Refresh the client list
            dispatch(getClients(searchQuery));
        }
    }, [deleteClientData, loadingDeleteClientInfo, dispatch, searchQuery]);

    useEffect(() => {
        if (isEditing && currentClient) {
            setClientName(currentClient.name);
        } else {
            setClientName("");
        }
    }, [isEditing, currentClient]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
        setIsEditing(false);
        setCurrentClient(null);
        setClientName("");
        dispatch(clearError());
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setCurrentClient(null);
        setClientName("");
        dispatch(clearError());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!clientName.trim()) {
            return setIsModalOpen(false);
        }

        if (isEditing && currentClient) {
            dispatch(updateClient(currentClient._id, clientName.trim()));
            setIsModalOpen(false)
        } else {
            dispatch(addClient(clientName.trim()));
            setIsModalOpen(false)
        }
    };

    const handleStartEditing = (client) => {
        setIsEditing(true);
        setCurrentClient(client);
        setClientName(client.name);
        setIsModalOpen(true);
        dispatch(clearError());
    };

    const handleDelete = async (clientId) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            dispatch(deleteClient(clientId));
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Clients</h2>
                <button
                    onClick={handleOpenModal}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center"
                    disabled={isLoading}
                >
                    <Plus size={18} className="mr-2" />
                    Add Client
                </button>
            </div>

            {error && !isModalOpen && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                    <button
                        onClick={() => dispatch(clearError())}
                        className="ml-2 text-red-500 hover:text-red-700"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="mt-6">
                <MaterialTable
                    icons={tableIcons}
                    title={''}
                    columns={headCells}
                    data={clients}
                    isLoading={isLoading}
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
                        // Update search query in Redux state
                        dispatch(setSearchQuery(searchText || ''));
                        
                        // Call backend search when user types in MaterialTable search
                        if (searchText) {
                            dispatch(getClients(searchText));
                        } else {
                            dispatch(getClients());
                        }
                    }}
                    localization={{
                        body: {
                            emptyDataSourceMessage: searchQuery
                                ? "No matching clients found."
                                : "No clients found. Add a client to get started.",
                        },
                        toolbar: {
                            searchPlaceholder: "Search clients..."
                        }
                    }}
                />
            </div>

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
                                            {isEditing ? "Edit Client" : "Add Client"}
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
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
                                                Client Name
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                value={clientName}
                                                onChange={(e) => setClientName(e.target.value)}
                                                placeholder="Enter client name"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        disabled={isLoading}
                                    >
                                        {isLoading
                                            ? isEditing
                                                ? "Updating..."
                                                : "Adding..."
                                            : isEditing
                                                ? "Update Client"
                                                : "Add Client"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        disabled={isLoading}
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

export default ClientsScreen;