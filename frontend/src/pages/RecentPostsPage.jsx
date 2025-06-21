import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../assets/RecentPostsPageStyle.css';

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
            description: "A stunning supernova remnant in the constellation Cygnus.",
            imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
            author: {
              id: "x1y2z3a4-b5c6-d7e8-f9g0-h1i2j3k4l5m6",
              username: "NebulaChaser",
              avatarUrl: "https://randomuser.me/api/portraits/women/10.jpg"
            },
            dateCreated: "2024-06-22T10:00:00Z",
            likesCount: 210,
            commentsCount: 35
          },
          {
            id: "b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7",
            title: "Pleiades Star Cluster",
            description: "The Seven Sisters, an open star cluster in the constellation Taurus.",
            imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
            author: {
              id: "y2z3a4b5-c6d7-e8f9-g0h1-i2j3k4l5m6n7",
              username: "StarGazerPro",
              avatarUrl: "https://randomuser.me/api/portraits/men/15.jpg"
            },
            dateCreated: "2024-06-20T18:30:00Z",
            likesCount: 180,
            commentsCount: 22
          },
          {
            id: "c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8",
            title: "Lagoon Nebula",
            description: "A giant interstellar cloud in the constellation Sagittarius.",
            imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
            author: {
              id: "z3a4b5c6-d7e8-f9g0-h1i2-j3k4l5m6n7o8",
              username: "DeepSkyHunter",
              avatarUrl: "https://randomuser.me/api/portraits/women/20.jpg"
            },
            dateCreated: "2024-06-18T09:15:00Z",
            likesCount: 150,
            commentsCount: 18
          },
          {
            id: "d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9",
            title: "Triangulum Galaxy",
            description: "M33, a spiral galaxy near the Andromeda Galaxy.",
            imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
            author: {
              id: "a4b5c6d7-e8f9-g0h1-i2j3-k4l5m6n7o8p9",
              username: "GalaxyVoyager",
              avatarUrl: "https://randomuser.me/api/portraits/men/25.jpg"
            },
            dateCreated: "2024-06-15T11:00:00Z",
            likesCount: 190,
            commentsCount: 28
          },
          {
            id: "e5f6g7h8-i9j0-1k2l-3m4n-5o6p7q8r9s0t",
            title: "Eagle Nebula Pillars",
            description: "The iconic 'Pillars of Creation' in the Eagle Nebula.",
            imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
            author: {
              id: "b5c6d7e8-f9g0-h1i2-j3k4-l5m6n7o8p9q0",
              username: "CosmicSculptor",
              avatarUrl: "https://randomuser.me/api/portraits/women/30.jpg"
            },
            dateCreated: "2024-06-12T14:45:00Z",
            likesCount: 250,
            commentsCount: 40
          },
          {
            id: "f6g7h8i9-j0k1-2l3m-4n5o-6p7q8r9s0t1u",
            title: "Rosette Nebula",
            description: "A large, spherical H II region located in the constellation Monoceros.",
            imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
            author: {
              id: "c6d7e8f9-g0h1-i2j3-k4l5-m6n7o8p9q0r1",
              username: "FlowerOfSpace",
              avatarUrl: "https://randomuser.me/api/portraits/men/35.jpg"
            },
            dateCreated: "2024-06-10T20:00:00Z",
            likesCount: 170,
            commentsCount: 20
          },
          {
            id: "g7h8i9j0-1k2l-3m4n-5o6p-7q8r9s0t1u2v",
            title: "Crab Nebula",
            description: "A supernova remnant in the constellation Taurus, first observed in 1054 AD.",
            imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
            author: {
              id: "d7e8f9g0-h1i2-j3k4-l5m6-n7o8p9q0r1s2",
              username: "CosmicClaw",
              avatarUrl: "https://randomuser.me/api/portraits/women/40.jpg"
            },
            dateCreated: "2024-06-08T05:30:00Z",
            likesCount: 160,
            commentsCount: 25
          },
          {
            id: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
            title: "Andromeda Galaxy",
            description: "The Andromeda Galaxy is a barred spiral galaxy and the nearest major galaxy to the Milky Way.",
            imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
            author: {
              id: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
              username: "SpaceExplorer42",
              avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg"
            },
            dateCreated: "2024-05-15T08:30:00Z",
            likesCount: 142,
            commentsCount: 28
          },
          {
            id: "2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
            title: "Orion Nebula",
            description: "The Orion Nebula is a diffuse nebula situated in the Milky Way, south of Orion's Belt.",
            imageUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
            author: {
              id: "b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7",
              username: "CosmicPhotographer",
              avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg"
            },
            dateCreated: "2024-05-22T14:45:00Z",
            likesCount: 98,
            commentsCount: 17
          },
          {
            id: "3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r",
            title: "Milky Way Core",
            description: "The galactic core of the Milky Way as seen from a dark sky reserve.",
            imageUrl: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
            author: {
              id: "c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8",
              username: "AstroAdventurer",
              avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg"
            },
            dateCreated: "2024-05-03T22:15:00Z",
            likesCount: 87,
            commentsCount: 14
          }
        ];

        const sortedPosts = mockRecentPosts.sort((a, b) =>
          new Date(b.dateCreated) - new Date(a.dateCreated)
        );

        setRecentPosts(sortedPosts);
      } catch (err) {
        setError('Failed to load recent photos.');
        console.error("Error fetching recent posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPhotos();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="recent-photos-page loading-state">
        <div className="spinner"></div>
        <p>Loading recent photos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recent-photos-page error-state">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="recent-photos-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="page-title">Most Recent Photos</h2>
      <p className="page-subtitle">Discover the latest astrophotography from our community.</p>

      <div className="photos-grid">
        {recentPosts.length > 0 ? (
          recentPosts.map(post => (
            <motion.div
              key={post.id}
              className="photo-card"
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => setHoveredPost(post.id)}
              onHoverEnd={() => setHoveredPost(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="photo-image"
                style={{ backgroundImage: `url(${post.imageUrl})` }}
              >
                {hoveredPost === post.id && (
                  <motion.div
                    className="photo-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="overlay-content">
                      <h3>{post.title}</h3>
                      <p className="description">{post.description}</p>
                      <div className="post-meta">
                        <div className="author-info">
                          <img
                            src={post.author.avatarUrl}
                            alt={post.author.username}
                            className="author-avatar"
                          />
                          <span>{post.author.username}</span>
                        </div>
                        <div className="stats">
                          <span className="likes">❤️ {post.likesCount}</span>
                          <span className="comments">💬 {post.commentsCount}</span>
                        </div>
                        <div className="date">📅 {formatDate(post.dateCreated)}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="no-posts-found">
            <p>No recent photos found. Be the first to share one!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecentPostsPage;