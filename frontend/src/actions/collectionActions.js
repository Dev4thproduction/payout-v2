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
} from '../constants/collectionConstants';

import {
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
  SET_DISTRIBUTION_SELECTED_MONTH,
  SET_DISTRIBUTION_SEARCH_TERM,
  SET_DISTRIBUTION_FORM_DATA,
  RESET_DISTRIBUTION_FORM_DATA,
  SET_DISTRIBUTION_PAGINATION
} from "../constants/collectionConstants";

const getAuthHeaders = (getState) => {
  const {
        userLogin: { userInfo },
      } = getState()
      
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userInfo.token}`
  };
};

// Helper function to handle API responses
const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      response.status === 401 
        ? "Authentication required" 
        : `API Error: ${response.status} - ${errorText || 'Unknown error'}`
    );
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return {};
};

// Fetch all planned collections
export const fetchPlannedCollections = () => async (dispatch,getState) => {
  try {
    dispatch({ type: FETCH_PLANNED_COLLECTIONS_REQUEST });

    const response = await fetch('http://localhost:5000/api/planned-collections', {
      headers: getAuthHeaders(getState)
    });

    const data = await handleApiResponse(response);
    
    const formattedData = (Array.isArray(data) ? data : []).map(item => ({
      id: item._id,
      month: item.month,
      name: item.name,
      product: item.product,
      cases: item.numCases || 0,
      pos: item.pos || 0,
      basic: item.basic || 0,
      moneyCollection: item.moneyCollection || 0
    }));

    dispatch({
      type: FETCH_PLANNED_COLLECTIONS_SUCCESS,
      payload: formattedData
    });
  } catch (error) {
    console.error('Error fetching planned collections:', error);
    dispatch({
      type: FETCH_PLANNED_COLLECTIONS_FAIL,
      payload: error.message
    });
  }
};

// Fetch processes
export const fetchProcesses = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FETCH_PROCESSES_REQUEST });

    const response = await fetch('http://localhost:5000/api/process', {
      headers: getAuthHeaders(getState)
    });

    const data = await handleApiResponse(response);

    dispatch({
      type: FETCH_PROCESSES_SUCCESS,
      payload: Array.isArray(data) ? data : []
    });
  } catch (error) {
    console.error('Error fetching processes:', error);
    dispatch({
      type: FETCH_PROCESSES_FAIL,
      payload: error.message
    });
  }
};

// Fetch users
export const fetchUsers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FETCH_USERS_REQUEST });

    const response = await fetch('http://localhost:5000/api/users', {
      headers: getAuthHeaders(getState)
    });

    const data = await handleApiResponse(response);
    const userOnly = (Array.isArray(data) ? data : []).filter((user) => user.role?.name === "User");

    dispatch({
      type: FETCH_USERS_SUCCESS,
      payload: userOnly
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    dispatch({
      type: FETCH_USERS_FAIL,
      payload: error.message
    });
  }
};

// Fetch supervisors
export const fetchSupervisors = () => async (dispatch, getState) => {
  try {
    const response = await fetch('http://localhost:5000/api/users/supervisors/list', {
      headers: getAuthHeaders(getState)
    });

    const data = await handleApiResponse(response);

    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    console.error('Error fetching supervisors:', error);
    return { success: false, error: error.message, data: [] };
  }
};

// Fetch team members (non-supervisors, non-admins)
export const fetchTeamMembersList = () => async (dispatch, getState) => {
  try {
    const response = await fetch('http://localhost:5000/api/users/team-members/list', {
      headers: getAuthHeaders(getState)
    });

    const data = await handleApiResponse(response);

    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    console.error('Error fetching team members:', error);
    return { success: false, error: error.message, data: [] };
  }
};

// Add new planned collection
export const addPlannedCollection = (entryData) => async (dispatch, getState) => {
  try {
    dispatch({ type: ADD_PLANNED_COLLECTION_REQUEST });

    // Validate required fields
    if (!entryData.month || !entryData.name || !entryData.product) {
      throw new Error('Missing required fields: month, name, and product are required');
    }

    const response = await fetch('http://localhost:5000/api/planned-collections', {
      method: 'POST',
      headers: getAuthHeaders(getState),
      body: JSON.stringify([entryData])
    });

    const data = await handleApiResponse(response);
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid response from server');
    }

    const newItem = {
      id: data[0]._id,
      month: entryData.month,
      name: entryData.name,
      product: entryData.product,
      cases: entryData.numCases || 0,
      pos: entryData.pos || 0,
      basic: entryData.basic || 0,
      moneyCollection: entryData.moneyCollection || 0
    };

    dispatch({
      type: ADD_PLANNED_COLLECTION_SUCCESS,
      payload: newItem
    });

    return { success: true, data: newItem };
  } catch (error) {
    console.error('Error adding planned collection:', error);
    dispatch({
      type: ADD_PLANNED_COLLECTION_FAIL,
      payload: error.message
    });
    return { success: false, error: error.message };
  }
};

// Update planned collection
export const updatePlannedCollection = (id, entryData) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_PLANNED_COLLECTION_REQUEST });

    if (!id) {
      throw new Error('ID is required for update operation');
    }

    const response = await fetch(`http://localhost:5000/api/planned-collections/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(getState),
      body: JSON.stringify(entryData)
    });

    await handleApiResponse(response);

    const updatedItem = {
      id,
      month: entryData.month,
      name: entryData.name,
      product: entryData.product,
      cases: entryData.numCases || 0,
      pos: entryData.pos || 0,
      basic: entryData.basic || 0,
      moneyCollection: entryData.moneyCollection || 0
    };

    dispatch({
      type: UPDATE_PLANNED_COLLECTION_SUCCESS,
      payload: updatedItem
    });

    return { success: true, data: updatedItem };
  } catch (error) {
    console.error('Error updating planned collection:', error);
    dispatch({
      type: UPDATE_PLANNED_COLLECTION_FAIL,
      payload: error.message
    });
    return { success: false, error: error.message };
  }
};

