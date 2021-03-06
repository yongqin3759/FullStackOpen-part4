import React from 'react'

const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  const className = notification.isSuccess ? 'success' : 'error'
  return <div className={className}>{notification.message}</div>
}

export default Notification
