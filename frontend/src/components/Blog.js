import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addLikeToBlog } from '../reducers/blogReducer'
import { removeBlog } from '../reducers/blogReducer'

const Blog = ({ blog }) => {
  if(!blog){
    return
  }
  const [likes, setLikes] = useState(blog.likes)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const addLikes = () => {
    dispatch(addLikeToBlog(blog.id, likes+1))
    setLikes(likes + 1)
  }

  const handleRemoveBlog = () => {
    dispatch(removeBlog(blog.id))
    navigate('/blogs')
  }

  return (
    <div className='blog' style={blogStyle}>
      <h2>
        {blog.title} | {blog.author}
      </h2>
      <div className='additional-info'>
        <div className='blog-url'>{blog.url}</div>
        <div className='blog-likes'>
          Likes {likes}{' '}
          <button className='add-likes' onClick={addLikes}>
            Like
          </button>
        </div>
        <div>Added by {blog.user.name}</div>
        <button onClick={handleRemoveBlog}>remove</button>
      </div>
    </div>
  )
}

export default Blog
