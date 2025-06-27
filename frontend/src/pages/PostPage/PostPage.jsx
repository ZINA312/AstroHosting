import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './PostPage.module.scss'; 

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
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        setPostDetails({
          id: postId,
          title: "Andromeda Galaxy",
          description: "The Andromeda Galaxy is a barred spiral galaxy and the nearest major galaxy to the Milky Way. Captured over 5 nights with a total exposure time of 12 hours. This image required meticulous planning and execution, battling light pollution and unpredictable weather. The vibrant core and faint outer arms reveal the galaxy's intricate structure, truly a breathtaking sight in the night sky.",
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
            },
            {
              id: "e2f3g4h5-i6j7-k8l9-m0n1-o2p3q4r5s6t7",
              text: "This is truly inspirational! Makes me want to get into astrophotography.",
              commentDate: "2023-05-18T11:00:00Z",
              user: {
                id: "f3g4h5i6-j7k8-l9m0-n1o2-p3q4r5s6t7u8",
                username: "NightSkyDreamer",
                avatarUrl: "https://randomuser.me/api/portraits/women/12.jpg"
              }
            },
            {
                id: "f1g2h3i4-j5k6-l7m8-n9o0-p1q2r3s4t5u6",
                text: "The clarity is exceptional. Did you use any specific filters for light pollution?",
                commentDate: "2023-05-19T16:30:00Z",
                user: {
                  id: "g2h3i4j5-k6l7-m8n9-o0p1-q2r3s4t5u6v7",
                  username: "FilterGuru",
                  avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg"
                }
              }
          ].sort((a, b) => new Date(b.commentDate) - new Date(a.commentDate)), 
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
            },
            {
                id: "f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1",
                username: "StarPhotographer",
                avatarUrl: "https://randomuser.me/api/portraits/men/55.jpg"
              },
              {
                id: "g7h8i9j0-k1l2-m3n4-o5p6-q7r8s9t0u1v2",
                username: "CosmicGazer",
                avatarUrl: "https://randomuser.me/api/portraits/women/66.jpg"
              },
              {
                id: "h8i9j0k1-l2m3-n4o5-p6q7-r8s9t0u1v2w3",
                username: "DeepSpaceFan",
                avatarUrl: "https://randomuser.me/api/portraits/men/77.jpg"
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
                "Pixel Size": "4.63μm",
                "Cooling": "TEC -35°C below ambient"
              }
            },
            {
              id: "g3h4i5j6-k7l8-m9n0-o1p2-q3r4s5t6u7v8",
              name: "Sky-Watcher EQ6-R Pro",
              manufacturer: "Sky-Watcher",
              type: "Mount",
              specifications: {
                "Payload Capacity": "44 lbs",
                "Tracking Accuracy": "0.5 arcsec",
                "Motor Type": "Stepper Motors"
              }
            },
            {
                id: "h4i5j6k7-l8m9-n0o1-p2q3-r4s5t6u7v8w9",
                name: "Baader Planetarium MPCC Mark III",
                manufacturer: "Baader Planetarium",
                type: "Coma Corrector",
                specifications: {
                  "Design": "Multi-Purpose Coma Corrector",
                  "Compatibility": "Newtonian Telescopes"
                }
              }
          ]
        });

        setLoading(false);
      } catch (err) {
        setError('Failed to load post details. Please check your network connection.');
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [postId]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() === '') return;

    const mockComment = {
      id: `mock-${Date.now()}`, 
      text: newComment.trim(),
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

  if (loading) {
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
            src={postDetails.imageUrl}
            alt={postDetails.title}
            className={styles['post-image']}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          />
        </div>

        <div className={styles['post-info']}>
          <div className={styles['post-header']}>
            <Link to={`/user/${postDetails.author.id}`} className={styles['author-info']}>
              <img
                src={postDetails.author.avatarUrl}
                alt={postDetails.author.username}
                className={styles['author-avatar']}
              />
              <div>
                <span className={styles['author-name']}>{postDetails.author.username}</span>
                <span className={styles['post-date']}>{formatDate(postDetails.dateCreated)}</span>
              </div>
            </Link>

            <div className={styles['post-stats']}>
              <div className={styles['stat-item']}>
                <span className={styles['stat-icon']}>❤️</span>
                <span className={styles['stat-value']}>{postDetails.likesCount}</span>
              </div>
              <div className={styles['stat-item']}>
                <span className={styles['stat-icon']}>💬</span>
                <span className={styles['stat-value']}>{postDetails.commentsCount}</span>
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
              Liked By ({postDetails.likedBy.length})
            </button>
            <button
              className={`${styles['tab-item']} ${activeTab === 'comments' ? styles.active : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              Comments ({postDetails.commentsCount})
            </button>
          </div>

          <div className={styles['tab-content']}>
            {activeTab === 'equipment' && (
              <div className={styles['equipment-section']}>
                {postDetails.equipmentUsed.map((equipment, index) => (
                  <motion.div
                    key={equipment.id}
                    className={styles['equipment-card']}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3 className={styles['equipment-name']}>{equipment.name}</h3>
                    <div className={styles['equipment-meta']}>
                      <span className={styles['equipment-type']}>{equipment.type}</span>
                      <span className={styles['equipment-manufacturer']}>{equipment.manufacturer}</span>
                    </div>

                    <div className={styles.specifications}>
                      <h4>Specifications:</h4>
                      <ul>
                        {Object.entries(equipment.specifications).map(([key, value]) => (
                          <li key={key}>
                            <span className={styles['spec-key']}>{key}:</span>
                            <span className={styles['spec-value']}>{value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'likes' && (
              <div className={styles['likes-section']}>
                <div className={styles['likes-grid']}>
                  {postDetails.likedBy.map((user, index) => (
                    <motion.div
                      key={user.id}
                      className={styles['like-item']}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link to={`/user/${user.id}`} className={styles['user-link']}>
                        <img
                          src={user.avatarUrl}
                          alt={user.username}
                          className={styles['user-avatar']}
                        />
                        <span className={styles.username}>{user.username}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className={styles['comments-section']}>
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

                <div className={styles['comments-list']}>
                  {postDetails.comments.map((comment) => (
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
                            src={comment.user.avatarUrl}
                            alt={comment.user.username}
                            className={styles['comment-avatar']}
                          />
                          <span className={styles['comment-username']}>{comment.user.username}</span>
                        </Link>
                        <span className={styles['comment-date']} title={formatDate(comment.commentDate)}>
                          {formatDate(comment.commentDate)}
                        </span>
                      </div>
                      <p className={styles['comment-text']}>{comment.text}</p>
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