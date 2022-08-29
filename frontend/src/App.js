import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import { notificationChange } from './reducers/notificationReducer'
import { setUser } from './reducers/userReducer'
import {
  blogCreate,
  initializeBlogs,
} from './reducers/blogReducer'
import Navbar from './components/Navbar'

const App = () => {
  const dispatch = useDispatch()
  const { blogs, user } = useSelector(({ blogs, user }) => ({
    blogs,
    user,
  }))

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={handleBlogPost} />
    </Togglable>
  )
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('user')
    if (loggedInUser) {
      const u = JSON.parse(loggedInUser)
      dispatch(setUser(u))
      blogService.setToken(u.token)
    }
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    loginService
      .login({ username, password })
      .then((u) => {
        blogService.setToken(u.token)
        dispatch(setUser(u))
        setUsername('')
        setPassword('')
        window.localStorage.setItem('user', JSON.stringify(u))
        dispatch(
          notificationChange({
            isSuccess: true,
            message: `${u.name} has logged in successfully!`,
          })
        )
        setTimeout(() => {
          dispatch(notificationChange(null))
        }, 5000)
      })
      .catch((err) => {
        console.log(err)
        dispatch(
          notificationChange({
            isSuccess: false,
            message: 'Wrong username or password!',
          })
        )
        setTimeout(() => {
          dispatch(notificationChange(null))
        }, 5000)
      })
  }

  const logoutHandler = () => {
    window.localStorage.removeItem('user')
    dispatch(setUser(null))
    dispatch(
      notificationChange({
        isSuccess: true,
        message: `${user.name} has logged out!`,
      })
    )
    setTimeout(() => {
      dispatch(
        notificationChange(null)
      )
    }, 5000)
  }

  const handleBlogPost = (blogPost) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogPost)
      .then((returnedBlog) => {
        dispatch(blogCreate(returnedBlog))
        dispatch(
          notificationChange({
            isSuccess: true,
            message: `${user.name} has created blog post successfully!`,
          })
        )
        setTimeout(() => {
          dispatch(notificationChange(null))
        }, 5000)
      })
      .catch((error) => {
        dispatch(
          notificationChange({
            isSuccess: false,
            message: error.message,
          })
        )
        setTimeout(() => {
          dispatch(
            notificationChange(null)
          )
        }, 5000)
      })
  }

  return (
    <div>
      <Notification />
      {user === null ? (
        <LoginForm
          handleSubmit={handleLogin}
          handlePasswordChange={(e) => setPassword(e.target.value)}
          handleUsernameChange={(e) => setUsername(e.target.value)}
          username={username}
          password={password}
        />
      ) : (
        <div>
          <h2>blogs</h2>
          <h3>
            {user.name} has logged in
            <button onClick={logoutHandler}>Logout</button>
          </h3>
          {blogForm()}
          <br />
          <Navbar blogs={blogs}/>
        </div>
      )}
    </div>
  )
}

export default App
