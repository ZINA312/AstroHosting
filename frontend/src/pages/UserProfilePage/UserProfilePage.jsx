import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'; 
import { motion } from 'framer-motion';
import styles from './UserProfilePage.module.scss'; 

const UserProfilePage = () => {
  const { userId: urlUserId } = useParams();
  const userId = urlUserId || "some-default-user-id"; 

  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('posts');

  const [subscribers, setSubscribers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [showSubscribers, setShowSubscribers] = useState(false);
  const [showSubscriptions, setShowSubscriptions] = useState(false);
  const [loadingRelations, setLoadingRelations] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError('');
      try {
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockUserProfile = {
          id: userId,
          username: "CosmicExplorer",
          avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
          bio: "Astrophotography enthusiast with a passion for deep space objects. Specializing in nebula and galaxy photography. Equipment: Celestron 8SE, ZWO ASI294MC Pro, Sky-Watcher EQ6-R Pro Mount, Optolong L-Pro Filter, Baader Planetarium filters.",
          registrationDate: "2022-03-15T08:30:00Z",
          postCount: 42,
          subscribersCount: 1284,
          subscriptionsCount: 56
        };

        setUserProfile(mockUserProfile);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError('Failed to load user profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]); 

  const fetchSubscribers = async () => {
    setLoadingRelations(true);
    setError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 400)); 
      const mockSubscribers = [
        {
          id: "sub-1a2b3c4d",
          subscriber: {
            id: "user-a1b2",
            username: "GalaxyHunter",
            avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg"
          },
          targetUser: {
            id: userId,
            username: userProfile?.username
          },
          subscriptionDate: "2023-01-15T10:30:00Z"
        },
        {
          id: "sub-e5f6g7h8",
          subscriber: {
            id: "user-c3d4",
            username: "StarDustMapper",
            avatarUrl: "https://randomuser.me/api/portraits/women/25.jpg"
          },
          targetUser: {
            id: userId,
            username: userProfile?.username
          },
          subscriptionDate: "2023-02-20T11:00:00Z"
        },
        {
            id: "sub-i9j0k1l2",
            subscriber: {
              id: "user-e5f6",
              username: "NebulaWatcher",
              avatarUrl: "https://randomuser.me/api/portraits/men/28.jpg"
            },
            targetUser: {
              id: userId,
              username: userProfile?.username
            },
            subscriptionDate: "2023-04-01T09:00:00Z"
          },
          {
            id: "sub-m3n4o5p6",
            subscriber: {
              id: "user-g7h8",
              username: "AstroLens",
              avatarUrl: "https://randomuser.me/api/portraits/women/30.jpg"
            },
            targetUser: {
              id: userId,
              username: userProfile?.username
            },
            subscriptionDate: "2023-06-10T15:00:00Z"
          },
          {
            id: "sub-q7r8s9t0",
            subscriber: {
              id: "user-i9j0",
              username: "DeepSkyPhotog",
              avatarUrl: "https://randomuser.me/api/portraits/men/33.jpg"
            },
            targetUser: {
              id: userId,
              username: userProfile?.username
            },
            subscriptionDate: "2023-08-05T18:30:00Z"
          },
      ].filter(sub => sub.targetUser.id === userId); 
      setSubscribers(mockSubscribers);
    } catch (err) {
      console.error("Error fetching subscribers:", err);
      setError('Failed to load subscribers.');
    } finally {
      setLoadingRelations(false);
    }
  };

  const fetchSubscriptions = async () => {
    setLoadingRelations(true);
    setError(''); 
    try {
      await new Promise(resolve => setTimeout(resolve, 400)); 
      const mockSubscriptions = [
        {
          id: "sub-2b3c4d5e",
          subscriber: {
            id: userId,
            username: userProfile?.username
          },
          targetUser: {
            id: "user-b2c3",
            username: "NebulaMaster",
            avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg"
          },
          subscriptionDate: "2023-03-22T14:45:00Z"
        },
        {
          id: "sub-f6g7h8i9",
          subscriber: {
            id: userId,
            username: userProfile?.username
          },
          targetUser: {
            id: "user-d4e5",
            username: "PlanetFinder",
            avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg"
          },
          subscriptionDate: "2023-05-10T09:00:00Z"
        },
        {
            id: "sub-j0k1l2m3",
            subscriber: {
              id: userId,
              username: userProfile?.username
            },
            targetUser: {
              id: "user-f6g7",
              username: "CometChaser",
              avatarUrl: "https://randomuser.me/api/portraits/women/48.jpg"
            },
            subscriptionDate: "2023-07-01T16:00:00Z"
          },
          {
            id: "sub-n4o5p6q7",
            subscriber: {
              id: userId,
              username: userProfile?.username
            },
            targetUser: {
              id: "user-h8i9",
              username: "AstroDreamer",
              avatarUrl: "https://randomuser.me/api/portraits/men/52.jpg"
            },
            subscriptionDate: "2023-09-12T11:00:00Z"
          },
      ].filter(sub => sub.subscriber.id === userId); 
      setSubscriptions(mockSubscriptions);
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
      setError('Failed to load subscriptions.');
    } finally {
      setLoadingRelations(false);
    }
  };

  const handleSubscribersClick = () => {
    setShowSubscribers(true);
    setShowSubscriptions(false); 
    fetchSubscribers();
  };

  const handleSubscriptionsClick = () => {
    setShowSubscriptions(true);
    setShowSubscribers(false); 
    fetchSubscriptions();
  };

  const handleCloseModal = () => {
    setShowSubscribers(false);
    setShowSubscriptions(false);

  };

  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <div className={styles['profile-loading']}>
        <div className={styles.spinner}></div>
        <p>Loading profile...</p> 
      </div>
    );
  }

  if (error && !userProfile) { 
    return <div className={styles['profile-error']}>{error}</div>;
  }

  return (
    <motion.div
      className={styles['user-profile']}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles['profile-header']}>
        <div className={styles['profile-background']}></div>

        <div className={styles['profile-info']}>
          <motion.div
            className={styles['avatar-container']}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.username}
              className={styles['profile-avatar']}
            />
          </motion.div>

          <div className={styles['profile-details']}>
            <h1 className={styles['profile-username']}>{userProfile.username}</h1>
            <p className={styles['profile-bio']}>{userProfile.bio}</p>

            <div className={styles['profile-stats']}>
              <div className={styles['stat-item']}>
                <span className={styles['stat-value']}>{userProfile.postCount}</span>
                <span className={styles['stat-label']}>Posts</span>
              </div>
              <div
                className={styles['stat-item'] + ' ' + styles.clickable} 
                onClick={handleSubscribersClick}
              >
                <span className={styles['stat-value']}>{userProfile.subscribersCount}</span>
                <span className={styles['stat-label']}>Subscribers</span>
              </div>
              <div
                className={styles['stat-item'] + ' ' + styles.clickable} 
                onClick={handleSubscriptionsClick}
              >
                <span className={styles['stat-value']}>{userProfile.subscriptionsCount}</span>
                <span className={styles['stat-label']}>Subscriptions</span>
              </div>
            </div>

            <div className={styles['profile-meta']}>
              <span className={styles['join-date']}>Joined {formatDate(userProfile.registrationDate)}</span>
            </div>
          </div>
        </div>
      </div>

      {(showSubscribers || showSubscriptions) && (
        <motion.div
          className={styles['modal-backdrop']}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleCloseModal}
        >
          <motion.div
            className={styles['relations-modal']}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={e => e.stopPropagation()} 
          >
            <button
              className={styles['close-modal']}
              onClick={handleCloseModal}
            >
              &times;
            </button>

            <h2 className={styles['modal-title']}>
              {showSubscribers ? 'Subscribers' : 'Subscriptions'}
            </h2>

            {loadingRelations ? (
              <div className={styles['modal-loading']}>
                <div className={styles.spinner}></div>
                <p>Loading {showSubscribers ? 'subscribers' : 'subscriptions'}...</p>
              </div>
            ) : error ? ( 
                <div className={styles['profile-error']}>{error}</div>
            ) : (
              <div className={styles['relations-list']}>
                {(showSubscribers ? subscribers : subscriptions).length > 0 ? (
                    (showSubscribers ? subscribers : subscriptions).map((relation, index) => {
                        const user = showSubscribers ? relation.subscriber : relation.targetUser;
                        return (
                        <motion.div
                            key={relation.id}
                            className={styles['relation-item']}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link
                            to={`/user/${user.id}`}
                            className={styles['user-link']}
                            onClick={handleCloseModal} 
                            >
                            <img
                                src={user.avatarUrl}
                                alt={user.username}
                                className={styles['user-avatar']}
                            />
                            <div className={styles['user-info']}>
                                <span className={styles.username}>{user.username}</span>
                                <span className={styles['subscription-date']}>
                                Since {formatDate(relation.subscriptionDate)}
                                </span>
                            </div>
                            </Link>
                        </motion.div>
                        );
                    })
                ) : (
                    <p className={styles['no-relations']}>
                        {showSubscribers ? "No subscribers yet." : "No subscriptions yet."}
                    </p>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      <div className={styles['profile-navigation']}>
        <button
          className={`${styles['nav-item']} ${activeTab === 'posts' ? styles.active : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
        <button
          className={`${styles['nav-item']} ${activeTab === 'about' ? styles.active : ''}`}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
      </div>

      {/* Profile Content */}
      <div className={styles['profile-content']}>
        {activeTab === 'posts' && (
          <div className={styles['posts-grid']}>
            {[...Array(userProfile.postCount)].map((_, index) => (
              <motion.div
                key={index} 
                className={styles['post-card']}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={styles['post-image']}
                  style={{
                    backgroundImage: `url(https://source.unsplash.com/random/400x300?space,stars&${index})` 
                  }}
                >
                  <div className={styles['post-overlay']}>
                    <span className={styles['post-likes']}>❤️ {Math.floor(Math.random() * 500) + 50}</span> 
                    <span className={styles['post-comments']}>💬 {Math.floor(Math.random() * 50) + 5}</span> 
                  </div>
                </div>
              </motion.div>
            ))}
            {userProfile.postCount === 0 && (
                <div className={styles['no-posts-found']}>
                    <p>No posts found for this user yet.</p>
                </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <motion.div
            className={styles['about-section']}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles['about-card']}>
              <h3 className={styles['about-title']}>Bio</h3>
              <p className={styles['about-text']}>{userProfile.bio}</p>
            </div>

            <div className={styles['about-card']}>
              <h3 className={styles['about-title']}>Equipment</h3>
              <ul className={styles['equipment-list']}>
                {userProfile.bio.includes("Celestron 8SE") && <li>Celestron NexStar 8SE Telescope</li>}
                {userProfile.bio.includes("ZWO ASI294MC Pro") && <li>ZWO ASI294MC Pro Camera</li>}
                {userProfile.bio.includes("Sky-Watcher EQ6-R Pro") && <li>Sky-Watcher EQ6-R Pro Mount</li>}
                {userProfile.bio.includes("Optolong L-Pro Filter") && <li>Optolong L-Pro Filter</li>}
                {userProfile.bio.includes("Baader Planetarium") && <li>Baader Planetarium Filters</li>}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default UserProfilePage;