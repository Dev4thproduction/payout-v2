import React from 'react'

const Button = ({ onClick, disabled, text, type, custom }) => {
  return (
    //
    <button
      className={`bg-green-500 hover:bg-green-700 text-white text-sm font-semibold py-1 px-4 rounded focus:outline-none focus:shadow-outline ${custom}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  )
}

export default Button