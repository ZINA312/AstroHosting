import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IMAGE_BASE_URL } from '../../../../config/apiConfig';
import styles from './CommentItem.module.scss';

const CommentItem = ({
  comment,
  currentUserId,
  editingCommentId,
  editedCommentText,
  setEditedCommentText,
  handleEditComment,
  handleDeleteComment,
  handleSaveEditedComment,
  handleCancelEdit,
  formatDate,
  handleAvatarError,
}) => {
  const isEditing = editingCommentId === comment.id;

  return (
    <motion.div
      className={styles['comment-card']}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles['comment-header']}>
        <Link to={`/user/${comment.user.id}`} className={styles['comment-author']}>
          <img
            src={comment.user.avatarUrl ? `${IMAGE_BASE_URL}${comment.user.avatarUrl}` : '/default-avatar.jpg'}
            alt={comment.user.username}
            className={styles['comment-avatar']}
            onError={handleAvatarError}
          />
          <span className={styles['comment-username']}>{comment.user.username}</span>
        </Link>
        <span className={styles['comment-date']} title={formatDate(comment.commentDate)}>
          {formatDate(comment.commentDate)}
        </span>
        {currentUserId === comment.user.id && (
          <div className={styles['comment-actions']}>
            <button className={styles['edit-comment-button']} onClick={() => handleEditComment(comment)} title="Edit comment">Edit</button>
            <button className={styles['delete-comment-button']} onClick={() => handleDeleteComment(comment.id)} title="Delete comment">&times;</button>
          </div>
        )}
      </div>
      {isEditing ? (
        <div className={styles['editing-controls']}>
          <textarea
            value={editedCommentText}
            onChange={(e) => setEditedCommentText(e.target.value)}
            rows="3"
            className={styles['comment-input-edit']}
          ></textarea>
          <div className={styles['editing-buttons']}>
            <button className={styles['save-comment-button']} onClick={() => handleSaveEditedComment(comment.id)}>Save</button>
            <button className={styles['cancel-edit-button']} onClick={handleCancelEdit}>Cancel</button>
          </div>
        </div>
      ) : (
        <p className={styles['comment-text']}>{comment.text}</p>
      )}
    </motion.div>
  );
};

export default CommentItem;