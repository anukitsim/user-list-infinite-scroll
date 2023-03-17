import { useState, useEffect } from 'react';

const UserCard = ({ imageUrl, user }) => {
  return (
    <div className="user-card">
      <img src={`${imageUrl}?${user.id}`} alt={user.name} />
      <div className="user-details">
        <h2> {user.prefix} {user.name} {user.lastName}</h2>
        <p> {user.title}</p>
      </div>
    </div>
  );
};

const UserList = () => {
    const [users, setUsers] = useState({ list: [], pagination: {} });

  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async (page, size) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://sweeftdigital-intern.eu-central-1.elasticbeanstalk.com/user/${page}/${size}`);
      const data = await response.json();
      if (data.hasOwnProperty('list')) {
        setUsers(prevUsers => {
            // filter out users with duplicate ids
            const newUsers = data.list.filter(user => !prevUsers.list.some(u => u.id === user.id));
            return { list: [...prevUsers.list, ...newUsers], pagination: data.pagination };
          });
          
      } else {
        console.error('Invalid API response:', data);
      }
    } catch (error) {
      console.error('API request failed:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers(page, 10);
  }, [page]);

  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight &&
        !isLoading &&
        users.pagination.currentPage < users.pagination.totalPages
      ) {
        setPage(page => page + 1);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isLoading, users.pagination]);

  const imageUrl = 'http://placeimg.com/640/480/animals';

  return (
    <div className="user-list">
      {users.list.length > 0 ? users.list.map((user, index) => (
        <UserCard
          key={`${user.id}-${index}`}
          imageUrl={imageUrl}
          user={user}
        />
      )) : <p>No users found</p>}
      {isLoading && <p>Loading users...</p>}
    </div>
  );
};

export default UserList;
