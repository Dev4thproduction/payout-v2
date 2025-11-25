import React from 'react'

const Input = ({ name, value, onChange, width, type, ...other }) => {
  return (
    <input
      className={`block appearance-none ${
        width ? width : 'w-sm'
      } bg-gray-100 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm`}
      id={name}
      placeholder={name}
      value={value}
      onChange={onChange}
      type={type}
      {...other}
    />
  )
}

export default Input