import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../assets/PopularUsersPageStyle.css'; 

const PopularUsersPage = () => {
  const [users, setUsers] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        await new Promise(resolve => setTimeout(resolve, 1000));

        const dummyUsers = [
          {
            id: "user-1",
            username: "AstroNomad",
            avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg"
          },
          {
            id: "user-2",
            username: "CosmicLens",
            avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg"
          },
          {
            id: "user-3",
            username: "StarGazerPro",
            avatarUrl: "https://randomuser.me/api/portraits/men/88.jpg"
          },
          {
            id: "user-4",
            username: "GalacticGirl",
            avatarUrl: "https://randomuser.me/api/portraits/women/41.jpg"
          },
          {
            id: "user-5",
            username: "NebulaNerd",
            avatarUrl: "https://randomuser.me/api/portraits/men/29.jpg"
          },
          {
            id: "user-6",
            username: "BlackHoleBabe",
            avatarUrl: "https://randomuser.me/api/portraits/women/55.jpg"
          },
          {
            id: "user-7",
            username: "PlanetPathfinder",
            avatarUrl: "https://randomuser.me/api/portraits/men/12.jpg"
          },
          {
            id: "user-8",
            username: "CometChaser",
            avatarUrl: "https://randomuser.me/api/portraits/women/77.jpg"
          },
          {
            id: "user-9",
            username: "LunarExplorer",
            avatarUrl: "https://randomuser.me/api/portraits/men/3.jpg"
          },
          {
            id: "user-10",
            username: "MarsMission",
            avatarUrl: "https://randomuser.me/api/portraits/women/90.jpg"
          },
        ];
        setUsers(dummyUsers);
      } catch (err) {
        setError("Failed to fetch users. Please try again later.");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="popular-users-page loading-state">
        <p>Loading popular photographers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="popular-users-page error-state">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="popular-users-page">
      <h1 className="page-title">Popular Photographers</h1>
      <div className="users-grid">
        {users.map(user => (
          <motion.div
            key={user.id}
            className="user-card"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="user-avatar-container">
              <div className="user-avatar-frame"></div>
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="user-avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-avatar.jpg';
                }}
              />
            </div>
            <h2 className="user-username">{user.username}</h2>
            <button className="view-profile-btn">View Profile</button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PopularUsersPage;