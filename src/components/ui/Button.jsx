import React from 'react'

const Button = ({ text, textColor, bgColor }) => {
  return (
    <button className={`px-6 py-3 rounded-tl-3xl rounded-br-3xl font-albert-sans ${textColor} ${bgColor}`}>
      {text}
    </button>
  )
}

export default Button
