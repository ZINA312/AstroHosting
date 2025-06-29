import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './PostPage.module.scss'; 
import { postApi } from '../../api/postApi'; 
import { likeApi } from '../../api/likeApi'; 
import { commentApi } from '../../api/commentApi'; 
import { IMAGE_BASE_URL } from '../../config/apiConfig'; 
import { useAuth } from '../../context/AuthContext'; 


const equipmentTypeMap = {
  0: 'Camera',
  1: 'Lens',
  2: 'Coma Corrector',
  3: 'Flattener', 
  4: 'Mount',
  5: 'Tripod',
  6: 'Focuser',
  7: 'Guide Scope',
  8: 'Guide Camera',
  9: 'Filter',
  10: 'Accessory',
};

const PostPage = () => {
  const { postId } = useParams();

  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const currentUserId = user?.id; 

  const [postDetails, setPostDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('comments');
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false); 
  const [comments, setComments] = useState([]); 

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState('');


  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        setLoading(true);
        setError(''); 
        if (!postId || postId === '00000000-0000-0000-0000-000000000000') {
            setError('Invalid Post ID provided in URL.');
            setLoading(false);
            return;
        }

        const fetchedPost = await postApi.getPostDetailsById(postId);
        
        
        const fetchedComments = await commentApi.getCommentsForPost(postId);
        setComments(fetchedComments);

        const currentUserHasLiked = isAuthenticated && fetchedPost.likedBy?.some(
          (likedUser) => likedUser.id === currentUserId
        );
        setIsLiked(currentUserHasLiked);
        
        setPostDetails(fetchedPost);
      } catch (err) {
        console.error("Failed to load post details:", err);
        setError(err.message || 'Failed to load post details. Please check your network connection.');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && postId) {
      fetchPostDetails();
    }
  }, [postId, isAuthenticated, currentUserId, authLoading]); 

  const handleCommentSubmit = async (e) => { 
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please log in to post comments."); 
      return;
    }
    if (newComment.trim() === '') return;

    if (!postId || postId === '00000000-0000-0000-0000-000000000000') {
        alert("Cannot post comment: Invalid Post ID. Please ensure the URL is correct.");
        console.error("Attempted to comment on invalid postId:", postId);
        return;
    }

    try {
        const commentData = {
            postId: postId,
            content: newComment.trim() 
        };
        const createdComment = await commentApi.createComment(commentData);
        
        
        
        const commentWithUserInfo = {
            ...createdComment,
            user: {
                id: currentUserId,
                username: user?.username || "Anonymous",
                avatarUrl: user?.avatarUrl || "/default-avatar.jpg"
            }
        };

        setComments(prevComments => [commentWithUserInfo, ...prevComments]);
        
        setPostDetails(prev => ({
            ...prev,
            commentsCount: (prev.commentsCount || 0) + 1
        }));
        
        setNewComment(''); 
    } catch (err) {
        console.error("Error creating comment:", err);
        alert(`Failed to post comment: ${err.message}. Please try again.`); 
    }
  };

  const handleDeleteComment = async (commentId) => {
      if (!isAuthenticated) {
          alert("Please log in to delete comments.");
          return;
      }
      if (!commentId) {
          alert("Cannot delete comment: Invalid comment ID.");
          return;
      }

      
      if (!window.confirm("Are you sure you want to delete this comment?")) { 
          return;
      }

      try {
          await commentApi.deleteComment(commentId);
          setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
          setPostDetails(prev => ({
              ...prev,
              commentsCount: (prev.commentsCount || 0) - 1
          }));
      } catch (err) {
          console.error("Error deleting comment:", err);
          alert(`Failed to delete comment: ${err.message}. Please try again.`); 
      }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditedCommentText(comment.content); 
  };

  const handleSaveEditedComment = async (commentId) => {
    if (!isAuthenticated) {
      alert("Please log in to edit comments.");
      return;
    }
    if (editedCommentText.trim() === '') {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const updateData = { content: editedCommentText.trim() }; 
      await commentApi.updateComment(commentId, updateData);
      
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === commentId ? { ...comment, content: editedCommentText.trim() } : comment 
        )
      );
      setEditingCommentId(null); 
      setEditedCommentText('');
    } catch (err) {
      console.error("Error saving edited comment:", err);
      alert(`Failed to save comment: ${err.message}. Please try again.`);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedCommentText('');
  };

  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      alert("Please log in to like posts."); 
      return;
    }

    if (!postId || postId === '00000000-0000-0000-0000-000000000000') {
        alert("Cannot like/unlike: Invalid Post ID. Please ensure the URL is correct.");
        console.error("Attempted to like/unlike with invalid postId:", postId);
        return;
    }

    try {
      if (isLiked) {
        await likeApi.deleteLike(postId);
        setPostDetails(prev => ({
          ...prev,
          likesCount: prev.likesCount - 1,
          likedBy: prev.likedBy?.filter(likedUser => likedUser.id !== currentUserId) 
        }));
        setIsLiked(false);
      } else {
        await likeApi.createLike(postId);
        setPostDetails(prev => ({
          ...prev,
          likesCount: prev.likesCount + 1,
          likedBy: [...(prev.likedBy || []), { id: currentUserId, username: user?.username || "Anonymous", avatarUrl: user?.avatarUrl || "/default-avatar.jpg" }] 
        }));
        setIsLiked(true);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      alert(`Failed to toggle like: ${err.message}. Please try again.`); 
    }
  };

  const formatDate = (dateString) => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "Invalid Date";
        }
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleString(undefined, options);
    } catch (e) {
        console.error("Error formatting date:", e);
        return "Invalid Date";
    }
  };

  const handleAvatarError = (e) => {
    e.target.onerror = null; 
    e.target.src = '/default-avatar.jpg'; 
  };

  if (loading || authLoading) { 
    return (
      <div className={styles['post-loading']}>
        <div className={styles.spinner}></div>
        <p>Loading cosmic marvels...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles['post-error']}>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className={styles['retry-button']}>Retry</button>
      </div>
    );
  }

  if (!postDetails) {
    return <div className={styles['post-error']}><p>Post not found.</p></div>;
  }

  const equipmentUsed = postDetails.equipmentUsed || [];
  const likedBy = postDetails.likedBy || [];

  return (
    <motion.div
      className={styles['post-details-page']}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles['post-container']}>
        <div className={styles['post-image-container']}>
          <motion.img
            src={postDetails.imageUrl ? `${IMAGE_BASE_URL}${postDetails.imageUrl}` : '/default-post-image.jpg'} 
            alt={postDetails.title}
            className={styles['post-image']}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            onError={(e) => { e.target.onerror = null; e.target.src = '/default-post-image.jpg'; }} 
          />
        </div>

        <div className={styles['post-info']}>
          <div className={styles['post-header']}>
            <Link to={`/user/${postDetails.author.id}`} className={styles['author-info']}>
              <img
                src={postDetails.author.avatarUrl ? `${IMAGE_BASE_URL}${postDetails.author.avatarUrl}` : '/default-avatar.jpg'} 
                alt={postDetails.author.username}
                className={styles['author-avatar']}
                onError={handleAvatarError}
              />
              <div>
                <span className={styles['author-name']}>{postDetails.author.username}</span>
                <span className={styles['post-date']}>{formatDate(postDetails.dateCreated)}</span>
              </div>
            </Link>

            <div className={styles['post-stats']}>
              <div 
                className={`${styles['stat-item']} ${styles.clickableLike} ${isLiked ? styles.liked : ''}`} 
                onClick={handleLikeToggle}
                title={isLiked ? "Unlike" : "Like"}
              >
                <span className={styles['stat-icon']}>❤️</span>
                <span className={styles['stat-value']}>{postDetails.likesCount}</span>
              </div>
              <div className={styles['stat-item']}>
                <span className={styles['stat-icon']}>💬</span>
                <span className={styles['stat-value']}>{comments.length}</span>
              </div>
            </div>
          </div>

          <div className={styles['post-content']}>
            <h1 className={styles['post-title']}>{postDetails.title}</h1>
            <p className={styles['post-description']}>{postDetails.description}</p>
          </div>

          <div className={styles['post-tabs']}>
            <button
              className={`${styles['tab-item']} ${activeTab === 'equipment' ? styles.active : ''}`}
              onClick={() => setActiveTab('equipment')}
            >
              Equipment Used
            </button>
            <button
              className={`${styles['tab-item']} ${activeTab === 'likes' ? styles.active : ''}`}
              onClick={() => setActiveTab('likes')}
            >
              Liked By ({likedBy.length})
            </button>
            <button
              className={`${styles['tab-item']} ${activeTab === 'comments' ? styles.active : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              Comments ({comments.length}) 
            </button>
          </div>

          <div className={styles['tab-content']}>
            {activeTab === 'equipment' && (
              <div className={styles['equipment-section']}>
                {equipmentUsed.length > 0 ? (
                  equipmentUsed.map((equipment, index) => (
                    
                    <motion.div
                      key={equipment.id}
                      className={styles['equipment-card']}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link to={`/equipment/${equipment.id}`} className={styles['equipment-card-link']}>
                        <h3 className={styles['equipment-name']}>{equipment.name}</h3>
                        <div className={styles['equipment-meta']}>
                          <span className={styles['equipment-type']}>{equipmentTypeMap[equipment.type] || 'Unknown Type'}</span>
                          <span className={styles['equipment-manufacturer']}>{equipment.manufacturer}</span>
                        </div>

                        <div className={styles.specifications}>
                          <h4>Specifications:</h4>
                          <ul>
                            {Object.entries(equipment.specifications || {}).map(([key, value]) => (
                              <li key={key}>
                                <span className={styles['spec-key']}>{key}:</span>
                                <span className={styles['spec-value']}>{value}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <p>No equipment details available for this post.</p>
                )}
              </div>
            )}

            {activeTab === 'likes' && (
              <div className={styles['likes-section']}>
                {likedBy.length > 0 ? (
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
                ) : (
                  <p>No likes yet. Be the first to like this post!</p>
                )}
              </div>
            )}

            {activeTab === 'comments' && (
              <div className={styles['comments-section']}>
                {isAuthenticated && ( 
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
                )}
                {!isAuthenticated && (
                  <p className={styles['login-to-comment']}>
                    <Link to="/login">Log in</Link> to post comments.
                  </p>
                )}

                {comments.length > 0 ? ( 
                  <div className={styles['comments-list']}>
                    {comments.map((comment) => (
                      <motion.div
                        key={comment.id}
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
                            {isAuthenticated && currentUserId === comment.user.id && (
                                <div className={styles['comment-actions']}>
                                    <button 
                                        className={styles['edit-comment-button']} 
                                        onClick={() => handleEditComment(comment)}
                                        title="Edit comment"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className={styles['delete-comment-button']} 
                                        onClick={() => handleDeleteComment(comment.id)}
                                        title="Delete comment"
                                    >
                                        &times;
                                    </button>
                                </div>
                            )}
                        </div>
                        {editingCommentId === comment.id ? (
                            <div className={styles['editing-controls']}>
                                <textarea
                                    value={editedCommentText}
                                    onChange={(e) => setEditedCommentText(e.target.value)}
                                    rows="3"
                                    className={styles['comment-input-edit']} 
                                ></textarea>
                                <div className={styles['editing-buttons']}>
                                    <button 
                                        className={styles['save-comment-button']} 
                                        onClick={() => handleSaveEditedComment(comment.id)}
                                    >
                                        Save
                                    </button>
                                    <button 
                                        className={styles['cancel-edit-button']} 
                                        onClick={handleCancelEdit}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className={styles['comment-text']}>{comment.content}</p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p>No comments yet. Be the first to comment!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostPage;
