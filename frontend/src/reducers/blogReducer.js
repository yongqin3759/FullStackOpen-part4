import { createSlice } from '@reduxjs/toolkit'
import blogsService from '../services/blogs'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    blogCreate(state, action) {
      const newBlog = action.payload
      return [...state].concat(newBlog)
    },
    blogDelete(state, action) {
      const id = action.payload
      return [...state].filter((blog) => !(blog.id === id))
    },
    blogAddLike(state, action) {
      const id = action.payload
      return [...state].map((blog) => {
        return blog.id !== id
          ? blog : {
            ...blog,
            likes: blog.likes + 1,
          }
      })
    },
    blogSort(state) {
      return [...state].sort((a, b) => {
        return b.likes - a.likes
      })
    },
    blogSet(state, action){
      return action.payload
    }
  },
})

export const { blogCreate, blogAddLike, blogDelete, blogSort, blogSet } =
  blogsSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogsService.getAll()
    dispatch(blogSet(blogs))
    dispatch(blogSort())
  }
}

export default blogsSlice.reducer
