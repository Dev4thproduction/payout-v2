import {
  FETCH_FIXED_PRICE_REQUEST,
  FETCH_FIXED_PRICE_SUCCESS,
  FETCH_FIXED_PRICE_FAIL,
  UPDATE_FIXED_PRICE_REQUEST,
  UPDATE_FIXED_PRICE_SUCCESS,
  UPDATE_FIXED_PRICE_FAIL,
  SET_EDITING,
  SET_NEW_AMOUNT,
  CLEAR_MESSAGE,
} from '../constants/fixedPriceConstants';

const initialState = {
  currentAmount: null,
  newAmount: '',
  isEditing: false,
  loading: false,
  message: '',
  messageType: '',
};

export const fixedPriceReducer = (state = initialState, action) => {
  switch (action.type) {
    
    case UPDATE_FIXED_PRICE_REQUEST:
      return { ...state, loading: true };

    case FETCH_FIXED_PRICE_SUCCESS:
      return {
        ...state,
        loading: false,
        currentAmount: action.payload,
        newAmount: action.payload !== null ? action.payload.toString() : '',
      };

    case UPDATE_FIXED_PRICE_SUCCESS:
      return {
        ...state,
        loading: false,
        currentAmount: action.payload,
        isEditing: false,
        message: 'Fixed amount updated successfully!',
        messageType: 'success',
      };

    case FETCH_FIXED_PRICE_FAIL:
      return {
        ...state,
        loading: false,
        message: `Error fetching fixed amount: ${action.payload}`,
        messageType: 'error',
      };

    case UPDATE_FIXED_PRICE_FAIL:
      return {
        ...state,
        loading: false,
        message: `Error updating fixed amount: ${action.payload}`,
        messageType: 'error',
      };

    case SET_EDITING:
      return { ...state, isEditing: action.payload };

    case SET_NEW_AMOUNT:
      return { ...state, newAmount: action.payload };

    case CLEAR_MESSAGE:
      return { ...state, message: '', messageType: '' };

    default:
      return state;
  }
};
