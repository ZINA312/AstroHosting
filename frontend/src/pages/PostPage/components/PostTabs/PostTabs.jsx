import styles from './PostTabs.module.scss';

const PostTabs = ({ activeTab, setActiveTab, likesCount, commentsCount }) => {
  return (
    <div className={styles['post-tabs']}>
      <button
        className={`${styles['tab-item']} ${activeTab === 'equipment' ? styles.active : ''}`}
        onClick={() => setActiveTab('equipment')}
      >
        Equipment Used
      </button>
      <button
        className={`${styles['tab-item']} ${activeTab === 'likes' ? styles.active : ''}`}
        onClick={() => setActiveTab('likes')}
      >
        Liked By ({likesCount})
      </button>
      <button
        className={`${styles['tab-item']} ${activeTab === 'comments' ? styles.active : ''}`}
        onClick={() => setActiveTab('comments')}
      >
        Comments ({commentsCount})
      </button>
    </div>
  );
};

export default PostTabs;