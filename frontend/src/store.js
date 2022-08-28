import notificationReducer from './reducers/notificationReducer'
import { configureStore } from '@reduxjs/toolkit'
import blogReducer from './reducers/blogReducer'
import userReducer from './reducers/userReducer'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
    user: userReducer
  },
})

export default store
