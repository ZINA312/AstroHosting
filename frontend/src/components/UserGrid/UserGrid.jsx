import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; 
import styles from './UserGrid.module.scss'; 
import { IMAGE_BASE_URL } from '../../config/apiConfig';

const UsersGrid = ({ users }) => {
  const handleAvatarError = (e) => {
    e.target.onerror = null; 
    e.target.src = '/default-avatar.jpg';
  };

  if (!users || users.length === 0) {
    return (
      <div className={styles['no-users-found']}>
        <p>No users found. Check back later!</p>
      </div>
    );
  }

  return (
    <div className={styles['users-grid']}>
      {users.map(user => (
        <motion.div
          key={user.id}
          className={styles['user-card']}
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link to={`/user/${user.id}`} className={styles['user-link']}>
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
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default UsersGrid;
