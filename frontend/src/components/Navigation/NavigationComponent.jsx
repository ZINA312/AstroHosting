import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserNavigation from './UserNavigationComponent';
import styles from './NavigationStyle.module.scss';

const NavigationComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' || e.type === 'click') { 
      e.preventDefault();
      const trimmedSearchTerm = searchTerm.trim();
      if (trimmedSearchTerm) {
        
        navigate(`/search?query=${encodeURIComponent(trimmedSearchTerm)}`);
        setSearchTerm(''); 
      }
    }
  };

  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <div className={styles.navigationLinks}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/recent-posts">Astrophotography</Link></li>
          <li><Link to="/popular-users">Photographers</Link></li>
        </div>
        <li className={styles.searchContainer}> 
          <input 
            type="text"
            className={styles.searchInput} 
            placeholder='Search users, posts, equipment...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchSubmit} 
          />
          <button className={styles.searchButton} onClick={handleSearchSubmit}>
            <p className="fa fa-search">🔎</p>
          </button>
        </li>
        <UserNavigation />
      </ul>
    </nav>
  );
};

export default NavigationComponent;
