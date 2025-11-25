import React, { useEffect, useState, forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import MaterialTable from 'material-table'
import { toast } from 'react-toastify'
import moment from 'moment'

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
import { getRoles } from '../actions/roleActions'
import { GET_ROLES_RESET } from '../constants/roleConstants'

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

const Roles = ({ history }) => {
  const navigate = useNavigate();
  // * States
  const [data, setData] = useState([])

  const [addRoleOption, setAddRoleOption] = useState(true)
  const [loading, setLoading] = useState(true)

  // * Initialization
  const dispatch = useDispatch()

  // * Check for auth
  const userLogin = useSelector((state) => state.userLogin)
  const { loadingUserInfo, userInfo } = userLogin

  useEffect(() => {
    // * Check if user info exists
    if (!userInfo) {
    //   history.push('/')
    }
  }, [userInfo, history])

  // * Check for role
  const getRoleInfo = useSelector((state) => state.getRoleInfo)
  const { loadingGetRole, getRoleData } = getRoleInfo

  useEffect(() => {
    if (getRoleData) {
      setAddRoleOption(getRoleData.rolesAdd)
      if (!getRoleData.rolesView) {
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
    dispatch(getRoles())
  }, [])

  // * Get Roles
  const getRolesInfo = useSelector((state) => state.getRolesInfo)
  const { loadingGetRolesInfo, errorGetRolesInfo, getRolesData } = getRolesInfo

  useEffect(() => {
    dispatch({ type: GET_ROLES_RESET })
    if (getRolesData) {
      setLoading(false)
      setData(getRolesData)
    } else if (errorGetRolesInfo) {
      setLoading(false)
      toast(errorGetRolesInfo, {
        type: 'error',
        hideProgressBar: true,
        autoClose: 2000,
      })
    }
  }, [getRolesData, errorGetRolesInfo])

  // * Users Table
  const headCells = [
    {
      field: 'name',
      title: 'Name',
      render: (rowData) => (
        <Link
          className='font-bold text-md cursor-pointer text-blue-800 bg-blue-100 p-2 flex justify-center rounded'
          to={`/roles/update/${rowData._id}`}
        >
          {rowData.name}
        </Link>
      ),
    },
    {
      field: 'createdAt',
      title: 'Created At',
      render: (rowData) =>
        moment(rowData.createdAt).format('DD-MM-YYYY HH:mm:ss'),
    },
  ]

  if (loading) {
    return <Loading />
  }

  return (
    <div className='w-full h-full'>
      <h1 className='text-2xl font-semibold'>Roles</h1>
      <div className='bg-white shadow-md rounded px-8 py-4 my-4 j'>
        <div className='flex justify-between'>
          <div className='flex gap-5'></div>
          {addRoleOption && (
            <Link
              className='bg-green-500 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              to='/roles/add'
            >
              Add a Role
            </Link>
          )}
        </div>
      </div>
      <MaterialTable
        icons={tableIcons}
        title={''}
        columns={headCells}
        data={data}
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
        onSearchChange={(searchText) => {
          // Call backend search when user types in MaterialTable search
          if (searchText) {
            dispatch(getRoles(searchText))
          } else {
            dispatch(getRoles())
          }
        }}
      />
    </div>
  )
}

export default Roles