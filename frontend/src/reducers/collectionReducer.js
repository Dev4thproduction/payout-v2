import {
  FETCH_PLANNED_COLLECTIONS_REQUEST,
  FETCH_PLANNED_COLLECTIONS_SUCCESS,
  FETCH_PLANNED_COLLECTIONS_FAIL,
  FETCH_PROCESSES_REQUEST,
  FETCH_PROCESSES_SUCCESS,
  FETCH_PROCESSES_FAIL,
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAIL,
  ADD_PLANNED_COLLECTION_REQUEST,
  ADD_PLANNED_COLLECTION_SUCCESS,
  ADD_PLANNED_COLLECTION_FAIL,
  UPDATE_PLANNED_COLLECTION_REQUEST,
  UPDATE_PLANNED_COLLECTION_SUCCESS,
  UPDATE_PLANNED_COLLECTION_FAIL,
  DELETE_PLANNED_COLLECTION_REQUEST,
  DELETE_PLANNED_COLLECTION_SUCCESS,
  DELETE_PLANNED_COLLECTION_FAIL,
  SET_SELECTED_MONTH,
  SET_SEARCH_TERM,
  SET_ACTIVE_TAB,
  SET_NEW_ENTRY,
  RESET_NEW_ENTRY,
  FETCH_RECEIVED_DATA_REQUEST,
  FETCH_RECEIVED_DATA_SUCCESS,
  FETCH_RECEIVED_DATA_FAIL,
  ADD_RECEIVED_ENTRY_REQUEST,
  ADD_RECEIVED_ENTRY_SUCCESS,
  ADD_RECEIVED_ENTRY_FAIL,
  UPDATE_RECEIVED_ENTRY_REQUEST,
  UPDATE_RECEIVED_ENTRY_SUCCESS,
  UPDATE_RECEIVED_ENTRY_FAIL,
  DELETE_RECEIVED_ENTRY_REQUEST,
  DELETE_RECEIVED_ENTRY_SUCCESS,
  DELETE_RECEIVED_ENTRY_FAIL,
  SET_RECEIVED_FORM_DATA,
  RESET_RECEIVED_FORM_DATA,
  SET_RECEIVED_PAGINATION,
  FETCH_DISTRIBUTIONS_REQUEST,
  FETCH_DISTRIBUTIONS_SUCCESS,
  FETCH_DISTRIBUTIONS_FAIL,
  ADD_DISTRIBUTION_REQUEST,
  ADD_DISTRIBUTION_SUCCESS,
  ADD_DISTRIBUTION_FAIL,
  UPDATE_DISTRIBUTION_REQUEST,
  UPDATE_DISTRIBUTION_SUCCESS,
  UPDATE_DISTRIBUTION_FAIL,
  DELETE_DISTRIBUTION_REQUEST,
  DELETE_DISTRIBUTION_SUCCESS,
  DELETE_DISTRIBUTION_FAIL,
  SET_DISTRIBUTION_FORM_DATA,
  RESET_DISTRIBUTION_FORM_DATA,
  SET_DISTRIBUTION_SELECTED_MONTH,
  SET_DISTRIBUTION_SEARCH_TERM,
} from '../constants/collectionConstants';

const getCurrentMonthKey = () => {
  const now = new Date();
  const indiaTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
  const currentMonth = indiaTime.getMonth();
  const currentYear = indiaTime.getFullYear();
  return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
};

const initialState = {
  receivedPagination: {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    pageSize: 10
  },
  allPlannedCollections: [],
  filteredPlannedCollections: [],
  allReceivedData: [], // Added missing field
  filteredReceivedData: [],
  distributions: [],
  filteredDistributions: [],
  processes: [],
  users: [],
  loading: false,
  receivedLoading: false, // Separate loading for received data
  distributionLoading: false,
  error: null,
  receivedError: null, // Separate error for received data
  distributionError: null,
  selectedMonth: getCurrentMonthKey(),
  searchTerm: '',
  activeTab: 'planned',
  newEntry: {
    month: getCurrentMonthKey(),
    name: '',
    product: '',
    cases: '',
    pos: '',
    basic: '',
    moneyCollection: ''
  },
  receivedFormData: { // Added missing field
    month: getCurrentMonthKey(),
    process: '',
    billAmount: '',
    tds: '',
    balance: '',
    rate: '',
    grossSalary: '',
    netSalary: '',
    total: ''
  },
  distributionFormData: {
    month: getCurrentMonthKey(),
    process: '',
    quantity: '',
    notes: ''
  },
  isSaving: false,
  editingItem: null,
  editingReceivedItem: null // Added missing field
};

