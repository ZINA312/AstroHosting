import { useRef } from 'react'; 
import styles from './ImageUploader.module.scss';
import { motion } from 'framer-motion'; 

const ImageUploader = ({ previewUrl, onImageChange, onRemoveImage, setError }) => {
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            onRemoveImage(); 
            return;
        }

        
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file (e.g., JPG, PNG).');
            onRemoveImage(); 
            return;
        }

        
        if (file.size > 5 * 1024 * 1024) { 
            setError('File size too large (max 5MB).');
            onRemoveImage();
            return;
        }

        
        const url = URL.createObjectURL(file);
        
        
        onImageChange(file, url); 
        setError(''); 
    };

    
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy'; 
    };

    
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file) {
            
            fileInputRef.current.files = e.dataTransfer.files; 
            handleFileChange({ target: { files: e.dataTransfer.files } });
        }
    };

    return (
        <div className={styles['image-preview-container']}>
            {previewUrl ? (
                
                <motion.div
                    className={styles['image-preview-wrapper']} 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }} 
                >
                    <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className={styles['image-preview']} 
                        onError={onRemoveImage} 
                    />
                    <button 
                        type="button" 
                        onClick={onRemoveImage} 
                        className={styles['remove-image-button']}
                        aria-label="Remove image" 
                    >
                        &times;
                    </button>
                </motion.div>
            ) : (
                <motion.div
                    className={styles['image-preview-placeholder']}
                    onClick={() => fileInputRef.current.click()} 
                    onDragOver={handleDragOver} 
                    onDrop={handleDrop}
                    initial={{ scale: 0.95 }}
                    whileHover={{ scale: 1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                    <div className={styles['placeholder-content']}>
                        <span className={styles['placeholder-icon']}>🌌</span>
                        <span>Click to Upload Image or Drag & Drop</span> 
                    </div>
                </motion.div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*" 
                style={{ display: 'none' }} 
            />
        </div>
    );
};

export default ImageUploader;
