import { motion } from 'framer-motion';
import styles from './AuthButton.module.scss';

const AuthButton = ({ isLoading, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className={styles['button-container']}
    >
      <button
        type="submit"
        className={styles['auth-button']}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className={styles.spinner}></div>
        ) : children}
      </button>
    </motion.div>
  );
};

export default AuthButton;