import { useState } from "react"

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")

  const handleCreateBlog = (e) => {
    e.preventDefault()
    const blogPost = {
      title,
      author,
      url,
    }
    createBlog(blogPost)
    setTitle("")
    setAuthor("")
    setUrl("")
  }

  return (
    <form onSubmit={handleCreateBlog}>
      <h2>Create New Blog</h2>
      <p>
        Title:
        <input
          type="text"
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </p>
      <p>
        Name:
        <input
          type="text"
          placeholder="name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </p>
      <p>
        URL:
        <input
          type="text"
          placeholder="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </p>
      <button>Create Blog</button>
    </form>
  )
}

export default BlogForm
