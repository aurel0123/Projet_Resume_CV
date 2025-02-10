import React from 'react'

export default function Container({children, className}) {
  return (
    <div className={`max-w-[70rem] mx-auto ${className}`}>
        {children}
    </div>
  )
}
