import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './EquipmentPage.module.scss';
import { equipmentApi } from '../../api/equipmentApi'; 
import { postApi } from '../../api/postApi'; 
import PostCard from '../HomePage/components/PostCard/PostCard'; 

const EquipmentPage = () => {
    const { equipmentId } = useParams(); 
    const [equipmentDetails, setEquipmentDetails] = useState(null);
    const [equipmentPosts, setEquipmentPosts] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [postsError, setPostsError] = useState(null); 

    
    const equipmentTypeMap = {
        0: 'Camera',
        1: 'Lens',
        2: 'Coma Corrector',
        3: 'Flattener',
        4: 'Mount',
        5: 'Tripod',
        6: 'Focuser',
        7: 'Guide Scope',
        8: 'Guide Camera',
        9: 'Filter',
        10: 'Accessory',
        
    };

    useEffect(() => {
        const fetchEquipmentAndPosts = async () => {
            if (!equipmentId) {
                setLoading(false);
                setError('No equipment ID provided.');
                return;
            }

            setLoading(true);
            setPostsLoading(true); 
            setError(null);
            setPostsError(null); 

            try {
                
                const data = await equipmentApi.getEquipmentById(equipmentId);
                setEquipmentDetails(data);
            } catch (err) {
                console.error("Error fetching equipment details:", err);
                setError(err.message || "Failed to load equipment details. Please try again.");
            } finally {
                setLoading(false);
            }

            try {
                const posts = await postApi.getPostsByEquipmentId(equipmentId);
                setEquipmentPosts(posts);
            } catch (err) {
                console.error("Error fetching posts for equipment:", err);
                setPostsError(err.message || "Failed to load related posts. Please try again.");
            } finally {
                setPostsLoading(false);
            }
        };

        fetchEquipmentAndPosts();
    }, [equipmentId]); 

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
            <div className={styles['equipment-details-card']}>
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
                        <p className={styles['detail-value']}>{equipmentDetails.description}</p>
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
            </div>

            <section className={styles['related-posts-section']}>
                <h2 className={styles['section-title']}>Photos Made With This Equipment</h2>
                {postsLoading ? (
                    <div className={styles['loading-posts-state']}>
                        <div className={styles.spinner}></div>
                        <p>Loading photos...</p>
                    </div>
                ) : postsError ? (
                    <div className={styles['error-posts-state']}>
                        <p className={styles['error-message']}>{postsError}</p>
                        <button onClick={() => window.location.reload()} className={styles['retry-button']}>Retry</button>
                    </div>
                ) : equipmentPosts.length > 0 ? (
                    <div className={styles['posts-grid']}>
                        {equipmentPosts.map(post => (
                            <PostCard key={post.id} post={post} isFeatured={false} onHoverStart={() => {}} onHoverEnd={() => {}} />
                        ))}
                    </div>
                ) : (
                    <div className={styles['no-posts-found']}>
                        <p>No photos found made with this equipment yet.</p>
                    </div>
                )}
            </section>
        </motion.div>
    );
};

export default EquipmentPage;
