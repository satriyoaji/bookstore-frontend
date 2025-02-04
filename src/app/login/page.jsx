"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { signIn } from 'next-auth/react'
import classes from './login.module.css'
import Link from 'next/link'

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password === "" || username === "") {
      toast.error("Fill all fields!")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long!")
      return
    }

    try {
      const res = await signIn('credentials', { username, password, redirect: false })

      console.log(res)

      if(res?.error == null){
        router.push('/')
      } else {
        toast.error("Error occured while logging in")
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h2>Sign in</h2>
        <form onSubmit={handleSubmit}>
          <input type="username" placeholder="Username..." onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password..." onChange={(e) => setPassword(e.target.value)} />
          <button className={classes.submitButton}>
            Submit
          </button>
          {/*<Link href='/register' className={classes.loginNow}>*/}
          {/*  Don&apos;t have an account? <br /> Register now.*/}
          {/*</Link>*/}
        </form>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Login