// Delete planned collection
export const deletePlannedCollection = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: DELETE_PLANNED_COLLECTION_REQUEST });

    if (!id) {
      throw new Error('ID is required for delete operation');
    }

    const response = await fetch(`http://localhost:5000/api/planned-collections/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(getState)
    });

    await handleApiResponse(response);

    dispatch({
      type: DELETE_PLANNED_COLLECTION_SUCCESS,
      payload: id
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting planned collection:', error);
    dispatch({
      type: DELETE_PLANNED_COLLECTION_FAIL,
      payload: error.message
    });
    return { success: false, error: error.message };
  }
};

// UI Actions
export const setSelectedMonth = (month) => (dispatch, getState) => {
  dispatch({
    type: SET_SELECTED_MONTH,
    payload: month
  });
};

export const setSearchTerm = (term) => (dispatch) => {
  dispatch({
    type: SET_SEARCH_TERM,
    payload: term
  });
};

export const setActiveTab = (tab) => (dispatch) => {
  dispatch({
    type: SET_ACTIVE_TAB,
    payload: tab
  });
};

export const setNewEntry = (entry) => (dispatch) => {
  dispatch({
    type: SET_NEW_ENTRY,
    payload: entry
  });
};

export const resetNewEntry = () => (dispatch) => {
  dispatch({ type: RESET_NEW_ENTRY });
};

// Fetch received data
export const fetchReceivedData = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FETCH_RECEIVED_DATA_REQUEST });

    const response = await fetch('http://localhost:5000/api/planned-collections/recived', {
      headers: getAuthHeaders(getState)
    });

    const result = await handleApiResponse(response);
    const data = result.data || result;

    const formattedData = (Array.isArray(data) ? data : []).map(item => ({
      id: item._id || item.id,
      month: item.month,
      process: item.process,
      billAmount: item.billAmount || 0,
      tds: item.tds || 0,
      balance: item.balance || 0,
      rate: item.rate || 0,
      grossSalary: item.grossSalary || 0,
      netSalary: item.netSalary || 0,
      total: item.total || 0
    }));

    dispatch({
      type: FETCH_RECEIVED_DATA_SUCCESS,
      payload: formattedData
    });
  } catch (error) {
    console.error('Error fetching received data:', error);
    dispatch({
      type: FETCH_RECEIVED_DATA_FAIL,
      payload: error.message
    });
  }
};

// Add received entry
export const addReceivedEntry = (entryData) => async (dispatch, getState) => {
  try {
    dispatch({ type: ADD_RECEIVED_ENTRY_REQUEST });

    // Validate required fields
    if (!entryData.month || !entryData.process) {
      throw new Error('Missing required fields: month and process are required');
    }

    const response = await fetch('http://localhost:5000/api/planned-collections/recived', {
      method: 'POST',
      headers: getAuthHeaders(getState),
      body: JSON.stringify(entryData),
    });

    const data = await handleApiResponse(response);
    const newItem = {
      id: data._id,
      ...entryData
    };

    dispatch({
      type: ADD_RECEIVED_ENTRY_SUCCESS,
      payload: newItem
    });

    return { success: true, data: newItem };
  } catch (error) {
    console.error('Error adding received entry:', error);
    dispatch({
      type: ADD_RECEIVED_ENTRY_FAIL,
      payload: error.message
    });
    return { success: false, error: error.message };
  }
};

// Update received entry
export const updateReceivedEntry = (id, entryData) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_RECEIVED_ENTRY_REQUEST });

    if (!id) {
      throw new Error('ID is required for update operation');
    }

    const response = await fetch(`http://localhost:5000/api/planned-collections/recived/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(getState),
      body: JSON.stringify(entryData),
    });

    await handleApiResponse(response);

    const updatedItem = {
      id,
      ...entryData
    };

    dispatch({
      type: UPDATE_RECEIVED_ENTRY_SUCCESS,
      payload: updatedItem
    });

    return { success: true, data: updatedItem };
  } catch (error) {
    console.error('Error updating received entry:', error);
    dispatch({
      type: UPDATE_RECEIVED_ENTRY_FAIL,
      payload: error.message
    });
    return { success: false, error: error.message };
  }
};

