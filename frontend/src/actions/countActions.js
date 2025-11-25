import axios from 'axios'
import {
  GET_ATTENDANCE_COUNT_FAIL,
  GET_ATTENDANCE_COUNT_REQUEST,
  ATTENDANCE_COUNT_RESET,
  GET_ATTENDANCE_COUNT_SUCCESS,
} from '../constants/countConstants'

const baseUrl = process.env.REACT_APP_API_URL

export const getUserAttendanceCounts = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: GET_ATTENDANCE_COUNT_REQUEST,
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

    const { data } = await axios.get(`${baseUrl}/count/attendance`, config)

    dispatch({
      type: GET_ATTENDANCE_COUNT_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: GET_ATTENDANCE_COUNT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
} 