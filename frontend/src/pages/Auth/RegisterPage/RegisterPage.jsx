import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout/AuthLayout';
import AuthCard from '../components/AuthCard/AuthCard';
import AuthInput from '../components/AuthInput/AuthInput';
import AuthButton from '../components/AuthButton/AuthButton';
import styles from './RegisterPage.module.scss';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    userName: '',
    login: '',
    password: '',
    bio: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);

      navigate('/login');
    }, 1500);

    // add registration
  };

  const footerLinks = (
    <>
      <p>Already have an account? <Link to="/login" className={styles['auth-link']}>Login here</Link></p>
      <p>By registering, you agree to our <Link to="/terms" className={styles['auth-link']}>Terms of Service</Link></p>
    </>
  );

  return (
    <AuthLayout>
      <AuthCard
        title="Join AstroHosting"
        subtitle="Share your cosmic perspective"
        error={error}
        footerLinks={footerLinks}
      >
        <form onSubmit={handleSubmit} className={styles['auth-form']}>
          <AuthInput
            label="Username"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
            placeholder="Choose a username"
            delay={0.2}
          />
          <AuthInput
            label="Login"
            id="login"
            name="login"
            value={formData.login}
            onChange={handleChange}
            required
            placeholder="Enter your login"
            delay={0.3}
          />
          <AuthInput
            label="Password"
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Create a password"
            delay={0.4}
          />
          <AuthInput
            label="Bio (Optional)"
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself"
            rows="3"
            delay={0.5}
          />
          <AuthButton isLoading={isLoading}>
            Create Account
          </AuthButton>
        </form>
      </AuthCard>
    </AuthLayout>
  );
};

export default RegisterPage;