// Delete received entry
export const deleteReceivedEntry = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: DELETE_RECEIVED_ENTRY_REQUEST });

    if (!id) {
      throw new Error('ID is required for delete operation');
    }

    const response = await fetch(`http://localhost:5000/api/planned-collections/recived/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(getState)
    });

    await handleApiResponse(response);

    dispatch({
      type: DELETE_RECEIVED_ENTRY_SUCCESS,
      payload: id
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting received entry:', error);
    dispatch({
      type: DELETE_RECEIVED_ENTRY_FAIL,
      payload: error.message
    });
    return { success: false, error: error.message };
  }
};

// Form data actions
export const setReceivedFormData = (data) => (dispatch) => {
  dispatch({
    type: SET_RECEIVED_FORM_DATA,
    payload: data
  });
};

export const resetReceivedFormData = () => (dispatch) => {
  dispatch({ type: RESET_RECEIVED_FORM_DATA });
};

// Pagination actions
export const setReceivedPagination = (page) => (dispatch) => {
  dispatch({
    type: SET_RECEIVED_PAGINATION,
    payload: page
  });
};

// Helper to parse backend "Month YYYY" into "YYYY-MM"
const parseBackendMonth = (monthString) => {
  if (!monthString) return "";
  const [monthName, year] = monthString.split(" ");
  const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth() + 1;
  return `${year}-${String(monthIndex).padStart(2, "0")}`;
};

// Fetch distributions
export const fetchDistributions = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FETCH_DISTRIBUTIONS_REQUEST });

    const response = await fetch("http://localhost:5000/api/planned-collections/distributions/", {
      headers: getAuthHeaders(getState),
    });

    const result = await handleApiResponse(response);
    const data = result.data || result;

    const formattedData = (Array.isArray(data) ? data : []).map((item) => ({
      id: item._id || item.id,
      month: item.month,
      monthKey: parseBackendMonth(item.month),
      process: item.process,
      quantity: item.quantity || 0,
      notes: item.notes || "",
    }));

    dispatch({
      type: FETCH_DISTRIBUTIONS_SUCCESS,
      payload: formattedData,
    });
  } catch (error) {
    console.error("Error fetching distributions:", error);
    dispatch({
      type: FETCH_DISTRIBUTIONS_FAIL,
      payload: error.message,
    });
  }
};

// Add distribution
export const addDistribution = (entryData) => async (dispatch, getState) => {
  try {
    dispatch({ type: ADD_DISTRIBUTION_REQUEST });

    if (!entryData.month || !entryData.process) {
      throw new Error("Missing required fields: month and process are required");
    }

    const response = await fetch("http://localhost:5000/api/planned-collections/distribution", {
      method: "POST",
      headers: getAuthHeaders(getState),
      body: JSON.stringify(entryData),
    });

    const data = await handleApiResponse(response);
    const newItem = {
      id: data._id,
      ...entryData,
      monthKey: parseBackendMonth(entryData.month),
    };

    dispatch({
      type: ADD_DISTRIBUTION_SUCCESS,
      payload: newItem,
    });

    return { success: true, data: newItem };
  } catch (error) {
    console.error("Error adding distribution:", error);
    dispatch({
      type: ADD_DISTRIBUTION_FAIL,
      payload: error.message,
    });
    return { success: false, error: error.message };
  }
};

// Update distribution
export const updateDistribution = (id, entryData) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_DISTRIBUTION_REQUEST });

    if (!id) throw new Error("ID is required for update operation");

    const response = await fetch(`http://localhost:5000/api/planned-collections/distribution/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(getState),
      body: JSON.stringify(entryData),
    });

    await handleApiResponse(response);

    const updatedItem = {
      id,
      ...entryData,
      monthKey: parseBackendMonth(entryData.month),
    };

    dispatch({
      type: UPDATE_DISTRIBUTION_SUCCESS,
      payload: updatedItem,
    });

    return { success: true, data: updatedItem };
  } catch (error) {
    console.error("Error updating distribution:", error);
    dispatch({
      type: UPDATE_DISTRIBUTION_FAIL,
      payload: error.message,
    });
    return { success: false, error: error.message };
  }
};

