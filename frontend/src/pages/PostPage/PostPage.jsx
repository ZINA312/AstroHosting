import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './PostPage.module.scss';
import { postApi } from '../../api/postApi';
import { likeApi } from '../../api/likeApi';
import { commentApi } from '../../api/commentApi';
import { IMAGE_BASE_URL } from '../../config/apiConfig';
import { useAuth } from '../../context/AuthContext';
import EquipmentList from '../../components/EquipmentGrid/EquipmentGrid';
import PostHeader from './components/PostHeader/PostHeader';
import PostTabs from './components/PostTabs/PostTabs';
import LikesList from './components/LikesList/LikesList';
import CommentsSection from './components/CommentsSection/CommentsSection';

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
          <PostHeader
            postDetails={postDetails}
            commentsCount={comments.length}
            isLiked={isLiked}
            onLikeToggle={handleLikeToggle}
            formatDate={formatDate}
            handleAvatarError={handleAvatarError}
            styles={styles}
          />

          <div className={styles['post-content']}>
            <h1 className={styles['post-title']}>{postDetails.title}</h1>
            <p className={styles['post-description']}>{postDetails.description}</p>
          </div>

          <PostTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            likesCount={likedBy.length}
            commentsCount={comments.length}
            styles={styles}
          />

          <div className={styles['tab-content']}>
            {activeTab === 'equipment' && <EquipmentList equipment={equipmentUsed} />}
            {activeTab === 'likes' && (
              <LikesList 
                likedBy={likedBy} 
                handleAvatarError={handleAvatarError} 
                styles={styles} 
              />
            )}
            {activeTab === 'comments' && (
              <CommentsSection
                comments={comments}
                isAuthenticated={isAuthenticated}
                currentUserId={currentUserId}
                newComment={newComment}
                setNewComment={setNewComment}
                handleCommentSubmit={handleCommentSubmit}
                editingCommentId={editingCommentId}
                editedCommentText={editedCommentText}
                setEditedCommentText={setEditedCommentText}
                handleEditComment={handleEditComment}
                handleDeleteComment={handleDeleteComment}
                handleSaveEditedComment={handleSaveEditedComment}
                handleCancelEdit={handleCancelEdit}
                formatDate={formatDate}
                handleAvatarError={handleAvatarError}
                styles={styles}
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostPage;
