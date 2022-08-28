import { Link, Routes, Route } from 'react-router-dom'
import React from 'react'
import Users from './Users'

const Navbar = () => {
  return (
    <nav
      style={{
        borderBottom: 'solid 1px',
        paddingBottom: '1rem',
      }}
    >
      <Link to='/users'>users</Link> | <Link to='/blogs'>blogs</Link>
      <Routes>
        <Route path='users' element={<Users />} />
      </Routes>
    </nav>
  )
}

export default Navbar
