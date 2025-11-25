// src/redux/process/processReducer.js
import * as types from "../constants/processConstants";

const initialState = {
  clients: [],
  products: [],
  processes: [],
  client: "",
  product: "",
  rate: "",
  isModalOpen: false,
  editingProcessId: null,
  searchTerm: "",
  loading: false,
  error: null,
};

export const processReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_CLIENTS_REQUEST:
    case types.FETCH_PRODUCTS_REQUEST:
    case types.FETCH_PROCESSES_REQUEST:
      return { ...state, loading: true };

    case types.FETCH_CLIENTS_SUCCESS:
      return { ...state, loading: false, clients: action.payload };

    case types.FETCH_PRODUCTS_SUCCESS:
      return { ...state, loading: false, products: action.payload };

    case types.FETCH_PROCESSES_SUCCESS:
      return { ...state, loading: false, processes: action.payload };

    case types.FETCH_CLIENTS_FAIL:
    case types.FETCH_PRODUCTS_FAIL:
    case types.FETCH_PROCESSES_FAIL:
      return { ...state, loading: false, error: action.payload };

    case types.SAVE_PROCESS_SUCCESS:
      return {
        ...state,
        isModalOpen: false,
        client: "",
        product: "",
        rate: "",
        editingProcessId: null,
      };

    case types.DELETE_PROCESS_SUCCESS:
      return {
        ...state,
        processes: state.processes.filter((proc) => proc._id !== action.payload),
      };

    case types.SET_CLIENT:
      return { ...state, client: action.payload };

    case types.SET_PRODUCT:
      return { ...state, product: action.payload };

    case types.SET_RATE:
      return { ...state, rate: action.payload };

    case types.SET_MODAL_OPEN:
      return { ...state, isModalOpen: action.payload };

    case types.SET_EDITING_PROCESS_ID:
      return { ...state, editingProcessId: action.payload };

    case types.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };

    default:
      return state;
  }
};
