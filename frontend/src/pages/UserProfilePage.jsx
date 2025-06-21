import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../assets/UserProfilePage.css';

const UserProfilePage = () => {
  const { userId } = 1;
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
      try {
        // add fetching 
        setUserProfile({
          id: userId,
          username: "CosmicExplorer",
          avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
          bio: "Astrophotography enthusiast with a passion for deep space objects. Specializing in nebula and galaxy photography. Equipment: Celestron 8SE, ZWO ASI294MC Pro.",
          registrationDate: "2022-03-15T08:30:00Z",
          postCount: 42,
          subscribersCount: 1284,
          subscriptionsCount: 56
        });
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load user profile');
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [userId]);

const fetchSubscribers = async () => {
    // add fetching 
    setLoadingRelations(true);
    try {
      const mockSubscribers = [
        {
          id: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
          subscriber: {
            id: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
            username: "GalaxyHunter",
            avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg"
          },
          targetUser: {
            id: userId,
            username: "CosmicExplorer"
          },
          subscriptionDate: "2023-01-15T10:30:00Z"
        },
      ];
      setSubscribers(mockSubscribers);
    } catch (err) {
      setError('Failed to load subscribers');
    } finally {
      setLoadingRelations(false);
    }
  };
  const fetchSubscriptions = async () => {
    // add fetching 
    setLoadingRelations(true);
    try {
      const mockSubscriptions = [
        {
          id: "2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
          subscriber: {
            id: userId,
            username: "CosmicExplorer"
          },
          targetUser: {
            id: "b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7",
            username: "NebulaMaster",
            avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg"
          },
          subscriptionDate: "2023-03-22T14:45:00Z"
        },
      ];
      setSubscriptions(mockSubscriptions);
    } catch (err) {
      setError('Failed to load subscriptions');
    } finally {
      setLoadingRelations(false);
    }
  };

  const handleSubscribersClick = () => {
    setShowSubscribers(true);
    fetchSubscribers();
  };

  const handleSubscriptionsClick = () => {
    setShowSubscriptions(true);
    fetchSubscriptions();
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="profile-error">{error}</div>;
  }

  return (
    <motion.div 
      className="user-profile"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile-header">
        <div className="profile-background"></div>
        
        <div className="profile-info">
          <motion.div 
            className="avatar-container"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <img 
              src={userProfile.avatarUrl} 
              alt={userProfile.username} 
              className="profile-avatar"
            />
          </motion.div>
          
          <div className="profile-details">
            <h1 className="profile-username">{userProfile.username}</h1>
            <p className="profile-bio">{userProfile.bio}</p>
            
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{userProfile.postCount}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div 
                className="stat-item clickable"
                onClick={handleSubscribersClick}
              >
                <span className="stat-value">{userProfile.subscribersCount}</span>
                <span className="stat-label">Subscribers</span>
              </div>
              <div 
                className="stat-item clickable"
                onClick={handleSubscriptionsClick}
              >
                <span className="stat-value">{userProfile.subscriptionsCount}</span>
                <span className="stat-label">Subscriptions</span>
              </div>
            </div>
            
            <div className="profile-meta">
              <span className="join-date">Joined {formatDate(userProfile.registrationDate)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {(showSubscribers || showSubscriptions) && (
        <motion.div 
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => {
            setShowSubscribers(false);
            setShowSubscriptions(false);
          }}
        >
          <motion.div 
            className="relations-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={e => e.stopPropagation()}
          >
            <button 
              className="close-modal"
              onClick={() => {
                setShowSubscribers(false);
                setShowSubscriptions(false);
              }}
            >
              &times;
            </button>
            
            <h2 className="modal-title">
              {showSubscribers ? 'Subscribers' : 'Subscriptions'}
            </h2>
            
            {loadingRelations ? (
              <div className="modal-loading">
                <div className="spinner"></div>
              </div>
            ) : (
              <div className="relations-list">
                {(showSubscribers ? subscribers : subscriptions).map((relation, index) => {
                  const user = showSubscribers ? relation.subscriber : relation.targetUser;
                  return (
                    <motion.div 
                      key={relation.id}
                      className="relation-item"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link 
                        to={`/user/${user.id}`} 
                        className="user-link"
                        onClick={() => {
                          setShowSubscribers(false);
                          setShowSubscriptions(false);
                        }}
                      >
                        <img 
                          src={user.avatarUrl} 
                          alt={user.username} 
                          className="user-avatar"
                        />
                        <div className="user-info">
                          <span className="username">{user.username}</span>
                          <span className="subscription-date">
                            Since {formatDate(relation.subscriptionDate)}
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      <div className="profile-navigation">
        <button 
          className={`nav-item ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
        <button 
          className={`nav-item ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
      </div>
      
      <div className="profile-content">
        {activeTab === 'posts' && (
          <div className="posts-grid">
            {[...Array(9)].map((_, index) => (
              <motion.div 
                key={index}
                className="post-card"
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div 
                  className="post-image"
                  style={{ 
                    backgroundImage: `url(https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80)`
                  }}
                >
                  <div className="post-overlay">
                    <span className="post-likes">❤️ {Math.floor(Math.random() * 100)}</span>
                    <span className="post-comments">💬 {Math.floor(Math.random() * 20)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {activeTab === 'about' && (
          <motion.div
            className="about-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="about-card">
              <h3 className="about-title">Bio</h3>
              <p className="about-text">{userProfile.bio}</p>
            </div>
            
            <div className="about-card">
              <h3 className="about-title">Equipment</h3>
              <ul className="equipment-list">
                <li>Celestron NexStar 8SE Telescope</li>
                <li>ZWO ASI294MC Pro Camera</li>
                <li>Sky-Watcher EQ6-R Pro Mount</li>
                <li>Optolong L-Pro Filter</li>
              </ul>
            </div>
          </motion.div>
        )}
        
      </div>
    </motion.div>
  );
};

export default UserProfilePage;