import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './SearchResultsPage.module.scss';
import { searchApi } from '../../api/searchApi';
import { IMAGE_BASE_URL } from '../../config/apiConfig'; 
import PostCard from '../HomePage/components/PostCard/PostCard'; 

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

const SearchResultsPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get('query') || '';

    const [results, setResults] = useState({ users: [], posts: [], equipment: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('posts'); 

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!searchTerm) {
                setLoading(false);
                setResults({ users: [], posts: [], equipment: [] });
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const data = await searchApi.globalSearch(searchTerm);
                setResults(data);
                if (data.posts.length > 0) {
                    setActiveTab('posts');
                } else if (data.users.length > 0) {
                    setActiveTab('users');
                } else if (data.equipment.length > 0) {
                    setActiveTab('equipment');
                } else {
                    setActiveTab('posts'); 
                }
            } catch (err) {
                console.error("Error fetching search results:", err);
                setError(err.message || "Failed to load search results. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [searchTerm]); 

    const handleAvatarError = (e) => {
        e.target.onerror = null;
        e.target.src = '/default-avatar.jpg'; 
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className={styles['loading-state']}>
                    <div className={styles.spinner}></div>
                    <p>Searching for "{searchTerm}"...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className={styles['error-state']}>
                    <p className={styles['error-message']}>{error}</p>
                    <button onClick={() => window.location.reload()} className={styles['retry-button']}>Retry</button>
                </div>
            );
        }

        if (searchTerm && results.users.length === 0 && results.posts.length === 0 && results.equipment.length === 0) {
            return (
                <div className={styles['no-results']}>
                    <p>No results found for "{searchTerm}".</p>
                </div>
            );
        }
        
        
        if (!searchTerm) {
            return (
                <div className={styles['no-search-term']}>
                    <p>Enter a search term in the navigation bar to find users, posts, or equipment.</p>
                </div>
            );
        }


        switch (activeTab) {
            case 'posts':
                return (
                    <div className={styles['posts-grid']}>
                        {results.posts.length > 0 ? (
                            results.posts.map(post => (
                                <PostCard key={post.id} post={post} isFeatured={false} onHoverStart={() => {}} onHoverEnd={() => {}} />
                            ))
                        ) : (
                            <p className={styles['no-results-tab']}>No posts found.</p>
                        )}
                    </div>
                );
            case 'users':
                return (
                    <div className={styles['users-grid']}>
                        {results.users.length > 0 ? (
                            results.users.map(user => (
                                <motion.div 
                                    key={user.id} 
                                    className={styles['user-card']}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Link to={`/user/${user.id}`} className={styles['user-link']}>
                                        <img 
                                            src={user.avatarUrl ? `${IMAGE_BASE_URL}${user.avatarUrl}` : '/default-avatar.jpg'} 
                                            alt={user.username} 
                                            className={styles['user-avatar']}
                                            onError={handleAvatarError}
                                        />
                                        <span className={styles['user-username']}>{user.username}</span>
                                    </Link>
                                </motion.div>
                            ))
                        ) : (
                            <p className={styles['no-results-tab']}>No users found.</p>
                        )}
                    </div>
                );
            case 'equipment':
                return (
                    <div className={styles['equipment-list']}>
                        {results.equipment.length > 0 ? (
                            results.equipment.map(item => (
                                <motion.div 
                                    key={item.id} 
                                    className={styles['equipment-item']}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Link to={`/equipment/${item.id}`} className={styles['equipment-link']}>
                                        <h3 className={styles['equipment-name']}>{item.name}</h3>
                                        {item.type !== undefined && (
                                            <span className={styles['equipment-type']}>{equipmentTypeMap[item.type] || 'Unknown Type'}</span>
                                        )}
                                        {item.manufacturer && <span className={styles['equipment-manufacturer']}>{item.manufacturer}</span>}
                                    </Link>
                                </motion.div>
                            ))
                        ) : (
                            <p className={styles['no-results-tab']}>No equipment found.</p>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <motion.div
            className={styles['search-results-page']}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className={styles['page-title']}>Search Results for "{searchTerm}"</h1>

            <div className={styles['tabs-container']}>
                <button
                    className={`${styles['tab-button']} ${activeTab === 'posts' ? styles.active : ''}`}
                    onClick={() => setActiveTab('posts')}
                    disabled={loading || results.posts.length === 0}
                >
                    Posts ({results.posts.length})
                </button>
                <button
                    className={`${styles['tab-button']} ${activeTab === 'users' ? styles.active : ''}`}
                    onClick={() => setActiveTab('users')}
                    disabled={loading || results.users.length === 0}
                >
                    Users ({results.users.length})
                </button>
                <button
                    className={`${styles['tab-button']} ${activeTab === 'equipment' ? styles.active : ''}`}
                    onClick={() => setActiveTab('equipment')}
                    disabled={loading || results.equipment.length === 0}
                >
                    Equipment ({results.equipment.length})
                </button>
            </div>

            <div className={styles['tab-content']}>
                {renderContent()}
            </div>
        </motion.div>
    );
};

export default SearchResultsPage;
