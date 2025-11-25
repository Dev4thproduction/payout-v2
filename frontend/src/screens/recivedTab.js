import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Check,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Calendar,
  ClipboardList,
  X
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import MaterialTable from '@material-table/core';
import {
  fetchReceivedData,
  fetchProcesses,
  fetchUsers,
  addReceivedEntry,
  updateReceivedEntry,
  deleteReceivedEntry,
  setReceivedFormData,
  resetReceivedFormData,
  setSelectedMonth,
  setSearchTerm,
} from "../actions/collectionActions";

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
const AddEntryModal = React.memo(({
  isOpen,
  onCancel,
  onSave,
  formData,
  handleFieldChange,
  processes,
  isEditing,
  loading
}) => {
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
            value={formData.month || ''}
            onChange={(e) => handleFieldChange("month", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            disabled={loading}
          >
            <option value="">Select Month</option>
            {monthOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          
          {/* Process */}
          <select
            value={formData.process || ''}
            onChange={(e) => handleFieldChange("process", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            disabled={loading}
          >
            <option value="">Select Process</option>
            {processes.map(p => (
              <option key={p._id} value={`${p.client.name} - ${p.product.name}`}>
                {p.client.name} - {p.product.name}
              </option>
            ))}
          </select>

          {/* Other fields */}
          {['billAmount', 'tds', 'balance', 'rate', 'grossSalary', 'netSalary', 'total'].map(field => (
            <input
              key={field}
              type={field === 'rate' ? 'number' : 'text'}
              placeholder={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              value={formData[field] || ''}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              className="w-full border px-3 py-2 rounded"
              disabled={loading}
            />
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button 
            onClick={onCancel} 
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            onClick={onSave} 
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditing ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
});

/* ---------- Main Component ---------- */
const ReceivedTab = () => {
  const dispatch = useDispatch();
  const {
    filteredReceivedData,
    processes = [],
    receivedLoading,
    receivedError,
    selectedMonth,
    receivedFormData,
    editingReceivedItem
  } = useSelector((state) => state.collection);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProcesses());
    dispatch(fetchReceivedData());
  }, [dispatch]);

  const handleMonthChange = useCallback((month) => {
    dispatch(setSelectedMonth(month));
  }, [dispatch]);

  const handleAddEntry = () => {
    const monthOptions = getMonthOptions().filter(opt => opt.value !== 'all');
    const currentMonthOption = monthOptions[0];
    dispatch(setReceivedFormData({
      month: currentMonthOption?.value || '',
      process: "",
      billAmount: "",
      tds: "",
      balance: "",
      rate: "",
      grossSalary: "",
      netSalary: "",
      total: "",
    }));
    setIsModalOpen(true);
  };

  const handleEditEntry = (item) => {
    dispatch(setReceivedFormData(item));
    setIsModalOpen(true);
  };

  const handleDeleteEntry = (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      dispatch(deleteReceivedEntry(id));
    }
  };

  const handleModalSave = async () => {
    if (!receivedFormData.month || !receivedFormData.process) return;
    
    if (editingReceivedItem) {
      await dispatch(updateReceivedEntry(editingReceivedItem.id, receivedFormData));
    } else {
      await dispatch(addReceivedEntry(receivedFormData));
    }
    
    setIsModalOpen(false);
    dispatch(resetReceivedFormData());
  };
  console.log(filteredReceivedData);
  

  const tableColumns = [
    { title: 'Month', field: 'month', render: rowData => {
      const monthOption = getMonthOptions().find(opt => opt.value === rowData.month);
      return monthOption?.display || rowData.month;
    }},
    { title: 'Process', field: 'process' },
    { title: 'Bill Amount', field: 'billAmount', type: 'currency', currencySetting: { currencyCode: 'INR' } },
    { title: 'TDS', field: 'tds', type: 'currency', currencySetting: { currencyCode: 'INR' } },
    { title: 'Balance', field: 'balance', type: 'currency', currencySetting: { currencyCode: 'INR' } },
    { title: 'Rate', field: 'rate', render: rowData => `${rowData.rate}%` },
    { title: 'Gross Salary', field: 'grossSalary', type: 'currency', currencySetting: { currencyCode: 'INR' } },
    { title: 'Net Salary', field: 'netSalary', type: 'currency', currencySetting: { currencyCode: 'INR' } },
    { title: 'Total', field: 'total', type: 'currency', currencySetting: { currencyCode: 'INR' } },
    {
      title: 'Actions',
      field: 'actions',
      render: rowData => (
        <div className="flex gap-2">
          <button onClick={() => handleEditEntry(rowData)} className="text-indigo-600 hover:text-indigo-800">
            <Edit size={16} />
          </button>
          <button onClick={() => handleDeleteEntry(rowData.id)} className="text-red-600 hover:text-red-800">
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white ">
      {/* Error Message */}
      {receivedError && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 flex justify-between items-center">
          <span>{receivedError}</span>
          <button onClick={() => dispatch({ type: "CLEAR_RECEIVED_ERROR" })}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* Month Filter + Add */}
      <div className="flex justify-between mb-4">
        <MonthFilterDropdown
          selectedMonth={selectedMonth || 'all'}
          onMonthChange={handleMonthChange}
        />
        <button 
          onClick={handleAddEntry} 
          className="px-4 py-2 bg-indigo-600 text-white rounded flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} /> Add Entry
        </button>
      </div>

      {/* Modal */}
      <AddEntryModal
        isOpen={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          dispatch(resetReceivedFormData());
        }}
        onSave={handleModalSave}
        formData={receivedFormData}
        handleFieldChange={(field, val) => dispatch(setReceivedFormData({ ...receivedFormData, [field]: val }))}
        processes={processes}
        isEditing={!!editingReceivedItem}
        loading={receivedLoading}
      />

      {/* Material Table */}
      <MaterialTable
        title=""
        columns={tableColumns}
        data={filteredReceivedData}
        isLoading={receivedLoading}
        options={{
          exportButton: false,
          search: true,
          exportAllData: false,
          rowStyle: { height: "60px", fontSize: 13 },
          paging: true,
          pageSize: 10,
          emptyRowsWhenPaging: false,
          pageSizeOptions: [10, 20, 50],
          headerStyle: {
            position: "sticky",
            top: "0",
            fontWeight: "bold",
            fontSize: 13,
            backgroundColor: "#f9fafb",
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
              <div className="flex flex-col items-center justify-center py-8">
                <ClipboardList size={32} className="text-gray-400 mb-2" />
                <p className="text-gray-500 font-medium">No data found</p>
                <p className="text-gray-400 text-sm">
                  Try adjusting your search or add a new entry
                </p>
              </div>
            ),
          },
          toolbar: { searchPlaceholder: "Search by process..." },
        }}
      />
    </div>
  );
};

export default ReceivedTab;