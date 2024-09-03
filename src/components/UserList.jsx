import React, { useEffect, useState } from 'react';
import RannerApi from '../api';
import UserCard from './UserCard';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        let users = await RannerApi.getUserAll();
        setUsers(users);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <UserCard
            key={user.username}
            username={user.username}
            firstName={user.firstName}
            lastName={user.lastName}
            email={user.email}
          />
        ))}
      </ul>
    </div>
  );
}

export default UserList;