export const collectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PLANNED_COLLECTIONS_REQUEST:
    case FETCH_PROCESSES_REQUEST:
    case FETCH_USERS_REQUEST:
    case ADD_PLANNED_COLLECTION_REQUEST:
    case UPDATE_PLANNED_COLLECTION_REQUEST:
    case DELETE_PLANNED_COLLECTION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_PLANNED_COLLECTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        allPlannedCollections: action.payload,
        filteredPlannedCollections: action.payload.filter(
          item => item.month === state.selectedMonth
        )
      };

    case FETCH_PROCESSES_SUCCESS:
      return {
        ...state,
        loading: false,
        processes: action.payload
      };

    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload
      };

    case ADD_PLANNED_COLLECTION_SUCCESS:
      const updatedAllCollections = [...state.allPlannedCollections, action.payload];
      return {
        ...state,
        loading: false,
        allPlannedCollections: updatedAllCollections,
        filteredPlannedCollections: 
          action.payload.month === state.selectedMonth
            ? [...state.filteredPlannedCollections, action.payload]
            : state.filteredPlannedCollections,
        newEntry: initialState.newEntry,
        isSaving: false
      };

    case UPDATE_PLANNED_COLLECTION_SUCCESS:
      const updatedCollections = state.allPlannedCollections.map(item =>
        item.id === action.payload.id ? action.payload : item
      );
      return {
        ...state,
        loading: false,
        allPlannedCollections: updatedCollections,
        filteredPlannedCollections: state.filteredPlannedCollections.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
        newEntry: initialState.newEntry,
        editingItem: null,
        isSaving: false
      };

    case DELETE_PLANNED_COLLECTION_SUCCESS:
      return {
        ...state,
        loading: false,
        allPlannedCollections: state.allPlannedCollections.filter(
          item => item.id !== action.payload
        ),
        filteredPlannedCollections: state.filteredPlannedCollections.filter(
          item => item.id !== action.payload
        ),
        isSaving: false
      };

    case FETCH_PLANNED_COLLECTIONS_FAIL:
    case FETCH_PROCESSES_FAIL:
    case FETCH_USERS_FAIL:
    case ADD_PLANNED_COLLECTION_FAIL:
    case UPDATE_PLANNED_COLLECTION_FAIL:
    case DELETE_PLANNED_COLLECTION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isSaving: false
      };

    case SET_SELECTED_MONTH:
      return {
        ...state,
        selectedMonth: action.payload,
        filteredPlannedCollections: state.allPlannedCollections.filter(
          item => item.month === action.payload
        ),
        filteredReceivedData: (state.allReceivedData || []).filter(
          item => item.month === action.payload
        ),
        error: null
      };

    case SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload
      };

    case SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload
      };

    case SET_NEW_ENTRY:
      return {
        ...state,
        newEntry: {
          ...state.newEntry,
          ...action.payload
        }
      };

    case RESET_NEW_ENTRY:
      return {
        ...state,
        newEntry: initialState.newEntry,
        editingItem: null
      };
    
    case FETCH_RECEIVED_DATA_REQUEST:
      return {
        ...state,
        receivedLoading: true,
        receivedError: null
      };
      
    case FETCH_RECEIVED_DATA_SUCCESS:
      return {
        ...state,
        receivedLoading: false,
        allReceivedData: action.payload,
        filteredReceivedData: action.payload.filter(
          item => item.month === state.selectedMonth
        )
      };
      
    case FETCH_RECEIVED_DATA_FAIL:
      return {
        ...state,
        receivedLoading: false,
        receivedError: action.payload
      };
      
    case ADD_RECEIVED_ENTRY_REQUEST:
    case UPDATE_RECEIVED_ENTRY_REQUEST:
    case DELETE_RECEIVED_ENTRY_REQUEST:
      return {
        ...state,
        receivedLoading: true,
        receivedError: null
      };
      
    case ADD_RECEIVED_ENTRY_SUCCESS:
      const updatedAllReceived = [...(state.allReceivedData || []), action.payload];
      return {
        ...state,
        receivedLoading: false,
        allReceivedData: updatedAllReceived,
        filteredReceivedData: 
          action.payload.month === state.selectedMonth
            ? [...state.filteredReceivedData, action.payload]
            : state.filteredReceivedData,
        receivedFormData: initialState.receivedFormData,
        editingReceivedItem: null
      };
      
    case UPDATE_RECEIVED_ENTRY_SUCCESS:
      const updatedReceived = (state.allReceivedData || []).map(item =>
        item.id === action.payload.id ? action.payload : item
      );
      return {
        ...state,
        receivedLoading: false,
        allReceivedData: updatedReceived,
        filteredReceivedData: state.filteredReceivedData.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
        receivedFormData: initialState.receivedFormData,
        editingReceivedItem: null
      };
      
    case DELETE_RECEIVED_ENTRY_SUCCESS:
      return {
        ...state,
        receivedLoading: false,
        allReceivedData: (state.allReceivedData || []).filter(
          item => item.id !== action.payload
        ),
        filteredReceivedData: state.filteredReceivedData.filter(
          item => item.id !== action.payload
        )
      };
      
    case ADD_RECEIVED_ENTRY_FAIL:
    case UPDATE_RECEIVED_ENTRY_FAIL:
    case DELETE_RECEIVED_ENTRY_FAIL:
      return {
        ...state,
        receivedLoading: false,
        receivedError: action.payload
      };
      
    case SET_RECEIVED_FORM_DATA:
      return {
        ...state,
        receivedFormData: {
          ...state.receivedFormData,
          ...action.payload
        }
      };
      
    case RESET_RECEIVED_FORM_DATA:
      return {
        ...state,
        receivedFormData: initialState.receivedFormData,
        editingReceivedItem: null
      };
      
    case SET_RECEIVED_PAGINATION:
      return {
        ...state,
        receivedPagination: {
          ...state.receivedPagination,
          currentPage: action.payload
        }
      };

    // Distribution cases
    case FETCH_DISTRIBUTIONS_REQUEST:
      return {
        ...state,
        distributionLoading: true,
        distributionError: null
      };

    case FETCH_DISTRIBUTIONS_SUCCESS:
      return {
        ...state,
        distributionLoading: false,
        distributions: action.payload,
        filteredDistributions: action.payload.filter(
          item => item.month === state.selectedMonth || state.selectedMonth === 'all'
        )
      };

    case FETCH_DISTRIBUTIONS_FAIL:
      return {
        ...state,
        distributionLoading: false,
        distributionError: action.payload
      };

    case ADD_DISTRIBUTION_REQUEST:
    case UPDATE_DISTRIBUTION_REQUEST:
    case DELETE_DISTRIBUTION_REQUEST:
      return {
        ...state,
        distributionLoading: true,
        distributionError: null
      };

    case ADD_DISTRIBUTION_SUCCESS:
      const updatedAllDistributions = [...state.distributions, action.payload];
      return {
        ...state,
        distributionLoading: false,
        distributions: updatedAllDistributions,
        filteredDistributions:
          action.payload.month === state.selectedMonth || state.selectedMonth === 'all'
            ? [...state.filteredDistributions, action.payload]
            : state.filteredDistributions,
        distributionFormData: initialState.distributionFormData,
        editingItem: null
      };

    case UPDATE_DISTRIBUTION_SUCCESS:
      const updatedDistributions = state.distributions.map(item =>
        item.id === action.payload.id ? action.payload : item
      );
      return {
        ...state,
        distributionLoading: false,
        distributions: updatedDistributions,
        filteredDistributions: state.filteredDistributions.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
        distributionFormData: initialState.distributionFormData,
        editingItem: null
      };

    case DELETE_DISTRIBUTION_SUCCESS:
      return {
        ...state,
        distributionLoading: false,
        distributions: state.distributions.filter(
          item => item.id !== action.payload
        ),
        filteredDistributions: state.filteredDistributions.filter(
          item => item.id !== action.payload
        )
      };

    case ADD_DISTRIBUTION_FAIL:
    case UPDATE_DISTRIBUTION_FAIL:
    case DELETE_DISTRIBUTION_FAIL:
      return {
        ...state,
        distributionLoading: false,
        distributionError: action.payload
      };

    case SET_DISTRIBUTION_FORM_DATA:
      return {
        ...state,
        distributionFormData: {
          ...state.distributionFormData,
          ...action.payload
        }
      };

    case RESET_DISTRIBUTION_FORM_DATA:
      return {
        ...state,
        distributionFormData: initialState.distributionFormData,
        editingItem: null
      };

    case SET_DISTRIBUTION_SELECTED_MONTH:
      return {
        ...state,
        selectedMonth: action.payload,
        filteredDistributions: action.payload === 'all'
          ? state.distributions
          : state.distributions.filter(item => item.month === action.payload)
      };

    case SET_DISTRIBUTION_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload
      };

    default:
      return state;
  }
};