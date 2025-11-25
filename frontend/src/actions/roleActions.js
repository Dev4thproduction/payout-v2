import axios from 'axios'

import {
  ADD_ROLE_FAIL,
  ADD_ROLE_REQUEST,
  ADD_ROLE_SUCCESS,
  GET_ROLES_FAIL,
  GET_ROLES_REQUEST,
  GET_ROLES_SUCCESS,
  GET_ROLE_BY_ID_FAIL,
  GET_ROLE_BY_ID_REQUEST,
  GET_ROLE_BY_ID_SUCCESS,
  UPDATE_ROLE_FAIL,
  UPDATE_ROLE_REQUEST,
  UPDATE_ROLE_SUCCESS,
} from '../constants/roleConstants'
import { logout } from './userActions'

const baseUrl = process.env.REACT_APP_API_URL;

export const getRoles = (search = '') => async (dispatch, getState) => {
  try {
    dispatch({
      type: GET_ROLES_REQUEST,
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

    const { data } = await axios.get(`${baseUrl}/roles${search ? `?search=${encodeURIComponent(search)}` : ''}`, config)

    dispatch({
      type: GET_ROLES_SUCCESS,
      payload: data,
    })
  } catch (error) {
    // if (error.response.status === 401) {
    //   dispatch(logout())
    //   return
    // }
    dispatch({
      type: GET_ROLES_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const addRole =
  (
    name,
    tasksView,
    tasksDetailsView,
    tasksUpdate,
    tasksAddCustomer,
    tasksAddAllocation,
    allocationPendingTasks,
    visitPendingTasks,
    inProgressTasks,
    finalisationPendingTasks,
    completedTasks,
    waivedTasks,
    calling,
    taskSummary,
    transfers,
    usersView,
    usersAdd,
    usersUpdate,
    viewAttendance,
    rejoinUsers,
    viewUnassignTasks,
    viewTransfferedTasks,
    viewFieldTasks,
    resignedUsers,
    rolesView,
    rolesAdd,
    rolesUpdate,
    customersView,
    customersAdd,
    customersUpdate,
    appAccess,
    webAccess,
    settings,
    reports,
    pincodes,
    dashboard,
    processView,
    processAdd,
    ProcessUpdate,
    ProcessDelete,
    assignProcessView,
    assignProcessAdd,
    assignProcessUpdate,
    assignProcessDelete,
    DailyCollectionView,
    DailyCollectionViewAdd,
    DailyCollectionViewUpdate,
    DailyCollectionViewDelete,
    mis,
    driveNbfcDelhi,
    driveNbfcHaryana,
    driveNbfcUp,
    driveNbfcTata,
    driveHdfcCard,
    driveHdfcRetail,
    driveIdfc,
    driveKotak
  ) =>
    async (dispatch, getState) => {
      try {
        dispatch({
          type: ADD_ROLE_REQUEST,
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
          `${baseUrl}/roles`,
          {
            name,
            tasksView,
            tasksDetailsView,
            tasksUpdate,
            tasksAddCustomer,
            tasksAddAllocation,
            allocationPendingTasks,
            visitPendingTasks,
            inProgressTasks,
            finalisationPendingTasks,
            completedTasks,
            waivedTasks,
            calling,
            taskSummary,
            transfers,
            usersView,
            usersAdd,
            usersUpdate,
            viewAttendance,
            rejoinUsers,
            viewUnassignTasks,
            viewTransfferedTasks,
            viewFieldTasks,
            resignedUsers,
            rolesView,
            rolesAdd,
            rolesUpdate,
            customersView,
            customersAdd,
            customersUpdate,
            appAccess,
            webAccess,
            settings,
            reports,
            pincodes,
            dashboard,
            processView,
            processAdd,
            ProcessUpdate,
            ProcessDelete,
            assignProcessView,
            assignProcessAdd,
            assignProcessUpdate,
            assignProcessDelete,
            DailyCollectionView,
            DailyCollectionViewAdd,
            DailyCollectionViewUpdate,
            DailyCollectionViewDelete,
            mis,
            driveNbfcDelhi,
            driveNbfcHaryana,
            driveNbfcUp,
            driveNbfcTata,
            driveHdfcCard,
            driveHdfcRetail,
            driveIdfc,
            driveKotak,
          },
          config
        )

        dispatch({
          type: ADD_ROLE_SUCCESS,
          payload: data,
        })
      } catch (error) {
        // if (error.response.status === 401) {
        //   dispatch(logout())
        //   return
        // }
        dispatch({
          type: ADD_ROLE_FAIL,
          payload:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        })
      }
    }

export const getRoleByID = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: GET_ROLE_BY_ID_REQUEST,
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

    const { data } = await axios.get(`${baseUrl}/roles/${id}`, config)

    dispatch({
      type: GET_ROLE_BY_ID_SUCCESS,
      payload: data,
    })
  } catch (error) {
    if (error.response.status === 401) {
      dispatch(logout())
      return
    }
    dispatch({
      type: GET_ROLE_BY_ID_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const updateRole =
  (
    id,
    tasksView,
    tasksDetailsView,
    tasksUpdate,
    tasksAddCustomer,
    tasksAddAllocation,
    allocationPendingTasks,
    visitPendingTasks,
    inProgressTasks,
    finalisationPendingTasks,
    completedTasks,
    waivedTasks,
    calling,
    taskSummary,
    transfers,
    usersView,
    usersAdd,
    usersUpdate,
    viewAttendance,
    rejoinUsers,
    viewUnassignTasks,
    viewTransfferedTasks,
    viewFieldTasks,
    resignedUsers,
    rolesView,
    rolesAdd,
    rolesUpdate,
    customersView,
    customersAdd,
    customersUpdate,
    appAccess,
    webAccess,
    settings,
    reports,
    pincodes,
    dashboard,
    processView,
    processAdd,
    ProcessUpdate,
    ProcessDelete,
    assignProcessView,
    assignProcessAdd,
    assignProcessUpdate,
    assignProcessDelete,
    DailyCollectionView,
    DailyCollectionViewAdd,
    DailyCollectionViewUpdate,
    DailyCollectionViewDelete,
    mis,
    driveNbfcDelhi,
    driveNbfcHaryana,
    driveNbfcUp,
    driveNbfcTata,
    driveHdfcCard,
    driveHdfcRetail,
    driveIdfc,
    driveKotak

  ) =>
    async (dispatch, getState) => {
      try {
        dispatch({
          type: UPDATE_ROLE_REQUEST,
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
          `${baseUrl}/roles/${id}`,
          {
            tasksView,
            tasksDetailsView,
            tasksUpdate,
            tasksAddCustomer,
            tasksAddAllocation,
            allocationPendingTasks,
            visitPendingTasks,
            inProgressTasks,
            finalisationPendingTasks,
            completedTasks,
            waivedTasks,
            calling,
            taskSummary,
            transfers,
            usersView,
            usersAdd,
            usersUpdate,
            viewAttendance,
            rejoinUsers,
            viewUnassignTasks,
            viewTransfferedTasks,
            viewFieldTasks,
            resignedUsers,
            rolesView,
            rolesAdd,
            rolesUpdate,
            customersView,
            customersAdd,
            customersUpdate,
            appAccess,
            webAccess,
            settings,
            reports,
            pincodes,
            dashboard,
            processView,
            processAdd,
            ProcessUpdate,
            ProcessDelete,
            assignProcessView,
            assignProcessAdd,
            assignProcessUpdate,
            assignProcessDelete,
            DailyCollectionView,
            DailyCollectionViewAdd,
            DailyCollectionViewUpdate,
            DailyCollectionViewDelete,
            mis,
            driveNbfcDelhi,
            driveNbfcHaryana,
            driveNbfcUp,
            driveNbfcTata,
            driveHdfcCard,
            driveHdfcRetail,
            driveIdfc,
            driveKotak
          },
          config
        )

        dispatch({
          type: UPDATE_ROLE_SUCCESS,
          payload: data,
        })
      } catch (error) {
        if (error.response.status === 401) {
          dispatch(logout())
          return
        }
        dispatch({
          type: UPDATE_ROLE_FAIL,
          payload:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        })
      }
    }