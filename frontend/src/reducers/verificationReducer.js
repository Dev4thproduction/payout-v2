// src/reducers/verificationReducer.js
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

const initialState = {
  users: [],
  verifications: [],
  payouts: [],
  loading: false,
  error: null
};

const verificationReducer = (state = initialState, action) => {
  switch (action.type) {
    // Users
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
        error: null
      };
    case FETCH_USERS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Verifications
    case FETCH_VERIFICATIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_VERIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        verifications: action.payload,
        error: null
      };
    case FETCH_VERIFICATIONS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Payouts
    case FETCH_PAYOUTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_PAYOUTS_SUCCESS:
      return {
        ...state,
        loading: false,
        payouts: action.payload,
        error: null
      };
    case FETCH_PAYOUTS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Payout Actions (these don't change state directly, just provide feedback)
    case ADD_PAYOUT_SUCCESS:
    case UPDATE_PAYOUT_SUCCESS:
    case DELETE_PAYOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };

    default:
      return state;
  }
};

export default verificationReducer;