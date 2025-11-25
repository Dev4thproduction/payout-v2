import {
  ADD_USER_FAIL,
  ADD_USER_REQUEST,
  ADD_USER_RESET,
  ADD_USER_SUCCESS,
  GET_ROLE_FAIL,
  GET_ROLE_REQUEST,
  GET_ROLE_RESET,
  GET_ROLE_SUCCESS,
  GET_USERS_FAIL,
  GET_USERS_REQUEST,
  GET_USERS_RESET,
  GET_USERS_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_RESET,
  USER_LOGOUT,
  USER_LOGOUT_REQUEST,
  USER_LOGOUT_SUCCESS,
  USER_LOGOUT_FAIL,
  USER_LOGOUT_RESET,
  GET_USER_BY_ID_FAIL,
  GET_USER_BY_ID_REQUEST,
  GET_USER_BY_ID_RESET,
  GET_USER_BY_ID_SUCCESS,
  ADD_CUSTOMER_TO_USER_FAIL,
  ADD_CUSTOMER_TO_USER_REQUEST,
  ADD_CUSTOMER_TO_USER_RESET,
  ADD_CUSTOMER_TO_USER_SUCCESS,
  REMOVE_CUSTOMER_FROM_USER_FAIL,
  REMOVE_CUSTOMER_FROM_USER_REQUEST,
  REMOVE_CUSTOMER_FROM_USER_RESET,
  REMOVE_CUSTOMER_FROM_USER_SUCCESS,
  RESET_DEVICE_ID_FAIL,
  RESET_DEVICE_ID_REQUEST,
  RESET_DEVICE_ID_RESET,
  RESET_DEVICE_ID_SUCCESS,
  RESET_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_RESET,
  RESET_PASSWORD_SUCCESS,
  UPDATE_USER_FAIL,
  UPDATE_USER_REQUEST,
  UPDATE_USER_RESET,
  UPDATE_USER_SUCCESS,
  FETCH_ATTENDANCE_FAIL,
  FETCH_ATTENDANCE_REQUEST,
  FETCH_ATTENDANCE_RESET,
  FETCH_ATTENDANCE_SUCCESS,
  RESIGN_USER_FAIL,
  RESIGN_USER_REQUEST,
  RESIGN_USER_RESET,
  RESIGN_USER_SUCCESS,
  FORCE_LOGOUT_USER_FAIL,
  FORCE_LOGOUT_USER_REQUEST,
  FORCE_LOGOUT_USER_RESET,
  FORCE_LOGOUT_USER_SUCCESS,
  FORCE_LOGOUT_MULTIPLE_FAIL,
  FORCE_LOGOUT_MULTIPLE_REQUEST,
  FORCE_LOGOUT_MULTIPLE_RESET,
  FORCE_LOGOUT_MULTIPLE_SUCCESS,
} from '../constants/userConstants'

export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loadingUserInfo: true }
    case USER_LOGIN_SUCCESS:
      return { loadingUserInfo: false, userInfo: action.payload }
    case USER_LOGIN_FAIL:
      return { loadingUserInfo: false, errorUserInfo: action.payload }
    case USER_LOGOUT:
      return {}
    default:
      return state
  }
}

export const getRoleReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ROLE_REQUEST:
      return { loadingGetRole: true }
    case GET_ROLE_SUCCESS:
      return { loadingGetRole: false, getRoleData: action.payload }
    case GET_ROLE_FAIL:
      return { loadingGetRole: false, errorGetRole: action.payload }
    case GET_ROLE_RESET:
      return {}
    default:
      return state
  }
}

export const getUsersReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_USERS_REQUEST:
      return { loadingGetUsersInfo: true }
    case GET_USERS_SUCCESS:
      return { loadingGetUsersInfo: false, getUsersData: action.payload }
    case GET_USERS_FAIL:
      return { loadingGetUsersInfo: false, errorGetUsersInfo: action.payload }
    case GET_USERS_RESET:
      return {}
    default:
      return state
  }
}

export const addUserReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_USER_REQUEST:
      return { loadingAddUserInfo: true }
    case ADD_USER_SUCCESS:
      return {
        loadingAddUserInfo: false,
        addUserData: action.payload,
      }
    case ADD_USER_FAIL:
      return {
        loadingAddUserInfo: false,
        errorAddUserInfo: action.payload,
      }
    case ADD_USER_RESET:
      return {}
    default:
      return state
  }
}

export const getUserByIDReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_USER_BY_ID_REQUEST:
      return { loadingGetUserByIDInfo: true }
    case GET_USER_BY_ID_SUCCESS:
      return {
        loadingGetUserByIDInfo: false,
        getUserByIDData: action.payload,
      }
    case GET_USER_BY_ID_FAIL:
      return {
        loadingGetUserByIDInfo: false,
        errorGetUserByIDInfo: action.payload,
      }
    case GET_USER_BY_ID_RESET:
      return {}
    default:
      return state
  }
}

export const updateUserReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_USER_REQUEST:
      return { loadingUpdateUserInfo: true }
    case UPDATE_USER_SUCCESS:
      return {
        loadingUpdateUserInfo: false,
        updateUserData: action.payload,
      }
    case UPDATE_USER_FAIL:
      return {
        loadingUpdateUserInfo: false,
        errorUpdateUserInfo: action.payload,
      }
    case UPDATE_USER_RESET:
      return {}
    default:
      return state
  }
}

