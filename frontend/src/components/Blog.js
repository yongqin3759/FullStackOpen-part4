import { useState } from "react"
import blogService from "../services/blogs"

const Blog = ({ blog, setMessage, updateLikes }) => {
  const [show, setShow] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleShow = () => {
    setShow(!show)
  }

  const addLikes = () => {
    setLikes(likes+1)
    updateLikes(blog.id, likes+1)
  }

  const removeBlog = () => {
    blogService
      .remove(blog.id)
      .then(() => {
        setMessage({
          isSuccess: true,
          message: "Blog deleted",
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
        <button className="toggle-blog-info" onClick={handleShow}>
          {show ? "hide" : "view"}
        </button>
      </div>
      {show ? (
        <div className="additional-info">
          <div className="blog-url">{blog.url}</div>
          <div className="blog-likes">
            Likes {likes}{" "}
            <button className="add-likes" onClick={addLikes}>
              Like
            </button>
          </div>
          <div>{blog.user.name}</div>
          <button onClick={removeBlog}>remove</button>
        </div>
      ) : (
        ""
      )}
    </div>
  )
}

export default Blog
