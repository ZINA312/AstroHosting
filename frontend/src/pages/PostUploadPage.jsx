import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../assets/PostUploadPageStyle.css';

const EquipmentTypes = {
    Camera: 0,
    Lens: 1,
    ComaCorrector: 2,
    Flatner: 3,
    Mount: 4,
    Tripod: 5,
    Focuser: 6,
    GuideScope: 7,
    GuideCamera: 8,
    Filter: 9,
    Accessory: 10,
    Telescope: 11,
};

const getEquipmentTypeName = (typeValue) => {
    return Object.keys(EquipmentTypes).find(key => EquipmentTypes[key] === typeValue) || 'Unknown';
};

const getEquipmentTypeValue = (typeName) => {
    return EquipmentTypes[typeName];
};


const CreatePostPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        equipmentIds: []
    });
    const [availableEquipment, setAvailableEquipment] = useState([]);
    const [filteredEquipment, setFilteredEquipment] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false); 
    const [addingEquipment, setAddingEquipment] = useState(false); 
    const [error, setError] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [showEquipmentSearch, setShowEquipmentSearch] = useState(false);
    const [showAddCustomEquipment, setShowAddCustomEquipment] = useState(false);
    const [newEquipment, setNewEquipment] = useState({
        name: '',
        manufacturer: '',
        type: EquipmentTypes.Accessory,
        specifications: {}
    });
    const [newSpecKey, setNewSpecKey] = useState('');
    const [newSpecValue, setNewSpecValue] = useState('');

    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 500)); 
                const mockEquipment = [
                    { id: 'e1f2g3h4-i5j6-k7l8-m9n0-o1p2q3r4s5t6', name: 'Celestron NexStar 8SE', manufacturer: 'Celestron', type: getEquipmentTypeName(EquipmentTypes.Telescope) },
                    { id: 'f2g3h4i5-j6k7-l8m9-n0o1-p2q3r4s5t6u7', name: 'ZWO ASI294MC Pro', manufacturer: 'ZWO', type: getEquipmentTypeName(EquipmentTypes.Camera) },
                    { id: 'g3h4i5j6-k7l8-m9n0-o1p2-q3r4s5t6u7v8', name: 'Sky-Watcher EQ6-R Pro', manufacturer: 'Sky-Watcher', type: getEquipmentTypeName(EquipmentTypes.Mount) },
                    { id: 'h4i5j6k7-l8m9-n0o1-p2q3-r4s5t6u7v8w9', name: 'Optolong L-Pro Filter', manufacturer: 'Optolong', type: getEquipmentTypeName(EquipmentTypes.Filter) },
                    { id: 'i5j6k7l8-m9n0-o1p2-q3r4-s5t6u7v8w9x0', name: 'William Optics RedCat 51', manufacturer: 'William Optics', type: getEquipmentTypeName(EquipmentTypes.Lens) },
                    { id: 'j6k7l8m9-n0o1-p2q3-r4s5-t6u7v8w9x0y1', name: 'Nikon D850', manufacturer: 'Nikon', type: getEquipmentTypeName(EquipmentTypes.Camera) },
                    { id: 'k7l8m9n0-o1p2-q3r4-s5t6-u7v8w9x0y1z2', name: 'Astro-Tech AT72ED', manufacturer: 'Astro-Tech', type: getEquipmentTypeName(EquipmentTypes.Telescope) },
                    { id: 'l8m9n0o1-p2q3-r4s5-t6u7-v8w9x0y1z2a3', name: 'iOptron CEM40', manufacturer: 'iOptron', type: getEquipmentTypeName(EquipmentTypes.Mount) },
                    { id: 'm9n0o1p2-q3r4-s5t6-u7v8-w9x0y1z2a3b4', name: 'Baader Moon & Skyglow Filter', manufacturer: 'Baader', type: getEquipmentTypeName(EquipmentTypes.Filter) },
                ];
                setAvailableEquipment(mockEquipment);
                setFilteredEquipment(mockEquipment);
                setLoading(false);
            } catch (err) {
                setError('Failed to load equipment list');
                setLoading(false);
            }
        };

        fetchEquipment();
    }, []);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredEquipment(availableEquipment);
        } else {
            const lowercasedSearch = searchTerm.toLowerCase();
            const filtered = availableEquipment.filter(item =>
                item.name.toLowerCase().includes(lowercasedSearch) ||
                (item.manufacturer && item.manufacturer.toLowerCase().includes(lowercasedSearch)) ||
                item.type.toLowerCase().includes(lowercasedSearch)
            );
            setFilteredEquipment(filtered);
        }
    }, [searchTerm, availableEquipment]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'imageUrl') {
            setPreviewUrl(value);
        }
    };

    const handleEquipmentChange = (equipmentId) => {
        setFormData(prev => {
            const equipmentIds = [...prev.equipmentIds];
            const index = equipmentIds.indexOf(equipmentId);

            if (index > -1) {
                equipmentIds.splice(index, 1);
            } else {
                equipmentIds.push(equipmentId);
            }

            return {
                ...prev,
                equipmentIds
            };
        });
    };

    const removeEquipment = (equipmentId) => {
        setFormData(prev => ({
            ...prev,
            equipmentIds: prev.equipmentIds.filter(id => id !== equipmentId)
        }));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFileUpload = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            setError('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('File size too large (max 5MB)');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
            setFormData(prev => ({
                ...prev,
                imageUrl: ''
            }));
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setPreviewUrl('');
        setFormData(prev => ({
            ...prev,
            imageUrl: ''
        }));
    };

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

    const handleAddCustomEquipmentClick = async () => {
        setError('');

        if (!newEquipment.name.trim()) {
            setError('Equipment Name is required.');
            return;
        }
        if (!newEquipment.manufacturer.trim()) {
            setError('Manufacturer is required for custom equipment.');
            return;
        }
        if (Object.keys(newEquipment.specifications).length === 0) {
            setError('At least one specification is required for custom equipment.');
            return;
        }

        setAddingEquipment(true); 
        try {
            const equipmentToBackend = {
                Name: newEquipment.name,
                Manufacturer: newEquipment.manufacturer,
                Type: newEquipment.type,
                Specifications: newEquipment.specifications
            };

            console.log('Sending new equipment to backend:', equipmentToBackend);

            const response = await new Promise(resolve => setTimeout(() => {
                const newId = `custom-${Date.now()}`;
                const createdEquipment = {
                    id: newId,
                    name: newEquipment.name,
                    manufacturer: newEquipment.manufacturer,
                    type: getEquipmentTypeName(newEquipment.type),
                    specifications: newEquipment.specifications
                };
                resolve(createdEquipment);
            }, 1000));

            setAvailableEquipment(prev => [...prev, response]);
            
            setFormData(prev => ({
                ...prev,
                equipmentIds: [...prev.equipmentIds, response.id]
            }));

            setNewEquipment({
                name: '',
                manufacturer: '',
                type: EquipmentTypes.Accessory,
                specifications: {}
            });
            setNewSpecKey('');
            setNewSpecValue('');
            setShowAddCustomEquipment(false);
            setError('');
        } catch (err) {
            setError(err.message || 'Failed to add custom equipment.');
        } finally {
            setAddingEquipment(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        setError('');

        if (!formData.title.trim()) {
            setError('Title is required');
            setUploading(false);
            return;
        }

        if (!formData.imageUrl && !previewUrl) {
            setError('Image is required');
            setUploading(false);
            return;
        }

        try {
            console.log('Final post data to upload:', {
                ...formData,
                image: previewUrl ? 'uploaded-image-data' : formData.imageUrl,
            });

            await new Promise(resolve => setTimeout(resolve, 1500));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to publish photo');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="create-post-loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <motion.div
            className="create-post-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="create-post-container">
                <motion.div
                    className="post-form-card"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <h2 className="form-title">Share Your Cosmic Capture</h2>
                    <p className="form-subtitle">Upload and showcase your astrophotography masterpiece</p>

                    {error && (
                        <motion.div
                            className="form-error"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="post-form">
                        <div className="image-preview-container">
                            {previewUrl ? (
                                <div className="image-preview-wrapper">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="image-preview"
                                        onError={() => setPreviewUrl('')}
                                    />
                                    <button
                                        type="button"
                                        className="remove-image-button"
                                        onClick={removeImage}
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : formData.imageUrl ? (
                                <div className="image-preview-wrapper">
                                    <img
                                        src={formData.imageUrl}
                                        alt="Preview"
                                        className="image-preview"
                                        onError={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                                    />
                                    <button
                                        type="button"
                                        className="remove-image-button"
                                        onClick={removeImage}
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <div className="image-preview-placeholder" onClick={handleFileUpload}>
                                    <div className="placeholder-content">
                                        <span className="placeholder-icon">🌌</span>
                                        <span>Click to Upload Image</span>
                                    </div>
                                </div>
                            )}

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="title">Photo Title *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="Give your photo a title"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Tell the story behind this capture..."
                                rows="4"
                                className="form-textarea"
                            ></textarea>
                        </div>
                        
                        <div className="form-group">
                            <label>Equipment Used</label>

                            <div className="selected-equipment-container">
                                {formData.equipmentIds.map(id => {
                                    const equipment = availableEquipment.find(eq => eq.id === id);
                                    return equipment ? (
                                        <motion.div
                                            key={equipment.id}
                                            className="selected-equipment-card"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                        >
                                            <div className="equipment-info">
                                                <span className="equipment-name">{equipment.name}</span>
                                                <span className="equipment-type">
                                                    {equipment.type}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                className="remove-equipment"
                                                onClick={() => removeEquipment(equipment.id)}
                                            >
                                                ×
                                            </button>
                                        </motion.div>
                                    ) : null;
                                })}
                            </div>

                            {!showEquipmentSearch && !showAddCustomEquipment && (
                                <div className="equipment-actions">
                                    <button
                                        type="button"
                                        className="add-equipment-button"
                                        onClick={() => setShowEquipmentSearch(true)}
                                    >
                                        + Add Existing Equipment
                                    </button>
                                    <button
                                        type="button"
                                        className="add-equipment-button"
                                        onClick={() => setShowAddCustomEquipment(true)}
                                    >
                                        + Add Custom Equipment
                                    </button>
                                </div>
                            )}

                            {showEquipmentSearch && (
                                <div className="equipment-search-container">
                                    <div className="search-container">
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            placeholder="Search equipment..."
                                            className="search-input"
                                            autoFocus
                                        />
                                        <span className="search-icon">🔍</span>
                                        <button
                                            type="button"
                                            className="close-search"
                                            onClick={() => { setShowEquipmentSearch(false); setSearchTerm(''); }}
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <div className="equipment-grid">
                                        {filteredEquipment.length > 0 ? (
                                            filteredEquipment.map(equipment => (
                                                <motion.div
                                                    key={equipment.id}
                                                    className={`equipment-card ${formData.equipmentIds.includes(equipment.id) ? 'selected' : ''}`}
                                                    onClick={() => handleEquipmentChange(equipment.id)}
                                                    whileHover={{ scale: 1.03 }}
                                                >
                                                    <div className="equipment-info">
                                                        <span className="equipment-name">{equipment.name}</span>
                                                        <span className="equipment-type">
                                                            {equipment.manufacturer ? `${equipment.manufacturer} - ` : ''}
                                                            {equipment.type}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="no-results">
                                                No equipment found matching "{searchTerm}"
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {showAddCustomEquipment && (
                            <div className="add-custom-equipment-container">
                                <h3>Add New Equipment</h3>
                                <div className="custom-equipment-form-inputs"> 
                                    <div className="form-group">
                                        <label htmlFor="newEquipmentName">Name *</label>
                                        <input
                                            type="text"
                                            id="newEquipmentName"
                                            name="name"
                                            value={newEquipment.name}
                                            onChange={handleNewEquipmentChange}
                                            placeholder="e.g., My Custom Telescope"
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="newEquipmentManufacturer">Manufacturer *</label>
                                        <input
                                            type="text"
                                            id="newEquipmentManufacturer"
                                            name="manufacturer"
                                            value={newEquipment.manufacturer}
                                            onChange={handleNewEquipmentChange}
                                            placeholder="e.g., Self-Made, Generic Brand"
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="newEquipmentType">Type *</label>
                                        <select
                                            id="newEquipmentType"
                                            name="type"
                                            value={newEquipment.type}
                                            onChange={handleNewEquipmentChange}
                                            className="form-input"
                                            required
                                        >
                                            {Object.entries(EquipmentTypes).map(([key, value]) => (
                                                <option key={key} value={value}>{key}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Specifications (Key-Value Pairs) *</label>
                                        <div className="specifications-input-group">
                                            <input
                                                type="text"
                                                value={newSpecKey}
                                                onChange={(e) => setNewSpecKey(e.target.value)}
                                                placeholder="Key (e.g., Aperture)"
                                                className="form-input"
                                                style={{ flex: 1 }}
                                            />
                                            <input
                                                type="text"
                                                value={newSpecValue}
                                                onChange={(e) => setNewSpecValue(e.target.value)}
                                                placeholder="Value (e.g., 8 inches)"
                                                className="form-input"
                                                style={{ flex: 1 }}
                                            />
                                            <button
                                                type="button"
                                                className="add-spec-button"
                                                onClick={handleAddSpecification}
                                            >
                                                + Add Spec
                                            </button>
                                        </div>
                                        <div className="current-specs-container">
                                            {Object.entries(newEquipment.specifications).map(([key, value]) => (
                                                <div key={key} className="selected-equipment-card">
                                                    <div className="equipment-info">
                                                        <span className="equipment-name">{key}: {value}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="remove-equipment"
                                                        onClick={() => handleRemoveSpecification(key)}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div> 
                                
                                <div className="custom-equipment-actions">
                                    <button
                                        type="button" 
                                        className="submit-button"
                                        onClick={handleAddCustomEquipmentClick} 
                                        disabled={addingEquipment}
                                    >
                                        {addingEquipment ? <div className="button-spinner"></div> : 'Add Equipment'}
                                    </button>
                                    <button
                                        type="button"
                                        className="cancel-button"
                                        onClick={() => {
                                            setShowAddCustomEquipment(false);
                                            setNewEquipment({
                                                name: '',
                                                manufacturer: '',
                                                type: EquipmentTypes.Accessory,
                                                specifications: {}
                                            });
                                            setNewSpecKey('');
                                            setNewSpecValue('');
                                            setError('');
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <button 
                                type="submit" 
                                className="submit-button"
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <div className="button-spinner"></div>
                                ) : 'Publish Photo'}
                            </button>
                        </motion.div>
                    </form> 
                </motion.div>

                <motion.div
                    className="create-post-background"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ duration: 1 }}
                />
            </div>
        </motion.div>
    );
};

export default CreatePostPage;