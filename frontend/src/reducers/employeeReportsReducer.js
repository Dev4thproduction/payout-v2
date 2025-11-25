// src/redux/reducers/employeeReportsReducer.js
import {
  FETCH_ATTENDANCE_REQUEST,
  FETCH_ATTENDANCE_SUCCESS,
  FETCH_ATTENDANCE_FAIL,
  FETCH_REPORT_VERIFICATIONS_REQUEST,
  FETCH_REPORT_VERIFICATIONS_SUCCESS,
  FETCH_REPORT_VERIFICATIONS_FAIL,
  FETCH_PLANNED_COLLECTIONS_REQUEST,
  FETCH_PLANNED_COLLECTIONS_SUCCESS,
  FETCH_PLANNED_COLLECTIONS_FAIL,
  FETCH_RECEIVED_COLLECTIONS_REQUEST,
  FETCH_RECEIVED_COLLECTIONS_SUCCESS,
  FETCH_RECEIVED_COLLECTIONS_FAIL,
  FETCH_DISTRIBUTIONS_REQUEST,
  FETCH_DISTRIBUTIONS_SUCCESS,
  FETCH_DISTRIBUTIONS_FAIL,
  FETCH_REPORT_DATA_REQUEST,
  FETCH_REPORT_DATA_SUCCESS,
  FETCH_REPORT_DATA_FAIL,
  UPDATE_SELECTED_MONTH,
  UPDATE_ATTENDANCE_PAGINATION,
  UPDATE_VERIFICATION_PAGINATION,
  CLEAR_REPORT_ERRORS
} from "../constants/employeeReportsConstants.js";

const initialState = {
  // Selected month - default to "all" to show all months
  selectedMonth: "all", // Changed from current month to "all"
  
  // Data
  attendance: null,
  verifications: null,
  plannedCollections: null,
  receivedCollections: null,
  distributions: null,
  
  // Loading states
  attendanceLoading: false,
  verificationsLoading: false,
  plannedCollectionsLoading: false,
  receivedCollectionsLoading: false,
  distributionsLoading: false,
  reportDataLoading: false,
  
  // General loading (for backward compatibility)
  loading: false,
  
  // Errors
  attendanceError: null,
  verificationsError: null,
  plannedCollectionsError: null,
  receivedCollectionsError: null,
  distributionsError: null,
  error: null,
  
  // Pagination data
  paginationData: {
    attendance: { 
      totalPages: 1, 
      totalItems: 0, 
      currentPage: 1 
    },
    verifications: { 
      totalPages: 1, 
      totalItems: 0, 
      currentPage: 1 
    }
  },
  
  // Current pages for pagination
  attendanceCurrentPage: 1,
  verificationCurrentPage: 1,
  itemsPerPage: 10
};

const employeeReportsReducer = (state = initialState, action) => {
  switch (action.type) {
    // Clear Errors
    case CLEAR_REPORT_ERRORS:
      return {
        ...state,
        attendanceError: null,
        verificationsError: null,
        plannedCollectionsError: null,
        receivedCollectionsError: null,
        distributionsError: null,
        error: null
      };

    // Update Selected Month
    case UPDATE_SELECTED_MONTH:
      return {
        ...state,
        selectedMonth: action.payload,
        // Reset pagination when month changes
        attendanceCurrentPage: 1,
        verificationCurrentPage: 1
      };

    // Update Pagination Data
    case UPDATE_ATTENDANCE_PAGINATION:
      return {
        ...state,
        paginationData: {
          ...state.paginationData,
          attendance: action.payload
        },
        attendanceCurrentPage: action.payload.currentPage
      };

    case UPDATE_VERIFICATION_PAGINATION:
      return {
        ...state,
        paginationData: {
          ...state.paginationData,
          verifications: action.payload
        },
        verificationCurrentPage: action.payload.currentPage
      };

    // Attendance Actions
    case FETCH_ATTENDANCE_REQUEST:
      return {
        ...state,
        attendanceLoading: true,
        loading: true,
        attendanceError: null,
        error: null
      };
    case FETCH_ATTENDANCE_SUCCESS:
      return {
        ...state,
        attendanceLoading: false,
        loading: false,
        attendance: action.payload,
        attendanceError: null,
        error: null
      };
    case FETCH_ATTENDANCE_FAIL:
      return {
        ...state,
        attendanceLoading: false,
        loading: false,
        attendanceError: action.payload,
        error: action.payload
      };

    // Verification Actions
    case FETCH_REPORT_VERIFICATIONS_REQUEST:
      return {
        ...state,
        verificationsLoading: true,
        loading: true,
        verificationsError: null,
        error: null
      };
    case FETCH_REPORT_VERIFICATIONS_SUCCESS:
      return {
        ...state,
        verificationsLoading: false,
        loading: false,
        verifications: action.payload,
        verificationsError: null,
        error: null
      };
    case FETCH_REPORT_VERIFICATIONS_FAIL:
      return {
        ...state,
        verificationsLoading: false,
        loading: false,
        verificationsError: action.payload,
        error: action.payload
      };

    // Planned Collections Actions
    case FETCH_PLANNED_COLLECTIONS_REQUEST:
      return {
        ...state,
        plannedCollectionsLoading: true,
        loading: true,
        plannedCollectionsError: null,
        error: null
      };
    case FETCH_PLANNED_COLLECTIONS_SUCCESS:
      return {
        ...state,
        plannedCollectionsLoading: false,
        loading: false,
        plannedCollections: action.payload,
        plannedCollectionsError: null,
        error: null
      };
    case FETCH_PLANNED_COLLECTIONS_FAIL:
      return {
        ...state,
        plannedCollectionsLoading: false,
        loading: false,
        plannedCollectionsError: action.payload,
        error: action.payload
      };

    // Received Collections Actions
    case FETCH_RECEIVED_COLLECTIONS_REQUEST:
      return {
        ...state,
        receivedCollectionsLoading: true,
        loading: true,
        receivedCollectionsError: null,
        error: null
      };
    case FETCH_RECEIVED_COLLECTIONS_SUCCESS:
      return {
        ...state,
        receivedCollectionsLoading: false,
        loading: false,
        receivedCollections: action.payload,
        receivedCollectionsError: null,
        error: null
      };
    case FETCH_RECEIVED_COLLECTIONS_FAIL:
      return {
        ...state,
        receivedCollectionsLoading: false,
        loading: false,
        receivedCollectionsError: action.payload,
        error: action.payload
      };

    // Distributions Actions
    case FETCH_DISTRIBUTIONS_REQUEST:
      return {
        ...state,
        distributionsLoading: true,
        loading: true,
        distributionsError: null,
        error: null
      };
    case FETCH_DISTRIBUTIONS_SUCCESS:
      return {
        ...state,
        distributionsLoading: false,
        loading: false,
        distributions: action.payload,
        distributionsError: null,
        error: null
      };
    case FETCH_DISTRIBUTIONS_FAIL:
      return {
        ...state,
        distributionsLoading: false,
        loading: false,
        distributionsError: action.payload,
        error: action.payload
      };

    // Combined Report Data Actions
    case FETCH_REPORT_DATA_REQUEST:
      return {
        ...state,
        reportDataLoading: true,
        loading: true,
        error: null
      };
    case FETCH_REPORT_DATA_SUCCESS:
      return {
        ...state,
        reportDataLoading: false,
        loading: false,
        error: null
      };
    case FETCH_REPORT_DATA_FAIL:
      return {
        ...state,
        reportDataLoading: false,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default employeeReportsReducer;