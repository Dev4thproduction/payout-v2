// src/redux/process/processActions.js
import * as types from "../constants/processConstants";

const baseUrl = process.env.REACT_APP_API_URL;

// Fetch all clients with Authorization
export const fetchClients = () => async (dispatch, getState) => {
  try {
    dispatch({ type: types.FETCH_CLIENTS_REQUEST });

    // ✅ Get token from Redux state
    const {
      auth: { userInfo },
    } = getState();

    const res = await fetch("http://localhost:5000/api/clients", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`, // ✅ Include token
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch clients");
    }

    const data = await res.json();

    dispatch({ type: types.FETCH_CLIENTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: types.FETCH_CLIENTS_FAIL,
      payload: error.message || "Something went wrong",
    });
  }
};


// ✅ Fetch Products
export const fetchProducts = () => async (dispatch) => {
  try {
    dispatch({ type: types.FETCH_PRODUCTS_REQUEST });
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();
    dispatch({ type: types.FETCH_PRODUCTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: types.FETCH_PRODUCTS_FAIL, payload: error.message });
  }
};

// ✅ Fetch Processes
export const fetchProcesses = () => async (dispatch) => {
  try {
    dispatch({ type: types.FETCH_PROCESSES_REQUEST });
    const res = await fetch("http://localhost:5000/api/process");
    const data = await res.json();
    dispatch({ type: types.FETCH_PROCESSES_SUCCESS, payload: Array.isArray(data) ? data : []  });
  } catch (error) {
    dispatch({ type: types.FETCH_PROCESSES_FAIL, payload: error.message });
  }
};

// ✅ Save Process (Add/Edit)
export const saveProcess = (id, client, product, rate) => async (dispatch) => {
  try {
    dispatch({ type: types.SAVE_PROCESS_REQUEST });

    const method = id ? "PUT" : "POST";
    const url = id
      ? `http://localhost:5000/api/process/${id}`
      : "http://localhost:5000/api/process";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client, product, rate }),
    });

    const data = await res.json();
    dispatch({ type: types.SAVE_PROCESS_SUCCESS, payload: data });

    dispatch(fetchProcesses());
  } catch (error) {
    dispatch({ type: types.SAVE_PROCESS_FAIL, payload: error.message });
  }
};

// ✅ Delete Process
export const deleteProcess = (id) => async (dispatch) => {
  try {
    dispatch({ type: types.DELETE_PROCESS_REQUEST });
    await fetch(`http://localhost:5000/api/process/${id}`, { method: "DELETE" });
    dispatch({ type: types.DELETE_PROCESS_SUCCESS, payload: id });
    dispatch(fetchProcesses());
  } catch (error) {
    dispatch({ type: types.DELETE_PROCESS_FAIL, payload: error.message });
  }
};

// ✅ Local State Actions
export const setClient = (value) => ({ type: types.SET_CLIENT, payload: value });
export const setProduct = (value) => ({ type: types.SET_PRODUCT, payload: value });
export const setRate = (value) => ({ type: types.SET_RATE, payload: value });
export const setModalOpen = (value) => ({ type: types.SET_MODAL_OPEN, payload: value });
export const setEditingProcessId = (value) => ({
  type: types.SET_EDITING_PROCESS_ID,
  payload: value,
});
export const setSearchTerm = (value) => ({ type: types.SET_SEARCH_TERM, payload: value });
