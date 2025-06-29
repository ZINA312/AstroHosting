import styles from './CommentForm.module.scss';

const CommentForm = ({ newComment, setNewComment, handleCommentSubmit }) => {
  return (
    <form onSubmit={handleCommentSubmit} className={styles['comment-form']}>
      <div className={styles['form-group']}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows="3"
          className={styles['comment-input']}
        ></textarea>
      </div>
      <button type="submit" className={styles['submit-button']}>Post Comment</button>
    </form>
  );
};

export default CommentForm;