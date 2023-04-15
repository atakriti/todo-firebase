import React, { useEffect, useState } from 'react'
import {BsGoogle} from "react-icons/bs"
import { auth,googleProvider } from "./firebase"
import {createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged,signOut,signInWithPopup} from "firebase/auth"
function Register() {
  // To dsipaly the id of the user it calls uid
  // by Default when signup it will signin automatically
  let [user,setUser] = useState({}) // Here we want only the user who signed in
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
      await createUserWithEmailAndPassword(auth, suValue.emailSu, suValue.passwordSu)
      setSuValue({
        emailSu: "",
        passwordSu:""
      })
    } catch (error) {
      alert(error.message)
    }
  }
  // ============================= HandleSignIn ====================
  let handleSubmitSi = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, siValue.emailSi, siValue.passwordSi)
      setSiValue({
        emailSi: "",
        passwordSi:""
      })
    } catch (error) {
      alert(error.message)
    }
  } 
  // ============================ Sign out =====================
  let handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      alert(error.message)
    }
  }
  // =================================== Sign in with google ==========================
  let handleGoogle = () => {
    signInWithPopup(auth, googleProvider)
  }
  console.log(user);
  useEffect(() => {
    onAuthStateChanged(auth,(currentUser) => setUser(currentUser))
  },[])
  return (
    <div className='container flex flex-col items-center space-y-7 max-w-full'>
      <div className="w-full flex justify-center">
        <button onClick={handleGoogle} className='flex items-center justify-around w-60 bg-slate-500 rounded-md py-2 text-2xl border text-white'><span>Sign in with</span> <BsGoogle className='fill-white w-10 h-10'/></button>
      </div>
      <div className="border-y-2 w-60">
        <h1 className='text-center text-2xl'>OR</h1>
      </div>
      <h1 className='text-center text-3xl mb-3'>Sign up</h1>
      <form className='border-y-2 mb-2 p-2 flex justify-between flex-col w-full  md:flex-row' onChange={handleChangeSu} onSubmit={handleSubmitSu}>
        <input required value={suValue.emailSu} type="text" name="emailSu" id="" placeholder='E-Mail...' className='flex-1 p-1 outline-none' />
        <input required value={suValue.passwordSu} type="password" name="passwordSu" id="" placeholder='Password... (Min 6 character)' className='flex-1 p-1 outline-none' />
        <button className='bg-sky-600 text-white w-40 py-1 rounded-full mx-auto outline-none hover:bg-sky-300'>Sign up</button>
      </form>
      {/* ==================== sign in ============= */}
      <h1 className='text-center text-3xl mb-3'>Sign in</h1>
      <form className='border-y-2 mb-2 p-2 flex justify-between flex-col w-full  md:flex-row' onChange={handleChangeSi} onSubmit={handleSubmitSi} >
        <input required value={siValue.emailSi} type="text" name="emailSi" id="" placeholder='E-Mail...' className='flex-1 p-1 outline-none' />
        <input required value={siValue.passwordSi} type="password" name="passwordSi" id="" placeholder='Password... (Min 6 character)' className='flex-1 p-1 outline-none' />
        <button className='bg-sky-600 text-white w-40 py-1 rounded-full mx-auto outline-none hover:bg-sky-300'>Sign in</button>
      </form>
      {/* ====================== Sign out ================= */}
       {/* Here the user.email is not from the state, this email is from the firebase */}
      {user?.email && (
 <button className='bg-red-500 w-60 py-2 rounded-2xl outline-none hover:bg-red-400' onClick={handleSignOut}>Sign out</button>
      )}
     
      {user?.email && (
          <>
          <h1 className='bg-gray-400 p-2 text-white mt-2 rounded-full w-3/5 text-center' >E-Mail: {user?.email} <br /> Name: {user?.displayName}</h1> 
          </>
      )}
          <img src={user?.photoURL} className="rounded-full" alt="" />
      
    </div>
  )
}

export default Register