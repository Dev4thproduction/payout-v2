// src/actions/verificationActions.js
import axios from "axios";
import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAIL,
  FETCH_VERIFICATIONS_REQUEST,
  FETCH_VERIFICATIONS_SUCCESS,
  FETCH_VERIFICATIONS_FAIL,
  FETCH_PAYOUTS_REQUEST,
  FETCH_PAYOUTS_SUCCESS,
  FETCH_PAYOUTS_FAIL,
  ADD_PAYOUT_SUCCESS,
  UPDATE_PAYOUT_SUCCESS,
  DELETE_PAYOUT_SUCCESS
} from "../constants/verificationConstants.js";

const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// ✅ Fetch Users
export const fetchUsers = () => async (dispatch,getState) => {
  try {

    dispatch({ type: FETCH_USERS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState()
    

    const { data } = await axios.get(`${baseUrl}/users`, {
      headers: { Authorization: `Bearer ${userInfo.token}` }
    });
    dispatch({ type: FETCH_USERS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FETCH_USERS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ Fetch Verifications
export const fetchVerifications = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_VERIFICATIONS_REQUEST });
    const { data } = await axios.get(`${baseUrl}/verifications`);
    dispatch({ 
      type: FETCH_VERIFICATIONS_SUCCESS, 
      payload: data.success ? data.data || [] : [] 
    });
  } catch (error) {
    dispatch({
      type: FETCH_VERIFICATIONS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ Fetch Payout Verifications
export const fetchPayouts = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_PAYOUTS_REQUEST });
    const { data } = await axios.get(`${baseUrl}/payout-verifications`);
    dispatch({ 
      type: FETCH_PAYOUTS_SUCCESS, 
      payload: data.success ? data.data || [] : [] 
    });
  } catch (error) {
    dispatch({
      type: FETCH_PAYOUTS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ Create Payout
export const createPayout = (payload) => async (dispatch) => {
  try {
    await axios.post(`${baseUrl}/payout-verifications`, payload, {
      headers: { "Content-Type": "application/json" }
    });
    dispatch({ type: ADD_PAYOUT_SUCCESS });
    dispatch(fetchPayouts()); // Refresh payout list
  } catch (error) {
    dispatch({
      type: FETCH_PAYOUTS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ Update Payout
export const updatePayout = (id, payload) => async (dispatch) => {
  try {
    await axios.put(`${baseUrl}/payout-verifications/${id}`, payload, {
      headers: { "Content-Type": "application/json" }
    });
    dispatch({ type: UPDATE_PAYOUT_SUCCESS });
    dispatch(fetchPayouts()); // Refresh payout list
  } catch (error) {
    dispatch({
      type: FETCH_PAYOUTS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ Save Payout (Create or Update)
export const savePayout = ({ payload, isEditing, id }) => async (dispatch) => {
  if (isEditing) {
    dispatch(updatePayout(id, payload));
  } else {
    dispatch(createPayout(payload));
  }
};

// ✅ Delete Payout
export const deletePayout = (id) => async (dispatch) => {
  try {
    await axios.delete(`${baseUrl}/payout-verifications/${id}`);
    dispatch({ type: DELETE_PAYOUT_SUCCESS });
    dispatch(fetchPayouts()); // Refresh payout list
  } catch (error) {
    dispatch({
      type: FETCH_PAYOUTS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};