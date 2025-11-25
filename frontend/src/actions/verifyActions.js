import axios from "axios";
import * as types from "../constants/verifyConstants";

export const fetchProcesses = () => async (dispatch) => {
  try {
    dispatch({ type: types.FETCH_PROCESSES_REQUEST });
    const res = await axios.get("http://localhost:5000/api/process");
    dispatch({ type: types.FETCH_PROCESSES_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({
      type: types.FETCH_PROCESSES_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const fetchVerifications = () => async (dispatch) => {
  try {
    dispatch({ type: types.FETCH_VERIFICATIONS_REQUEST });
    const res = await axios.get("http://localhost:5000/api/verifications");
    dispatch({ type: types.FETCH_VERIFICATIONS_SUCCESS, payload: res.data.data });
  } catch (error) {
    dispatch({
      type: types.FETCH_VERIFICATIONS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const submitVerification = (editingId, process, location, price) => async (dispatch) => {
  try {
    dispatch({ type: types.SUBMIT_VERIFICATION_REQUEST });

    if (editingId) {
      await axios.put(`http://localhost:5000/api/verifications/${editingId}`, {
        process,
        location,
        price: Number(price),
      });
    } else {
      await axios.post("http://localhost:5000/api/verifications", {
        process,
        location,
        price: Number(price),
      });
    }

    dispatch({ type: types.SUBMIT_VERIFICATION_SUCCESS });
    dispatch(fetchVerifications());
  } catch (error) {
    dispatch({
      type: types.SUBMIT_VERIFICATION_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const deleteVerification = (id) => async (dispatch) => {
  try {
    await axios.delete(`http://localhost:5000/api/verifications/${id}`);
    dispatch({ type: types.DELETE_VERIFICATION_SUCCESS, payload: id });
  } catch (error) {
    console.error("Delete failed:", error);
  }
};

// Local State Actions
export const setProcess = (value) => ({ type: types.SET_PROCESS, payload: value });
export const setLocation = (value) => ({ type: types.SET_LOCATION, payload: value });
export const setPrice = (value) => ({ type: types.SET_PRICE, payload: value });
export const setModalOpen = (value) => ({ type: types.SET_MODAL_OPEN, payload: value });
export const setEditingId = (value) => ({ type: types.SET_EDITING_ID, payload: value });
export const setSearchTerm = (value) => ({ type: types.SET_SEARCH_TERM, payload: value });
