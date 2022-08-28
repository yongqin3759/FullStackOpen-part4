import React, { useState, useEffect } from 'react'
import userService from '../services/user'

const Users = () => {
  const [users, setUsers] = useState([])
  useEffect(() => {
    userService.getUserInfo().then((res) => {
      setUsers(res)
    })
  }, [])

  console.log(users)
  return (
    <div>
      <h2>Users</h2>
      <table>
        <tr>
          <th></th>
          <th>Blogs Created</th>
        </tr>
        {users.map((user, id) => (
          <tr key={id}>
            <td>{user.name}</td>
            <td>{user.blogs.length}</td>
          </tr>
        ))}
      </table>
    </div>
  )
}

export default Users
