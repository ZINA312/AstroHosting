import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './RecentPostsPage.module.scss';
import { postApi } from '../../api/postApi'; 
import PostsGrid from '../../components/PostGrid/PostGrid'; 

const RecentPostsPage = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentPhotos = async () => {
      try {
        setLoading(true);
        setError(null);

        const allPosts = await postApi.getAllNonDeletedPosts();

        const sortedPosts = [...allPosts].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );

        setRecentPosts(sortedPosts);
      } catch (err) {
        console.error("Error fetching recent posts:", err);
        setError(err.message || 'Failed to load recent photos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPhotos();
  }, []); 

  return (
    <motion.div
      className={styles['recent-photos-page']}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={styles['page-title']}>Most Recent Photos</h2>
      <p className={styles['page-subtitle']}>
        Discover the latest astrophotography from our community, featuring breathtaking views of nebulae, galaxies, and star clusters.
      </p>

      {loading ? (
        <div className={styles['loading-state']}>
          <div className={styles.spinner}></div>
          <p>Loading recent photos...</p>
        </div>
      ) : error ? (
        <div className={styles['error-state']}>
          <p className={styles['error-message']}>{error}</p>
          <button onClick={() => window.location.reload()} className={styles['retry-button']}>Retry</button>
        </div>
      ) : recentPosts.length > 0 ? (
        <PostsGrid posts={recentPosts} />
      ) : (
        <div className={styles['no-posts-found']}>
          <p>No recent photos found. Be the first to share one!</p>
        </div>
      )}
    </motion.div>
  );
};

export default RecentPostsPage;
