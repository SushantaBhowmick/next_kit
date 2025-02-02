'use client'
import { logout } from '@/lib/auth'
import React from 'react'

const SignOut = () => {
  return (
    <div>
    <button onClick={()=>logout()}>Sign Out</button>
  </div>
  )
}

export default SignOut
