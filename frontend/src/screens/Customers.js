import React, { useEffect, useState, forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import MaterialTable from 'material-table'
import { toast } from 'react-toastify'
import moment from 'moment'

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
import {
  addCustomer,
  getCustomers,
  updateCustomer,
} from '../actions/customerActions'
import {
  ADD_CUSTOMER_RESET,
  GET_CUSTOMERS_RESET,
  UPDATE_CUSTOMER_RESET,
} from '../constants/customerConstants'
import Select from '../components/Select'

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

const Customers = ({ history }) => {
  const navigate = useNavigate();
  // * States
  const [data, setData] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [name, setName] = useState('')
  const [logo, setLogo] = useState('')
  const [mapOnPDF, setMapOnPDF] = useState(false)
  const [openTransfers, setOpenTransfers] = useState(false)
  const [submitType, setSubmitType] = useState('')
  const [id, setID] = useState('')

  const [addCustomerOption, setAddCustomerOption] = useState(true)
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
  }, [userInfo, history])

  // * Check for role
  const getRoleInfo = useSelector((state) => state.getRoleInfo)
  const { loadingGetRole, getRoleData } = getRoleInfo

  useEffect(() => {
    if (getRoleData) {
      setAddCustomerOption(getRoleData.customersAdd)
      if (!getRoleData.customersView) {
        toast('Not Authorized', {
          type: 'error',
          hideProgressBar: true,
          autoClose: 2000,
      })
        navigate('/')
      }
    }
  }, [userInfo, getRoleData])

  // * Get Customers
  useEffect(() => {
    dispatch(getCustomers())
  }, [])

  const getCustomersInfo = useSelector((state) => state.getCustomersInfo)
  const { loadingGetCustomersInfo, errorGetCustomersInfo, getCustomersData } =
    getCustomersInfo

  useEffect(() => {
    dispatch({ type: GET_CUSTOMERS_RESET })
    if (getCustomersData) {
      setLoading(false)
      setData(getCustomersData)
    } else if (errorGetCustomersInfo) {
      setLoading(false)
      toast(errorGetCustomersInfo, {
        type: 'error',
        hideProgressBar: true,
        autoClose: 2000,
      })
    }
  }, [getCustomersData, errorGetCustomersInfo])

  // * Users Table
  const headCells = [
    {
      field: 'name',
      title: 'Name',
      render: (rowData) => (
        <div
          className='font-bold text-md cursor-pointer text-green-800 bg-green-100 p-2 flex justify-center rounded'
          onClick={() => openUpdateCustomerModal(rowData)}
        >
          <p>{rowData.name}</p>
        </div>
      ),
    },
    {
      field: 'users',
      title: 'Users',
    },
    {
      field: 'createdAt',
      title: 'Created At',
      render: (rowData) =>
        moment(rowData.createdAt).format('DD-MM-YYYY HH:mm:ss'),
    },
  ]

  // * Open Add Modal
  const openAddCustomerModal = () => {
    setOpenModal(true)
    setSubmitType('add')
  }

  // * Close Modal
  const closeCustomerModal = () => {
    setOpenModal(false)
    setName('')
    setLogo('')
    setMapOnPDF(false)
    setSubmitType('')
    setID('')
    setOpenTransfers(false)
  }

  // * Open Update Modal
  const openUpdateCustomerModal = (item) => {
    setOpenModal(true)
    setSubmitType('update')
    setName(item.name)
    setLogo(item.logo)
    setMapOnPDF(item.mapOnPDF)
    setID(item._id)
    setOpenTransfers(item.openTransfers)
  }

  // * Add Customer
  const submitAddCustomerHandler = () => {
    if (!name) {
      toast('Name is manadatory', {
        type: 'error',
        hideProgressBar: true,
        autoClose: 2000,
      })
    } else {
      dispatch(addCustomer(name, logo, mapOnPDF, openTransfers))
    }
  }

  const addCustomerInfo = useSelector((state) => state.addCustomerInfo)
  const { loadingAddCustomerInfo, errorAddCustomerInfo, addCustomerData } =
    addCustomerInfo

  useEffect(() => {
    dispatch({ type: ADD_CUSTOMER_RESET })
    if (addCustomerData) {
      toast('Customer added successfully', {
        type: 'success',
        hideProgressBar: true,
        autoClose: 2000,
      })
      setTimeout(() => {
        dispatch(getCustomers())
        closeCustomerModal()
      }, 1000)
    } else if (errorAddCustomerInfo) {
      toast(errorAddCustomerInfo, {
        type: 'error',
        hideProgressBar: true,
        autoClose: 2000,
      })
    }
  }, [addCustomerData, errorAddCustomerInfo])

  // * Update Customer
  const submitUpdateCustomerHandler = () => {
    if (!name) {
      toast('Name is manadatory', {
        type: 'error',
        hideProgressBar: true,
        autoClose: 2000,
      })
    } else {
      dispatch(updateCustomer(id, name, logo, mapOnPDF, openTransfers))
    }
  }

  const updateCustomerInfo = useSelector((state) => state.updateCustomerInfo)
  const {
    loadingUpdateCustomerInfo,
    errorUpdateCustomerInfo,
    updateCustomerData,
  } = updateCustomerInfo

  useEffect(() => {
    dispatch({ type: UPDATE_CUSTOMER_RESET })
    if (updateCustomerData) {
      toast('Customer updated successfully', {
        type: 'success',
        hideProgressBar: true,
        autoClose: 2000,
      })
      setTimeout(() => {
        dispatch(getCustomers())
        closeCustomerModal()
      }, 1000)
    } else if (errorUpdateCustomerInfo) {
      toast(errorUpdateCustomerInfo, {
        type: 'error',
        hideProgressBar: true,
        autoClose: 2000,
      })
    }
  }, [updateCustomerData, errorUpdateCustomerInfo])

  return (
    <div className='w-full h-full'>
      <h1 className='text-2xl font-semibold'>Customers</h1>
      <div className='bg-white shadow-md rounded px-8 py-4 my-4 j'>
        <div className='flex justify-between'>
          <div className='flex gap-5'></div>
          {addCustomerOption && (
            <Button
              custom='py-2'
              type='button'
              onClick={openAddCustomerModal}
              text='Add a Customer'
            />
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
            dispatch(getCustomers(searchText))
          } else {
            dispatch(getCustomers())
          }
        }}
      />
      {openModal && (
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
                  <Input
                    width='w-full mb-4'
                    name='Name *'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Select
                    name='Logo *'
                    width='w-full mb-4'
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    options={[
                      {
                        id: 'MSER Ventures Private Limited',
                        title: 'MSER Ventures Private Limited',
                      },
                      {
                        id: 'Management Services',
                        title: 'Management Services',
                      },
                    ]}
                  />
                  <div className='flex flex-col gap-2'>
                    <label class='text-gray-500 font-bold flex-1'>
                      <input
                        class='mr-2 leading-tight'
                        type='checkbox'
                        onChange={(e) =>
                          e.target.checked === true
                            ? setMapOnPDF(true)
                            : setMapOnPDF(false)
                        }
                        checked={mapOnPDF === true ? true : false}
                      />
                      <span class='text-sm'>Map on PDF</span>
                    </label>
                    <label class='text-gray-500 font-bold flex-1'>
                      <input
                        class='mr-2 leading-tight'
                        type='checkbox'
                        onChange={(e) =>
                          e.target.checked === true
                            ? setOpenTransfers(true)
                            : setOpenTransfers(false)
                        }
                        checked={openTransfers === true ? true : false}
                      />
                      <span class='text-sm'>Open Transfers</span>
                    </label>
                  </div>
                  <p className='text-sm mt-4'>
                    All the fields with * are mandatory
                  </p>
                </div>
                {/*footer*/}
                <div className='flex items-center justify-end py-2 px-3 border-t border-solid border-blueGray-200 rounded-b'>
                  <button
                    className='text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                    type='button'
                    onClick={closeCustomerModal}
                  >
                    Close
                  </button>
                  {submitType === 'add' ? (
                    <button
                      className='bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-300'
                      type='button'
                      onClick={submitAddCustomerHandler}
                      disabled={loadingAddCustomerInfo}
                    >
                      Add
                    </button>
                  ) : (
                    submitType === 'update' && (
                      <button
                        className='bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-300'
                        type='button'
                        onClick={submitUpdateCustomerHandler}
                      >
                        Update
                      </button>
                    )
                  )}
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

export default Customers