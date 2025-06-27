import { useState } from 'react';
import Slider from 'react-slick';
import PostCard from '../PostCard/PostCard'; 
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './FeaturedSlider.module.scss'; 

const FeaturedSlider = ({ posts }) => {
  const [hoveredFeatured, setHoveredFeatured] = useState(null);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 7000,
    pauseOnHover: true,
    arrows: true,
    fade: true,
    cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
  };

  return (
    <div className={styles['slider-container']}>
      <Slider {...sliderSettings}>
        {posts.map(post => (
          <div key={post.id} className={styles['featured-slide']}>
            <PostCard
              post={post}
              isFeatured={true}
              isHovered={hoveredFeatured === post.id}
              onHoverStart={() => setHoveredFeatured(post.id)}
              onHoverEnd={() => setHoveredFeatured(null)}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FeaturedSlider;