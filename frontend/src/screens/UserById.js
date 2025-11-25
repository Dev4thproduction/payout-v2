import React, { useEffect, useState, forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
// import {
//   withScriptjs,
//   withGoogleMap,
//   GoogleMap,
//   Marker,
//   Polyline,
//   InfoWindow,
// } from 'react-google-maps'

import Button from '../components/Button'
import Input from '../components/Input'
import Select from '../components/Select'
import Loading from '../components/Loading'
import AddBox from '@material-ui/icons/AddBox'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import Check from '@material-ui/icons/Check'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import Clear from '@material-ui/icons/Clear'
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import Edit from '@material-ui/icons/Edit'
import FilterList from '@material-ui/icons/FilterList'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import Remove from '@material-ui/icons/Remove'
import SaveAlt from '@material-ui/icons/SaveAlt'
import Search from '@material-ui/icons/Search'
import ViewColumn from '@material-ui/icons/ViewColumn'
import {
  addCustomer,
  fetchAttendance,
  getUserByID,
  removeCustomer,
  resetDeviceID,
  resetPassword,
  resignUser,
  updateUser,
} from '../actions/userActions'
import {
  ADD_CUSTOMER_TO_USER_RESET,
  FETCH_ATTENDANCE_RESET,
  GET_USER_BY_ID_RESET,
  REMOVE_CUSTOMER_FROM_USER_RESET,
  RESET_DEVICE_ID_RESET,
  RESET_PASSWORD_RESET,
  RESIGN_USER_RESET,
  UPDATE_USER_RESET,
} from '../constants/userConstants'
import MaterialTable from 'material-table'
import moment from 'moment'

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
}

