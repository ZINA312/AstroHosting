import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ImageUploader from './components/ImageUploader/ImageUploader';
import PostForm from './components/PostForm/PostForm';
import EquipmentSelector from './components/EquipmentSelector/EquipmentSelector';
import AddCustomEquipment from './components/AddCustomEquipment/AddCustomEquipment';
import styles from './PostUploadPage.module.scss';

export const EquipmentTypes = {
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

export const getEquipmentTypeName = (typeValue) => {
    return Object.keys(EquipmentTypes).find(key => EquipmentTypes[key] === typeValue) || 'Unknown';
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
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [addingEquipment, setAddingEquipment] = useState(false);
    const [error, setError] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [showEquipmentSearch, setShowEquipmentSearch] = useState(false);
    const [showAddCustomEquipment, setShowAddCustomEquipment] = useState(false);

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
                setLoading(false);
            } catch (err) {
                setError('Failed to load equipment list');
                setLoading(false);
            }
        };

        fetchEquipment();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (url) => {
        setPreviewUrl(url);
        setFormData(prev => ({
            ...prev,
            imageUrl: '' 
        }));
    };

    const handleEquipmentSelectionChange = (equipmentId) => {
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

    const handleAddCustomEquipment = async (newEquipmentData) => {
        setAddingEquipment(true);
        try {
            const response = await new Promise(resolve => setTimeout(() => {
                const newId = `custom-${Date.now()}`;
                const createdEquipment = {
                    id: newId,
                    name: newEquipmentData.name,
                    manufacturer: newEquipmentData.manufacturer,
                    type: getEquipmentTypeName(newEquipmentData.type),
                    specifications: newEquipmentData.specifications
                };
                resolve(createdEquipment);
            }, 1000));

            setAvailableEquipment(prev => [...prev, response]);
            setFormData(prev => ({
                ...prev,
                equipmentIds: [...prev.equipmentIds, response.id]
            }));
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
            <div className={styles['create-post-loading']}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    const selectedEquipment = formData.equipmentIds.map(id =>
        availableEquipment.find(eq => eq.id === id)
    ).filter(Boolean); 

    return (
        <motion.div
            className={styles['create-post-page']}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className={styles['create-post-container']}>
                <motion.div
                    className={styles['post-form-card']}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <h2 className={styles['form-title']}>Share Your Cosmic Capture</h2>
                    <p className={styles['form-subtitle']}>Upload and showcase your astrophotography masterpiece</p>

                    {error && (
                        <motion.div
                            className={styles['form-error']}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className={styles['post-form']}>
                        <ImageUploader
                            previewUrl={previewUrl || formData.imageUrl}
                            onImageChange={handleImageChange}
                            onRemoveImage={() => setPreviewUrl('')} 
                            setError={setError}
                        />

                        <PostForm
                            title={formData.title}
                            description={formData.description}
                            handleChange={handleFormChange}
                        />

                        <EquipmentSelector
                            selectedEquipment={selectedEquipment}
                            availableEquipment={availableEquipment}
                            onEquipmentSelect={handleEquipmentSelectionChange}
                            onRemoveEquipment={handleEquipmentSelectionChange} 
                            showSearch={showEquipmentSearch}
                            setShowSearch={setShowEquipmentSearch}
                            setShowAddCustom={setShowAddCustomEquipment}
                        />

                        {showAddCustomEquipment && (
                            <AddCustomEquipment
                                onAddEquipment={handleAddCustomEquipment}
                                onCancel={() => {
                                    setShowAddCustomEquipment(false);
                                    setError('');
                                }}
                                isAdding={addingEquipment}
                                EquipmentTypes={EquipmentTypes}
                            />
                        )}

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <button
                                type="submit"
                                className={styles['submit-button']}
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <div className={styles['button-spinner']}></div>
                                ) : 'Publish Photo'}
                            </button>
                        </motion.div>
                    </form>
                </motion.div>

                <motion.div
                    className={styles['create-post-background']}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ duration: 1 }}
                />
            </div>
        </motion.div>
    );
};

export default CreatePostPage;