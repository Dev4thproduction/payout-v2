import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import Input from '../components/Input'
import Button from '../components/Button'
import { addRole } from '../actions/roleActions'
import { ADD_ROLE_RESET } from '../constants/roleConstants'

const AddRole = ({ history }) => {
  // * States
  const [name, setName] = useState('')
  const [tasksView, setTasksView] = useState(false)
  const [tasksDetailsView, setTasksDetailsView] = useState(false)
  const [tasksUpdate, setTasksUpdate] = useState(false)
  const [tasksAddCustomer, setTasksAddCustomer] = useState(false)
  const [tasksAddAllocation, setTasksAddAllocation] = useState(false)
  const [allocationPendingTasks, setAllocationPendingTasks] = useState(false)
  const [visitPendingTasks, setVisitPendingTasks] = useState(false)
  const [inProgressTasks, setInProgressTasks] = useState(false)
  const [finalisationPendingTasks, setFinalisationPendingTasks] =
    useState(false)
  const [completedTasks, setCompletedTasks] = useState(false)
  const [waivedTasks, setWaivedTasks] = useState(false)
  const [calling, setCalling] = useState(false)
  const [taskSummary, setTaskSummary] = useState(false)
  const [transfers, setTransfers] = useState(false)
  const [usersView, setUsersView] = useState(false)
  const [usersAdd, setUsersAdd] = useState(false)
  const [usersUpdate, setUsersUpdate] = useState(false)
  const [rejoinUsers, setRejoinUsers] = useState(false)
  const [viewAttendance, setViewAttendance] = useState(false)
  const [viewUnassignTasks, setViewUnassignTasks] = useState(false)
  const [viewTransfferedTasks, setViewTransfferedTasks] = useState(false)
  const [viewFieldTasks, setViewFieldTasks] = useState(false)
  const [resignedUsers, setResignedUsers] = useState(false)
  const [rolesView, setRolesView] = useState(false)
  const [rolesAdd, setRolesAdd] = useState(false)
  const [rolesUpdate, setRolesUpdate] = useState(false)
  const [customersView, setCustomersView] = useState(false)
  const [customersAdd, setCustomersAdd] = useState(false)
  const [customersUpdate, setCustomersUpdate] = useState(false)
  const [appAccess, setAppAccess] = useState(false)
  const [webAccess, setWebAccess] = useState(false)
  const [settings, setSettings] = useState(false)
  const [reports, setReports] = useState(false)
  const [pincodes, setPincodes] = useState(false)
  const [dashboard, setDashboard] = useState(false)
  const [processView, setProcessView] = useState(false)
  const [processAdd, setProcessAdd] = useState(false)
  const [ProcessUpdate, setProcessUpdate] = useState(false)
  const [ProcessDelete, setProcessDelete] = useState(false)
  const [assignProcessView, setAssignProcessView] = useState(false)
  const [assignProcessAdd, setAssignProcessAdd] = useState(false)
  const [assignProcessUpdate, setAssignProcessUpdate] = useState(false)
  const [assignProcessDelete, setAssignProcessDelete] = useState(false)
  const [DailyCollectionView, setDailyCollectionView] = useState(false)
  const [DailyCollectionViewAdd, setDailyCollectionViewAdd] = useState(false)
  const [DailyCollectionViewUpdate, setDailyCollectionViewUpdate] = useState(false)
  const [DailyCollectionViewDelete, setDailyCollectionViewDelete] = useState(false)
  const [mis, setMis] = useState(false)
  const [driveNbfcDelhi, setDriveNbfcDelhi] = useState(false)
  const [driveNbfcHaryana, setDriveNbfcHaryana] = useState(false)
  const [driveNbfcUp, setDriveNbfcUp] = useState(false)
  const [driveNbfcTata, setDriveNbfcTata] = useState(false)
  const [driveHdfcCard, setDriveHdfcCard] = useState(false)
  const [driveHdfcRetail, setDriveHdfcRetail] = useState(false)
  const [driveIdfc, setDriveIdfc] = useState(false)
  const [driveKotak, setDriveKotak] = useState(false)

  // * Tasks
  const tasksAddByCustomer = () => {
    setTasksAddCustomer(true)
    setTasksAddAllocation(false)
  }

  const tasksAddByAllocator = () => {
    setTasksAddCustomer(false)
    setTasksAddAllocation(true)
  }

  const noTasksView = () => {
    setTasksView(false)
    setAllocationPendingTasks(false)
    setVisitPendingTasks(false)
    setInProgressTasks(false)
    setFinalisationPendingTasks(false)
    setCompletedTasks(false)
    setTaskSummary(false)
  }

  // * Initialization
  const dispatch = useDispatch()

  // * Check for auth
  const userLogin = useSelector((state) => state.userLogin)
  const { loadingUserInfo, userInfo } = userLogin

  useEffect(() => {
    if (!userInfo) {
      //   history.push('/')
    }
  }, [userInfo, history])

  // * Check for role
  const getRoleInfo = useSelector((state) => state.getRoleInfo)
  const { loadingGetRole, getRoleData } = getRoleInfo

  useEffect(() => {
    if (getRoleData) {
      if (!getRoleData.rolesAdd) {
        // history.push('/')
      }
    }
  }, [userInfo, getRoleData, history])

  const addRoleHandler = () => {
    if (!name) {
      toast('Name is mandatory', {
        type: 'error',
        hideProgressBar: true,
        autoClose: 2000,
      })
    } else {
      dispatch(
        addRole(
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
        )
      )
    }
  }

  const addRoleInfo = useSelector((state) => state.addRoleInfo)
  const { loadingAddRoleInfo, errorAddRoleInfo, addRoleData } = addRoleInfo

  useEffect(() => {
    dispatch({ type: ADD_ROLE_RESET })
    if (addRoleData) {
      toast('Role added successfully', {
        type: 'success',
        hideProgressBar: true,
        autoClose: 2000,
      })
      setTimeout(() => {

      }, 1000)
    } else if (errorAddRoleInfo) {
      toast(errorAddRoleInfo, {
        type: 'error',
        hideProgressBar: true,
        autoClose: 2000,
      })
    }
  }, [addRoleData, errorAddRoleInfo])

  return (
    <div className='w-full h-full'>
      <h1 className='text-2xl font-semibold'>Add Role</h1>
      <div className='bg-white shadow-md rounded px-8 py-8 my-4'>
        <h3 className='text-md font-semibold mb-2'>Name</h3>
        <Input
          name='Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <h3 className='text-md font-semibold mt-8'>Tasks</h3>
        <div class='flex flex-wrap md:items-center mt-4'>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true ? setTasksView(true) : noTasksView()
              }
              checked={tasksView === true ? true : false}
            />
            <span class='text-sm'>View Tasks</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setTasksDetailsView(true)
                  : setTasksDetailsView(false)
              }
              checked={tasksDetailsView === true ? true : false}
            />
            <span class='text-sm'>View Tasks Details</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setTasksUpdate(true)
                  : setTasksUpdate(false)
              }
              checked={tasksUpdate === true ? true : false}
            />
            <span class='text-sm'>Update Tasks</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold mt-6'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? tasksAddByCustomer()
                  : setTasksAddCustomer(false)
              }
              checked={tasksAddCustomer === true ? true : false}
            />
            <span class='text-sm'>Tasks Add By Customer</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold mt-6'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? tasksAddByAllocator()
                  : setTasksAddAllocation(false)
              }
              checked={tasksAddAllocation === true ? true : false}
            />
            <span class='text-sm'>Tasks Add By Allocator</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold mt-6'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setAllocationPendingTasks(true)
                  : setAllocationPendingTasks(false)
              }
              checked={allocationPendingTasks === true ? true : false}
            />
            <span class='text-sm'>View Allocation Pending Tasks</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold mt-6'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setVisitPendingTasks(true)
                  : setVisitPendingTasks(false)
              }
              checked={visitPendingTasks === true ? true : false}
            />
            <span class='text-sm'>View Visit Pending Tasks</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold mt-6'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setInProgressTasks(true)
                  : setInProgressTasks(false)
              }
              checked={inProgressTasks === true ? true : false}
            />
            <span class='text-sm'>View In Progress Tasks</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold mt-6'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setFinalisationPendingTasks(true)
                  : setFinalisationPendingTasks(false)
              }
              checked={finalisationPendingTasks === true ? true : false}
            />
            <span class='text-sm'>View Finalisation Pending Tasks</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold mt-6'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setCompletedTasks(true)
                  : setCompletedTasks(false)
              }
              checked={completedTasks === true ? true : false}
            />
            <span class='text-sm'>View Completed Tasks</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold mt-6'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setWaivedTasks(true)
                  : setWaivedTasks(false)
              }
              checked={waivedTasks === true ? true : false}
            />
            <span class='text-sm'>View Waived Tasks</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold mt-6'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true ? setCalling(true) : setCalling(false)
              }
              checked={calling === true ? true : false}
            />
            <span class='text-sm'>Calling</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold mt-6'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setTaskSummary(true)
                  : setTaskSummary(false)
              }
              checked={taskSummary === true ? true : false}
            />
            <span class='text-sm'>Task Summary</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold mt-6'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setTransfers(true)
                  : setTransfers(false)
              }
              checked={transfers === true ? true : false}
            />
            <span class='text-sm'>Transfers</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold mt-6'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setViewUnassignTasks(true)
                  : setViewUnassignTasks(false)
              }
              checked={viewUnassignTasks === true ? true : false}
            />
            <span class='text-sm'>UnAssigned Task View</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold mt-6'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setViewFieldTasks(true)
                  : setViewFieldTasks(false)
              }
              checked={viewFieldTasks === true ? true : false}
            />
            <span class='text-sm'>Field Taks View</span>
          </label>
        </div>
        <h3 className='text-md font-semibold mt-8'>Process Management</h3>
        <div class='flex flex-wrap md:items-center mt-4'>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setProcessView(true)
                  : setProcessView(false)
              }
              checked={processView === true ? true : false}
            />
            <span class='text-sm'>Process View</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setProcessAdd(true)
                  : setProcessAdd(false)
              }
              checked={processAdd === true ? true : false}
            />
            <span class='text-sm'>Process Add</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setProcessUpdate(true)
                  : setProcessUpdate(false)
              }
              checked={ProcessUpdate === true ? true : false}
            />
            <span class='text-sm'>Process Update</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold mt-6'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setProcessDelete(true)
                  : setProcessDelete(false)
              }
              checked={ProcessDelete === true ? true : false}
            />
            <span class='text-sm'>Process Delete</span>
          </label>
        </div>

        <h3 className='text-md font-semibold mt-8'>Assign Process</h3>
        <div class='flex flex-wrap md:items-center mt-4'>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setAssignProcessView(true)
                  : setAssignProcessView(false)
              }
              checked={assignProcessView === true ? true : false}
            />
            <span class='text-sm'>Assign Process View</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setAssignProcessAdd(true)
                  : setAssignProcessAdd(false)
              }
              checked={assignProcessAdd === true ? true : false}
            />
            <span class='text-sm'>Assign Process Add</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setAssignProcessUpdate(true)
                  : setAssignProcessUpdate(false)
              }
              checked={assignProcessUpdate === true ? true : false}
            />
            <span class='text-sm'>Assign Process Update</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold mt-6'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setAssignProcessDelete(true)
                  : setAssignProcessDelete(false)
              }
              checked={assignProcessDelete === true ? true : false}
            />
            <span class='text-sm'>Assign Process Delete</span>
          </label>
        </div>

        <h3 className='text-md font-semibold mt-8'>Daily Collection</h3>
        <div class='flex flex-wrap md:items-center mt-4'>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setDailyCollectionView(true)
                  : setDailyCollectionView(false)
              }
              checked={DailyCollectionView === true ? true : false}
            />
            <span class='text-sm'>Daily Collection View</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setDailyCollectionViewAdd(true)
                  : setDailyCollectionViewAdd(false)
              }
              checked={DailyCollectionViewAdd === true ? true : false}
            />
            <span class='text-sm'>Daily Collection Add</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setDailyCollectionViewUpdate(true)
                  : setDailyCollectionViewUpdate(false)
              }
              checked={DailyCollectionViewUpdate === true ? true : false}
            />
            <span class='text-sm'>Daily Collection Update</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold mt-6'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setDailyCollectionViewDelete(true)
                  : setDailyCollectionViewDelete(false)
              }
              checked={DailyCollectionViewDelete === true ? true : false}
            />
            <span class='text-sm'>Daily Collection Delete</span>
          </label>
        </div>
        <h3 className='text-md font-semibold mt-8'>Users</h3>
        <div class='flex flex-wrap md:items-center mt-4'>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setUsersView(true)
                  : setUsersView(false)
              }
              checked={usersView === true ? true : false}
            />
            <span class='text-sm'>View Users</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setUsersAdd(true)
                  : setUsersAdd(false)
              }
              checked={usersAdd === true ? true : false}
            />
            <span class='text-sm'>Add Users</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setUsersUpdate(true)
                  : setUsersUpdate(false)
              }
              checked={usersUpdate === true ? true : false}
            />
            <span class='text-sm'>Update Users</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold mt-6'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setRejoinUsers(true)
                  : setRejoinUsers(false)
              }
              checked={rejoinUsers === true ? true : false}
            />
            <span class='text-sm'>Rejoin Users</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold mt-6'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setResignedUsers(true)
                  : setResignedUsers(false)
              }
              checked={resignedUsers === true ? true : false}
            />
            <span class='text-sm'>Resigned Users</span>
          </label>
        </div>
        <h3 className='text-md font-semibold mt-8'>Roles</h3>
        <div class='flex flex-wrap md:items-center mt-4'>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setRolesView(true)
                  : setRolesView(false)
              }
              checked={rolesView === true ? true : false}
            />
            <span class='text-sm'>View Roles</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setRolesAdd(true)
                  : setRolesAdd(false)
              }
              checked={rolesAdd === true ? true : false}
            />
            <span class='text-sm'>Add Roles</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setRolesUpdate(true)
                  : setRolesUpdate(false)
              }
              checked={rolesUpdate === true ? true : false}
            />
            <span class='text-sm'>Update Roles</span>
          </label>
        </div>
        <h3 className='text-md font-semibold mt-8'>Customers</h3>
        <div class='flex flex-wrap md:items-center mt-4'>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setCustomersView(true)
                  : setCustomersView(false)
              }
              checked={customersView === true ? true : false}
            />
            <span class='text-sm'>View Customers</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setCustomersAdd(true)
                  : setCustomersAdd(false)
              }
              checked={customersAdd === true ? true : false}
            />
            <span class='text-sm'>Add Customers</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setCustomersUpdate(true)
                  : setCustomersUpdate(false)
              }
              checked={customersUpdate === true ? true : false}
            />
            <span class='text-sm'>Update Customers</span>
          </label>
        </div>
        <h3 className='text-md font-semibold mt-8'>Drive Access</h3>
        <div class='flex flex-wrap md:items-center mt-4'>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setDriveNbfcDelhi(true)
                  : setDriveNbfcDelhi(false)
              }
              checked={driveNbfcDelhi === true ? true : false}
            />
            <span class='text-sm'>NBFC Delhi</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setDriveNbfcHaryana(true)
                  : setDriveNbfcHaryana(false)
              }
              checked={driveNbfcHaryana === true ? true : false}
            />
            <span class='text-sm'>NBFC Haryana</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setDriveNbfcUp(true)
                  : setDriveNbfcUp(false)
              }
              checked={driveNbfcUp === true ? true : false}
            />
            <span class='text-sm'>NBFC UP</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold mt-6'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setDriveNbfcTata(true)
                  : setDriveNbfcTata(false)
              }
              checked={driveNbfcTata === true ? true : false}
            />
            <span class='text-sm'>NBFC Tata</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold mt-6'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setDriveHdfcCard(true)
                  : setDriveHdfcCard(false)
              }
              checked={driveHdfcCard === true ? true : false}
            />
            <span class='text-sm'>HDFC Card</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold mt-6'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setDriveHdfcRetail(true)
                  : setDriveHdfcRetail(false)
              }
              checked={driveHdfcRetail === true ? true : false}
            />
            <span class='text-sm'>HDFC Retail</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold mt-6'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setDriveIdfc(true)
                  : setDriveIdfc(false)
              }
              checked={driveIdfc === true ? true : false}
            />
            <span class='text-sm'>IDFC Main</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold mt-6'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setDriveKotak(true)
                  : setDriveKotak(false)
              }
              checked={driveKotak === true ? true : false}
            />
            <span class='text-sm'>Kotak Main</span>
          </label>
        </div>
        <h3 className='text-md font-semibold mt-8'>Login Acess</h3>
        <div class='flex flex-wrap md:items-center mt-4'>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setAppAccess(true)
                  : setAppAccess(false)
              }
              checked={appAccess === true ? true : false}
            />
            <span class='text-sm'>App Access</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setWebAccess(true)
                  : setWebAccess(false)
              }
              checked={webAccess === true ? true : false}
            />
            <span class='text-sm'>Web Access</span>
          </label>
        </div>
        <h3 className='text-md font-semibold mt-8'>Settings</h3>
        <div class='flex flex-wrap md:items-center mt-4'>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setSettings(true)
                  : setSettings(false)
              }
              checked={settings === true ? true : false}
            />
            <span class='text-sm'>Settings</span>
          </label>
          {/* <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true ? setReports(true) : setReports(false)
              }
              checked={reports === true ? true : false}
            />
            <span class='text-sm'>Reports</span>
          </label> */}
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setViewAttendance(true)
                  : setViewAttendance(false)
              }
              checked={viewAttendance === true ? true : false}
            />
            <span class='text-sm'>Attendance</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setPincodes(true)
                  : setPincodes(false)
              }
              checked={pincodes === true ? true : false}
            />
            <span class='text-sm'>Pincodes</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold mt-6'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true
                  ? setDashboard(true)
                  : setDashboard(false)
              }
              checked={dashboard === true ? true : false}
            />
            <span class='text-sm'>Dashboard</span>
          </label>
          <label class='w-1/3 text-gray-500 font-bold'>
            <input
              class='mr-2 leading-tight'
              type='checkbox'
              onChange={(e) =>
                e.target.checked === true ? setMis(true) : setMis(false)
              }
              checked={mis === true ? true : false}
            />
            <span class='text-sm'>MIS Access</span>
          </label>
        </div>
        <Button
          type='button'
          text='Add'
          custom='mt-6 py-2 px-6'
          onClick={addRoleHandler}
        />
      </div>
    </div>
  )
}

export default AddRole