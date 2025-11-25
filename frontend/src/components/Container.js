import React from 'react'

const Container = ({ children }) => {
  return (
    <div className='flex flex-no-wrap h-screen overflow-x-auto'>{children}</div>
  )
}

export default Container