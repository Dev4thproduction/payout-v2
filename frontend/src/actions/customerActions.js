import axios from 'axios'

import {
  ADD_CUSTOMER_FAIL,
  ADD_CUSTOMER_REQUEST,
  ADD_CUSTOMER_SUCCESS,
  GET_CUSTOMERS_FAIL,
  GET_CUSTOMERS_REQUEST,
  GET_CUSTOMERS_SUCCESS,
  UPDATE_CUSTOMER_FAIL,
  UPDATE_CUSTOMER_REQUEST,
  UPDATE_CUSTOMER_RESET,
  UPDATE_CUSTOMER_SUCCESS
} from '../constants/customerConstants';
import { logout } from './userActions';

const baseUrl = process.env.REACT_APP_API_URL;

export const getCustomers = (search = '') => async (dispatch, getState) => {
    try {
      dispatch({
        type: GET_CUSTOMERS_REQUEST,
      })
  
      const {
        userLogin: { userInfo },
      } = getState()
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
  
      // Add search parameter to the URL if provided
      const url = search ? `${baseUrl}/customers?search=${encodeURIComponent(search)}` : `${baseUrl}/customers`
      const { data } = await axios.get(url, config)
  
      dispatch({
        type: GET_CUSTOMERS_SUCCESS,
        payload: data,
      })
    } catch (error) {
      if (error.response.status === 401) {
        dispatch(logout())
        return
      }
      dispatch({
        type: GET_CUSTOMERS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }
  
  export const addCustomer =
    (name, logo, mapOnPDF, openTransfers) => async (dispatch, getState) => {
      try {
        dispatch({
          type: ADD_CUSTOMER_REQUEST,
        })
  
        const {
          userLogin: { userInfo },
        } = getState()
  
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
  
        const { data } = await axios.post(
          `${baseUrl}/customers`,
          { name, logo, mapOnPDF, openTransfers },
          config
        )
  
        dispatch({
          type: ADD_CUSTOMER_SUCCESS,
          payload: data,
        })
      } catch (error) {
        if (error.response.status === 401) {
          dispatch(logout())
          return
        }
        dispatch({
          type: ADD_CUSTOMER_FAIL,
          payload:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        })
      }
    }

    export const updateCustomer =
  (id, name, logo, mapOnPDF, openTransfers) => async (dispatch, getState) => {
    try {
      dispatch({
        type: UPDATE_CUSTOMER_REQUEST,
      })

      const {
        userLogin: { userInfo },
      } = getState()

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.put(
        `${baseUrl}/customers/${id}`,
        { name, logo, mapOnPDF, openTransfers },
        config
      )

      dispatch({
        type: UPDATE_CUSTOMER_SUCCESS,
        payload: data,
      })
    } catch (error) {
      if (error.response.status === 401) {
        dispatch(logout())
        return
      }
      dispatch({
        type: UPDATE_CUSTOMER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }