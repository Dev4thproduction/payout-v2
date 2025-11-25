import React, { useEffect, useState, forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import MaterialTable from 'material-table'
import { toast } from 'react-toastify'

import Input from '../components/Input'
import Button from '../components/Button'
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
import ExitToApp from '@material-ui/icons/ExitToApp'
import Select from '../components/Select'
import { addUser, getUsers, forceLogoutUser, forceLogoutMultipleUsers } from '../actions/userActions'
import { getCustomers } from '../actions/customerActions'
import { getRoles } from '../actions/roleActions'
import {
  ADD_USER_RESET,
  GET_USERS_RESET,
  GET_USER_BY_EMAIL_RESET,
  FORCE_LOGOUT_USER_RESET,
  FORCE_LOGOUT_MULTIPLE_RESET,
} from '../constants/userConstants'
import { Link } from 'react-router-dom'

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

const UserList = ({ history }) => {
  // * States
  const navigate = useNavigate();
  const [data, setData] = useState([])
  const [rolesFromServer, setRolesFromServer] = useState([])
  const [roleOptions, setRoleOptions] = useState([])
  const [customersFromServer, setCustomersFromServer] = useState([])
  const [customerOptions, setCustomerOptions] = useState([])
  // * Add a User
  const [openModal, setOpenModal] = useState(false)
  const [email, setEmail] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [customers, setCustomers] = useState([])
  const [newPassword, setNewPassword] = useState('')
  const [ipAddress, setIpAddress] = useState('')
  const [passwordModal, setPasswordModal] = useState(false)
  const [selectAll, setSelectAll] = useState(false);

  // * Force Logout States
  const [forceLogoutModal, setForceLogoutModal] = useState(false)
  const [selectedUserForLogout, setSelectedUserForLogout] = useState(null)
  const [selectedUsersForBulkLogout, setSelectedUsersForBulkLogout] = useState([])
  const [bulkForceLogoutModal, setBulkForceLogoutModal] = useState(false)

  // * Roles
  const [addUserOption, setAddUserOption] = useState(true)
  const [forceLogoutOption, setForceLogoutOption] = useState(true)
  const [loading, setLoading] = useState(true)

  // * Remove items from array
  const removeItemsFromArray = (id) => {
    let newArray = customers.filter((item) => item !== id)
    setCustomers(newArray)
  }

  // * Initialization
  const dispatch = useDispatch()

  // * Check for auth
  const userLogin = useSelector((state) => state.userLogin)
  const { loadingUserInfo, userInfo } = userLogin

  useEffect(() => {
    // * Check if user info exists
    if (!userInfo) {
      // history.push('/')
    }
  }, [userInfo, history])

  // * Check for role
  const getRoleInfo = useSelector((state) => state.getRoleInfo)
  const { loadingGetRole, getRoleData } = getRoleInfo

  useEffect(() => {
    if (getRoleData) {
      setAddUserOption(getRoleData.usersAdd)
      setForceLogoutOption(getRoleData.usersUpdate) // Assuming same permission for force logout
      if (!getRoleData.usersView) {
        toast('Not Authorized', {
          type: 'error',
          hideProgressBar: true,
          autoClose: 2000,
        })
        navigate('/')
      }
    }
  }, [userInfo, getRoleData, history])

  useEffect(() => {
    if (selectAll) {
      setCustomers(customerOptions.map(item => item.id));
    } else {
      setCustomers([]);
    }
  }, [selectAll, customerOptions]);

  const handleCustomerChange = (id) => {
    if (customers.includes(id)) {
      setCustomers(customers.filter(customerId => customerId !== id));
    } else {
      setCustomers([...customers, id]);
    }
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    dispatch(getUsers())
    dispatch(getCustomers())
    dispatch(getRoles())
  }, [])

  // * Get Users
  const getUsersInfo = useSelector((state) => state.getUsersInfo)
  const { loadingGetUsersInfo, errorGetUsersInfo, getUsersData } = getUsersInfo

  useEffect(() => {
    dispatch({ type: GET_USERS_RESET })
    if (getUsersData) {
      setLoading(false)
      console.log('getUsersData:', getUsersData)
      // Handle different response structures
      let usersData = getUsersData.users || getUsersData
      if (Array.isArray(usersData)) {
        setData(usersData)
      } else if (usersData && typeof usersData === 'object') {
        // If it's an object, try to find the users array
        const possibleUserArrays = Object.values(usersData).filter(item => Array.isArray(item))
        if (possibleUserArrays.length > 0) {
          setData(possibleUserArrays[0])
        } else {
          setData([])
        }
      } else {
        setData([])
      }
    } else if (errorGetUsersInfo) {
      setLoading(false)
      toast(errorGetUsersInfo, {
        type: 'error',
        hideProgressBar: true,
        autoClose: 2000,
      })
    }
  }, [getUsersData, errorGetUsersInfo])

  // Get customers data
  const getCustomersInfo = useSelector((state) => state.getCustomersInfo)
  const { getCustomersData } = getCustomersInfo

  useEffect(() => {
    if (getCustomersData && Array.isArray(getCustomersData)) {
      setCustomersFromServer(getCustomersData)
    }
  }, [getCustomersData])

  // Get roles data
  const getRolesInfo = useSelector((state) => state.getRolesInfo)
  const { getRolesData } = getRolesInfo

  useEffect(() => {
    if (getRolesData && Array.isArray(getRolesData)) {
      setRolesFromServer(getRolesData)
    }
  }, [getRolesData])

  useEffect(() => {
    if (Array.isArray(rolesFromServer) && rolesFromServer.length > 0) {
      const data = rolesFromServer.map((item) => ({
        id: item._id,
        title: item.name,
      }))
      setRoleOptions(data)
    }
  }, [rolesFromServer])

  useEffect(() => {
    if (Array.isArray(customersFromServer) && customersFromServer.length > 0) {
      const data = customersFromServer.map((item) => ({
        id: item._id,
        title: item.name,
      }))
      setCustomerOptions(data)
    }
  }, [customersFromServer])

  // * Force Logout Single User
  const openForceLogoutModal = (user) => {
    setSelectedUserForLogout(user)
    setForceLogoutModal(true)
  }

  const closeForceLogoutModal = () => {
    setSelectedUserForLogout(null)
    setForceLogoutModal(false)
  }

  const handleForceLogout = () => {
    if (selectedUserForLogout) {
      dispatch(forceLogoutUser(selectedUserForLogout._id))
    }
  }

  // * Force Logout Multiple Users
  const openBulkForceLogoutModal = () => {
    if (selectedUsersForBulkLogout.length === 0) {
      toast('Please select users to force logout', {
        type: 'error',
        hideProgressBar: true,
        autoClose: 2000,
      })
      return
    }
    setBulkForceLogoutModal(true)
  }

  const closeBulkForceLogoutModal = () => {
    setBulkForceLogoutModal(false)
  }

  const handleBulkForceLogout = () => {
    const userIds = selectedUsersForBulkLogout.map(user => user._id)
    dispatch(forceLogoutMultipleUsers(userIds))
  }

  // * Users Table
  const headCells = [
    {
      field: 'name',
      title: 'Name',
      render: (rowData) => (
        <Link
          className='font-bold text-md cursor-pointer text-green-800 bg-green-100 p-2 flex justify-center rounded'
          to={`/users/${rowData._id}`}
        >
          {rowData.name}
        </Link>
      ),
    },
    {
      field: 'email',
      title: 'Email',
    },
    {
      field: 'identifier',
      title: 'Identifier',
    },
    {
      field: 'role',
      title: 'Role',
      render: (rowData) => rowData.role?.name || 'N/A',
    },
    {
      title: 'Customers',
      render: (rowData) => (Array.isArray(rowData.customers) ? rowData.customers.length : 0),
    },
    {
      field: 'joinedOn',
      title: 'Joined On',
      render: (rowData) => {
        if (rowData.joinedOn) {
          try {
            return new Date(rowData.joinedOn).toLocaleDateString()
          } catch (error) {
            return rowData.joinedOn
          }
        }
        return 'N/A'
      },
    },
    {
      field: 'calling',
      title: 'Status',
      render: (rowData) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${rowData.calling
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
          }`}>
          {rowData.calling ? 'Online' : 'Offline'}
        </span>
      ),
    },
    {
      title: 'Actions',
      render: (rowData) => (
        <div className='flex gap-2'>
          {forceLogoutOption && userInfo?.id !== rowData._id && (
            <button
              onClick={() => openForceLogoutModal(rowData)}
              className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs flex items-center gap-1'
              title='Force Logout'
            >
              <ExitToApp style={{ fontSize: 14 }} />
              Logout
            </button>
          )}
        </div>
      ),
    },
  ]

  // * Open Add User Modal
  const openAddUserModal = () => {
    setOpenModal(true)
  }

  // * Close Add User Modal
  const closeAddUserModal = () => {
    setOpenModal(false)
    setEmail('')
    setIdentifier('')
    setName('')
    setRole('')
    setCustomers([])
    setIpAddress('')
  }

  // * Add User
  const addUserHandler = () => {
    if (!name || !identifier || !email || !role || !ipAddress) {
      toast('All the fields are mandatory', {
        type: 'error',
        hideProgressBar: true,
        autoClose: 2000,
      })
      return
    }

    if (customers.length === 0) {
      toast('Select atleast 1 customer', {
        type: 'error',
        hideProgressBar: true,
        autoClose: 2000,
      })
      return
    }

    dispatch(addUser(name, identifier, email, role, customers, ipAddress))
  }

  const addUserInfo = useSelector((state) => state.addUserInfo)
  const { loadingAddUserInfo, errorAddUserInfo, addUserData } = addUserInfo

  useEffect(() => {
    dispatch({ type: ADD_USER_RESET })
    if (addUserData) {
      toast('User added successfully', {
        type: 'success',
        hideProgressBar: true,
        autoClose: 2000,
      })
      setNewPassword(addUserData)
      setPasswordModal(true)
      closeAddUserModal()
    } else if (errorAddUserInfo) {
      toast(errorAddUserInfo, {
        type: 'error',
        hideProgressBar: true,
        autoClose: 2000,
      })
    }
  }, [addUserData, errorAddUserInfo])

  // * Force Logout Handlers
  const forceLogoutUserInfo = useSelector((state) => state.forceLogoutUserInfo)
  const { loadingForceLogoutUser, errorForceLogoutUser, forceLogoutUserData } = forceLogoutUserInfo

  useEffect(() => {
    dispatch({ type: FORCE_LOGOUT_USER_RESET })
    if (forceLogoutUserData) {
      toast(forceLogoutUserData.msg, {
        type: 'success',
        hideProgressBar: true,
        autoClose: 3000,
      })
      closeForceLogoutModal()
      setTimeout(() => {
        dispatch(getUsers())
      }, 1000)
    } else if (errorForceLogoutUser) {
      toast(errorForceLogoutUser, {
        type: 'error',
        hideProgressBar: true,
        autoClose: 2000,
      })
    }
  }, [forceLogoutUserData, errorForceLogoutUser])

  const forceLogoutMultipleInfo = useSelector((state) => state.forceLogoutMultipleInfo)
  const { loadingForceLogoutMultiple, errorForceLogoutMultiple, forceLogoutMultipleData } = forceLogoutMultipleInfo

  useEffect(() => {
    dispatch({ type: FORCE_LOGOUT_MULTIPLE_RESET })
    if (forceLogoutMultipleData) {
      toast(forceLogoutMultipleData.msg, {
        type: 'success',
        hideProgressBar: true,
        autoClose: 3000,
      })
      setSelectedUsersForBulkLogout([])
      closeBulkForceLogoutModal()
      setTimeout(() => {
        dispatch(getUsers())
      }, 1000)
    } else if (errorForceLogoutMultiple) {
      toast(errorForceLogoutMultiple, {
        type: 'error',
        hideProgressBar: true,
        autoClose: 2000,
      })
    }
  }, [forceLogoutMultipleData, errorForceLogoutMultiple])

  const closePasswordModal = () => {
    setNewPassword('')
    setPasswordModal(false)
    setTimeout(() => {
      dispatch(getUsers())
    }, 1000)
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className='w-full h-full'>
      <h1 className='text-2xl font-semibold'>Users</h1>
      <div className='bg-white shadow-md rounded px-8 py-4 my-4'>
        <div className='flex justify-between items-center'>
          {forceLogoutOption && (
            <Button
              type='button'
              onClick={openBulkForceLogoutModal}
              text='Force Logout Selected'
              className='bg-orange-500 hover:bg-orange-700'
            />
          )}
          {addUserOption && (
            <Button
              type='button'
              onClick={openAddUserModal}
              text='Add a User'
              className='bg-emerald-500 hover:bg-emerald-700 ml-auto'
            />
          )}
        </div>
      </div>
      {console.log('Data being passed to MaterialTable:', data)}
      <MaterialTable
        icons={tableIcons}
        title={''}
        columns={headCells}
        data={data}
        options={{
          exportButton: false,
          search: true, // Enable MaterialTable search
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
          selection: forceLogoutOption,
          selectionProps: rowData => ({
            disabled: userInfo?.id === rowData._id,
          })
        }}
        onSearchChange={(searchText) => {
          // Call backend search when user types in MaterialTable search
          if (searchText) {
            dispatch(getUsers(searchText))
          } else {
            dispatch(getUsers())
          }
        }}
        onSelectionChange={(rows) => setSelectedUsersForBulkLogout(rows)}
      />

      {/* Add User Modal */}
      {openModal && (
        <>
          {/* Modal Overlay */}
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto min-h-screen">
            <div className="relative w-full max-w-xl mx-auto bg-white rounded-lg shadow-lg">

              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Add User</h3>
              </div>

              {/* Modal Body */}
              <div className="px-4 py-4">
                {/* Name & Identifier */}
                <div className="flex gap-4 mb-4">
                  <Input
                    width="flex-1"
                    name="Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    width="flex-1"
                    name="Identifier *"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>

                {/* Email */}
                <Input
                  width="w-full mb-4"
                  name="Email *"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {/* Role */}
                <Select
                  width="w-full mb-4"
                  name="Role *"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  options={roleOptions}
                />

                {/* IP Address */}
                <Input
                  width="w-full mb-4"
                  name="IP Address *"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                />

                {/* Customer Selection */}
                <p className="text-sm mb-2">Select Customers *</p>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                    className="mr-2"
                  />
                  <span className="text-sm font-bold">Select All</span>
                </div>
                <div className="flex flex-wrap">
                  {customerOptions.map((item) => (
                    <label
                      key={item.id}
                      className="w-1/2 text-sm text-gray-700 font-medium mb-2"
                    >
                      <input
                        type="checkbox"
                        checked={customers.includes(item.id)}
                        onChange={() => handleCustomerChange(item.id)}
                        className="mr-2"
                      />
                      {item.title}
                    </label>
                  ))}
                </div>

                {/* Note */}
                <p className="text-xs text-gray-500 mt-2">
                  All the fields with * are mandatory
                </p>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end px-4 py-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeAddUserModal}
                  className="text-red-500 font-bold uppercase text-sm px-4 py-2 mr-2"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={addUserHandler}
                  disabled={loadingAddUserInfo}
                  className={`${loadingAddUserInfo ? 'bg-gray-300' : 'bg-emerald-500 hover:bg-emerald-600'
                    } text-white font-bold uppercase text-sm px-6 py-2 rounded shadow`}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </>
      )}


      {/* Password Modal */}
      {passwordModal && (
        <>
          <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
            <div className='relative w-auto my-6 mx-auto max-w-3xl'>
              <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                <div className='flex items-center justify-between py-1 px-3 border-b border-solid border-blueGray-200 rounded-t'>
                  <h3 className='text-lg font-semibold mt-0 mb-0'>New Password</h3>
                </div>
                <div className='relative p-6 pb-2 flex-auto'>
                  <Input
                    width='w-full mb-4'
                    name='New Password *'
                    value={newPassword}
                    disabled
                  />
                </div>
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

      {/* Force Logout Single User Modal */}
      {forceLogoutModal && selectedUserForLogout && (
        <>
          <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
            <div className='relative w-auto my-6 mx-auto max-w-md'>
              <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                <div className='flex items-center justify-between py-1 px-3 border-b border-solid border-blueGray-200 rounded-t'>
                  <h3 className='text-lg font-semibold mt-0 mb-0'>Force Logout User</h3>
                </div>
                <div className='relative p-6 flex-auto'>
                  <p className='text-gray-500 text-sm leading-relaxed'>
                    Are you sure you want to force logout <strong>{selectedUserForLogout.name}</strong>?
                  </p>
                  <p className='text-gray-400 text-xs mt-2'>
                    This will immediately invalidate all their active sessions and they will need to login again.
                  </p>
                </div>
                <div className='flex items-center justify-end py-2 px-3 border-t border-solid border-blueGray-200 rounded-b'>
                  <button
                    className='text-gray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                    type='button'
                    onClick={closeForceLogoutModal}
                  >
                    Cancel
                  </button>
                  <button
                    className='bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-300'
                    type='button'
                    onClick={handleForceLogout}
                    disabled={loadingForceLogoutUser}
                  >
                    Force Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
        </>
      )}

      {/* Bulk Force Logout Modal */}
      {bulkForceLogoutModal && (
        <>
          <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
            <div className='relative w-auto my-6 mx-auto max-w-md'>
              <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                <div className='flex items-center justify-between py-1 px-3 border-b border-solid border-blueGray-200 rounded-t'>
                  <h3 className='text-lg font-semibold mt-0 mb-0'>Force Logout Multiple Users</h3>
                </div>
                <div className='relative p-6 flex-auto'>
                  <p className='text-gray-500 text-sm leading-relaxed mb-3'>
                    Are you sure you want to force logout <strong>{selectedUsersForBulkLogout.length}</strong> selected users?
                  </p>
                  <div className='max-h-32 overflow-y-auto'>
                    {selectedUsersForBulkLogout.map((user, index) => (
                      <p key={index} className='text-xs text-gray-600'>• {user.name} ({user.email})</p>
                    ))}
                  </div>
                  <p className='text-gray-400 text-xs mt-2'>
                    This will immediately invalidate all their active sessions and they will need to login again.
                  </p>
                </div>
                <div className='flex items-center justify-end py-2 px-3 border-t border-solid border-blueGray-200 rounded-b'>
                  <button
                    className='text-gray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                    type='button'
                    onClick={closeBulkForceLogoutModal}
                  >
                    Cancel
                  </button>
                  <button
                    className='bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-300'
                    type='button'
                    onClick={handleBulkForceLogout}
                    disabled={loadingForceLogoutMultiple}
                  >
                    Force Logout All
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
        </>
      )}
    </div>
  )
}

export default UserList