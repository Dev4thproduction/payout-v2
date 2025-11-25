import {
  FIXED_FETCH_REQUEST,
  FIXED_FETCH_SUCCESS,
  FIXED_FETCH_FAIL,
  FIXED_DELETE_SUCCESS,
  FIXED_UPDATE_SUCCESS,
  FIXED_UPLOAD_REQUEST,
  FIXED_UPLOAD_SUCCESS,
  FIXED_UPLOAD_FAIL,
} from "../constants/fixedConstant.js";

const initialState = {
  loading: false,
  data: [],
  error: null,
  uploadProgress: 0,
};

export const FIXEDReducer = (state = initialState, action) => {
  switch (action.type) {
    case FIXED_FETCH_REQUEST:
    case FIXED_UPLOAD_REQUEST:
      return { ...state, loading: true, error: null };

    case FIXED_FETCH_SUCCESS:
      return { ...state, loading: false, data: action.payload };

    case FIXED_FETCH_FAIL:
    case FIXED_UPLOAD_FAIL:
      return { ...state, loading: false, error: action.payload };

    case FIXED_DELETE_SUCCESS:
      return {
        ...state,
        data: state.data.filter((item) => item._id !== action.payload),
      };

    case FIXED_UPDATE_SUCCESS:
      return {
        ...state,
        data: state.data.map((item) =>
          item._id === action.payload._id ? action.payload : item
        ),
      };

    case FIXED_UPLOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.updatedData,
      };

    default:
      return state;
  }
};
