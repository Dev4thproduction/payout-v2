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

const baseUrl = process.env.REACT_APP_API_URL;

// Fetch fixed amount
export const fetchFixedAmount = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_FIXED_PRICE_REQUEST });

    const response = await fetch('http://localhost:5000/api/fixed-amount');
    const contentType = response.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Expected JSON but got: ${contentType}`);
    }

    if (response.ok) {
      const data = await response.json();
      dispatch({
        type: FETCH_FIXED_PRICE_SUCCESS,
        payload: data.amount,
      });
    } else if (response.status === 404) {
      dispatch({
        type: FETCH_FIXED_PRICE_SUCCESS,
        payload: null,
      });
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch fixed amount');
    }
  } catch (error) {
    dispatch({
      type: FETCH_FIXED_PRICE_FAIL,
      payload: error.message,
    });
  }
};

// Update fixed amount
export const updateFixedAmount = (amount) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_FIXED_PRICE_REQUEST });

    const response = await fetch('http://localhost:5000/api/fixed-amount', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Expected JSON but got: ${contentType}`);
    }

    if (response.ok) {
      await response.json();
      dispatch({
        type: UPDATE_FIXED_PRICE_SUCCESS,
        payload: amount,
      });
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update fixed amount');
    }
  } catch (error) {
    dispatch({
      type: UPDATE_FIXED_PRICE_FAIL,
      payload: error.message,
    });
  }
};

// Local state actions
export const setIsEditing = (value) => ({
  type: SET_EDITING,
  payload: value,
});

export const setNewAmount = (value) => ({
  type: SET_NEW_AMOUNT,
  payload: value,
});

export const clearMessage = () => ({
  type: CLEAR_MESSAGE,
});
