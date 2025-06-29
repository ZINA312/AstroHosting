import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IMAGE_BASE_URL } from '../../../../config/apiConfig';
import styles from './LikesList.module.scss';

const LikesList = ({ likedBy, handleAvatarError }) => {
  if (likedBy.length === 0) {
    return <p>No likes yet. Be the first to like this post!</p>;
  }

  return (
    <div className={styles['likes-section']}>
      <div className={styles['likes-grid']}>
        {likedBy.map((user, index) => (
          <motion.div
            key={user.id}
            className={styles['like-item']}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link to={`/user/${user.id}`} className={styles['user-link']}>
              <img
                src={user.avatarUrl ? `${IMAGE_BASE_URL}${user.avatarUrl}` : '/default-avatar.jpg'}
                alt={user.username}
                className={styles['user-avatar']}
                onError={handleAvatarError}
              />
              <span className={styles.username}>{user.username}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LikesList;