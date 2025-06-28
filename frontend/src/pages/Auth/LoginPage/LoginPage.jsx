import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout/AuthLayout'; 
import AuthCard from '../components/AuthCard/AuthCard';     
import AuthInput from '../components/AuthInput/AuthInput';  
import AuthButton from '../components/AuthButton/AuthButton'; 
import styles from './LoginPage.module.scss';
import { useAuth } from '../../../context/AuthContext'; 

const LoginPage = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [localError, setLocalError] = useState(''); 
  const { login, loading: authLoading, authError } = useAuth(); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(''); 

    if (!formData.login || !formData.password) {
      setLocalError('Please enter both login and password.');
      return;
    }

    try {
      await login({ login: formData.login, password: formData.password });
      navigate('/'); 
    } catch (err) {
      console.error("Login submission failed:", err);
    }
  };

  const footerLinks = (
    <>
      <p>Don't have an account? <Link to="/register" className={styles['auth-link']}>Register here</Link></p>
      <p><Link to="/forgot-password" className={styles['auth-link']}>Forgot password?</Link></p>
    </>
  );

  return (
    <AuthLayout>
      <AuthCard
        title="Login to AstroHosting"
        subtitle="Capture the cosmos, share your vision"
        error={localError || authError} 
        footerLinks={footerLinks}
      >
        <form onSubmit={handleSubmit} className={styles['auth-form']}>
          <AuthInput
            label="Login"
            id="login"
            name="login"
            value={formData.login}
            onChange={handleChange}
            required
            placeholder="Enter your login"
            delay={0.2}
            disabled={authLoading}
          />
          <AuthInput
            label="Password"
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            delay={0.3}
            disabled={authLoading}
          />
          <AuthButton isLoading={authLoading}> 
            Login
          </AuthButton>
        </form>
      </AuthCard>
    </AuthLayout>
  );
};

export default LoginPage;
