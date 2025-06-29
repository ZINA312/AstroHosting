import { useState, useEffect } from 'react';
import FeaturedSlider from './components/FeaturedSlider/FeaturedSlider';
import PostGrid from '../../components/PostGrid/PostGrid';
import styles from './HomePage.module.scss';
import { postApi } from '../../api/postApi'; 

const HomePage = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null); 

        const allPosts = await postApi.getPopularPosts();

        const sortedPosts = [...allPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const fetchedFeaturedPosts = sortedPosts.slice(0, 3);
        const fetchedPopularPosts = sortedPosts.slice(3);

        setFeaturedPosts(fetchedFeaturedPosts);
        setPopularPosts(fetchedPopularPosts);

      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError(err.message || "Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className={styles['home-page']}>
        <p>Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles['home-page']}>
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles['home-page']}>
      <section className={styles['featured-section']}>
        <h2 className={styles['section-title']}>Featured Astrophotos</h2>
        {featuredPosts.length > 0 ? (
          <FeaturedSlider posts={featuredPosts} />
        ) : (
          <p>No featured posts available.</p>
        )}
      </section>

      <section className={styles['popular-section']}>
        <h2 className={styles['section-title']}>Popular Photos</h2>
        {popularPosts.length > 0 ? (
          <PostGrid posts={popularPosts} />
        ) : (
          <p>No popular posts available.</p>
        )}
      </section>
    </div>
  );
};

export default HomePage;
