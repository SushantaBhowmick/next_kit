import React from 'react'
import Navbar from './_components/navbar';

interface ProtectedRouteProps{
    children:React.ReactNode;
}

const ProtectedRoute = ({children}:ProtectedRouteProps) => {
  return (
    <div className='bg-gradient h-full w-full flex flex-col gap-y-10 items-center justify-center'>
        <Navbar />
      {children}
    </div>
  )
}

export default ProtectedRoute
