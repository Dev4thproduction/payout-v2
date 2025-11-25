// src/redux/actions/employeeReportsActions.js
import axios from "axios";
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

const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

// ✅ Clear Errors
export const clearReportErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_REPORT_ERRORS });
};

// ✅ Update Selected Month
export const updateSelectedMonth = (month) => (dispatch) => {
  dispatch({ 
    type: UPDATE_SELECTED_MONTH, 
    payload: month 
  });
};

// ✅ Update Attendance Pagination
export const updateAttendancePagination = (pageData) => (dispatch) => {
  dispatch({ 
    type: UPDATE_ATTENDANCE_PAGINATION, 
    payload: pageData 
  });
};

// ✅ Update Verification Pagination
export const updateVerificationPagination = (pageData) => (dispatch) => {
  dispatch({ 
    type: UPDATE_VERIFICATION_PAGINATION, 
    payload: pageData 
  });
};

// ✅ Fetch Attendance Data
export const fetchAttendanceData = (month, page = 1, limit = 10) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_ATTENDANCE_REQUEST });
    
    // Build params - if month is "all", don't include month parameter
    const params = { page, limit };
    if (month && month !== "all") {
      params.month = month;
    }
    
    const { data } = await axios.get(`${baseUrl}/attendance`, { params });
    
    dispatch({ 
      type: FETCH_ATTENDANCE_SUCCESS, 
      payload: data 
    });

    // Update pagination data
    const totalPages = data.totalPages || Math.ceil((data.total || data.data?.length || 0) / limit);
    const totalItems = data.total || data.data?.length || 0;
    const currentPage = data.currentPage || page;

    dispatch(updateAttendancePagination({
      totalPages,
      totalItems,
      currentPage
    }));

  } catch (error) {
    dispatch({
      type: FETCH_ATTENDANCE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ Fetch Verification Data for Reports
export const fetchReportVerifications = (month, page = 1, limit = 10) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_REPORT_VERIFICATIONS_REQUEST });
    
    // Build params - if month is "all", don't include month parameter
    const params = { page, limit };
    if (month && month !== "all") {
      params.month = month;
    }
    
    const { data } = await axios.get(`${baseUrl}/payout-verifications`, { params });
    
    dispatch({ 
      type: FETCH_REPORT_VERIFICATIONS_SUCCESS, 
      payload: data 
    });

    // Update pagination data
    const totalPages = data.totalPages || Math.ceil((data.total || data.data?.length || 0) / limit);
    const totalItems = data.total || data.data?.length || 0;
    const currentPage = data.currentPage || page;

    dispatch(updateVerificationPagination({
      totalPages,
      totalItems,
      currentPage
    }));

  } catch (error) {
    dispatch({
      type: FETCH_REPORT_VERIFICATIONS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ Fetch Planned Collections
export const fetchPlannedCollections = (month) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_PLANNED_COLLECTIONS_REQUEST });
    
    // Build params - if month is "all", don't include month parameter
    const params = {};
    if (month && month !== "all") {
      params.month = month;
    }
    
    const { data } = await axios.get(`${baseUrl}/planned-collections`, { params });
    
    dispatch({ 
      type: FETCH_PLANNED_COLLECTIONS_SUCCESS, 
      payload: data 
    });
  } catch (error) {
    dispatch({
      type: FETCH_PLANNED_COLLECTIONS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ Fetch Received Collections
export const fetchReceivedCollections = (month, page = 1, limit = 100) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_RECEIVED_COLLECTIONS_REQUEST });
    
    // Build params - if month is "all", don't include month parameter
    const params = { page, limit };
    if (month && month !== "all") {
      params.month = month;
    }
    
    const { data } = await axios.get(`${baseUrl}/planned-collections/recived`, { params });
    
    dispatch({ 
      type: FETCH_RECEIVED_COLLECTIONS_SUCCESS, 
      payload: data 
    });
  } catch (error) {
    dispatch({
      type: FETCH_RECEIVED_COLLECTIONS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ Fetch Distributions
export const fetchDistributions = (month) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_DISTRIBUTIONS_REQUEST });
    
    // Build params - if month is "all", don't include month parameter
    const params = {};
    if (month && month !== "all") {
      params.month = month;
    }
    
    const { data } = await axios.get(`${baseUrl}/planned-collections/distributions`, { params });
    
    dispatch({ 
      type: FETCH_DISTRIBUTIONS_SUCCESS, 
      payload: data 
    });
  } catch (error) {
    dispatch({
      type: FETCH_DISTRIBUTIONS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ Fetch All Report Data (Combined Action)
export const fetchAllReportData = (month, attendancePage = 1, verificationPage = 1, itemsPerPage = 10) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_REPORT_DATA_REQUEST });

    // Update selected month first
    dispatch(updateSelectedMonth(month));

    // Fetch all data in parallel
    const promises = [
      dispatch(fetchAttendanceData(month, attendancePage, itemsPerPage)),
      dispatch(fetchReportVerifications(month, verificationPage, itemsPerPage)),
      dispatch(fetchPlannedCollections(month)),
      dispatch(fetchReceivedCollections(month, 1, 100)),
      dispatch(fetchDistributions(month))
    ];

    await Promise.all(promises);

    dispatch({ type: FETCH_REPORT_DATA_SUCCESS });

  } catch (error) {
    dispatch({
      type: FETCH_REPORT_DATA_FAIL,
      payload: error.message || "Failed to fetch report data",
    });
  }
};

// ✅ Change Attendance Page (for pagination)
export const changeAttendancePage = (month, page, itemsPerPage = 10) => async (dispatch) => {
  dispatch(fetchAttendanceData(month, page, itemsPerPage));
};

// ✅ Change Verification Page (for pagination)
export const changeVerificationPage = (month, page, itemsPerPage = 10) => async (dispatch) => {
  dispatch(fetchReportVerifications(month, page, itemsPerPage));
};