import { Link } from 'react-router-dom';
import { IMAGE_BASE_URL } from '../../../../config/apiConfig';
import styles from './PostHeader.module.scss';

const PostHeader = ({
  postDetails,
  commentsCount,
  isLiked,
  onLikeToggle,
  formatDate,
  handleAvatarError,
}) => {
  const author = postDetails.author;

  return (
    <div className={styles['post-header']}>
      <Link to={`/user/${author.id}`} className={styles['author-info']}>
        <img
          src={author.avatarUrl ? `${IMAGE_BASE_URL}${author.avatarUrl}` : '/default-avatar.jpg'}
          alt={author.username}
          className={styles['author-avatar']}
          onError={handleAvatarError}
        />
        <div>
          <span className={styles['author-name']}>{author.username}</span>
          <span className={styles['post-date']}>{formatDate(postDetails.dateCreated)}</span>
        </div>
      </Link>

      <div className={styles['post-stats']}>
        <div
          className={`${styles['stat-item']} ${styles.clickableLike} ${isLiked ? styles.liked : ''}`}
          onClick={onLikeToggle}
          title={isLiked ? "Unlike" : "Like"}
        >
          <span className={styles['stat-icon']}>❤️</span>
          <span className={styles['stat-value']}>{postDetails.likesCount}</span>
        </div>
        <div className={styles['stat-item']}>
          <span className={styles['stat-icon']}>💬</span>
          <span className={styles['stat-value']}>{commentsCount}</span>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;