import * as types from "../constants/verifyConstants";

const initialState = {
  processes: [],
  verifications: [],
  process: "",
  location: "",
  price: "",
  isModalOpen: false,
  editingId: null,
  searchTerm: "",
  loading: false,
  error: null,
  success: null,
};

export const verifyReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_PROCESSES_REQUEST:
    case types.FETCH_VERIFICATIONS_REQUEST:
    case types.SUBMIT_VERIFICATION_REQUEST:
      return { ...state, loading: true };

    case types.FETCH_PROCESSES_SUCCESS:
      return { ...state, loading: false, processes: action.payload };

    case types.FETCH_VERIFICATIONS_SUCCESS:
      return { ...state, loading: false, verifications: action.payload };

    case types.SUBMIT_VERIFICATION_SUCCESS:
      return {
        ...state,
        loading: false,
        success: "Verification submitted successfully",
        error: null,
        process: "",
        location: "",
        price: "",
        editingId: null,
        isModalOpen: false,
      };

    case types.FETCH_PROCESSES_FAIL:
    case types.FETCH_VERIFICATIONS_FAIL:
    case types.SUBMIT_VERIFICATION_FAIL:
      return { ...state, loading: false, error: action.payload };

    case types.DELETE_VERIFICATION_SUCCESS:
      return {
        ...state,
        verifications: state.verifications.filter((v) => v._id !== action.payload),
      };

    case types.SET_PROCESS:
      return { ...state, process: action.payload };
    case types.SET_LOCATION:
      return { ...state, location: action.payload };
    case types.SET_PRICE:
      return { ...state, price: action.payload };
    case types.SET_MODAL_OPEN:
      return { ...state, isModalOpen: action.payload };
    case types.SET_EDITING_ID:
      return { ...state, editingId: action.payload };
    case types.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };

    default:
      return state;
  }
};
