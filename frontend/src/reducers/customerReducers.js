import {
    ADD_CUSTOMER_FAIL,
    ADD_CUSTOMER_REQUEST,
    ADD_CUSTOMER_RESET,
    ADD_CUSTOMER_SUCCESS,
    GET_CUSTOMERS_FAIL,
    GET_CUSTOMERS_REQUEST,
    GET_CUSTOMERS_RESET,
    GET_CUSTOMERS_SUCCESS,
    UPDATE_CUSTOMER_FAIL,
    UPDATE_CUSTOMER_REQUEST,
    UPDATE_CUSTOMER_RESET,
    UPDATE_CUSTOMER_SUCCESS
  } from '../constants/customerConstants';

  export const getCustomersReducer = (state = {}, action) => {
    switch (action.type) {
      case GET_CUSTOMERS_REQUEST:
        return { loadingGetCustomersInfo: true }
      case GET_CUSTOMERS_SUCCESS:
        return {
          loadingGetCustomersInfo: false,
          getCustomersData: action.payload,
        }
      case GET_CUSTOMERS_FAIL:
        return {
          loadingGetCustomersInfo: false,
          errorGetCustomersInfo: action.payload,
        }
      case GET_CUSTOMERS_RESET:
        return {}
      default:
        return state
    }
  }
  
  export const addCustomerReducer = (state = {}, action) => {
    switch (action.type) {
      case ADD_CUSTOMER_REQUEST:
        return { loadingAddCustomerInfo: true }
      case ADD_CUSTOMER_SUCCESS:
        return {
          loadingAddCustomerInfo: false,
          addCustomerData: action.payload,
        }
      case ADD_CUSTOMER_FAIL:
        return {
          loadingAddCustomerInfo: false,
          errorAddCustomerInfo: action.payload,
        }
      case ADD_CUSTOMER_RESET:
        return {}
      default:
        return state
    }
  }

  export const updateCustomerReducer = (state = {}, action) => {
    switch (action.type) {
      case UPDATE_CUSTOMER_REQUEST:
        return { loadingUpdateCustomerInfo: true }
      case UPDATE_CUSTOMER_SUCCESS:
        return {
          loadingUpdateCustomerInfo: false,
          updateCustomerData: action.payload,
        }
      case UPDATE_CUSTOMER_FAIL:
        return {
          loadingUpdateCustomerInfo: false,
          errorUpdateCustomerInfo: action.payload,
        }
      case UPDATE_CUSTOMER_RESET:
        return {}
      default:
        return state
    }
  }