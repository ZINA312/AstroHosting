import { motion } from 'framer-motion';
import styles from './EquipmentDetailsCard.module.scss';
import { equipmentTypeMap } from '../../../../utils/equipmentTypeMap'; 

const EquipmentDetailsCard = ({ equipmentDetails }) => {
    if (!equipmentDetails) {
        return null; 
    }

    return (
        <motion.div 
            className={styles['equipment-details-card']}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className={styles['detail-group']}>
                <span className={styles['detail-label']}>Type:</span>
                <span className={styles['detail-value']}>
                    {equipmentTypeMap[equipmentDetails.type] || 'Unknown Type'}
                </span>
            </div>
            {equipmentDetails.manufacturer && (
                <div className={styles['detail-group']}>
                    <span className={styles['detail-label']}>Manufacturer:</span>
                    <span className={styles['detail-value']}>{equipmentDetails.manufacturer}</span>
                </div>
            )}
            {equipmentDetails.description && (
                <div className={styles['detail-group']}>
                    <span className={styles['detail-label']}>Description:</span>
                    <p className={`${styles['detail-value']} ${styles.description}`}>{equipmentDetails.description}</p>
                </div>
            )}
            {equipmentDetails.quantityAvailable !== undefined && (
                <div className={styles['detail-group']}>
                    <span className={styles['detail-label']}>Quantity Available:</span>
                    <span className={styles['detail-value']}>{equipmentDetails.quantityAvailable}</span>
                </div>
            )}

            {equipmentDetails.specifications && Object.keys(equipmentDetails.specifications).length > 0 && (
                <div className={styles['specifications-section']}>
                    <h3 className={styles['section-heading']}>Specifications:</h3>
                    <ul className={styles['spec-list']}>
                        {Object.entries(equipmentDetails.specifications).map(([key, value]) => (
                            <li key={key} className={styles['spec-item']}>
                                <span className={styles['spec-key']}>{key}:</span>
                                <span className={styles['spec-value']}>{value}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </motion.div>
    );
};

export default EquipmentDetailsCard;
