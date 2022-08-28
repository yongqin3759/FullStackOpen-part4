import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(({ notification }) => {
    return notification
  })
  if (notification === null) {
    return null
  }

  const className = notification.isSuccess ? 'success' : 'error'
  return <div className={className}>{notification.message}</div>
}

export default Notification
