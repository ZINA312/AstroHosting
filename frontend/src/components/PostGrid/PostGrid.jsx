import { useState } from 'react';
import PostCard from '../PostCard/PostCard'; 
import styles from './PostGrid.module.scss';

const PostGrid = ({ posts }) => {
  const [hoveredPost, setHoveredPost] = useState(null);

  return (
    <div className={styles['photos-grid']}>
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          isHovered={hoveredPost === post.id}
          onHoverStart={() => setHoveredPost(post.id)}
          onHoverEnd={() => setHoveredPost(null)}
        />
      ))}
    </div>
  );
};

export default PostGrid;