const UserByID = ({ history }) => {
  const navigate = useNavigate();
  let params = useParams()
  let id = params.id.replace(':', '')

  // * States
  const [name, setName] = useState('')
  const [deviceInfo, setDeviceInfo] = useState(null)
  const [roleName, setRoleName] = useState('')
  const [email, setEmail] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [ipAddress, setIpAddress] = useState('')
  const [distanceForCalling, setDistanceForCalling] = useState(0)
  const [status, setStatus] = useState(true)
  const [joinedOn, setJoinedOn] = useState('')
  const [resignedOn, setResignedOn] = useState('')
  const [rolesFromServer, setRolesFromServer] = useState([])
  const [roleOptions, setRoleOptions] = useState([])
  const [role, setRole] = useState('')
  const [calling, setCalling] = useState(false)
  // const [extension, setExtension] = useState('')
  // const [extensionPassword, setExtensionPassword] = useState('')
  const [passwordModal, setPasswordModal] = useState(false)
  const [openResignModal, setOpenResignModal] = useState(false)
  const [showCalling, setShowCalling] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [userCustomers, setUserCustomers] = useState([])
  const [deleteCustomerModal, setDeleteCustomerModal] = useState(false)
  const [deleteCustomerID, setDeleteCustomerID] = useState('')
  const [addCustomerModal, setAddCustomerModal] = useState(false)
  const [addCustomerName, setAddCustomerName] = useState('')
  const [customersFromServer, setCustomersFromServer] = useState([])
  const [customerOptions, setCustomerOptions] = useState([])
  const [attenance, setAttendance] = useState([])
  const [tasks, setTasks] = useState([])
  // * Attendance
  const [attendanceDetails, setAttendanceDetails] = useState(null)
  const [lineData, setLineData] = useState([])
  const [date, setDate] = useState(new Date())
  // * Cards
  const [showSettings, setShowSettings] = useState(true)
  const [showCustomers, setShowCustomers] = useState(false)
  const [showAttendance, setShowAttendance] = useState(false)
  const [showTasks, setShowTasks] = useState(false)
  const [showLocations, setShowLocations] = useState(false)

  // * Roles
  const [taskDetailsOption, setTaskDetailsOption] = useState(false)
  const [updateUserOption, setUpdateUserOption] = useState(false)
  const [loading, setLoading] = useState(true)

  // * Initialization
  const dispatch = useDispatch()

  // * Check for auth
  const userLogin = useSelector((state) => state.userLogin)
  const { loadingUserInfo, userInfo } = userLogin

  useEffect(() => {
    // * Check if user info exists
    if (!userInfo) {
      navigate('/')
    }
  }, [userInfo])

  // * Check for role
  const getRoleInfo = useSelector((state) => state.getRoleInfo)
  const { loadingGetRole, getRoleData } = getRoleInfo

  useEffect(() => {
    if (getRoleData) {
      setTaskDetailsOption(getRoleData.tasksDetailsView)
      setUpdateUserOption(getRoleData.usersUpdate)
      if (!getRoleData.usersView) {
        toast('Not Authorized', {
          type: 'error',
          hideProgressBar: true,
          autoClose: 2000,
      })
        navigate('/')
      }
    }
  }, [userInfo, getRoleData])

  // * On Start
  useEffect(() => {
    dispatch(getUserByID(id))
    // dispatch(fetchAttendance(id, moment(date).format('DD-MM-YYYY')))
  }, [])

  const getUserByIDInfo = useSelector((state) => state.getUserByIDInfo)
  const { loadingGetUserByIDInfo, errorGetUserByIDInfo, getUserByIDData } =
    getUserByIDInfo

  useEffect(() => {
    dispatch({ type: GET_USER_BY_ID_RESET })
    if (getUserByIDData) {
      setLoading(false)
      setName(getUserByIDData.user.name)
      setDeviceInfo(getUserByIDData.user.deviceInfo)
      setEmail(getUserByIDData.user.email)
      setIdentifier(getUserByIDData.user.identifier)
      setIpAddress(getUserByIDData.user.ipAddress)
      setDistanceForCalling(getUserByIDData.user.distanceForCalling)
      setRoleName(getUserByIDData.user.role.name)
      setStatus(getUserByIDData.user.status)
      setJoinedOn(getUserByIDData.user.joinedOn)
      setResignedOn(getUserByIDData.user.resignedOn)
      setRole(getUserByIDData.user.role._id)
      setRolesFromServer(getUserByIDData.roles)
      setCalling(getUserByIDData.user.calling)
      // setExtension(getUserByIDData.user.extension)
      // setExtensionPassword(getUserByIDData.user.extensionPassword)
      setUserCustomers(getUserByIDData.userCustomers)
      setCustomersFromServer(getUserByIDData.customers)
      setAttendance(getUserByIDData.attendance)
      setTasks(getUserByIDData.tasks)
    } else if (errorGetUserByIDInfo) {
      setLoading(false)
      if (errorGetUserByIDInfo.includes('Cast')) {
        navigate('/')
        return
      }
      toast(errorGetUserByIDInfo, {
        type: 'error',
        hideProgressBar: true,
        autoClose: 2000,
      })
    }
  }, [getUserByIDData, errorGetUserByIDInfo])

  // * Attendance
  const searchDate = () => {
    if (date) {
      dispatch(fetchAttendance(id, moment(date).format('YYYY-MM-DD')))
    } else {
      toast('Enter a valid date to search', {
        type: 'error',
        hideProgressBar: true,
        autoClose: 2000,
      })
    }
  }

  const fetchAttendanceInfo = useSelector((state) => state.fetchAttendanceInfo)
  const { loadingFetchAttendance, errorFetchAttendance, fetchAttendanceData } =
    fetchAttendanceInfo

  useEffect(() => {
    dispatch({ type: FETCH_ATTENDANCE_RESET })
    if (fetchAttendanceData) {
      setAttendanceDetails(fetchAttendanceData)
    } else if (errorFetchAttendance) {
      toast(errorFetchAttendance, {
        type: 'error',
        hideProgressBar: true,
        autoClose: 2000,
      })
    }
  }, [fetchAttendanceData, errorFetchAttendance])

  useEffect(() => {
    if (attendanceDetails) {
      let data = []
      attendanceDetails.attendance.locations.forEach((item) => {
        data.push({ lat: item.latitude, lng: item.longitude })
      })
      setLineData(data)
    }
  }, [attendanceDetails])

  useEffect(() => {
    if (rolesFromServer.length > 0) {
      let data = []
      rolesFromServer.forEach((item) => {
        data.push({ id: item._id, title: item.name })
      })
      setRoleOptions(data)
    }
  }, [rolesFromServer])

  useEffect(() => {
    if (customersFromServer.length > 0) {
      let data = []
      customersFromServer.forEach((item) => {
        data.push({ id: item._id, title: item.name })
      })
      setCustomerOptions(data)
    }
  }, [customersFromServer])

  useEffect(() => {
    if (calling === true || calling == 'true') {
      setShowCalling(true)
    } else {
      setShowCalling(false)
    }
  }, [calling])

  // * Update User
  const updateUserHandler = () => {
    if (!name || !role || !email || !ipAddress) {
      toast('All the fields are mandatory', {
        type: 'error',
        hideProgressBar: true,
        autoClose: 2000,
      })
      return
    }
    // if (calling == 'true') {
    //   if (!extension || !extensionPassword) {
    //     toast('All the fields are mandatory', {
    //       type: 'error',
    //       hideProgressBar: true,
    //       autoClose: 2000,
    //     })
    //     return
    //   }
    // }
    dispatch(
      // updateUser(id, name, role, Boolean(calling), extension, extensionPassword)
      updateUser(
        id,
        name,
        role,
        Boolean(calling),
        email,
        ipAddress,
        distanceForCalling
      )
    )
  }

  const updateUserInfo = useSelector((state) => state.updateUserInfo)
  const { loadingUpdateUserInfo, errorUpdateUserInfo, updateUserData } =
    updateUserInfo

  useEffect(() => {
    dispatch({ type: UPDATE_USER_RESET })
    if (updateUserData) {
      toast('User updated successfully', {
        type: 'success',
        hideProgressBar: true,
        autoClose: 2000,
      })
      setTimeout(() => {
        dispatch(getUserByID(id))
      }, 1000)
    } else if (errorUpdateUserInfo) {
      toast(errorUpdateUserInfo, {
        type: 'error',
        hideProgressBar: true,
        autoClose: 2000,
      })
    }
  }, [updateUserData, errorUpdateUserInfo])

  // * Reset Device ID
  const resetDeviceIDHandler = () => {
    dispatch(resetDeviceID(id))
  }

  const resetDeviceIDInfo = useSelector((state) => state.resetDeviceIDInfo)
  const {
    loadingResetDeviceIDInfo,
    errorResetDeviceIDInfo,
    resetDeviceIDData,
  } = resetDeviceIDInfo

  useEffect(() => {
    dispatch({ type: RESET_DEVICE_ID_RESET })
    if (resetDeviceIDData) {
      toast('Device ID reset successfully', {
        type: 'success',
        hideProgressBar: true,
        autoClose: 2000,
      })
    } else if (errorResetDeviceIDInfo) {
      toast(errorResetDeviceIDInfo, {
        type: 'error',
        hideProgressBar: true,
        autoClose: 2000,
      })
    }
  }, [resetDeviceIDData, errorResetDeviceIDInfo])

  // * Reset Password
  const resetPasswordHandler = () => {
    dispatch(resetPassword(id))
  }

  const resetPasswordInfo = useSelector((state) => state.resetPasswordInfo)
  const {
    loadingResetPasswordInfo,
    errorResetPasswordInfo,
    resetPasswordData,
  } = resetPasswordInfo

  useEffect(() => {
    dispatch({ type: RESET_PASSWORD_RESET })
    if (resetPasswordData) {
      toast('Password reset successful', {
        type: 'success',
        hideProgressBar: true,
        autoClose: 2000,
      })
      setNewPassword(resetPasswordData)
      setPasswordModal(true)
    } else if (errorResetPasswordInfo) {
      toast(errorResetPasswordInfo, {
        type: 'error',
        hideProgressBar: true,
        autoClose: 2000,
      })
    }
  }, [resetPasswordData, errorResetPasswordInfo])

  const closePasswordModal = () => {
    setNewPassword('')
    setPasswordModal(false)
  }

  // * Resign
  const resignHandler = () => {
    dispatch(resignUser(id))
  }

  const resignUserInfo = useSelector((state) => state.resignUserInfo)
  const { loadingResignUser, errorResignUser, resignUserData } = resignUserInfo

  useEffect(() => {
    dispatch({ type: RESIGN_USER_RESET })
    if (resignUserData) {
      toast(resignUserData.msg, {
        type: 'success',
        hideProgressBar: true,
        autoClose: 2000,
      })
      setOpenResignModal(false)
      setTimeout(() => {
        dispatch(getUserByID(id))
      }, 1000)
    } else if (errorResignUser) {
      toast(errorResignUser, {
        type: 'error',
        hideProgressBar: true,
        autoClose: 2000,
      })
    }
  }, [resignUserData, errorResignUser])

  // * Tasks
  const headCellsTasks = [
    {
      field: 'taskID',
      title: 'Task ID',
      render: (rowData) =>
        taskDetailsOption ? (
          <Link
            className='font-bold text-md cursor-pointer text-blue-800 bg-blue-100 p-2 flex justify-center rounded'
            target='_blank'
            to={`/tasks/${rowData._id}`}
          >
            {rowData.taskID}
          </Link>
        ) : (
          <div className='font-bold text-md p-2 flex justify-center rounded bg-red-100 text-red-800'>
            <p className='text-sm'>{rowData.taskID}</p>
          </div>
        ),
    },
    {
      field: 'name',
      title: 'Name',
    },
    {
      field: 'customer.name',
      title: 'Customer',
    },
    {
      field: 'type',
      title: 'Type',
    },
    {
      field: 'status',
      title: 'Status',
    },
    {
      field: 'allocatedOnFieldOn',
      title: 'Allocated On',
    },
  ]

  // * Attendance
  const headCellsAttendance = [
    {
      field: 'date',
      title: 'Date',
    },
    {
      field: 'punchInTime',
      title: 'Punch In Time',
    },
    {
      field: 'punchInLocation',
      title: 'Punch In Location',
      render: (rowData) => rowData.punchInLocation?.address || 'N/A',
    },
    {
      field: 'punchOutTime',
      title: 'Punch Out Time',
    },
    {
      field: 'punchOutLocation',
      title: 'Punch Out Location',
      render: (rowData) => rowData.punchOutLocation?.address || 'N/A',
    },
  ]

  // * Customers
  const headCells = [
    {
      field: 'name',
      title: 'Name',
    },
    {
      field: 'action',
      title: 'Action',
      render: (rowData) => (
        <DeleteOutline
          className='cursor-pointer'
          onClick={() => openDeleteCustomer(rowData._id)}
        />
      ),
    },
  ]

  const processedAttendance = React.useMemo(() => {
    if (!attenance || attenance.length === 0) return [];

    return attenance.flatMap(day => {
      const punchInsAndOuts = day.punchIns.map((punchIn, index) => ({
        date: day.date,
        punchInTime: punchIn.time,
        punchInLocation: punchIn,
        punchOutTime: day.punchOuts[index] ? day.punchOuts[index].time : 'N/A',
        punchOutLocation: day.punchOuts[index] || { address: 'N/A' },
      }));

      // Add any remaining punch-outs if there are more punch-outs than punch-ins
      if (day.punchOuts.length > day.punchIns.length) {
        for (let i = day.punchIns.length; i < day.punchOuts.length; i++) {
          punchInsAndOuts.push({
            date: day.date,
            punchInTime: 'N/A',
            punchInLocation: { address: 'N/A' },
            punchOutTime: day.punchOuts[i].time,
            punchOutLocation: day.punchOuts[i],
          });
        }
      }

      return punchInsAndOuts;
    });
  }, [attenance]);

  // * Delete customer
  const openDeleteCustomer = (item) => {
    setDeleteCustomerModal(true)
    setDeleteCustomerID(item)
  }

  const closeDeleteCustomer = () => {
    setDeleteCustomerModal(false)
    setDeleteCustomerID('')
  }

  const deleteCustomerHandler = () => {
    dispatch(removeCustomer(id, deleteCustomerID))
  }

  const removeCustomerFromUserInfo = useSelector(
    (state) => state.removeCustomerFromUserInfo
  )
  const {
    loadingRemoveCustomerFromUserInfo,
    errorRemoveCustomerFromUserInfo,
    removeCustomerFromUserData,
  } = removeCustomerFromUserInfo

  useEffect(() => {
    dispatch({ type: REMOVE_CUSTOMER_FROM_USER_RESET })
    if (removeCustomerFromUserData) {
      toast('Customer removed successfully', {
        type: 'success',
        hideProgressBar: true,
        autoClose: 2000,
      })
      setTimeout(() => {
        dispatch(getUserByID(id))
        closeDeleteCustomer()
      }, 1000)
    } else if (errorRemoveCustomerFromUserInfo) {
      toast(errorRemoveCustomerFromUserInfo, {
        type: 'error',
        hideProgressBar: true,
        autoClose: 2000,
      })
    }
  }, [removeCustomerFromUserData, errorRemoveCustomerFromUserInfo])

  // * Add customer
  const closeAddCustomer = () => {
    setAddCustomerModal(false)
    setAddCustomerName('')
  }

  const addCustomerHandler = () => {
    if (!addCustomerName) {
      toast('Please enter a valid name for the customer', {
        type: 'error',
        hideProgressBar: true,
        autoClose: 2000,
      })
    } else {
      dispatch(addCustomer(id, addCustomerName))
    }
  }

  const addCustomerToUserInfo = useSelector(
    (state) => state.addCustomerToUserInfo
  )
  const {
    loadingAddCustomerToUserInfo,
    errorAddCustomerToUserInfo,
    addCustomerToUserData,
  } = addCustomerToUserInfo

  useEffect(() => {
    dispatch({ type: ADD_CUSTOMER_TO_USER_RESET })
    if (addCustomerToUserData) {
      toast('Customer added successfully', {
        type: 'success',
        hideProgressBar: true,
        autoClose: 2000,
      })
      setTimeout(() => {
        dispatch(getUserByID(id))
        closeAddCustomer()
      }, 1000)
    } else if (errorAddCustomerToUserInfo) {
      toast(errorAddCustomerToUserInfo, {
        type: 'error',
        hideProgressBar: true,
        autoClose: 2000,
      })
    }
  }, [addCustomerToUserData, errorAddCustomerToUserInfo])

  //   const InternalMap = () => (
  //     <GoogleMap
  //       defaultZoom={12}
  //       defaultCenter={{ lat: 28.6304, lng: 77.2177 }}
  //       options={{
  //         streetViewControl: false,
  //         draggable: true, // make map draggable
  //         keyboardShortcuts: false, // disable keyboard shortcuts
  //         scaleControl: true, // allow scale controle
  //         scrollwheel: true, // allow scroll wheel
  //       }}
  //     >
  //       <Polyline path={lineData} />
  //       <Marker position={lineData[0]}>
  //         <InfoWindow onCloseClick={null}>
  //           <span>Punch In</span>
  //         </InfoWindow>
  //       </Marker>
  //       {attendanceDetails && attendanceDetails.attendance.punchOutTime && (
  //         <Marker
  //           position={lineData[lineData.length - 1]}
  //           label={lineData[lineData.length - 1].lat}
  //         >
  //           <InfoWindow onCloseClick={null}>
  //             <span>Punch Out</span>
  //           </InfoWindow>
  //         </Marker>
  //       )}
  //     </GoogleMap>
  //   )

  //   const MapHoc = withScriptjs(withGoogleMap(InternalMap))

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <div className='w-full h-full'>
        <div className='flex flex-row gap-2 items-end'>
          <h1 className='text-2xl font-semibold'>{name}</h1>
          {deviceInfo && (
            <p className='text-sm mb-1'>
              ({deviceInfo.brand} {deviceInfo.model})
            </p>
          )}
        </div>
        <div className='bg-white shadow-md rounded px-8 py-4 my-4'>
          <div className='flex justify-between'>
            <div className='flex gap-2 md:gap-8 items-center flex-col md:flex-row'>
              <div className='bg-blue-700 h-14 w-52 md:h-24 md:w-96 rounded-full flex flex-col justify-center items-center text-2xl md:text-5xl text-white'>
                {name[0]}
              </div>
              <div className='flex gap-8 items-center w-full md:w-0.5 h-0.5 my-4 md:my-0 md:h-full bg-gray-200'></div>
              <div className='flex flex-col gap-2 w-full items-start'>
                <p className='text-sm'>
                  Email: <p className='font-semibold'>{email}</p>
                </p>
                <p className='text-sm'>
                  Identifier: <p className='font-semibold'>{identifier}</p>
                </p>
              </div>
              <div className='flex gap-8 items-center w-full md:w-0.5 h-0.5 my-4 md:my-0 md:h-full bg-gray-200'></div>
              <div className='flex flex-col gap-2 w-full items-start'>
                <p className='text-sm'>
                  Role: <p className='font-semibold'>{roleName}</p>
                </p>
                <p className='text-sm'>
                  Status:
                  <p className='font-semibold'>
                    {status === true ? 'Active' : 'Not Active'}
                  </p>
                </p>
              </div>
              <div className='flex gap-8 items-center w-full md:w-0.5 h-0.5 my-4 md:my-0 md:h-full bg-gray-200'></div>
              <div className='flex flex-col gap-2 w-full items-start'>
                <p className='text-sm'>
                  Joined On: <p className='font-semibold'>{joinedOn}</p>
                </p>
                <p className='text-sm'>
                  Resigned On:
                  <p className='font-semibold'>
                    {status === true ? 'Active' : resignedOn}
                  </p>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='py-2 my-4 flex flex-wrap gap-5'>
          {/* <Button
            custom='py-2 shadow-md bg-white text-black hover:text-white'
            text='Location'
            onClick={() => (
              setShowLocations(true),
              setShowTasks(false),
              setShowAttendance(false),
              setShowCustomers(false),
              setShowSettings(false)
            )}
          /> */}
          <Button
            custom='py-2 shadow-md bg-black text-black hover:text-white'
            text='Tasks'
            onClick={() => (
              setShowLocations(false),
              setShowTasks(true),
              setShowAttendance(false),
              setShowCustomers(false),
              setShowSettings(false)
            )}
          />
          <Button
            custom='py-2 shadow-md bg-black text-black hover:text-white'
            text='Attendance'
            onClick={() => (
              setShowLocations(false),
              setShowTasks(false),
              setShowAttendance(true),
              setShowCustomers(false),
              setShowSettings(false)
            )}
          />
          <Button
            custom='py-2 shadow-md bg-black text-black hover:text-white'
            text='Customers'
            onClick={() => (
              setShowLocations(false),
              setShowTasks(false),
              setShowAttendance(false),
              setShowCustomers(true),
              setShowSettings(false)
            )}
          />
          <Button
            custom='py-2 shadow-md bg-black text-black hover:text-white'
            text='Settings'
            onClick={() => (
              setShowLocations(false),
              setShowTasks(false),
              setShowAttendance(false),
              setShowSettings(true),
              setShowCustomers(false)
            )}
          />
        </div>
        {showLocations && (
          <div className='flex flex-row gap-5' style={{ height: 480 }}>

            <div
              className='flex flex-col gap-3'
              style={{
                width: '30%',
                backgroundColor: 'white',
                borderRadius: 5,
                padding: 16,
              }}
            >
              <div className='flex flex-col'>
                <label className='text-sm mb-2' htmlFor='name'>
                  Date
                </label>
                <Input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  type='date'
                />
              </div>
              <Button text='Search' custom='py-2' onClick={searchDate} />
              <div className='flex flex-row items-center gap-2'>
                <p className='text-sm'>Date:</p>
                <p className='text-sm font-semibold'>
                  {attendanceDetails && attendanceDetails.attendance.date}
                </p>
              </div>
              <div className='flex flex-row items-center gap-2'>
                <p className='text-sm'>In Time:</p>
                <p className='text-sm font-semibold'>
                  {attendanceDetails &&
                    attendanceDetails.attendance.punchInTime}
                </p>
              </div>
              <div className='flex flex-col'>
                <p className='text-sm'>In Location:</p>
                <p className='text-sm font-semibold'>
                  {attendanceDetails &&
                    attendanceDetails.attendance.punchInLocation.address}
                </p>
              </div>
              {attendanceDetails && attendanceDetails.attendance.punchOutTime && (
                <>
                  <div className='flex flex-row items-center gap-2'>
                    <p className='text-sm'>Out Time:</p>
                    <p className='text-sm font-semibold'>
                      {attendanceDetails &&
                        attendanceDetails.attendance.punchOutTime}
                    </p>
                  </div>
                  <div className='flex flex-col'>
                    <p className='text-sm'>Out Location:</p>
                    <p className='text-sm font-semibold'>
                      {attendanceDetails &&
                        attendanceDetails.attendance.punchInLocation.address}
                    </p>
                  </div>
                </>
              )}
              <div className='flex flex-row items-center gap-2'>
                <p className='text-sm'>Total Tasks:</p>
                <p className='text-sm font-semibold'>
                  {attendanceDetails && attendanceDetails.tasks}
                </p>
              </div>
              {/* <div className='flex flex-row items-center gap-2'>
                  <p className='text-sm'>Distance:</p>
                  <p className='text-sm font-semibold'>5 km</p>
                </div> */}
            </div>
          </div>
        )}
        {showTasks && (
          <MaterialTable
            icons={tableIcons}
            title={'Tasks'}
            columns={headCellsTasks}
            data={tasks}
            options={{
              exportButton: false,
              search: true,
              exportAllData: false,
              rowStyle: {
                height: '5px',
                fontSize: 13,
              },
              paging: true,
              pageSize: 10,
              emptyRowsWhenPaging: false,
              pageSizeOptions: [10, 20, 50],
              headerStyle: {
                position: 'sticky',
                top: '0',
              },
            }}
          />
        )}
        {showAttendance && (
          <MaterialTable
            icons={tableIcons}
            title={'Attendance'}
            columns={headCellsAttendance}
            data={processedAttendance}
            options={{
              exportButton: true,
              exportAllData: true,
              search: true,
              rowStyle: {
                fontSize: 13,
              },
              paging: true,
              pageSize: 10,
              emptyRowsWhenPaging: false,
              pageSizeOptions: [10, 20, 50],
              headerStyle: {
                position: 'sticky',
                top: '0',
              },
              grouping: true,
              filtering: true,
            }}
          />
        )}
        {showCustomers && (
          <MaterialTable
            icons={tableIcons}
            title={'Customers'}
            columns={headCells}
            data={userCustomers}
            options={{
              exportButton: false,
              search: true,
              exportAllData: false,
              rowStyle: {
                height: '5px',
                fontSize: 13,
              },
              paging: true,
              pageSize: 10,
              emptyRowsWhenPaging: false,
              pageSizeOptions: [10, 20, 50],
              headerStyle: {
                position: 'sticky',
                top: '0',
              },
            }}
            actions={[
              {
                icon: () => (
                  <Button
                    onClick={() => setAddCustomerModal(true)}
                    text="Add Customer"
                    custom="ml-2"
                  />
                ),
                isFreeAction: true, // Action is not tied to a specific row
              },
            ]}
          />
        )}
        {showSettings && (
          <div className='bg-white shadow-md rounded px-8 py-4 my-4'>
            <h3 className='font-semibold text-md'>Settings</h3>
            <div className='flex flex-wrap w-full py-4 gap-5 items-center'>
              <div className='flex flex-col w-1/5'>
                <label className='text-sm mb-2' htmlFor='name'>
                  Name *
                </label>
                <Input
                  placeholder='Name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!updateUserOption}
                />
              </div>
              <div className='flex flex-col w-1/5'>
                <label className='text-sm mb-2' htmlFor='role'>
                  Role *
                </label>
                <Select
                  width='w-full'
                  name='Role *'
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  options={roleOptions}
                  disabled={!updateUserOption}
                />
              </div>
              <div className='flex flex-col w-1/5'>
                <label className='text-sm mb-2' htmlFor='role'>
                  Calling *
                </label>
                <Select
                  width='w-full'
                  name='Calling *'
                  value={calling}
                  onChange={(e) => setCalling(e.target.value)}
                  options={[
                    { id: true, title: 'Active' },
                    { id: false, title: 'Not Active' },
                  ]}
                  disabled={!updateUserOption}
                />
              </div>
              <div className='flex flex-col w-1/5'>
                <label className='text-sm mb-2' htmlFor='role'>
                  Distance for Calling *
                </label>
                <Select
                  width='w-full'
                  name='Distance for Calling *'
                  value={distanceForCalling}
                  onChange={(e) => setDistanceForCalling(e.target.value)}
                  options={[
                    { id: 0.1, title: '100 m' },
                    { id: 0.2, title: '200 m' },
                    { id: 0.3, title: '300 m' },
                    { id: 0.4, title: '400 m' },
                    { id: 0.5, title: '500 m' },
                    { id: 0.6, title: '600 m' },
                    { id: 0.7, title: '700 m' },
                    { id: 0.8, title: '800 m' },
                    { id: 0.9, title: '900 m' },
                    { id: 1.0, title: '1 km' },
                    { id: 100, title: 'No restriction' },
                  ]}
                  disabled={!updateUserOption}
                />
              </div>
              <div className='flex flex-col w-1/5'>
                <label className='text-sm mb-2' htmlFor='email'>
                  Email *
                </label>
                <Input
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!updateUserOption}
                />
              </div>
              <div className='flex flex-col w-1/5'>
                <label className='text-sm mb-2' htmlFor='name'>
                  IP Address *
                </label>
                <Input
                  placeholder='IP Address'
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  disabled={!updateUserOption}
                />
              </div>
            </div>
            <div className='flex flex-wrap w-full gap-5 py-2 items-center'>
            {userInfo.role.settings === true && (
              <Button
                text='Update'
                custom='h-1/2 py-2'
                disabled={!updateUserOption || loadingUpdateUserInfo}
                onClick={updateUserHandler}
              />
            )}
              <Button
                text='Reset Device ID'
                custom='h-1/2 py-2 bg-orange-500 hover:bg-red-700'
                disabled={!updateUserOption || loadingResetDeviceIDInfo}
                onClick={resetDeviceIDHandler}
              />
              <Button
                text='Reset Password'
                custom='h-1/2 py-2 bg-yellow-400 text-black hover:bg-yellow-600 hover:text-white'
                disabled={!updateUserOption || loadingResetPasswordInfo}
                onClick={resetPasswordHandler}
              />
              {userInfo.role.settings === true && (
              <Button
                text='Resign'
                custom='h-1/2 py-2 bg-red-500 text-white hover:bg-red-600 hover:text-white'
                disabled={!updateUserOption || loadingResignUser}
                onClick={() => setOpenResignModal(true)}
              />
              )}
            </div>
          </div>
        )}
        {passwordModal && (
          <>
            <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
              <div className='relative w-auto my-6 mx-auto max-w-3xl'>
                {/*content*/}
                <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                  {/*header*/}
                  <div className='flex items-center justify-between py-3 px-3 border-b border-solid border-blueGray-200 rounded-t'>
                    <h3 className='text-lg font-semibold'>New Password</h3>
                  </div>
                  {/*body*/}
                  <div className='relative p-6 pb-2 flex-auto'>
                    <Input
                      width='w-full mb-4'
                      name='New Password *'
                      value={newPassword}
                      disabled
                    />
                  </div>
                  {/*footer*/}
                  <div className='flex items-center justify-end py-2 border-t border-solid border-blueGray-200 rounded-b'>
                    <button
                      className='text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                      type='button'
                      onClick={closePasswordModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
          </>
        )}
        {openResignModal && (
          <>
            <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
              <div className='relative w-auto my-6 mx-auto max-w-3xl'>

                <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>

                  <div className='flex items-center justify-between py-3 px-3 border-b border-solid border-blueGray-200 rounded-t'>
                    <h3 className='text-lg font-semibold'>Resign</h3>
                  </div>

                  <div className='relative p-6 pb-2 flex-auto'>
                    <p className='text-sm mb-3'>
                      Are you sure, you want to resign this employee?
                    </p>
                  </div>

                  <div className='flex items-center justify-end py-2 border-t border-solid border-blueGray-200 rounded-b'>
                    <button
                      className='text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                      type='button'
                      onClick={() => setOpenResignModal(false)}
                    >
                      No
                    </button>
                    <button
                      className='bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-300 mr-4'
                      type='button'
                      onClick={resignHandler}
                      disabled={loadingResignUser}
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
          </>
        )}
        {deleteCustomerModal && (
          <>
            <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
              <div className='relative w-auto my-6 mx-auto max-w-3xl'>
                {/*content*/}
                <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                  {/*header*/}
                  <div className='flex items-center justify-between py-3 px-3 border-b border-solid border-blueGray-200 rounded-t'>
                    <h3 className='text-lg font-semibold'>Delete Customer</h3>
                  </div>
                  {/*body*/}
                  <div className='relative p-6 flex-auto'>
                    <p className='text-sm'>
                      Are you sure, you want to delete this Customer?
                    </p>
                  </div>
                  {/*footer*/}
                  <div className='flex items-center justify-end py-2 px-3 border-t border-solid border-blueGray-200 rounded-b'>
                    <button
                      className='text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                      type='button'
                      onClick={closeDeleteCustomer}
                    >
                      No
                    </button>
                    <button
                      className='bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-300'
                      type='button'
                      onClick={deleteCustomerHandler}
                      disabled={loadingRemoveCustomerFromUserInfo}
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
          </>
        )}
        {addCustomerModal && (
          <>
            <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
              <div className='relative w-auto my-6 mx-auto max-w-3xl'>
                {/*content*/}
                <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                  {/*header*/}
                  <div className='flex items-center justify-between py-3 px-3 border-b border-solid border-blueGray-200 rounded-t'>
                    <h3 className='text-lg font-semibold'>Add Customer</h3>
                  </div>
                  {/*body*/}
                  <div className='relative p-6 flex-auto'>
                    <Select
                      name='Add Customer *'
                      value={addCustomerName}
                      onChange={(e) => setAddCustomerName(e.target.value)}
                      options={customerOptions}
                    />
                    <p className='text-sm mt-4'>
                      All the fields with * are mandatory
                    </p>
                  </div>
                  {/*footer*/}
                  <div className='flex items-center justify-end py-2 px-3 border-t border-solid border-blueGray-200 rounded-b'>
                    <button
                      className='text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                      type='button'
                      onClick={closeAddCustomer}
                    >
                      Cancel
                    </button>
                    <button
                      className='bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-300'
                      type='button'
                      onClick={addCustomerHandler}
                      disabled={loadingAddCustomerToUserInfo}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
          </>
        )}
      </div>
    </>
  )
}

export default UserByID