import { Link } from 'react-router-dom';
import { useAuthMock } from '../../context/AuthContext';
import styles from './NavigationStyle.module.scss';

const UserNavigationComponent = () => {
  const { isAuthenticated, toggleAuth } = useAuthMock();
  
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
            <Link to="/user/1" className={styles.userNavLink}>
              <span className={styles.userName}>Profile</span>
            </Link>
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
      
      <li className={styles.userNavItem}>
        <button 
          className={`${styles.authToggle} auth-toggle`}
          onClick={toggleAuth}
        >
          {isAuthenticated ? 'Logout' : 'Login'}
        </button>
      </li>
    </ul>
  );
};

export default UserNavigationComponent;