import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Check,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Calendar,
  ClipboardList
} from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import MaterialTable from '@material-table/core';
import {
  fetchPlannedCollections,
  fetchProcesses,
  fetchUsers,
  addPlannedCollection,
  updatePlannedCollection,
  deletePlannedCollection,
  setSelectedMonth,
  setSearchTerm,
  setActiveTab,
  setNewEntry,
  resetNewEntry,
  fetchSupervisors
} from '../actions/collectionActions';
import ReceivedTab from "./recivedTab";
import DistributionTab from "./DistributionTab";

/* ---------- Helper: Month Options ---------- */
const getMonthOptions = () => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const now = new Date();
  const indiaTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const currentMonth = indiaTime.getMonth();
  const currentYear = indiaTime.getFullYear();

  const monthOptions = [
    { value: 'all', label: 'All Months', display: 'All Months' }
  ];

  for (let i = 0; i < 5; i++) {
    const monthIndex = (currentMonth - i + 12) % 12;
    const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
    const monthValue = `${months[monthIndex]} ${year}`;
    const monthKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
    monthOptions.push({ value: monthKey, label: monthValue, display: monthValue });
  }
  return monthOptions;
};

/* ---------- Month Filter Dropdown ---------- */
const MonthFilterDropdown = React.memo(({ selectedMonth, onMonthChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const monthOptions = getMonthOptions();
  const selectedOption = monthOptions.find(opt => opt.value === selectedMonth);

  return (
    <div className="relative w-full md:w-48">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg hover:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all bg-white"
      >
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-gray-400" />
          <span className="text-gray-700">
            {selectedOption?.display || 'All Months'}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {monthOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onMonthChange(option.value);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

/* ---------- Modal Form ---------- */
const AddEntryModal = React.memo(({ isOpen, onCancel, onSave, newEntry, handleFieldChange, supervisors, processes, isEditing, loading }) => {
  if (!isOpen) return null;
  const monthOptions = getMonthOptions().filter(opt => opt.value !== 'all');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {isEditing ? 'Edit Entry' : 'Add New Entry'}
        </h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {/* Month */}
          <select
            value={newEntry.month || ''}
            onChange={(e) => handleFieldChange("month", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            disabled={loading}
          >
            <option value="">Select Month</option>
            {monthOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          {/* Name (Supervisor) */}
          <select
            value={newEntry.name || ''}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            disabled={loading}
          >
            <option value="">Select Supervisor</option>
            {(supervisors || []).map(s => (
              <option key={s._id} value={s.name}>
                {s.name} ({s.identifier})
              </option>
            ))}
          </select>
          {/* Product */}
          <select
            value={newEntry.product || ''}
            onChange={(e) => handleFieldChange("product", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            disabled={loading}
          >
            <option value="">Select Product</option>
            {processes.map(p => (
              <option key={p._id} value={`${p.client.name} - ${p.product.name}`}>
                {p.client.name} - {p.product.name}
              </option>
            ))}
          </select>
          {/* Other fields */}
          {['cases', 'pos', 'basic', 'moneyCollection'].map(field => (
            <input
              key={field}
              type="number"
              placeholder={field}
              value={newEntry[field] || ''}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              className="w-full border px-3 py-2 rounded"
              disabled={loading}
            />
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button onClick={onSave} className="px-4 py-2 bg-indigo-600 text-white rounded">
            {isEditing ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
});

/* ---------- Main Component ---------- */
const CollectionApp = () => {
  const dispatch = useDispatch();
  const {
    allPlannedCollections = [],
    filteredPlannedCollections = [],
    processes = [],
    users = [],
    loading,
    selectedMonth,
    activeTab,
    newEntry
  } = useSelector(state => state.collection);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [supervisors, setSupervisors] = useState([]);

  // Set "All Months" as default on component mount
  useEffect(() => {
    dispatch(setSelectedMonth('all'));
  }, [dispatch]);

  useEffect(() => {
    if (activeTab === "planned") {
      dispatch(fetchPlannedCollections());
      dispatch(fetchProcesses());
      dispatch(fetchUsers());

      // Fetch supervisors
      const loadSupervisors = async () => {
        const supervisorsResult = await dispatch(fetchSupervisors());
        if (supervisorsResult.success) {
          setSupervisors(supervisorsResult.data);
        }
      };
      loadSupervisors();
    }
  }, [dispatch, activeTab]);

  const handleMonthChange = useCallback((month) => {
    dispatch(setSelectedMonth(month));
  }, [dispatch]);

  const handleAddEntry = () => {
    const monthOptions = getMonthOptions().filter(opt => opt.value !== 'all');
    const currentMonthOption = monthOptions[0];
    dispatch(setNewEntry({
      month: currentMonthOption?.value || '',
      name: "",
      product: "",
      cases: "",
      pos: "",
      basic: "",
      moneyCollection: "",
    }));
    setIsModalOpen(true);
  };

  const handleEditEntry = (item) => {
    setEditingItem(item);
    dispatch(setNewEntry(item));
    setIsModalOpen(true);
  };

  const handleDeleteEntry = (id) => {
    if (window.confirm("Delete this entry?")) {
      dispatch(deletePlannedCollection(id));
    }
  };

  const handleModalSave = async () => {
    if (!newEntry.month || !newEntry.name || !newEntry.product) return;
    if (editingItem) {
      await dispatch(updatePlannedCollection(editingItem.id, newEntry));
    } else {
      await dispatch(addPlannedCollection(newEntry));
    }
    setIsModalOpen(false);
    setEditingItem(null);
    dispatch(resetNewEntry());
  };

  const tableColumns = [
    { 
      title: 'Month', 
      field: 'month',
      render: rowData => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
          {rowData.month}
        </span>
      )
    },
    { 
      title: 'Name', 
      field: 'name',
      render: rowData => (
        <span className="font-medium text-gray-900">
          {rowData.name}
        </span>
      )
    },
    { 
      title: 'Product', 
      field: 'product',
      render: rowData => (
        <span className="text-gray-700">
          {rowData.product}
        </span>
      )
    },
    { 
      title: 'Cases', 
      field: 'cases', 
      type: 'numeric',
      render: rowData => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {rowData.cases}
        </span>
      )
    },
    { 
      title: 'POS', 
      field: 'pos', 
      type: 'numeric',
      render: rowData => (
        <span className="font-medium text-blue-600">
          {rowData.pos}
        </span>
      )
    },
    { 
      title: 'Salary', 
      field: 'basic', 
      type: 'numeric',
      render: rowData => (
        <span className="font-medium text-green-600">
          ₹{rowData.basic ? Number(rowData.basic).toLocaleString('en-IN') : '0'}
        </span>
      )
    },
    { 
      title: 'Money Collection', 
      field: 'moneyCollection', 
      type: 'numeric',
      render: rowData => (
        <span className="font-medium text-purple-600">
          ₹{rowData.moneyCollection ? Number(rowData.moneyCollection).toLocaleString('en-IN') : '0'}
        </span>
      )
    },
    {
      title: 'Actions',
      field: 'actions',
      sorting: false,
      render: rowData => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleEditEntry(rowData)} 
            className="text-indigo-600 hover:text-indigo-800 transition-colors p-1 rounded"
            title="Edit Entry"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => handleDeleteEntry(rowData.id)} 
            className="text-red-600 hover:text-red-800 transition-colors p-1 rounded"
            title="Delete Entry"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  // Show all data when "All Months" is selected
  const filteredData = selectedMonth === 'all' 
    ? allPlannedCollections 
    : allPlannedCollections.filter(item => item.month === selectedMonth);

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="bg-indigo-100 text-indigo-800 p-2 rounded-md mr-3">
          <ChevronDown size={18} />
        </span>
        Payout Collection
      </h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {['planned', 'received', 'distribution'].map(tab => (
          <button
            key={tab}
            onClick={() => dispatch(setActiveTab(tab))}
            className={`py-2 px-4 mr-2 text-sm font-medium ${
              activeTab === tab
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Month Filter + Add - Only show for planned tab */}
      {activeTab === "planned" && (
        <div className="pb-3">
          <div className="flex justify-between items-center gap-4">
            <MonthFilterDropdown
              selectedMonth={selectedMonth || 'all'}
              onMonthChange={handleMonthChange}
            />
            <button 
              onClick={handleAddEntry} 
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-sm"
              disabled={loading}
            >
              <Plus size={18} /> Add Entry
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <AddEntryModal
          isOpen={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onSave={handleModalSave}
          newEntry={newEntry}
          handleFieldChange={(field, val) => dispatch(setNewEntry({ ...newEntry, [field]: val }))}
          supervisors={supervisors}
          processes={processes}
          isEditing={!!editingItem}
          loading={loading}
        />
      )}

      {/* Content based on active tab */}
      {activeTab === "planned" && (
        <div className="overflow-x-auto rounded-lg border-gray-200 shadow-sm">
          <MaterialTable
            title=""
            columns={tableColumns}
            data={filteredData}
            isLoading={loading}
            options={{
              exportButton: false,
              search: true,
              exportAllData: false,
              rowStyle: (rowData, index) => ({
                height: '60px',
                fontSize: 13,
                backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
              }),
              paging: true,
              pageSize: 10,
              emptyRowsWhenPaging: false,
              pageSizeOptions: [10, 20, 50],
              headerStyle: {
                position: "sticky",
                top: "0",
                fontWeight: "bold",
                fontSize: 13,
                backgroundColor: "#f3f4f6",
              },
              searchFieldStyle: { fontSize: 13 },
              toolbar: true,
              showTitle: false,
              actionsColumnIndex: -1,
              searchAutoFocus: false,
              searchFieldAlignment: "left",
            }}
            onSearchChange={(text) => dispatch(setSearchTerm(text || ''))}
            localization={{
              body: {
                emptyDataSourceMessage: (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">📅</div>
                    <div className="font-medium text-gray-600">No data available</div>
                    <div className="text-sm text-gray-500 mt-1">
                      No records found. Try adding a new entry.
                    </div>
                  </div>
                ),
              },
              toolbar: { searchPlaceholder: "Search entries..." },
            }}
          />
        </div>
      )}

      {activeTab === "distribution" && (
        <div>
          <div className="text-center">
            <div className="text-sm text-gray-500 mt-1">
              <DistributionTab/>
            </div>
          </div>
        </div>
      )}

      {activeTab === "received" && (
        <React.Suspense
          fallback={
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          }
        >
          <ReceivedTab />
        </React.Suspense>
      )}
    </div>
  );
};

export default CollectionApp;