import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './UserProfilePage.module.scss'; 
import { userApi } from '../../api/userApi'; 
import { postApi } from '../../api/postApi';
import { subscriptionApi } from '../../api/subscriptionApi'; 
import { IMAGE_BASE_URL } from '../../config/apiConfig'; 
import { useAuth } from '../../context/AuthContext'; 
import PostCard from '../HomePage/components/PostCard/PostCard'; 

const UserProfilePage = () => {
    const { userId: urlUserId } = useParams();
    const userId = urlUserId; 

    const { user: currentUser, isAuthenticated, loading: authLoading } = useAuth();
    const currentUserId = currentUser?.id; 

    const [userProfile, setUserProfile] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('posts');

    const [subscribers, setSubscribers] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [showSubscribers, setShowSubscribers] = useState(false);
    const [showSubscriptions, setShowSubscriptions] = useState(false);
    const [loadingRelations, setLoadingRelations] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false); 

    
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState({
        username: '',
        bio: '',
        
    });
    const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState('');
    const avatarInputRef = useRef(null);

    
    useEffect(() => {
        if (avatarPreviewUrl && !avatarPreviewUrl.startsWith('data:image/') && !avatarPreviewUrl.startsWith(IMAGE_BASE_URL)) {
             
            return () => URL.revokeObjectURL(avatarPreviewUrl);
        }
    }, [avatarPreviewUrl]);

    useEffect(() => {
        const fetchProfileAndPosts = async () => {
            setLoading(true);
            setError('');
            try {
                if (!userId) { 
                    throw new Error('Invalid user ID provided in URL.');
                }

                const profileData = await userApi.getUserProfile(userId);
                setUserProfile(profileData);
                
                setEditedProfile({
                    username: profileData.username,
                    bio: profileData.bio || '', 
                    
                });
                setAvatarPreviewUrl(profileData.avatarUrl ? `${IMAGE_BASE_URL}${profileData.avatarUrl}` : '/default-avatar.jpg');


                const postsData = await postApi.getPostsByAuthor(userId);
                setUserPosts(postsData);

                if (isAuthenticated && currentUserId && currentUserId !== userId) {
                    const { isSubscribed } = await subscriptionApi.isSubscribed(userId); 
                    setIsFollowing(isSubscribed);
                } else {
                    setIsFollowing(false); 
                }

            } catch (err) {
                console.error("Error fetching user profile or posts:", err);
                setError(err.message || 'Failed to load profile data. Please try again.');
                setUserProfile(null); 
                setUserPosts([]); 
                setIsFollowing(false);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && userId) { 
            fetchProfileAndPosts();
        }
    }, [userId, isAuthenticated, currentUserId, authLoading]); 

    const fetchSubscribers = async () => {
        setLoadingRelations(true);
        setError('');
        try {
            const fetchedSubscribers = await subscriptionApi.getFollowersForUser(userId);
            setSubscribers(fetchedSubscribers); 
        } catch (err) {
            console.error("Error fetching subscribers:", err);
            setError(err.message || 'Failed to load subscribers.');
        } finally {
            setLoadingRelations(false);
        }
    };

    const fetchSubscriptions = async () => {
        setLoadingRelations(true);
        setError(''); 
        try {
            const fetchedSubscriptions = await subscriptionApi.getFollowingForUser(userId);
            setSubscriptions(fetchedSubscriptions); 
        } catch (err) {
            console.error("Error fetching subscriptions:", err);
            setError(err.message || 'Failed to load subscriptions.');
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
        setError(''); 
    };

    const handleFollowToggle = async () => {
        if (!isAuthenticated) {
            alert("Please log in to follow users."); 
            return;
        }
        if (currentUserId === userId) {
            alert("You cannot follow yourself."); 
            return;
        }

        try {
            if (isFollowing) {
                await subscriptionApi.deleteSubscription(userId); 
                setIsFollowing(false);
                setUserProfile(prev => ({ 
                    ...prev, 
                    subscribersCount: (prev.subscribersCount || 0) - 1 
                }));
            } else {
                await subscriptionApi.createSubscription(userId);
                setIsFollowing(true);
                setUserProfile(prev => ({ 
                    ...prev, 
                    subscribersCount: (prev.subscribersCount || 0) + 1 
                }));
            }
        } catch (err) {
            console.error("Error toggling follow:", err);
            alert(`Failed to toggle follow status: ${err.message}. Please try again.`); 
        }
    };

    
    const handleEditClick = () => {
        setIsEditing(true);
        
        if (userProfile) {
            setEditedProfile({
                username: userProfile.username,
                bio: userProfile.bio || '',
            });
            
            
            setSelectedAvatarFile(null); 
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file for the avatar.');
                setSelectedAvatarFile(null);
                setAvatarPreviewUrl(userProfile.avatarUrl ? `${IMAGE_BASE_URL}${userProfile.avatarUrl}` : '/default-avatar.jpg');
                return;
            }
            if (file.size > 2 * 1024 * 1024) { 
                setError('Avatar file size too large (max 2MB).');
                setSelectedAvatarFile(null);
                setAvatarPreviewUrl(userProfile.avatarUrl ? `${IMAGE_BASE_URL}${userProfile.avatarUrl}` : '/default-avatar.jpg');
                return;
            }
            setSelectedAvatarFile(file);
            setAvatarPreviewUrl(URL.createObjectURL(file)); 
            setError('');
        } else {
            setSelectedAvatarFile(null);
            setAvatarPreviewUrl(userProfile.avatarUrl ? `${IMAGE_BASE_URL}${userProfile.avatarUrl}` : '/default-avatar.jpg');
        }
    };

    const handleRemoveAvatar = () => {
        setSelectedAvatarFile(null);
        setAvatarPreviewUrl('/default-avatar.jpg'); 
    };

    const handleSaveProfile = async () => {
        setLoading(true); 
        setError('');
        try {
            
            
            if (!isCurrentUserProfile) { 
                throw new Error("You can only edit your own profile.");
            }

            
            if (!editedProfile.username.trim()) {
                setError('Username is required.');
                setLoading(false);
                return; 
            }

            
            const updateData = {
                username: editedProfile.username,
                bio: editedProfile.bio,
                
                
            };

            
            if (selectedAvatarFile) {
                updateData.newAvatarFile = selectedAvatarFile; 
            } else if (avatarPreviewUrl === '/default-avatar.jpg' && userProfile.avatarUrl && userProfile.avatarUrl !== '/default-avatar.jpg') {
                
                updateData.removeAvatar = true; 
            }
            
            
            await userApi.updateUserProfile(updateData);

            
            const updatedProfileData = await userApi.getUserProfile(userId);
            setUserProfile(updatedProfileData);
            setEditedProfile({ 
                username: updatedProfileData.username,
                bio: updatedProfileData.bio || '',
            });
            setAvatarPreviewUrl(updatedProfileData.avatarUrl ? `${IMAGE_BASE_URL}${updatedProfileData.avatarUrl}` : '/default-avatar.jpg');
            
            setSelectedAvatarFile(null); 
            setIsEditing(false); 
            
        } catch (err) {
            console.error("Error saving profile:", err);
            try {
                const errorData = JSON.parse(err.message);
                if (errorData.errors) {
                    const formattedErrors = Object.values(errorData.errors).flat().join('; ');
                    setError(`Validation failed: ${formattedErrors}`);
                } else {
                    setError(errorData.error || err.message || 'Failed to save profile changes. Please try again.');
                }
            } catch {
                setError(err.message || 'Failed to save profile changes. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        
        if (userProfile) {
            setEditedProfile({
                username: userProfile.username,
                bio: userProfile.bio || '',
            });
            setAvatarPreviewUrl(userProfile.avatarUrl ? `${IMAGE_BASE_URL}${userProfile.avatarUrl}` : '/default-avatar.jpg');
        }
        setSelectedAvatarFile(null);
        setError('');
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return "Invalid Date";
            }
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString(undefined, options);
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
            <div className={styles['profile-loading']}>
                <div className={styles.spinner}></div>
                <p>Loading profile...</p> 
            </div>
        );
    }

    if (error && !userProfile) { 
        return (
            <div className={styles['profile-error']}>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className={styles['retry-button']}>Retry</button>
            </div>
        );
    }

    if (!userProfile) {
        return <div className={styles['profile-error']}><p>User profile not found.</p></div>;
    }

    const isCurrentUserProfile = isAuthenticated && currentUserId === userId;

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
                        whileHover={{ scale: isEditing ? 1.0 : 1.05 }} 
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <img
                            src={avatarPreviewUrl} 
                            alt={userProfile.username}
                            className={styles['profile-avatar']}
                            onError={handleAvatarError}
                        />
                        {isEditing && (
                            <div className={styles['avatar-edit-overlay']} onClick={() => avatarInputRef.current.click()}>
                                <span className={styles['edit-icon']}>📷</span>
                                <input
                                    type="file"
                                    ref={avatarInputRef}
                                    onChange={handleAvatarFileChange}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />
                                {avatarPreviewUrl !== '/default-avatar.jpg' && ( 
                                    <button 
                                        type="button" 
                                        onClick={(e) => { e.stopPropagation(); handleRemoveAvatar(); }} 
                                        className={styles['remove-avatar-button']}
                                    >
                                        &times;
                                    </button>
                                )}
                            </div>
                        )}
                    </motion.div>

                    <div className={styles['profile-details']}>
                        {isEditing ? (
                            <input
                                type="text"
                                name="username"
                                value={editedProfile.username}
                                onChange={handleEditChange}
                                className={styles['edit-input']}
                            />
                        ) : (
                            <h1 className={styles['profile-username']}>{userProfile.username}</h1>
                        )}

                        {isEditing ? (
                            <textarea
                                name="bio"
                                value={editedProfile.bio}
                                onChange={handleEditChange}
                                className={`${styles['edit-input']} ${styles['edit-textarea']}`}
                                rows="3"
                            />
                        ) : (
                            <p className={styles['profile-bio']}>{userProfile.bio}</p>
                        )}

                        <div className={styles['profile-stats']}>
                            <div className={styles['stat-item']}>
                                <span className={styles['stat-value']}>{userProfile.postCount || 0}</span>
                                <span className={styles['stat-label']}>Posts</span>
                            </div>
                            <div
                                className={`${styles['stat-item']} ${styles.clickable}`} 
                                onClick={handleSubscribersClick}
                            >
                                <span className={styles['stat-value']}>{userProfile.subscribersCount || 0}</span>
                                <span className={styles['stat-label']}>Subscribers</span>
                            </div>
                            <div
                                className={`${styles['stat-item']} ${styles.clickable}`} 
                                onClick={handleSubscriptionsClick}
                            >
                                <span className={styles['stat-value']}>{userProfile.subscriptionsCount || 0}</span>
                                <span className={styles['stat-label']}>Subscriptions</span>
                            </div>
                        </div>

                        <div className={styles['profile-meta']}>
                            <span className={styles['join-date']}>Joined {formatDate(userProfile.registrationDate)}</span>
                        </div>

                        {isCurrentUserProfile && !isEditing && (
                            <motion.button
                                className={styles['edit-profile-button']}
                                onClick={handleEditClick}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Edit Profile
                            </motion.button>
                        )}

                        {isCurrentUserProfile && isEditing && (
                            <div className={styles['edit-actions']}>
                                <motion.button
                                    className={styles['save-changes-button']}
                                    onClick={handleSaveProfile}
                                    disabled={loading} 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </motion.button>
                                <motion.button
                                    className={styles['cancel-edit-button']}
                                    onClick={handleCancelEdit}
                                    disabled={loading} 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Cancel
                                </motion.button>
                            </div>
                        )}

                        {!isCurrentUserProfile && isAuthenticated && (
                            <motion.button
                                className={`${styles['follow-button']} ${isFollowing ? styles['following'] : ''}`}
                                onClick={handleFollowToggle}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isFollowing ? 'Following' : 'Follow'}
                            </motion.button>
                        )}
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
                                        const userToShow = showSubscribers ? relation.subscriber : relation.targetUser;
                                        return (
                                        <motion.div
                                            key={relation.id}
                                            className={styles['relation-item']}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Link
                                            to={`/user/${userToShow.id}`}
                                            className={styles['user-link']}
                                            onClick={handleCloseModal} 
                                            >
                                            <img
                                                src={userToShow.avatarUrl ? `${IMAGE_BASE_URL}/uploads/${userToShow.avatarUrl}` : '/default-avatar.jpg'} 
                                                alt={userToShow.username}
                                                className={styles['user-avatar']}
                                                onError={handleAvatarError}
                                            />
                                            <div className={styles['user-info']}>
                                                <span className={styles.username}>{userToShow.username}</span>
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

            <div className={styles['profile-content']}>
                {activeTab === 'posts' && (
                    <div className={styles['posts-grid']}>
                        {userPosts.length > 0 ? (
                            userPosts.map((post) => (
                                <PostCard 
                                    key={post.id}
                                    post={post}
                                    isFeatured={false} 
                                    onHoverStart={() => {}} 
                                    onHoverEnd={() => {}} 
                                />
                            ))
                        ) : (
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
                            {isEditing ? (
                                <textarea
                                    name="bio"
                                    value={editedProfile.bio}
                                    onChange={handleEditChange}
                                    className={`${styles['edit-input']} ${styles['edit-textarea']}`}
                                    rows="5"
                                />
                            ) : (
                                <p className={styles['profile-bio']}>{userProfile.bio}</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default UserProfilePage;
