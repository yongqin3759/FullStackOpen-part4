import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, setMessage }) => {
  const [show, setShow] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleShow = () => {
    setShow(!show)
  }

  const increaseLikes = () => {
    setLikes(likes + 1)
    blogService
      .update(blog.id, {
        likes: likes + 1,
      })
      .then(() => {
        setMessage({
          isSucess: true,
          message: 'You liked the post',
        })
      })
      .catch((err) => {
        setMessage({
          isSucess: false,
          message: err.message,
        })
        setLikes(likes - 1)
      })
  }

  const removeBlog = () => {
    blogService
      .remove(blog.id)
      .then(() => {
        setMessage({
          isSuccess: true,
          message: 'Blog deleted',
        })
      })
      .catch((err) => {
        setMessage({
          isSuccess: false,
          message: err.message,
        })
      })
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={handleShow}>{show ? 'hide' : 'view'}</button>
      </div>
      {show ? (
        <div>
          <div>{blog.url}</div>
          <div>
            Likes {likes} <button onClick={increaseLikes}>Like</button>
          </div>
          <div>{blog.user.name}</div>
          <button onClick={removeBlog}>remove</button>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default Blog
