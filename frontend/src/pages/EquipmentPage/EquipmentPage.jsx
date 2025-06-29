import { useState, useEffect, useCallback } from 'react'; 
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './EquipmentPage.module.scss';
import { equipmentApi } from '../../api/equipmentApi'; 
import { postApi } from '../../api/postApi'; 
import EquipmentDetailsCard from './components/EquipmentDetailsCard/EquipmentDetailsCard';
import RelatedPostsSection from './components/RelatedPostsSection/RelatedPostsSection';

const EquipmentPage = () => {
    const { equipmentId } = useParams(); 
    const [equipmentDetails, setEquipmentDetails] = useState(null);
    const [equipmentPosts, setEquipmentPosts] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [postsLoading, setPostsLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [postsError, setPostsError] = useState(null); 

    const fetchEquipmentDetails = useCallback(async () => {
        if (!equipmentId) {
            setError('No equipment ID provided.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await equipmentApi.getEquipmentById(equipmentId);
            setEquipmentDetails(data);
        } catch (err) {
            console.error("Error fetching equipment details:", err);
            setError(err.message || "Failed to load equipment details. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [equipmentId]);

    const fetchEquipmentPosts = useCallback(async () => {
        if (!equipmentId) {
            setPostsError('No equipment ID provided for posts.');
            return;
        }

        setPostsLoading(true);
        setPostsError(null);
        try {
            const posts = await postApi.getPostsByEquipmentId(equipmentId);
            setEquipmentPosts(posts);
        } catch (err) {
            console.error("Error fetching posts for equipment:", err);
            setPostsError(err.message || "Failed to load related posts. Please try again.");
        } finally {
            setPostsLoading(false);
        }
    }, [equipmentId]);

    useEffect(() => {
        fetchEquipmentDetails();
        fetchEquipmentPosts();
    }, [equipmentId, fetchEquipmentDetails, fetchEquipmentPosts]); 

    const handlePostsRetry = () => {
        fetchEquipmentPosts(); 
    };

    if (loading) {
        return (
            <div className={styles['loading-state']}>
                <div className={styles.spinner}></div>
                <p>Loading equipment details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles['error-state']}>
                <p className={styles['error-message']}>{error}</p>
                <button onClick={() => window.location.reload()} className={styles['retry-button']}>Retry</button>
            </div>
        );
    }

    if (!equipmentDetails) {
        return (
            <div className={styles['no-details']}>
                <p>Equipment not found.</p>
            </div>
        );
    }

    return (
        <motion.div
            className={styles['equipment-page']}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className={styles['page-title']}>{equipmentDetails.name}</h1>
            
            <EquipmentDetailsCard equipmentDetails={equipmentDetails} />

            <RelatedPostsSection 
                posts={equipmentPosts} 
                loading={postsLoading} 
                error={postsError} 
                onRetry={handlePostsRetry} 
            />
        </motion.div>
    );
};

export default EquipmentPage;
