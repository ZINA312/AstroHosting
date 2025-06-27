import { motion } from 'framer-motion';
import styles from './AuthInput.module.scss';

const AuthInput = ({ label, id, name, type = 'text', value, onChange, required, placeholder, rows, delay }) => {
  const InputComponent = rows ? 'textarea' : 'input';

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: delay }}
      className={styles['input-group']}
    >
      <label htmlFor={id} className={styles.label}>{label}</label>
      <InputComponent
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        rows={rows}
        className={styles.input}
      />
    </motion.div>
  );
};

export default AuthInput;