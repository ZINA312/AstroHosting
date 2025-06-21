import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../assets/PostPageStyle.css';

const PostPage = () => {
  const { postId } = useParams();
  const [postDetails, setPostDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('comments');
  const [newComment, setNewComment] = useState('');
  
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        // add fetching
        setPostDetails({
          id: postId,
          title: "Andromeda Galaxy",
          description: "The Andromeda Galaxy is a barred spiral galaxy and the nearest major galaxy to the Milky Way. Captured over 5 nights with a total exposure time of 12 hours.",
          imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          author: {
            id: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
            username: "CosmicExplorer",
            avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg"
          },
          dateCreated: "2023-05-15T08:30:00Z",
          likesCount: 142,
          commentsCount: 28,
          comments: [
            {
              id: "c1d2e3f4-g5h6-i7j8-k9l0-m1n2o3p4q5r6",
              text: "Absolutely stunning capture! The details in the spiral arms are incredible.",
              commentDate: "2023-05-16T14:22:00Z",
              user: {
                id: "b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7",
                username: "AstroFan99",
                avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg"
              }
            },
            {
              id: "d2e3f4g5-h6i7-j8k9-l0m1-n2o3p4q5r6s7",
              text: "What exposure settings did you use? I'm trying to capture similar shots.",
              commentDate: "2023-05-17T09:15:00Z",
              user: {
                id: "c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8",
                username: "SpacePhotographer",
                avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg"
              }
            }
          ],
          likedBy: [
            {
              id: "d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9",
              username: "GalaxyHunter",
              avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg"
            },
            {
              id: "e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0",
              username: "NebulaLover",
              avatarUrl: "https://randomuser.me/api/portraits/women/33.jpg"
            }
          ],
          equipmentUsed: [
            {
              id: "e1f2g3h4-i5j6-k7l8-m9n0-o1p2q3r4s5t6",
              name: "Celestron NexStar 8SE",
              manufacturer: "Celestron",
              type: "Telescope",
              specifications: {
                "Aperture": "203mm",
                "Focal Length": "2032mm",
                "Focal Ratio": "f/10"
              }
            },
            {
              id: "f2g3h4i5-j6k7-l8m9-n0o1-p2q3r4s5t6u7",
              name: "ZWO ASI294MC Pro",
              manufacturer: "ZWO",
              type: "Camera",
              specifications: {
                "Sensor": "CMOS",
                "Resolution": "11.7 MP",
                "Pixel Size": "4.63μm"
              }
            },
            {
              id: "g3h4i5j6-k7l8-m9n0-o1p2-q3r4s5t6u7v8",
              name: "Sky-Watcher EQ6-R Pro",
              manufacturer: "Sky-Watcher",
              type: "Mount",
              specifications: {
                "Payload Capacity": "44 lbs",
                "Tracking Accuracy": "0.5 arcsec"
              }
            }
          ]
        });
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load post details');
        setLoading(false);
      }
    };
    
    fetchPostDetails();
  }, [postId]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() === '') return;
    // add submit
    const mockComment = {
      id: `mock-${Date.now()}`,
      text: newComment,
      commentDate: new Date().toISOString(),
      user: {
        id: "current-user-id",
        username: "CurrentUser",
        avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg"
      }
    };
    
    setPostDetails(prev => ({
      ...prev,
      comments: [mockComment, ...prev.comments],
      commentsCount: prev.commentsCount + 1
    }));
    
    setNewComment('');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="post-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="post-error">{error}</div>;
  }

  return (
    <motion.div 
      className="post-details-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="post-container">
        <div className="post-image-container">
          <motion.img 
            src={postDetails.imageUrl} 
            alt={postDetails.title} 
            className="post-image"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          />
        </div>
        
        <div className="post-info">
          <div className="post-header">
            <Link to={`/user/${postDetails.author.id}`} className="author-info">
              <img 
                src={postDetails.author.avatarUrl} 
                alt={postDetails.author.username} 
                className="author-avatar"
              />
              <div>
                <span className="author-name">{postDetails.author.username}</span>
                <span className="post-date">{formatDate(postDetails.dateCreated)}</span>
              </div>
            </Link>
            
            <div className="post-stats">
              <div className="stat-item">
                <span className="stat-icon">❤️</span>
                <span className="stat-value">{postDetails.likesCount}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">💬</span>
                <span className="stat-value">{postDetails.commentsCount}</span>
              </div>
            </div>
          </div>
          
          <div className="post-content">
            <h1 className="post-title">{postDetails.title}</h1>
            <p className="post-description">{postDetails.description}</p>
          </div>
          
          <div className="post-tabs">
            <button 
              className={`tab-item ${activeTab === 'equipment' ? 'active' : ''}`}
              onClick={() => setActiveTab('equipment')}
            >
              Equipment Used
            </button>
            <button 
              className={`tab-item ${activeTab === 'likes' ? 'active' : ''}`}
              onClick={() => setActiveTab('likes')}
            >
              Liked By ({postDetails.likedBy.length})
            </button>
            <button 
              className={`tab-item ${activeTab === 'comments' ? 'active' : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              Comments ({postDetails.commentsCount})
            </button>
          </div>
          
          <div className="tab-content">
            {activeTab === 'equipment' && (
              <div className="equipment-section">
                {postDetails.equipmentUsed.map((equipment, index) => (
                  <motion.div 
                    key={equipment.id}
                    className="equipment-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3 className="equipment-name">{equipment.name}</h3>
                    <div className="equipment-meta">
                      <span className="equipment-type">{equipment.type}</span>
                      <span className="equipment-manufacturer">{equipment.manufacturer}</span>
                    </div>
                    
                    <div className="specifications">
                      <h4>Specifications:</h4>
                      <ul>
                        {Object.entries(equipment.specifications).map(([key, value]) => (
                          <li key={key}>
                            <span className="spec-key">{key}:</span>
                            <span className="spec-value">{value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {activeTab === 'likes' && (
              <div className="likes-section">
                <div className="likes-grid">
                  {postDetails.likedBy.map((user, index) => (
                    <motion.div 
                      key={user.id}
                      className="like-item"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link to={`/user/${user.id}`} className="user-link">
                        <img 
                          src={user.avatarUrl} 
                          alt={user.username} 
                          className="user-avatar"
                        />
                        <span className="username">{user.username}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'comments' && (
              <div className="comments-section">
                <form onSubmit={handleCommentSubmit} className="comment-form">
                  <div className="form-group">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      rows="3"
                      className="comment-input"
                    ></textarea>
                  </div>
                  <button type="submit" className="submit-button">Post Comment</button>
                </form>
                
                <div className="comments-list">
                  {postDetails.comments.map((comment) => (
                    <motion.div 
                      key={comment.id}
                      className="comment-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="comment-header">
                        <Link to={`/user/${comment.user.id}`} className="comment-author">
                          <img 
                            src={comment.user.avatarUrl} 
                            alt={comment.user.username} 
                            className="comment-avatar"
                          />
                          <span className="comment-username">{comment.user.username}</span>
                        </Link>
                        <span className="comment-date" title={formatDate(comment.commentDate)}>
                          {formatDate(comment.commentDate)}
                        </span>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostPage;