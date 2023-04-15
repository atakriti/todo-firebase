import React,{useEffect, useState} from 'react'
import { auth } from "./firebase"
import {createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged,signOut} from "firebase/auth"
function Register() {
  let [user,setUser] = useState({}) // Here we want only the user who signed up
  let [suValue, setSuValue] = useState({
    emailSu: "",
    passwordSu:""
  })
  console.log("🚀 ~ file: Register.jsx:8 ~ Register ~ suValue:", suValue)
  let [siValue, setSiValue] = useState({
    emailSi: "",
    passwordSi:""
  })
  // ===================== handleChangeSu ======================
  let handleChangeSu = (e) => {
    setSuValue({...suValue,[e.target.name]:e.target.value})
  }
  // ===================== handleChangeSi ======================
  let handleChangeSi = (e) => {
    setSiValue({...siValue,[e.target.name]:e.target.value})
  }
  // ============================ handleSubmitSu =======================
  let handleSubmitSu = async (e) => {
    e.preventDefault()
    try {
      await createUserWithEmailAndPassword(auth,suValue.emailSu,suValue.passwordSu)
    } catch (error) {
      alert(error.message)
    }
  }
  // ============================= HandleSignIn ====================
  let handleSubmitSi = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth,siValue.emailSi,siValue.passwordSi)
    } catch (error) {
      alert(error.message)
    }
  } 
  // ============================ Sign out =====================
  let handleSignOut = async () => {
    await signOut(auth)
  }
  useEffect(() => {
    onAuthStateChanged(auth,(currentUser) => setUser(currentUser))
  },[])
  return (
    <div className='container'>
      <form className='border-y-2 mb-2 p-2 flex justify-between flex-col  md:flex-row' onChange={handleChangeSu} onSubmit={handleSubmitSu}>
        <input value={suValue.emailSu} type="text" name="emailSu" id="" placeholder='E-Mail...' className='flex-1 p-1 outline-none' />
        <input value={suValue.passwordSu} type="password" name="passwordSu" id="" placeholder='Password...' className='flex-1 p-1 outline-none' />
        <button className='bg-sky-600 text-white w-40 py-1 rounded-full mx-auto hover:bg-sky-300'>Sign up</button>
      </form>
      {/* ==================== sign in ============= */}
      <form className='border-y-2 mb-2 p-2 flex justify-between flex-col  md:flex-row' onChange={handleChangeSi} onSubmit={handleSubmitSi} >
        <input type="text" name="emailSi" id="" placeholder='E-Mail...' className='flex-1 p-1 outline-none' />
        <input type="password" name="passwordSi" id="" placeholder='Password...' className='flex-1 p-1 outline-none' />
        <button className='bg-sky-600 text-white w-40 py-1 rounded-full mx-auto hover:bg-sky-300'>Sign in</button>
      </form>
      {/* ====================== Sign out ================= */}
      <button className='bg-red-500 w-60 py-2 rounded-2xl hover:bg-red-400' onClick={handleSignOut}>Sign out</button>
      {/* Here the user.email is not from the state, this email is from the firebase */}
      <h1>{user?.email}</h1> 
    </div>
  )
}

export default Register