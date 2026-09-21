import React from 'react'

const layout = ({children}:    {children: React.ReactNode}) => {
  return (
    <>
    <div>Dashboard layout</div>
    {children}
    </>
  )
}

export default layout