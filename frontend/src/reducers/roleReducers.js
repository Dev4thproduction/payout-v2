import {
    ADD_ROLE_FAIL,
    ADD_ROLE_REQUEST,
    ADD_ROLE_RESET,
    ADD_ROLE_SUCCESS,
    GET_ROLES_FAIL,
    GET_ROLES_REQUEST,
    GET_ROLES_RESET,
    GET_ROLES_SUCCESS,
    GET_ROLE_BY_ID_FAIL,
    GET_ROLE_BY_ID_REQUEST,
    GET_ROLE_BY_ID_RESET,
    GET_ROLE_BY_ID_SUCCESS,
    UPDATE_ROLE_FAIL,
    UPDATE_ROLE_REQUEST,
    UPDATE_ROLE_RESET,
    UPDATE_ROLE_SUCCESS,
  } from '../constants/roleConstants'

  export const getRolesReducer = (state = {}, action) => {
    switch (action.type) {
      case GET_ROLES_REQUEST:
        return { loadingGetRolesInfo: true }
      case GET_ROLES_SUCCESS:
        return { loadingGetRolesInfo: false, getRolesData: action.payload }
      case GET_ROLES_FAIL:
        return { loadingGetRolesInfo: false, errorGetRolesInfo: action.payload }
      case GET_ROLES_RESET:
        return {}
      default:
        return state
    }
  }
  
  export const addRoleReducer = (state = {}, action) => {
    switch (action.type) {
      case ADD_ROLE_REQUEST:
        return { loadingAddRoleInfo: true }
      case ADD_ROLE_SUCCESS:
        return { loadingAddRoleInfo: false, addRoleData: action.payload }
      case ADD_ROLE_FAIL:
        return { loadingAddRoleInfo: false, errorAddRoleInfo: action.payload }
      case ADD_ROLE_RESET:
        return {}
      default:
        return state
    }
  }
  
  export const getRoleByIDReducer = (state = {}, action) => {
    switch (action.type) {
      case GET_ROLE_BY_ID_REQUEST:
        return { loadingGetRoleByIDInfo: true }
      case GET_ROLE_BY_ID_SUCCESS:
        return { loadingGetRoleByIDInfo: false, getRoleByIDData: action.payload }
      case GET_ROLE_BY_ID_FAIL:
        return {
          loadingGetRoleByIDInfo: false,
          errorGetRoleByIDInfo: action.payload,
        }
      case GET_ROLE_BY_ID_RESET:
        return {}
      default:
        return state
    }
  }
  
  export const updateRoleReducer = (state = {}, action) => {
    switch (action.type) {
      case UPDATE_ROLE_REQUEST:
        return { loadingUpdateRoleInfo: true }
      case UPDATE_ROLE_SUCCESS:
        return { loadingUpdateRoleInfo: false, updateRoleData: action.payload }
      case UPDATE_ROLE_FAIL:
        return {
          loadingUpdateRoleInfo: false,
          errorUpdateRoleInfo: action.payload,
        }
      case UPDATE_ROLE_RESET:
        return {}
      default:
        return state
    }
  }

  