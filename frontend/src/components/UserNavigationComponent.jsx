import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthMock } from '../context/AuthContext';

const UserNavigationComponent = () => {
  const { isAuthenticated, toggleAuth } = useAuthMock();
  
  return (
    <ul className="user-navigation">
        {isAuthenticated ? (
            <>
                <li className="user-nav-item">
                    <Link to="/upload" className="user-nav-link">
                    Upload
                    </Link>
                </li>
                <li className="user-nav-item">
                    <Link to="/profile" className="user-nav-link">
                    <span className="user-name">Profile</span>
                    </Link>
                </li>
            </>
        ) : (
            <>
                <li className="user-nav-item">
                    <Link to="/login" className="user-nav-link">
                    Login
                    </Link>
                </li>
                <li className="user-nav-item">
                    <Link to="/register" className="register-button">
                    Register
                    </Link>
                </li>
            </>
        )}
        
            <li className="user-nav-item">
                <button 
                className="auth-toggle"
                onClick={toggleAuth}
                >
                {isAuthenticated ? 'Auth' : 'Not Auth'}
                </button>
            </li>
    </ul>
  );
};

export default UserNavigationComponent;