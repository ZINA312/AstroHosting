import UserNavigation from './UserNavigationComponent';
import { Link } from 'react-router-dom';
import styles from './NavigationStyle.module.scss';

const NavigationComponent = () => (
  <nav className={styles.nav}>
    <ul className={styles.navList}>
      <div className={styles.navigationLinks}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/recent-posts">Astrophotography</Link></li>
        <li><Link to="/popular-users">Photographers</Link></li>
      </div>
      <li>
        <input 
          className={styles.searchInput} 
          placeholder='Search'
        />
      </li>
      <UserNavigation />
    </ul>
  </nav>
);

export default NavigationComponent;