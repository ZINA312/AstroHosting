import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './EquipmentGrid.module.scss';
import { equipmentTypeMap } from '../../utils/equipmentTypeMap';

const EquipmentList = ({ equipment }) => {
    if (!equipment || equipment.length === 0) {
        return (
            <p className={styles['no-equipment-found']}>No equipment found.</p>
        );
    }

    return (
        <div className={styles['equipment-list']}>
            {equipment.map(item => (
                <motion.div 
                    key={item.id} 
                    className={styles['equipment-item']}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Link to={`/equipment/${item.id}`} className={styles['equipment-link']}>
                        <h3 className={styles['equipment-name']}>{item.name}</h3>
                        {item.type !== undefined && (
                            <span className={styles['equipment-type']}>{equipmentTypeMap[item.type] || 'Unknown Type'}</span>
                        )}
                        {item.manufacturer && <span className={styles['equipment-manufacturer']}>{item.manufacturer}</span>}
                    </Link>
                </motion.div>
            ))}
        </div>
    );
};

export default EquipmentList;
