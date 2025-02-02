'use client'
import { login } from '@/lib/auth'
import React from 'react'
import { FaGoogle } from 'react-icons/fa'

const SignIn = () => {
  return (
    <div>
      <button
        onClick={() => login()}
        className="flex justify-center items-center"
      >
        <FaGoogle />
        Sign in with Google
      </button>
    </div>
  )
}

export default SignIn
