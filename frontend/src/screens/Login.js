import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';

import { login } from '../actions/userActions'
import Loading from '../components/Loading'
import logo from '../logo.png'

const Login = ({ history }) => {
  const navigate = useNavigate();
    // * States
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
  
    // * Initalization
    const dispatch = useDispatch()
  
    // *  On Login click
    const handleLogin = () => {
      if (!email || !password) {
        toast('All the fields are mandatory', {
          type: 'error',
          hideProgressBar: true,
          autoClose: 2000,
        })
      } else {
        dispatch(login(email.toLowerCase(), password))
      }
    }

    // * On login result
  const userLogin = useSelector((state) => state.userLogin)
  const { loadingUserInfo, errorUserInfo, userInfo } = userLogin

  useEffect(() => {
    if (userInfo) {
      // Check user role and navigate accordingly
      if (userInfo.role.name === 'Client') {
        navigate('/banktasks');
      } else if (userInfo.role.name === 'Collection Supervisor'){
        navigate('/dailyCollection');
      } else {
        navigate('/tasks')
      }
    } else if (errorUserInfo) {
      toast(errorUserInfo, {
        type: 'error',
        hideProgressBar: true,
        autoClose: 2000,
      })
    }
  }, [userInfo, errorUserInfo, navigate])

  // * On loading
  if (loadingUserInfo) {
    return <Loading />
  }

  return (
    <div className='flex justify-center h-screen items-center bg-gray-50'>
      <div className='w-full max-w-xs'>
        <ToastContainer />
        <form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col items-center'>
          {/* <img src={logo} alt='GoLog' className='w-1/2' /> */}
          <h1 className='font-bold text-xl mb-2'>GoLog Pro</h1>
          <p className='text-sm mb-6'>Enter your credentials to sign in</p>
          <div className='mb-2 w-full'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='mobile'
            >
              Email
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline text-sm'
              id='email'
              type='email'
              placeholder='Email'
              onChange={(e) => setEmail(e.target.value)}
              disabled={loadingUserInfo}
            />
          </div>
          <div className='mb-6 w-full'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='password'
            >
              Password
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline text-sm'
              id='password'
              type='password'
              placeholder='******************'
              onChange={(e) => setPassword(e.target.value)}
              disabled={loadingUserInfo}
            />
          </div>
          <div className='flex items-center justify-between mb-4'>
            <button
              className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              type='button'
              onClick={handleLogin}
              disabled={loadingUserInfo}
            >
              Sign In
            </button>
          </div>
        </form>
        {/* <p className='text-center text-gray-500 text-xs'>
          &copy;2024 MSER Ventures Pvt Ltd. All rights reserved.
        </p> */}
      </div>
    </div>
  )
}

export default Login