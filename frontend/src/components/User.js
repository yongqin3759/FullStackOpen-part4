import React from 'react'

const User = ({ user }) => {
  if (!user) {
    return null
  }

  return (<div>
    <h1>{user.name} </h1>
    <h3>Added Blogs</h3>
    <ul>
      {user.blogs.map((b, id) => (
        <li key={id}>{b.title}</li>
      ))}
    </ul>
  </div>)
}

export default User
