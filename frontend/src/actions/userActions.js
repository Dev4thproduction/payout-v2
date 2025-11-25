import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom';
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
  USER_LOGOUT,
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
} from '../constants/userConstants';

const baseUrl = process.env.REACT_APP_API_URL;

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    })

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const { data } = await axios.post(
      `${baseUrl}/users/login`,
      { email, password },
      config
    )

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    })

    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const logout = () => async (dispatch) => {
  localStorage.removeItem('userInfo')
  dispatch({
    type: USER_LOGOUT,
  })
}

export const getRole = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: GET_ROLE_REQUEST,
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

    const { data } = await axios.get(`${baseUrl}/roles/${userInfo.role._id}`, config)

    dispatch({
      type: GET_ROLE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    // if (error.response.status === 401) {
    //   dispatch(logout())
    //   return
    // }
    dispatch({
      type: GET_ROLE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const getUsers = (search = '') => async (dispatch, getState) => {

  try {
    dispatch({
      type: GET_USERS_REQUEST,
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
    const url = search ? `${baseUrl}/users?search=${encodeURIComponent(search)}` : `${baseUrl}/users`
    const { data } = await axios.get(url, config)

    dispatch({
      type: GET_USERS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    //   if (error.response.status === 401) {
    //     dispatch(logout())
    //     return
    //   }
    dispatch({
      type: GET_USERS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const addUser =
  (name, identifier, email, role, customers, ipAddress) =>
    async (dispatch, getState) => {
      try {
        dispatch({
          type: ADD_USER_REQUEST,
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
          `${baseUrl}/users`,
          { name, identifier, email, role, customers, ipAddress },
          config
        )

        dispatch({
          type: ADD_USER_SUCCESS,
          payload: data,
        })
      } catch (error) {
        dispatch({
          type: ADD_USER_FAIL,
          payload:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        })
      }
    }

export const getUserByID = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: GET_USER_BY_ID_REQUEST,
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

    const { data } = await axios.get(`${baseUrl}/users/${id}`, config)

    dispatch({
      type: GET_USER_BY_ID_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: GET_USER_BY_ID_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const addCustomer = (id, customer) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ADD_CUSTOMER_TO_USER_REQUEST,
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
      `${baseUrl}/users/${id}/customers`,
      { customer },
      config
    )

    dispatch({
      type: ADD_CUSTOMER_TO_USER_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: ADD_CUSTOMER_TO_USER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const updateUser = (id, name, role, calling, email, ipAddress, distanceForCalling) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: UPDATE_USER_REQUEST,
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
        `${baseUrl}/users/${id}`,
        { name, role, calling, email, ipAddress, distanceForCalling },
        config
      )

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: data,
      })
    } catch (error) {
      dispatch({
        type: UPDATE_USER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }

export const resetDeviceID = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: RESET_DEVICE_ID_REQUEST,
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
      `${baseUrl}/users/${id}/reset-device`,
      {},
      config
    )

    dispatch({
      type: RESET_DEVICE_ID_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: RESET_DEVICE_ID_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const resetPassword = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: RESET_PASSWORD_REQUEST,
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
      `${baseUrl}/users/${id}/reset-password`,
      {},
      config
    )

    dispatch({
      type: RESET_PASSWORD_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: RESET_PASSWORD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const removeCustomer = (id, customer) => async (dispatch, getState) => {
  try {
    dispatch({
      type: REMOVE_CUSTOMER_FROM_USER_REQUEST,
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

    const { data } = await axios.delete(
      `${baseUrl}/users/${id}/customers/${customer}`,
      config
    )

    dispatch({
      type: REMOVE_CUSTOMER_FROM_USER_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: REMOVE_CUSTOMER_FROM_USER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const fetchAttendance = (id, date) => async (dispatch, getState) => {
  try {
    dispatch({
      type: FETCH_ATTENDANCE_REQUEST,
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

    const { data } = await axios.get(
      `${baseUrl}/users/fetch-attendance/${id}/${date}`,
      config
    )

    dispatch({
      type: FETCH_ATTENDANCE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: FETCH_ATTENDANCE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const resignUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: RESIGN_USER_REQUEST,
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

    const { data } = await axios.put(`${baseUrl}/users/resign/${id}`, {}, config)

    dispatch({
      type: RESIGN_USER_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: RESIGN_USER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const forceLogoutUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: FORCE_LOGOUT_USER_REQUEST,
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

    const { data } = await axios.put(`${baseUrl}/users/force-logout/${id}`, {}, config)

    dispatch({
      type: FORCE_LOGOUT_USER_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: FORCE_LOGOUT_USER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const forceLogoutMultipleUsers = (userIds) => async (dispatch, getState) => {
  try {
    dispatch({
      type: FORCE_LOGOUT_MULTIPLE_REQUEST,
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

    const { data } = await axios.put(`${baseUrl}/users/force-logout-multiple`, { userIds }, config)

    dispatch({
      type: FORCE_LOGOUT_MULTIPLE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: FORCE_LOGOUT_MULTIPLE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}