export const resetDeviceIDReducer = (state = {}, action) => {
  switch (action.type) {
    case RESET_DEVICE_ID_REQUEST:
      return { loadingResetDeviceIDInfo: true }
    case RESET_DEVICE_ID_SUCCESS:
      return {
        loadingResetDeviceIDInfo: false,
        resetDeviceIDData: action.payload,
      }
    case RESET_DEVICE_ID_FAIL:
      return {
        loadingResetDeviceIDInfo: false,
        errorResetDeviceIDInfo: action.payload,
      }
    case RESET_DEVICE_ID_RESET:
      return {}
    default:
      return state
  }
}

export const resetPasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case RESET_PASSWORD_REQUEST:
      return { loadingResetPasswordInfo: true }
    case RESET_PASSWORD_SUCCESS:
      return {
        loadingResetPasswordInfo: false,
        resetPasswordData: action.payload,
      }
    case RESET_PASSWORD_FAIL:
      return {
        loadingResetPasswordInfo: false,
        errorResetPasswordInfo: action.payload,
      }
    case RESET_PASSWORD_RESET:
      return {}
    default:
      return state
  }
}

export const removeCustomerFromUserReducer = (state = {}, action) => {
  switch (action.type) {
    case REMOVE_CUSTOMER_FROM_USER_REQUEST:
      return { loadingRemoveCustomerFromUserInfo: true }
    case REMOVE_CUSTOMER_FROM_USER_SUCCESS:
      return {
        loadingRemoveCustomerFromUserInfo: false,
        removeCustomerFromUserData: action.payload,
      }
    case REMOVE_CUSTOMER_FROM_USER_FAIL:
      return {
        loadingRemoveCustomerFromUserInfo: false,
        errorRemoveCustomerFromUserInfo: action.payload,
      }
    case REMOVE_CUSTOMER_FROM_USER_RESET:
      return {}
    default:
      return state
  }
}

export const addCustomerToUserReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_CUSTOMER_TO_USER_REQUEST:
      return { loadingAddCustomerToUserInfo: true }
    case ADD_CUSTOMER_TO_USER_SUCCESS:
      return {
        loadingAddCustomerToUserInfo: false,
        addCustomerToUserData: action.payload,
      }
    case ADD_CUSTOMER_TO_USER_FAIL:
      return {
        loadingAddCustomerToUserInfo: false,
        errorAddCustomerToUserInfo: action.payload,
      }
    case ADD_CUSTOMER_TO_USER_RESET:
      return {}
    default:
      return state
  }
}

export const userLogoutReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGOUT_REQUEST:
      return { loadingUserLogoutInfo: true }
    case USER_LOGOUT_SUCCESS:
      return {
        loadingUserLogoutInfo: false,
        userLogoutData: action.payload,
      }
    case USER_LOGOUT_FAIL:
      return {
        loadingUserLogoutInfo: false,
        errorUserLogoutInfo: action.payload,
      }
    case USER_LOGOUT_RESET:
      return {}
    default:
      return state
  }
}

export const fetchAttendanceReducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_ATTENDANCE_REQUEST:
      return { loadingFetchAttendance: true }
    case FETCH_ATTENDANCE_SUCCESS:
      return {
        loadingFetchAttendance: false,
        fetchAttendanceData: action.payload,
      }
    case FETCH_ATTENDANCE_FAIL:
      return {
        loadingFetchAttendance: false,
        errorFetchAttendance: action.payload,
      }
    case FETCH_ATTENDANCE_RESET:
      return {}
    default:
      return state
  }
}

export const resignUserReducer = (state = {}, action) => {
  switch (action.type) {
    case RESIGN_USER_REQUEST:
      return { loadingResignUser: true }
    case RESIGN_USER_SUCCESS:
      return {
        loadingResignUser: false,
        resignUserData: action.payload,
      }
    case RESIGN_USER_FAIL:
      return {
        loadingResignUser: false,
        errorResignUser: action.payload,
      }
    case RESIGN_USER_RESET:
      return {}
    default:
      return state
  }
}

export const forceLogoutUserReducer = (state = {}, action) => {
  switch (action.type) {
    case FORCE_LOGOUT_USER_REQUEST:
      return { loadingForceLogoutUser: true }
    case FORCE_LOGOUT_USER_SUCCESS:
      return {
        loadingForceLogoutUser: false,
        forceLogoutUserData: action.payload,
      }
    case FORCE_LOGOUT_USER_FAIL:
      return {
        loadingForceLogoutUser: false,
        errorForceLogoutUser: action.payload,
      }
    case FORCE_LOGOUT_USER_RESET:
      return {}
    default:
      return state
  }
}

export const forceLogoutMultipleReducer = (state = {}, action) => {
  switch (action.type) {
    case FORCE_LOGOUT_MULTIPLE_REQUEST:
      return { loadingForceLogoutMultiple: true }
    case FORCE_LOGOUT_MULTIPLE_SUCCESS:
      return {
        loadingForceLogoutMultiple: false,
        forceLogoutMultipleData: action.payload,
      }
    case FORCE_LOGOUT_MULTIPLE_FAIL:
      return {
        loadingForceLogoutMultiple: false,
        errorForceLogoutMultiple: action.payload,
      }
    case FORCE_LOGOUT_MULTIPLE_RESET:
      return {}
    default:
      return state
  }
}