import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './PopularUsersPage.module.scss';
import { userApi } from '../../api/userApi';
import UsersGrid from '../../components/UserGrid/UserGrid'; 

const PopularUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const allUsers = await userApi.getPopularUsers(10); 
        
        const sortedUsers = [...allUsers].sort((a, b) => (b.subscribersCount || 0) - (a.subscribersCount || 0));

        const fetchedUsers = sortedUsers.slice(0, 10); 
        
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
      <UsersGrid users={users} />
    </motion.div>
  );
};

export default PopularUsersPage;
