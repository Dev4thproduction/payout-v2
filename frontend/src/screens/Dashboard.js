import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const navigate = useNavigate();

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
      if (!getRoleData.dashboard) {
        toast('Not Authorized', {
          type: 'error',
          hideProgressBar: true,
          autoClose: 2000,
        })
        navigate('/')
      }
    }
  }, [userInfo, getRoleData])





    return (
    <>
      <div className='w-100'>
        <h1 className='text-2xl font-semibold'>Dashboard</h1>
        <div className='bg-white shadow-md rounded px-8 py-4 my-4'>
          <div className='w-full'>
            <h2 className='text-2xl font-semibold mb-4'>Welcome to GoLog</h2>
            <p className='text-gray-600'>Manage your users, roles, and customers efficiently.</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
