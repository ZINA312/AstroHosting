import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout/AuthLayout'; 
import AuthCard from '../components/AuthCard/AuthCard'; 
import AuthInput from '../components/AuthInput/AuthInput'; 
import AuthButton from '../components/AuthButton/AuthButton'; 
import { useAuth } from '../../../context/AuthContext'; 
import styles from './RegisterPage.module.scss'; 

const RegisterPage = () => {
    const [login, setLogin] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [bio, setBio] = useState(''); 
    const [localError, setLocalError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { register, loading, authError } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError(''); 
        setSuccessMessage(''); 

        if (!login || !username || !password || !confirmPassword) {
            setLocalError('All fields are required.');
            return;
        }
        if (password !== confirmPassword) {
            setLocalError('Passwords do not match.');
            return;
        }
        if (password.length < 8) {
            setLocalError('Password must be at least 8 characters long.');
            return;
        }
        if (!/[A-Z]/.test(password)) {
            setLocalError('Password must contain at least one uppercase letter.');
            return;
        }
        if (!/[a-z]/.test(password)) {
            setLocalError('Password must contain at least one lowercase letter.');
            return;
        }
        if (!/[0-9]/.test(password)) {
            setLocalError('Password must contain at least one digit.');
            return;
        }
        if (!/[^a-zA-Z0-9]/.test(password)) {
            setLocalError('Password must contain at least one special character.');
            return;
        }

        try {
            await register({ login, username, password, bio }); 
            setSuccessMessage('Registration successful! You can now log in.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            try {
                const errorData = JSON.parse(err.message);
                if (errorData.errors) {
                    const formattedErrors = Object.values(errorData.errors).flat().join('; ');
                    setLocalError(`Validation failed: ${formattedErrors}`);
                } else {
                    setLocalError(errorData.error || err.message || 'An unexpected error occurred during registration.');
                }
            } catch {
                setLocalError(err.message || 'An unexpected error occurred during registration.');
            }
        }
    };

    const footerLinks = (
        <p className={styles['auth-switch-text']}>
            Already have an account? <Link to="/login" className={styles['auth-switch-link']}>Login here</Link>
        </p>
    );

    return (
        <AuthLayout>
            <AuthCard
                title="Register New Account"
                subtitle="Join our community to share your cosmic captures!"
                error={localError || authError}
                successMessage={successMessage} 
                footerLinks={footerLinks}
            >
                <form onSubmit={handleSubmit} className={styles['auth-form']}>
                    <AuthInput
                        label="Login"
                        id="login"
                        name="login"
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        required
                        placeholder="Enter your login"
                        delay={0.1}
                        disabled={loading}
                    />
                    <AuthInput
                        label="Username"
                        id="username"
                        name="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Choose a username"
                        delay={0.2}
                        disabled={loading}
                    />
                    <AuthInput
                        label="Password"
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                        delay={0.3}
                        disabled={loading}
                        hint="Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char." 
                    />
                    <AuthInput
                        label="Confirm Password"
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Confirm your password"
                        delay={0.4}
                        disabled={loading}
                    />
                    <AuthInput 
                        label="Bio (Optional)"
                        id="bio"
                        name="bio"
                        type="textarea" 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us a little about yourself or your astrophotography interests (optional)"
                        delay={0.5}
                        disabled={loading}
                    />
                    <AuthButton isLoading={loading}>
                        Register
                    </AuthButton>
                </form>
            </AuthCard>
        </AuthLayout>
    );
};

export default RegisterPage;
