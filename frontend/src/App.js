import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)

  const blogFormRef = useRef()

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={handleBlogPost} />
    </Togglable>
  )

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('user')
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    loginService
      .login({ username, password })
      .then((user) => {
        blogService.setToken(user.token)
        setUser(user)
        setUsername('')
        setPassword('')
        window.localStorage.setItem('user', JSON.stringify(user))
        setMessage({
          isSuccess: true,
          message: `${user.name} has logged in successfully!`,
        })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch((err) => {
        console.log(err)
        setMessage({
          isSuccess: false,
          message: 'Wrong username or password!',
        })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const logoutHandler = () => {
    window.localStorage.removeItem('user')
    setUser(null)
    setMessage({
      isSuccess: true,
      message: `${user.name} has logged out!`,
    })
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleBlogPost = (blogPost) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogPost)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog))
        setMessage({
          isSuccess: true,
          message: `${user.name} has created blog post successfully!`,
        })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch((error) => {
        setMessage({
          isSuccess: false,
          message: error.message,
        })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const handleAddLikes = (id, likes) => {
    blogService
      .update(id, {
        likes,
      })
      .then(() => {
        setBlogs([...blogs].forEach(blog => {
          if(blog.id === id){
            return blog.likes += 1
          }
          return blog
        }))
        setBlogs([...blogs].sort((a,b) => {
          return a.likes - b.likes
        }))
      })
      .catch((err) => {
        setMessage({
          isSucess: false,
          message: err.message,
        })
      })
  }

  const handleRemove = (id) => {
    blogService.remove(id)
      .then(() => {
        setMessage({
          isSuccess: true,
          message: 'Blog deleted',
        })
        setBlogs(blogs.filter(blog => (
          blog.id !== id
        )))
      })
      .catch(err => {
        console.log(err)
        setMessage({
          isSuccess: false,
          message: 'Unauthorized Blog Deletion!',
        })
      })
  }

  return (
    <div>
      <Notification notification={message} />
      {user === null ? (
        <LoginForm handleSubmit={handleLogin}
          handlePasswordChange={e => setPassword(e.target.value)}
          handleUsernameChange={e => setUsername(e.target.value)}
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
          <h2>Blogs:</h2>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                updateLikes={handleAddLikes}
                handleRemove={handleRemove}
              />
            ))}
        </div>
      )}
    </div>
  )
}

export default App
