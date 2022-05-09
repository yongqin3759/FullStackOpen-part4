import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] =useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [blogPost, setBlogPost] = useState({
    title:'',
    author: '',
    url: ''
  })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(()=> {
    const loggedInUser = window.localStorage.getItem('user')
    if(loggedInUser){
      const user = JSON.parse(loggedInUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  },[])

  const handleLogin =(e)=> {
    e.preventDefault();
    loginService.login({username,password}).then(user=> {
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      window.localStorage.setItem('user', JSON.stringify(user))
      setMessage({
        isSuccess: true,
        message: `${user.name} has logged in successfully!`
      })
      setTimeout(()=> {
        setMessage(null)
      }, 5000)
    }).catch(err => {
      console.log(err)
      setMessage({
        isSuccess: false,
        message: 'Wrong username or password!'
      })
      setTimeout(()=> {
        setMessage(null)
      }, 5000)
    })
  }

  const logoutHandler = () => {
    window.localStorage.removeItem('user')
    setUser(null)
    setMessage({
      isSuccess: true,
      message: `${user.name} has logged out!`
    })
    setTimeout(()=> {
      setMessage(null)
    }, 5000)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input 
        type="text" 
        name="username" 
        onChange={(e)=>setUsername(e.target.value)}
        />
      </div>
      <div>
        password
        <input 
        type="password" 
        name="password" 
        onChange={(e)=>setPassword(e.target.value)}
        />
      </div>
      <button>Login</button>
    </form>
  )

  const handleBlogPost = (e) => {
    e.preventDefault()
    blogService.create(blogPost).then((returnedBlog)=> {
      setBlogs(blogs.concat(returnedBlog))
      setMessage({
        isSuccess: true,
        message: `${user.name} has created blog post successfully!`
      })
      setTimeout(()=> {
        setMessage(null)
      }, 5000)
    }).catch((error) => {
      setMessage({
        isSuccess: false,
        message: error
      })
      setTimeout(()=> {
        setMessage(null)
      }, 5000)
    })
  }

  const blogForm = () => (
    <form onSubmit={handleBlogPost}>
      <h2>Create New Blog</h2>
            <p>Title: 
            <input 
            type="text" 
            onChange={(e)=> setBlogPost({...blogPost,title:e.target.value})}/>
            </p>
            <p>Name: 
            <input 
            type="text" 
            onChange={(e)=> setBlogPost({...blogPost,author:e.target.value})}/>
            </p>
            <p>URL: 
            <input 
            type="text" 
            onChange={(e)=> setBlogPost({...blogPost,url:e.target.value})}/>
            </p>
            <button>Create Blog</button>
    </form>
  )

  return (
    <div>
    <Notification notification={message}/>
      {user === null ? loginForm() : 
        <div>
          <h2>blogs</h2>
          <h3>{user.name} has logged in 
          <button onClick={logoutHandler}>Logout</button></h3> 
          {blogForm()}
          <br/>
          <h2>Blogs:</h2>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      }
    </div>
  )
}

export default App
