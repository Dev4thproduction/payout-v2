import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Calendar,
  ChevronDown,
  ClipboardList
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import MaterialTable from "@material-table/core";
import {
  fetchDistributions,
  addDistribution,
  updateDistribution,
  deleteDistribution,
  setDistributionSelectedMonth,
  setDistributionSearchTerm,
  setDistributionFormData,
  resetDistributionFormData,
  fetchSupervisors,
  fetchTeamMembersList,
  fetchProcesses
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

/* ---------- Team Members Multi-Select Dropdown ---------- */
const TeamMembersDropdown = React.memo(({ teamMembers, selectedMembers, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleMember = (memberId) => {
    const isSelected = selectedMembers.includes(memberId);
    let updatedMembers;
    if (isSelected) {
      updatedMembers = selectedMembers.filter(id => id !== memberId);
    } else {
      updatedMembers = [...selectedMembers, memberId];
    }
    onChange(updatedMembers);
  };

  const getSelectedText = () => {
    if (selectedMembers.length === 0) return 'Select Team Members';
    if (selectedMembers.length === 1) {
      const member = teamMembers.find(m => m._id === selectedMembers[0]);
      return member ? `${member.name}` : '1 selected';
    }
    return `${selectedMembers.length} members selected`;
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md hover:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <span className={`text-sm ${selectedMembers.length === 0 ? 'text-gray-400' : 'text-gray-700'}`}>
          {getSelectedText()}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
            {(teamMembers || []).length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">No team members available</div>
            ) : (
              teamMembers.map(member => {
                const isSelected = selectedMembers.includes(member._id);
                return (
                  <label
                    key={member._id}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleMember(member._id)}
                      disabled={disabled}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">
                      {member.name} ({member.identifier})
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
});

/* ---------- Modal Form ---------- */
const AddEntryModal = React.memo(({
  isOpen,
  onCancel,
  onSave,
  formData = {},
  handleFieldChange,
  processOptions,
  supervisors,
  teamMembers,
  isEditing,
  loading
}) => {
  if (!isOpen) return null;
  const monthOptions = getMonthOptions().filter(opt => opt.value !== 'all');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {isEditing ? 'Edit Distribution' : 'Add New Distribution'}
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

          {/* Supervisor Dropdown */}
          <select
            value={formData.supervisor || ''}
            onChange={(e) => handleFieldChange("supervisor", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            disabled={loading}
          >
            <option value="">Select Supervisor</option>
            {(supervisors || []).map(s => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.identifier})
              </option>
            ))}
          </select>
          {/* Team Members Multi-Select Dropdown with Checkboxes */}
          <TeamMembersDropdown
            teamMembers={teamMembers}
            selectedMembers={formData.teamMembers || []}
            onChange={(updatedMembers) => handleFieldChange("teamMembers", updatedMembers)}
            disabled={loading}
          />

          {/* Name */}
          <input
            type="text"
            placeholder="Name"
            value={formData.name || ''}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            disabled={loading}
          />

          {/* Product Dropdown */}
          <select
            value={formData.product || ''}
            onChange={(e) => handleFieldChange("product", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            disabled={loading}
          >
            <option value="">Select Product</option>
            {(processOptions || []).map(p => (
              <option key={p._id} value={`${p.client.name} - ${p.product.name}`}>
                {p.client.name} - {p.product.name}
              </option>
            ))}
          </select>

          {/* Number Fields */}
          {['cases', 'pos', 'basic', 'moneyCollection', 'incentiveReceived', 'employeeIncentive'].map(field => (
            <input
              key={field}
              type="number"
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

/* ---------- Main Distribution Component ---------- */
const DistributionTab = () => {
  const dispatch = useDispatch();
  const {
    distributions = [],
    filteredDistributions = [],
    processes = [],
    distributionLoading: loading,
    selectedMonth,
    searchTerm,
    distributionFormData: formData = {},
    editingItem
  } = useSelector((state) => state.collection);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supervisors, setSupervisors] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [processOptions, setProcessOptions] = useState([]);

  useEffect(() => {
    dispatch(fetchDistributions());

    // Fetch supervisors, team members, and processes
    const loadData = async () => {
      const supervisorsResult = await dispatch(fetchSupervisors());
      const teamMembersResult = await dispatch(fetchTeamMembersList());

      if (supervisorsResult.success) {
        setSupervisors(supervisorsResult.data);
      }
      if (teamMembersResult.success) {
        setTeamMembers(teamMembersResult.data);
      }

      // Fetch processes for product dropdown
      dispatch(fetchProcesses());
    };

    loadData();
  }, [dispatch]);

  // Get processes from Redux store
  useEffect(() => {
    if (processes && processes.length > 0) {
      setProcessOptions(processes);
    }
  }, [processes]);

  const formatMonth = (monthValue) => {
    if (!monthValue || monthValue === 'all') return 'All Months';
    const [year, month] = monthValue.split('-');
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleAdd = () => {
    const monthOptions = getMonthOptions().filter(opt => opt.value !== 'all');
    const currentMonthOption = monthOptions[0];
    dispatch(setDistributionFormData({
      month: currentMonthOption?.value || '',
      name: "",
      product: "",
      cases: "",
      pos: "",
      basic: "",
      moneyCollection: "",
      incentiveReceived: "",
      employeeIncentive: "",
      supervisor: "",
      teamMembers: []
    }));
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    dispatch(setDistributionFormData(item));
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      dispatch(deleteDistribution(id));
    }
  };

  const handleModalSave = async () => {
    if (!formData.month || !formData.process) return;

    if (editingItem) {
      await dispatch(updateDistribution(editingItem.id, formData));
    } else {
      await dispatch(addDistribution(formData));
    }

    setIsModalOpen(false);
    dispatch(resetDistributionFormData());
  };

  const handleFieldChange = (field, value) => {
    dispatch(setDistributionFormData({ ...formData, [field]: value }));
  };

  return (
    <div className="bg-white ">
      {/* Header with Active Entries count and Add button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <MonthFilterDropdown
            selectedMonth={selectedMonth || 'all'}
            onMonthChange={(month) => dispatch(setDistributionSelectedMonth(month))}
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2"
            disabled={loading}
          >
            <Plus size={18} /> Add Entry
          </button>
        </div>
      </div>



      {/* Modal */}
      <AddEntryModal
        isOpen={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          dispatch(resetDistributionFormData());
        }}
        onSave={handleModalSave}
        formData={formData}
        handleFieldChange={handleFieldChange}
        processOptions={processOptions}
        supervisors={supervisors}
        teamMembers={teamMembers}
        isEditing={!!editingItem}
        loading={loading}
      />

      {/* Material Table */}
      <MaterialTable
        title=""
        columns={[
          {
            title: 'Month',
            field: 'month',
            render: rowData => formatMonth(rowData.month)
          },
          { title: 'Name', field: 'Name' },
          { title: 'Product', field: 'Product' },
          { title: 'No. of Cases', field: 'No. of Cases' },
          { title: 'POS', field: 'POS' },
          { title: 'Salary', field: 'Salary' },
          { title: 'Money Collection', field: 'Money Collection' },
          { title: 'Incentive Received', field: 'Incentive Received' },
          {
            title: 'Supervisor',
            field: 'supervisor',
            render: rowData => rowData.supervisor?.name || 'N/A'
          },
          {
            title: 'Supervisor Incentive (60%)',
            field: 'supervisorIncentive',
            type: 'currency',
            currencySetting: { currencyCode: 'INR' }
          },
          {
            title: 'Team Pool (40%)',
            field: 'teamIncentivePool',
            type: 'currency',
            currencySetting: { currencyCode: 'INR' }
          },
          {
            title: 'Per Team Member',
            field: 'individualTeamIncentive',
            type: 'currency',
            currencySetting: { currencyCode: 'INR' }
          },
          { title: 'Employee Incentive', field: 'Employee Incentive' },
          {
            title: 'Actions',
            field: 'actions',
            render: rowData => (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(rowData)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(rowData.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )
          }
        ]}
        data={filteredDistributions}
        isLoading={loading}
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
        onSearchChange={(text) => dispatch(setDistributionSearchTerm(text || ''))}
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

export default DistributionTab;