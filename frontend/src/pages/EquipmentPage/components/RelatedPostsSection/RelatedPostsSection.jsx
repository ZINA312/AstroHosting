import styles from './RelatedPostsSection.module.scss';
import PostsGrid from '../../../../components/PostGrid/PostGrid'; 

const RelatedPostsSection = ({ posts, loading, error, onRetry }) => {
    return (
        <section className={styles['related-posts-section']}>
            <h2 className={styles['section-title']}>Photos Made With This Equipment</h2>
            {loading ? (
                <div className={styles['loading-posts-state']}>
                    <div className={styles.spinner}></div>
                    <p>Loading photos...</p>
                </div>
            ) : error ? (
                <div className={styles['error-posts-state']}>
                    <p className={styles['error-message']}>{error}</p>
                    <button onClick={onRetry} className={styles['retry-button']}>Retry</button>
                </div>
            ) : posts.length > 0 ? (
                <PostsGrid posts={posts} />
            ) : (
                <div className={styles['no-posts-found']}>
                    <p>No photos found made with this equipment yet.</p>
                </div>
            )}
        </section>
    );
};

export default RelatedPostsSection;
