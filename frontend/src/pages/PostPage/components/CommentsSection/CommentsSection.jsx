import { Link } from 'react-router-dom';
import CommentForm from '../CommentForm/CommentForm';
import CommentItem from '../CommentItem/CommentItem';
import styles from './CommentsSection.module.scss';

const CommentsSection = (props) => {
  const { 
    isAuthenticated, 
    comments, 
    newComment, 
    setNewComment, 
    handleCommentSubmit,  
  } = props;

  if (comments.length === 0 && !isAuthenticated) {
    return (
        <>
            <p className={styles['login-to-comment']}>
                <Link to="/login">Log in</Link> to post comments.
            </p>
            <p>No comments yet. Be the first to comment!</p>
        </>
    )
  }

  return (
    <div className={styles['comments-section']}>
      {isAuthenticated ? (
        <CommentForm
          newComment={newComment}
          setNewComment={setNewComment}
          handleCommentSubmit={handleCommentSubmit}
          styles={styles}
        />
      ) : (
        <p className={styles['login-to-comment']}>
          <Link to="/login">Log in</Link> to post comments.
        </p>
      )}

      {comments.length > 0 ? (
        <div className={styles['comments-list']}>
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} {...props} />
          ))}
        </div>
      ) : (
        <p>No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};

export default CommentsSection;