// Delete distribution
export const deleteDistribution = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: DELETE_DISTRIBUTION_REQUEST });

    if (!id) throw new Error("ID is required for delete operation");

    const response = await fetch(`http://localhost:5000/api/planned-collections/distribution/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(getState),
    });

    await handleApiResponse(response);

    dispatch({
      type: DELETE_DISTRIBUTION_SUCCESS,
      payload: id,
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting distribution:", error);
    dispatch({
      type: DELETE_DISTRIBUTION_FAIL,
      payload: error.message,
    });
    return { success: false, error: error.message };
  }
};

// UI Actions
export const setDistributionSelectedMonth = (month) => (dispatch) => {
  dispatch({
    type: SET_DISTRIBUTION_SELECTED_MONTH,
    payload: month,
  });
};

export const setDistributionSearchTerm = (term) => (dispatch) => {
  dispatch({
    type: SET_DISTRIBUTION_SEARCH_TERM,
    payload: term,
  });
};

export const setDistributionFormData = (data) => (dispatch) => {
  dispatch({
    type: SET_DISTRIBUTION_FORM_DATA,
    payload: data,
  });
};

export const resetDistributionFormData = () => (dispatch) => {
  dispatch({ type: RESET_DISTRIBUTION_FORM_DATA });
};

export const setDistributionPagination = (page) => (dispatch) => {
  dispatch({
    type: SET_DISTRIBUTION_PAGINATION,
    payload: page,
  });
};
