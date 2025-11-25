// src/redux/clients/clientsReducer.js

import * as types from '../constants/clientsConstant';

export const getClientsReducer = (state = {}, action) => {
  switch (action.type) {
    case types.FETCH_CLIENTS_REQUEST:
      return { loadingGetClientsInfo: true }
    case types.FETCH_CLIENTS_SUCCESS:
      return {
        loadingGetClientsInfo: false,
        getClientsData: action.payload,
      }
    case types.FETCH_CLIENTS_FAILURE:
      return {
        loadingGetClientsInfo: false,
        errorGetClientsInfo: action.payload,
      }
    case types.FETCH_CLIENTS_RESET:
      return {}
    default:
      return state
  }
}

export const addClientReducer = (state = {}, action) => {
  switch (action.type) {
    case types.ADD_CLIENT_REQUEST:
      return { loadingAddClientInfo: true }
    case types.ADD_CLIENT_SUCCESS:
      return {
        loadingAddClientInfo: false,
        addClientData: action.payload,
      }
    case types.ADD_CLIENT_FAILURE:
      return {
        loadingAddClientInfo: false,
        errorAddClientInfo: action.payload,
      }
    case types.ADD_CLIENT_RESET:
      return {}
    default:
      return state
  }
}

export const updateClientReducer = (state = {}, action) => {
  switch (action.type) {
    case types.UPDATE_CLIENT_REQUEST:
      return { loadingUpdateClientInfo: true }
    case types.UPDATE_CLIENT_SUCCESS:
      return {
        loadingUpdateClientInfo: false,
        updateClientData: action.payload,
      }
    case types.UPDATE_CLIENT_FAILURE:
      return {
        loadingUpdateClientInfo: false,
        errorUpdateClientInfo: action.payload,
      }
    case types.UPDATE_CLIENT_RESET:
      return {}
    default:
      return state
  }
}

export const deleteClientReducer = (state = {}, action) => {
  switch (action.type) {
    case types.DELETE_CLIENT_REQUEST:
      return { loadingDeleteClientInfo: true }
    case types.DELETE_CLIENT_SUCCESS:
      return {
        loadingDeleteClientInfo: false,
        deleteClientData: action.payload,
      }
    case types.DELETE_CLIENT_FAILURE:
      return {
        loadingDeleteClientInfo: false,
        errorDeleteClientInfo: action.payload,
      }
    case types.DELETE_CLIENT_RESET:
      return {}
    default:
      return state
  }
}

// UI state reducer for modal and search functionality
export const clientUIReducer = (state = { searchQuery: '', isModalOpen: false, isEditing: false, currentClient: null }, action) => {
  switch (action.type) {
    case types.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload
      }
    case types.OPEN_MODAL:
      return {
        ...state,
        isModalOpen: true
      }
    case types.CLOSE_MODAL:
      return {
        ...state,
        isModalOpen: false,
        isEditing: false,
        currentClient: null
      }
    case types.SET_EDITING_CLIENT:
      return {
        ...state,
        isEditing: true,
        currentClient: action.payload,
        isModalOpen: true
      }
    case types.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }
    default:
      return state
  }
}

