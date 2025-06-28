import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import styles from './NavigationStyle.module.scss'; 

const UserNavigationComponent = () => {
  const { user, isAuthenticated, logout } = useAuth(); 
  
  return (
    <ul className={styles.userNavigation}>
      {isAuthenticated ? (
        <>
          <li className={styles.userNavItem}>
            <Link to="/post-upload" className={styles.userNavLink}>
              Upload
            </Link>
          </li>
          <li className={styles.userNavItem}>
            <Link to={`/user/${user?.id}`} className={styles.userNavLink}>
              <span className={styles.userName}>{user?.username || 'Profile'}</span>
            </Link>
          </li>
          <li className={styles.userNavItem}>
            <button 
              className={`${styles.userNavLink} ${styles.logoutButton}`} 
              onClick={logout}
            >
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          <li className={styles.userNavItem}>
            <Link to="/login" className={styles.userNavLink}>
              Login
            </Link>
          </li>
          <li className={styles.userNavItem}>
            <Link to="/register" className={styles.registerButton}>
              Register
            </Link>
          </li>
        </>
      )}
    </ul>
  );
};

export default UserNavigationComponent;
