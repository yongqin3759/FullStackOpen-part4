import { createSlice } from '@reduxjs/toolkit'
import blogsService from '../services/blogs'
import { notificationChange } from './notificationReducer'

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
      console.log([...state].filter((blog) => !(blog.id === id)))
      return [...state].filter((blog) => !(blog.id === id))
    },
    blogAddLike(state, action) {
      const id = action.payload
      return [...state].map((blog) => {
        return blog.id !== id
          ? blog
          : { ...blog,likes : blog.likes + 1 }
      })
    },
    blogSort(state) {
      return [...state].sort((a, b) => {
        return b.likes - a.likes
      })
    },
    blogSet(state, action) {
      return action.payload
    },
  },
})

export const { blogCreate, blogAddLike, blogDelete, blogSort, blogSet } =
  blogsSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogsService.getAll()
    dispatch(blogSet(blogs))
    dispatch(blogSort())
  }
}

export const removeBlog = (id) => {
  return async (dispatch) => {
    try {
      await blogsService.remove(id)
      dispatch(blogDelete(id))
      dispatch(
        notificationChange({
          isSuccess: true,
          message: 'Blog Deleted',
        })
      )
    } catch {
      dispatch(
        notificationChange({
          isSuccess: false,
          message: 'Unauthorized blog deletion',
        })
      )
    }
  }
}

export const addLikeToBlog = (id, likes) => {
  return async (dispatch) => {
    try {
      await blogsService.update(id, { likes })
      dispatch(blogAddLike(id))
      dispatch(blogSort())
      dispatch(
        notificationChange({
          isSuccess: true,
          message: 'Added Like!',
        })
      )
    } catch {
      dispatch(
        notificationChange({
          isSuccess: false,
          message: 'Unable to add like!',
        })
      )
    }
  }
}

export default blogsSlice.reducer
