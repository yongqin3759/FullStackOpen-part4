import { Link, Routes, Route, useMatch } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Users from './Users'
import User from './User'
import userService from '../services/user'
import Blogs from './Blogs'
import Blog from './Blog'
import { initializeBlogs } from '../reducers/blogReducer'

const Navbar = () => {
  const [users, setUsers] = useState([])
  const dispatch = useDispatch()

  const { blogs } = useSelector(({ blogs }) => ({
    blogs,
  }))

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    userService.getUserInfo().then((res) => {
      setUsers(res)
    })
  }, [])

  const matchUser = useMatch('/users/:id')
  const user = matchUser
    ? users.find((u) => u.id === matchUser.params.id)
    : null

  const matchBlog = useMatch('/blogs/:id')
  const blog = matchBlog
    ? blogs.find(b => b.id === matchBlog.params.id)
    : null

  return (
    <nav
      style={{
        borderBottom: 'solid 1px',
        paddingBottom: '1rem',
      }}
    >
      <Link to='/users'>users</Link> | <Link to='/blogs'>blogs</Link>
      <Routes>
        <Route path='users' element={<Users users={users} />} />
        <Route path='users/:id' element={<User user={user} />} />
        <Route path='blogs' element={<Blogs blogs={blogs}/>} />
        <Route path='blogs/:id' element={<Blog blog={blog}/>} />
      </Routes>
    </nav>
  )
}

export default Navbar
