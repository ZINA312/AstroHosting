import { motion } from 'framer-motion';
import styles from './AuthCard.module.scss';

const AuthCard = ({ title, subtitle, error, children, footerLinks }) => {
  return (
    <div className={styles['auth-card']}>
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className={styles['auth-title']}>{title}</h2>
        <p className={styles['auth-subtitle']}>{subtitle}</p>
      </motion.div>

      {error && (
        <motion.div
          className={styles['auth-error']}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          {error}
        </motion.div>
      )}

      {children} 

      <motion.div
        className={styles['auth-footer']}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {footerLinks}
      </motion.div>
    </div>
  );
};

export default AuthCard;