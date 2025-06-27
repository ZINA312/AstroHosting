import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './EquipmentSelector.module.scss';
import { getEquipmentTypeName } from '../../PostUploadPage'; 

const EquipmentSelector = ({
    selectedEquipment,
    availableEquipment,
    onEquipmentSelect,
    onRemoveEquipment,
    showSearch,
    setShowSearch,
    setShowAddCustom,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEquipment, setFilteredEquipment] = useState([]);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredEquipment(availableEquipment);
        } else {
            const lowercasedSearch = searchTerm.toLowerCase();
            const filtered = availableEquipment.filter(item =>
                item.name.toLowerCase().includes(lowercasedSearch) ||
                (item.manufacturer && item.manufacturer.toLowerCase().includes(lowercasedSearch)) ||
                getEquipmentTypeName(item.type).toLowerCase().includes(lowercasedSearch)
            );
            setFilteredEquipment(filtered);
        }
    }, [searchTerm, availableEquipment]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className={styles['form-group']}>
            <label>Equipment Used</label>

            <div className={styles['selected-equipment-container']}>
                {selectedEquipment.map(equipment => (
                    <motion.div
                        key={equipment.id}
                        className={styles['selected-equipment-card']}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className={styles['equipment-info']}>
                            <span className={styles['equipment-name']}>{equipment.name}</span>
                            <span className={styles['equipment-type']}>
                                {equipment.type}
                            </span>
                        </div>
                        <button
                            type="button"
                            className={styles['remove-equipment']}
                            onClick={() => onRemoveEquipment(equipment.id)}
                        >
                            &times;
                        </button>
                    </motion.div>
                ))}
            </div>

            {!showSearch && (
                <div className={styles['equipment-actions']}>
                    <button
                        type="button"
                        className={styles['add-equipment-button']}
                        onClick={() => setShowSearch(true)}
                    >
                        + Add Existing Equipment
                    </button>
                    <button
                        type="button"
                        className={styles['add-equipment-button']}
                        onClick={() => setShowAddCustom(true)}
                    >
                        + Add Custom Equipment
                    </button>
                </div>
            )}

            {showSearch && (
                <div className={styles['equipment-search-container']}>
                    <div className={styles['search-container']}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search equipment..."
                            className={styles['search-input']}
                            autoFocus
                        />
                        <span className={styles['search-icon']}>🔍</span>
                        <button
                            type="button"
                            className={styles['close-search']}
                            onClick={() => { setShowSearch(false); setSearchTerm(''); }}
                        >
                            &times;
                        </button>
                    </div>

                    <div className={styles['equipment-grid']}>
                        {filteredEquipment.length > 0 ? (
                            filteredEquipment.map(equipment => (
                                <motion.div
                                    key={equipment.id}
                                    className={`${styles['equipment-card']} ${selectedEquipment.some(eq => eq.id === equipment.id) ? styles.selected : ''}`}
                                    onClick={() => onEquipmentSelect(equipment.id)}
                                    whileHover={{ scale: 1.03 }}
                                >
                                    <div className={styles['equipment-info']}>
                                        <span className={styles['equipment-name']}>{equipment.name}</span>
                                        <span className={styles['equipment-type']}>
                                            {equipment.manufacturer ? `${equipment.manufacturer} - ` : ''}
                                            {equipment.type}
                                        </span>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className={styles['no-results']}>
                                No equipment found matching "{searchTerm}"
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EquipmentSelector;