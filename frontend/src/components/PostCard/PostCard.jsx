import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 
import styles from './PostCard.module.scss'; 
import { IMAGE_BASE_URL } from '../../config/apiConfig';

const PostCard = ({ post, isFeatured = false, isHovered, onHoverStart, onHoverEnd }) => {
  const navigate = useNavigate(); 

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCardClick = () => {
    navigate(`/post/${post.id}`); 
  };

  const wrapperProps = isFeatured ? {
    className: styles['slide-background'],
    onMouseEnter: onHoverStart,
    onMouseLeave: onHoverEnd,
    onClick: handleCardClick, 
  } : {
    className: styles['photo-card'],
    whileHover: { scale: 1.05 },
    onHoverStart: onHoverStart,
    onHoverEnd: onHoverEnd,
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 },
    onClick: handleCardClick, 
  };

  const imageUrl = post.imageUrl ? `${IMAGE_BASE_URL}${post.imageUrl}` : ''; 
  const avatarUrl = post.author.avatarUrl ? `${IMAGE_BASE_URL}${post.author.avatarUrl}` : ''; 
  
  const imageStyle = {
    backgroundImage: `url(${imageUrl})`
  };

  return (
    <motion.div {...wrapperProps} style={!isFeatured ? imageStyle : {}}>
      {isFeatured && <div className={styles['slide-background']} style={imageStyle}></div>}

      {isHovered && ( 
        <motion.div
          className={`${isFeatured ? styles['slide-overlay'] : styles['photo-overlay']}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles['overlay-content']}>
            <h3>{post.title}</h3>
            <p className={styles.description}>{post.description}</p>
            <div className={styles['post-meta']}>
              <div className={styles['author-info']}>
                <img
                  src={avatarUrl} 
                  alt={post.author.username}
                  className={styles['author-avatar']}
                />
                <span>{post.author.username}</span>
              </div>
              <div className={styles.stats}>
                <span className={styles.likes}>❤️ {post.likesCount} {isFeatured ? 'likes' : ''}</span>
                <span className={styles.comments}>💬 {post.commentsCount} {isFeatured ? 'comments' : ''}</span>
              </div>
              <div className={styles.date}>📅 {formatDate(post.dateCreated)}</div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PostCard;
