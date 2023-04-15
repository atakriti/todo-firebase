import React from 'react'
import {Link} from "react-router-dom"
function Header() {
  return (
      <header className='mb-3 w-96 flex justify-between items-center p-2 '>
          <Link className='bg-slate-500 text-white px-4 py-1 rounded-full hover:bg-slate-400' to="/todos">Todos</Link>
          <Link className='bg-slate-500 text-white px-4 py-1 rounded-full hover:bg-slate-400' to="/register">Regsiter</Link>
          <Link className='bg-slate-500 text-white px-4 py-1 rounded-full hover:bg-slate-400' to="/">Home</Link>
    </header>
  )
}

export default Header