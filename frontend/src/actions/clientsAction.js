// src/redux/clients/clientsActions.js

import axios from 'axios';
import * as types from '../constants/clientsConstant';
import { logout } from './userActions';

const baseUrl = process.env.REACT_APP_API_URL;
export const getClients = (search = '') => async (dispatch, getState) => {
  try {
    dispatch({
      type: types.FETCH_CLIENTS_REQUEST,
    });

    // Temporary: Get token from localStorage directly
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    console.log('UserInfo from localStorage:', userInfo);

    if (!userInfo || !userInfo.token) {
      // For testing, you can temporarily hardcode a token or skip auth
      console.log('No token found in localStorage');
      dispatch({
        type: types.FETCH_CLIENTS_FAILURE,
        payload: 'Not authorized, please login',
      });
      return;
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const url = search ? `${baseUrl}/clients?search=${encodeURIComponent(search)}` : `${baseUrl}/clients`;
    console.log('Making API call to:', url);
    
    const { data } = await axios.get(url, config);
    console.log('Raw API response:', data);

    dispatch({
      type: types.FETCH_CLIENTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error('API call failed:', error);
    dispatch({
      type: types.FETCH_CLIENTS_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const addClient = (name) => async (dispatch, getState) => {
  try {
    dispatch({
      type: types.ADD_CLIENT_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(
      `${baseUrl}/clients`,
      { name },
      config
    );

    dispatch({
      type: types.ADD_CLIENT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    if (error.response?.status === 401) {
      dispatch(logout());
      return;
    }
    dispatch({
      type: types.ADD_CLIENT_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateClient = (id, name) => async (dispatch, getState) => {
  try {
    dispatch({
      type: types.UPDATE_CLIENT_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(
      `${baseUrl}/clients/${id}`,
      { name },
      config
    );

    dispatch({
      type: types.UPDATE_CLIENT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    if (error.response?.status === 401) {
      dispatch(logout());
      return;
    }
    dispatch({
      type: types.UPDATE_CLIENT_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteClient = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: types.DELETE_CLIENT_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.delete(`${baseUrl}/clients/${id}`, config);

    dispatch({
      type: types.DELETE_CLIENT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    if (error.response?.status === 401) {
      dispatch(logout());
      return;
    }
    dispatch({
      type: types.DELETE_CLIENT_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Reset Actions
export const resetAddClient = () => ({
  type: types.ADD_CLIENT_RESET,
});

export const resetUpdateClient = () => ({
  type: types.UPDATE_CLIENT_RESET,
});

export const resetDeleteClient = () => ({
  type: types.DELETE_CLIENT_RESET,
});

export const resetGetClients = () => ({
  type: types.FETCH_CLIENTS_RESET,
});

// UI Actions (if needed for modal/search functionality)
export const setSearchQuery = (query) => ({
  type: types.SET_SEARCH_QUERY,
  payload: query
});

export const openModal = () => ({
  type: types.OPEN_MODAL
});

export const closeModal = () => ({
  type: types.CLOSE_MODAL
});

export const setEditingClient = (client) => ({
  type: types.SET_EDITING_CLIENT,
  payload: client
});

export const clearError = () => ({
  type: types.CLEAR_ERROR
});