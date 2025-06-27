import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './RecentPostsPage.module.scss';

const RecentPostsPage = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredPost, setHoveredPost] = useState(null);

  useEffect(() => {
    const fetchRecentPhotos = async () => {
      try {
        setLoading(true);
        setError(null);

        await new Promise(resolve => setTimeout(resolve, 800));

        const mockRecentPosts = [
          {
            id: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
            title: "Veil Nebula Complex",
            description: "A stunning supernova remnant in the constellation Cygnus. This wide-field view captures the intricate filaments and glowing gases resulting from a stellar explosion thousands of years ago.",
            imageUrl: "https://images.unsplash.com/photo-1629853381666-419b4b0e5b98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
            author: {
              id: "x1y2z3a4-b5c6-d7e8-f9g0-h1i2j3k4l5m6",
              username: "NebulaChaser",
              avatarUrl: "https://randomuser.me/api/portraits/women/10.jpg"
            },
            dateCreated: "2024-06-25T10:00:00Z", 
            likesCount: 210,
            commentsCount: 35
          },
          {
            id: "b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7",
            title: "Pleiades Star Cluster",
            description: "The Seven Sisters, an open star cluster in the constellation Taurus, known for its striking blue reflection nebulae.",
            imageUrl: "https://images.unsplash.com/photo-1517976192131-b7654316d3f0?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            author: {
              id: "y2z3a4b5-c6d7-e8f9-g0h1-i2j3k4l5m6n7",
              username: "StarGazerPro",
              avatarUrl: "https://randomuser.me/api/portraits/men/15.jpg"
            },
            dateCreated: "2024-06-24T18:30:00Z",
            likesCount: 180,
            commentsCount: 22
          },
          {
            id: "c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8",
            title: "Lagoon Nebula",
            description: "A giant interstellar cloud in the constellation Sagittarius, a stellar nursery where new stars are forming.",
            imageUrl: "https://images.unsplash.com/photo-1507499738096-ed7d2d31295b?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            author: {
              id: "z3a4b5c6-d7e8-f9g0-h1i2-j3k4l5m6n7o8",
              username: "DeepSkyHunter",
              avatarUrl: "https://randomuser.me/api/portraits/women/20.jpg"
            },
            dateCreated: "2024-06-23T09:15:00Z",
            likesCount: 150,
            commentsCount: 18
          },
          {
            id: "d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9",
            title: "Triangulum Galaxy",
            description: "M33, a magnificent face-on spiral galaxy near the Andromeda Galaxy, offering a wealth of star-forming regions.",
            imageUrl: "https://images.unsplash.com/photo-1534067746401-447544cc350d?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            author: {
              id: "a4b5c6d7-e8f9-g0h1-i2j3-k4l5m6n7o8p9",
              username: "GalaxyVoyager",
              avatarUrl: "https://randomuser.me/api/portraits/men/25.jpg"
            },
            dateCreated: "2024-06-22T11:00:00Z",
            likesCount: 190,
            commentsCount: 28
          },
          {
            id: "e5f6g7h8-i9j0-1k2l-3m4n-5o6p7q8r9s0t",
            title: "Eagle Nebula Pillars",
            description: "The iconic 'Pillars of Creation' in the Eagle Nebula, towering structures of interstellar gas and dust where new stars are born.",
            imageUrl: "https://images.unsplash.com/photo-1629853381666-419b4b0e5b98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80", // Using the same image as Veil Nebula for diversity purposes later
            author: {
              id: "b5c6d7e8-f9g0-h1i2-j3k4-l5m6n7o8p9q0",
              username: "CosmicSculptor",
              avatarUrl: "https://randomuser.me/api/portraits/women/30.jpg"
            },
            dateCreated: "2024-06-21T14:45:00Z",
            likesCount: 250,
            commentsCount: 40
          },
          {
            id: "f6g7h8i9-j0k1-2l3m-4n5o-6p7q8r9s0t1u",
            title: "Rosette Nebula",
            description: "A large, spherical H II region located in the constellation Monoceros, resembling a cosmic rose.",
            imageUrl: "https://images.unsplash.com/photo-1579624584285-b1a9f14b6c93?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            author: {
              id: "c6d7e8f9-g0h1-i2j3-k4l5-m6n7o8p9q0r1",
              username: "FlowerOfSpace",
              avatarUrl: "https://randomuser.me/api/portraits/men/35.jpg"
            },
            dateCreated: "2024-06-20T20:00:00Z", 
            likesCount: 170,
            commentsCount: 20
          },
          {
            id: "g7h8i9j0-1k2l-3m4n-5o6p-7q8r9s0t1u2v",
            title: "Crab Nebula",
            description: "A supernova remnant in the constellation Taurus, the result of a powerful stellar explosion observed nearly a millennium ago.",
            imageUrl: "https://images.unsplash.com/photo-1549429188-72b2170366b9?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            author: {
              id: "d7e8f9g0-h1i2-j3k4-l5m6-n7o8p9q0r1s2",
              username: "CosmicClaw",
              avatarUrl: "https://randomuser.me/api/portraits/women/40.jpg"
            },
            dateCreated: "2024-06-19T05:30:00Z", 
            likesCount: 160,
            commentsCount: 25
          },
          {
            id: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
            title: "Andromeda Galaxy",
            description: "The Andromeda Galaxy is a barred spiral galaxy and the nearest major galaxy to the Milky Way, destined for a future collision with our own.",
            imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
            author: {
              id: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
              username: "SpaceExplorer42",
              avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg"
            },
            dateCreated: "2024-06-18T08:30:00Z", 
            likesCount: 142,
            commentsCount: 28
          },
          {
            id: "2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
            title: "Orion Nebula",
            description: "The Orion Nebula is a diffuse nebula situated in the Milky Way, south of Orion's Belt, one of the brightest nebulae visible to the naked eye.",
            imageUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
            author: {
              id: "b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7",
              username: "CosmicPhotographer",
              avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg"
            },
            dateCreated: "2024-06-17T14:45:00Z", 
            likesCount: 98,
            commentsCount: 17
          },
          {
            id: "3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r",
            title: "Milky Way Core",
            description: "The galactic core of the Milky Way as seen from a dark sky reserve, revealing billions of stars and cosmic dust lanes.",
            imageUrl: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
            author: {
              id: "c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8",
              username: "AstroAdventurer",
              avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg"
            },
            dateCreated: "2024-06-16T22:15:00Z", 
            likesCount: 87,
            commentsCount: 14
          },
          {
            id: "h8i9j0k1-l2m3-n4o5-p6q7-r8s9t0u1v2w3",
            title: "Horsehead Nebula",
            description: "A small dark nebula in the constellation Orion, part of the much larger Orion Molecular Cloud Complex.",
            imageUrl: "https://images.unsplash.com/photo-1620245642691-8d2a6a1f0a2e?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            author: {
              id: "e8f9g0h1-i2j3-k4l5-m6n7-o8p9q0r1s2t3",
              username: "OrionVoyager",
              avatarUrl: "https://randomuser.me/api/portraits/men/50.jpg"
            },
            dateCreated: "2024-06-15T12:00:00Z",
            likesCount: 130,
            commentsCount: 19
          },
          {
            id: "i9j0k1l2-m3n4-o5p6-q7r8-s9t0u1v2w3x4",
            title: "Ring Nebula",
            description: "A planetary nebula in the constellation Lyra, a beautiful example of a dying star's expelled gas shell.",
            imageUrl: "https://images.unsplash.com/photo-1629853381666-419b4b0e5b98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80", // Reusing for now, ideally different images
            author: {
              id: "f9g0h1i2-j3k4-l5m6-n7o8-p9q0r1s2t3u4",
              username: "CosmicJeweler",
              avatarUrl: "https://randomuser.me/api/portraits/women/55.jpg"
            },
            dateCreated: "2024-06-14T09:00:00Z",
            likesCount: 110,
            commentsCount: 15
          }
        ];

        const sortedPosts = mockRecentPosts.sort((a, b) =>
          new Date(b.dateCreated) - new Date(a.dateCreated)
        );

        setRecentPosts(sortedPosts);
      } catch (err) {
        setError('Failed to load recent photos. Please try again later.');
        console.error("Error fetching recent posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPhotos();
  }, []);

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

  return (
    <motion.div
      className={styles['recent-photos-page']}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={styles['page-title']}>Most Recent Photos</h2>
      <p className={styles['page-subtitle']}>Discover the latest astrophotography from our community, featuring breathtaking views of nebulae, galaxies, and star clusters.</p>

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
        <div className={styles['photos-grid']}>
          {recentPosts.map(post => (
            <motion.div
              key={post.id}
              className={styles['photo-card']}
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => setHoveredPost(post.id)}
              onHoverEnd={() => setHoveredPost(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className={styles['photo-image']}
                style={{ backgroundImage: `url(${post.imageUrl})` }}
              >
                {hoveredPost === post.id && (
                  <motion.div
                    className={styles['photo-overlay']}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles['overlay-content']}>
                      <h3>{post.title}</h3>
                      <p className={styles.description}>{post.description}</p>
                      <div className={styles['post-meta']}>
                        <div className={styles['author-info']}>
                          <img
                            src={post.author.avatarUrl}
                            alt={post.author.username}
                            className={styles['author-avatar']}
                          />
                          <span>{post.author.username}</span>
                        </div>
                        <div className={styles.stats}>
                          <span className={styles.likes}>❤️ {post.likesCount}</span>
                          <span className={styles.comments}>💬 {post.commentsCount}</span>
                        </div>
                        <div className={styles.date}>📅 {formatDate(post.dateCreated)}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className={styles['no-posts-found']}>
          <p>No recent photos found. Be the first to share one!</p>
        </div>
      )}
    </motion.div>
  );
};

export default RecentPostsPage;