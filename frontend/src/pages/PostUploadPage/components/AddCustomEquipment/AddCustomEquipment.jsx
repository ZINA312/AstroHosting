import { useState } from 'react';
import styles from './AddCustomEquipment.module.scss';

const AddCustomEquipment = ({ onAddEquipment, onCancel, isAdding, EquipmentTypes }) => {
    const [newEquipment, setNewEquipment] = useState({
        name: '',
        manufacturer: '',
        type: EquipmentTypes.Accessory,
        specifications: {}
    });
    const [newSpecKey, setNewSpecKey] = useState('');
    const [newSpecValue, setNewSpecValue] = useState('');
    const [formError, setFormError] = useState(''); 
    const handleNewEquipmentChange = (e) => {
        const { name, value } = e.target;
        setNewEquipment(prev => ({
            ...prev,
            [name]: name === 'type' ? parseInt(value, 10) : value
        }));
    };

    const handleAddSpecification = () => {
        if (newSpecKey.trim() && newSpecValue.trim()) {
            setNewEquipment(prev => ({
                ...prev,
                specifications: {
                    ...prev.specifications,
                    [newSpecKey.trim()]: newSpecValue.trim()
                }
            }));
            setNewSpecKey('');
            setNewSpecValue('');
            setFormError('');
        }
    };

    const handleRemoveSpecification = (keyToRemove) => {
        setNewEquipment(prev => {
            const updatedSpecs = { ...prev.specifications };
            delete updatedSpecs[keyToRemove];
            return {
                ...prev,
                specifications: updatedSpecs
            };
        });
    };

    const handleSubmitCustomEquipment = () => {
        setFormError(''); 
        if (!newEquipment.name.trim()) {
            setFormError('Equipment Name is required.');
            return;
        }
        if (!newEquipment.manufacturer.trim()) {
            setFormError('Manufacturer is required.');
            return;
        }
        if (Object.keys(newEquipment.specifications).length === 0) {
            setFormError('At least one specification is required.');
            return;
        }
        onAddEquipment(newEquipment);
        setNewEquipment({
            name: '',
            manufacturer: '',
            type: EquipmentTypes.Accessory,
            specifications: {}
        });
        setNewSpecKey('');
        setNewSpecValue('');
    };

    return (
        <div className={styles['add-custom-equipment-container']}>
            <h3>Add New Equipment</h3>
            {formError && <div className={styles['form-error']}>{formError}</div>}
            <div className={styles['custom-equipment-form-inputs']}>
                <div className={styles['form-group']}>
                    <label htmlFor="newEquipmentName">Name *</label>
                    <input
                        type="text"
                        id="newEquipmentName"
                        name="name"
                        value={newEquipment.name}
                        onChange={handleNewEquipmentChange}
                        placeholder="e.g., My Custom Telescope"
                        className={styles['form-input']}
                        required
                    />
                </div>
                <div className={styles['form-group']}>
                    <label htmlFor="newEquipmentManufacturer">Manufacturer *</label>
                    <input
                        type="text"
                        id="newEquipmentManufacturer"
                        name="manufacturer"
                        value={newEquipment.manufacturer}
                        onChange={handleNewEquipmentChange}
                        placeholder="e.g., Self-Made, Generic Brand"
                        className={styles['form-input']}
                        required
                    />
                </div>
                <div className={styles['form-group']}>
                    <label htmlFor="newEquipmentType">Type *</label>
                    <select
                        id="newEquipmentType"
                        name="type"
                        value={newEquipment.type}
                        onChange={handleNewEquipmentChange}
                        className={styles['form-input']}
                        required
                    >
                        {Object.entries(EquipmentTypes).map(([key, value]) => (
                            <option key={key} value={value}>{key}</option>
                        ))}
                    </select>
                </div>
                <div className={styles['form-group']}>
                    <label>Specifications (Key-Value Pairs) *</label>
                    <div className={styles['specifications-input-group']}>
                        <input
                            type="text"
                            value={newSpecKey}
                            onChange={(e) => setNewSpecKey(e.target.value)}
                            placeholder="Key (e.g., Aperture)"
                            className={styles['form-input']}
                            style={{ flex: 1 }}
                        />
                        <input
                            type="text"
                            value={newSpecValue}
                            onChange={(e) => setNewSpecValue(e.target.value)}
                            placeholder="Value (e.g., 8 inches)"
                            className={styles['form-input']}
                            style={{ flex: 1 }}
                        />
                        <button
                            type="button"
                            className={styles['add-spec-button']}
                            onClick={handleAddSpecification}
                        >
                            + Add Spec
                        </button>
                    </div>
                    <div className={styles['current-specs-container']}>
                        {Object.entries(newEquipment.specifications).map(([key, value]) => (
                            <div key={key} className={styles['selected-equipment-card']}>
                                <div className={styles['equipment-info']}>
                                    <span className={styles['equipment-name']}>{key}: {value}</span>
                                </div>
                                <button
                                    type="button"
                                    className={styles['remove-equipment']}
                                    onClick={() => handleRemoveSpecification(key)}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles['custom-equipment-actions']}>
                <button
                    type="button"
                    className={styles['submit-button']}
                    onClick={handleSubmitCustomEquipment}
                    disabled={isAdding}
                >
                    {isAdding ? <div className={styles['button-spinner']}></div> : 'Add Equipment'}
                </button>
                <button
                    type="button"
                    className={styles['cancel-button']}
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AddCustomEquipment;