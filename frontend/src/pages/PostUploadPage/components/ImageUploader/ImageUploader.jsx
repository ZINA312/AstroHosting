import { useRef } from 'react';
import styles from './ImageUploader.module.scss';

const ImageUploader = ({ previewUrl, onImageChange, onRemoveImage, setError }) => {
    const fileInputRef = useRef(null);

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
            onImageChange(reader.result);
            setError(''); 
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className={styles['image-preview-container']}>
            {previewUrl ? (
                <div className={styles['image-preview-wrapper']}>
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className={styles['image-preview']}
                        onError={() => onImageChange('')} 
                    />
                    <button
                        type="button"
                        className={styles['remove-image-button']}
                        onClick={onRemoveImage}
                    >
                        &times;
                    </button>
                </div>
            ) : (
                <div className={styles['image-preview-placeholder']} onClick={handleFileUpload}>
                    <div className={styles['placeholder-content']}>
                        <span className={styles['placeholder-icon']}>🌌</span>
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
    );
};

export default ImageUploader;