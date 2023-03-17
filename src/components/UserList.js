import { useState, useEffect } from 'react';

const UserCard = ({ user }) => {
  return (
    <div className="user-card">
      <img src={user.imageUrl} alt={user.name} />
      <div className="user-details">
        <h2>{user.name} {user.lastName}</h2>
        <p>{user.prefix} {user.title}</p>
      </div>
    </div>
  );
};

const UserList = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async (page, size) => {
    try {
      const response = await fetch(`http://sweeftdigital-intern.eu-central-1.elasticbeanstalk.com/user/${page}/${size}`);
      const data = await response.json();
      if (data.hasOwnProperty('list')) {
        setUsers(data.list);
      } else {
        console.error('Invalid API response:', data);
      }
    } catch (error) {
      console.error('API request failed:', error);
    }
  };
  

  useEffect(() => {
    fetchUsers(1, 10);
  }, []);

  return (
    <div className="user-list">
      {users.length > 0 ? (
        users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))
      ) : (
        <p>Loading users...</p>
      )}
    </div>
  );
};

export default UserList;
