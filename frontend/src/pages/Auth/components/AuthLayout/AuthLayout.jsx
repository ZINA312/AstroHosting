import { motion } from 'framer-motion';
import styles from './AuthLayout.module.scss';

const AuthLayout = ({ children }) => {
  return (
    <motion.div
      className={styles['auth-container']}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
      <motion.div
        className={styles['auth-background']}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1 }}
      />
    </motion.div>
  );
};

export default AuthLayout;