import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ImageUploader from './components/ImageUploader/ImageUploader';
import PostForm from './components/PostForm/PostForm';
import EquipmentSelector from './components/EquipmentSelector/EquipmentSelector';
import AddCustomEquipment from './components/AddCustomEquipment/AddCustomEquipment';
import styles from './PostUploadPage.module.scss';


import { postApi } from '../../api/postApi';
import { equipmentApi } from '../../api/equipmentApi';


export const EquipmentTypes = {
    Camera: 0,
    Lens: 1,
    ComaCorrector: 2,
    Flattener: 3, 
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

export const getEquipmentTypeValue = (typeName) => {
    
    return EquipmentTypes[typeName];
};


const CreatePostPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '', 
        equipmentIds: [] 
    });
    const [availableEquipment, setAvailableEquipment] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [uploading, setUploading] = useState(false); 
    const [addingEquipment, setAddingEquipment] = useState(false); 
    const [error, setError] = useState('');
    const [previewUrl, setPreviewUrl] = useState(''); 
    const [selectedImageFile, setSelectedImageFile] = useState(null); 

    const [showEquipmentSearch, setShowEquipmentSearch] = useState(false);
    const [showAddCustomEquipment, setShowAddCustomEquipment] = useState(false);

    
    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                setLoading(true);
                setError('');
                const fetchedEquipment = await equipmentApi.getAllEquipment();
                
                const mappedEquipment = fetchedEquipment.map(eq => ({
                    ...eq,
                    type: getEquipmentTypeName(eq.type) 
                }));
                setAvailableEquipment(mappedEquipment);
            } catch (err) {
                console.error('Error loading equipment:', err);
                setError(err.message || 'Failed to load equipment list.');
            } finally {
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

    
    const handleImageChange = (file, url) => {
        setSelectedImageFile(file); 
        setPreviewUrl(url); 
        setError(''); 
    };

    const handleRemoveImage = () => {
        setSelectedImageFile(null);
        setPreviewUrl('');
        setError(''); 
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
        setError('');
        try {
            
            const equipmentDataToSend = {
                name: newEquipmentData.name,
                manufacturer: newEquipmentData.manufacturer,
                type: getEquipmentTypeValue(newEquipmentData.type), 
                specifications: newEquipmentData.specifications
            };
            const createdEquipment = await equipmentApi.createEquipment(equipmentDataToSend);
            
            
            const mappedCreatedEquipment = {
                ...createdEquipment,
                type: getEquipmentTypeName(createdEquipment.type)
            };

            setAvailableEquipment(prev => [...prev, mappedCreatedEquipment]);
            setFormData(prev => ({
                ...prev,
                equipmentIds: [...prev.equipmentIds, mappedCreatedEquipment.id]
            }));
            setShowAddCustomEquipment(false); 
        } catch (err) {
            console.error('Error adding custom equipment:', err);
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
            setError('Title is required.');
            setUploading(false);
            return;
        }

        if (!formData.description.trim()) {
            setError('Description is required.');
            setUploading(false);
            return;
        }

        if (!selectedImageFile) { 
            setError('Image is required.');
            setUploading(false);
            return;
        }

        try {
            
            const postCreateData = {
                title: formData.title,
                content: formData.description, 
                imageFile: selectedImageFile, 
                
                equipmentIds: formData.equipmentIds 
            };
              
            const createdPost = await postApi.createPost(postCreateData);
            console.log('Post successfully created:', createdPost);

            navigate(`/post/${createdPost.id}`); 
        } catch (err) {
            console.error('Error publishing post:', err);
            setError(err.message || 'Failed to publish photo. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles['create-post-loading']}>
                <div className={styles.spinner}></div>
                <p>Loading available equipment...</p>
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
                            transition={{ duration: 0.3 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className={styles['post-form']}>
                        <ImageUploader
                            previewUrl={previewUrl}
                            onImageChange={handleImageChange}
                            onRemoveImage={handleRemoveImage} 
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
