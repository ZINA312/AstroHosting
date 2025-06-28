import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from './PopularUsersPage.module.scss';
import { userApi } from '../../api/userApi';
import { IMAGE_BASE_URL } from '../../config/apiConfig';

const PopularUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const fetchedUsers = await userApi.getPopularUsers(10); 
        
        setUsers(fetchedUsers);

      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message || "Failed to load popular photographers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); 

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`); 
  };

  const handleAvatarError = (e) => {
    e.target.onerror = null;
    e.target.src = '/default-avatar.jpg';
  };

  if (loading) {
    return (
      <div className={`${styles['popular-users-page']} ${styles['loading-state']}`}>
        <div className={styles.spinner}></div> 
        <p>Loading popular photographers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles['popular-users-page']} ${styles['error-state']}`}>
        <p className={styles['error-message']}>{error}</p>
        <button onClick={() => window.location.reload()} className={styles['retry-button']}>Retry</button>
      </div>
    );
  }

  return (
    <motion.div
      className={styles['popular-users-page']}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className={styles['page-title']}>Popular Photographers</h1>
      {users.length > 0 ? (
        <div className={styles['users-grid']}>
          {users.map(user => (
            <motion.div
              key={user.id}
              className={styles['user-card']}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleUserClick(user.id)} 
            >
              <div className={styles['user-avatar-container']}>
                <div className={styles['user-avatar-frame']}></div>
                <img
                  src={user.avatarUrl ? `${IMAGE_BASE_URL}${user.avatarUrl}` : '/default-avatar.jpg'} 
                  alt={user.username}
                  className={styles['user-avatar']}
                  onError={handleAvatarError}
                />
              </div>
              <h2 className={styles['user-username']}>{user.username}</h2>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className={styles['no-users-found']}>
            <p>No popular photographers found. Check back later!</p>
        </div>
      )}
    </motion.div>
  );
};

export default PopularUsersPage;
