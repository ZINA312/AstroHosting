import FeaturedSlider from './components/FeaturedSlider/FeaturedSlider';
import PopularGrid from './components/PopularGrid/PopularGrid';
import styles from './HomePage.module.scss'; 

const HomePage = () => {
  const featuredPosts = [
    {
      id: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
      title: "Andromeda Galaxy",
      description: "The Andromeda Galaxy is a barred spiral galaxy and the nearest major galaxy to the Milky Way.",
      imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      author: {
        id: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
        username: "SpaceExplorer42",
        avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      dateCreated: "2023-05-15T08:30:00Z",
      likesCount: 142,
      commentsCount: 28
    },
    {
      id: "2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
      title: "Orion Nebula",
      description: "The Orion Nebula is a diffuse nebula situated in the Milky Way, south of Orion's Belt.",
      imageUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      author: {
        id: "b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7",
        username: "CosmicPhotographer",
        avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      dateCreated: "2023-07-22T14:45:00Z",
      likesCount: 98,
      commentsCount: 17
    },
    {
      id: "3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r",
      title: "Milky Way Core",
      description: "The galactic core of the Milky Way as seen from a dark sky reserve.",
      imageUrl: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      author: {
        id: "c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8",
        username: "AstroAdventurer",
        avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg"
      },
      dateCreated: "2023-08-03T22:15:00Z",
      likesCount: 87,
      commentsCount: 14
    }
  ];

  const popularPosts = [
    {
      id: "4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s",
      title: "Lunar Eclipse",
      description: "Total lunar eclipse captured with a telephoto lens",
      imageUrl: "https://images.unsplash.com/photo-1532944706581-e4f394ab26c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      author: {
        id: "d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9",
        username: "MoonWatcher",
        avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg"
      },
      dateCreated: "2023-04-12T03:20:00Z",
      likesCount: 124,
      commentsCount: 19
    },
    {
      id: "5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t",
      title: "Jupiter and Moons",
      description: "Jupiter with its Galilean moons visible",
      imageUrl: "https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      author: {
        id: "e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0",
        username: "PlanetObserver",
        avatarUrl: "https://randomuser.me/api/portraits/women/33.jpg"
      },
      dateCreated: "2023-06-05T21:10:00Z",
      likesCount: 89,
      commentsCount: 12
    },
    {
      id: "6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u",
      title: "Saturn's Rings",
      description: "Detailed view of Saturn's ring system",
      imageUrl: "https://images.unsplash.com/photo-1614314107760-980b95d1fa0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      author: {
        id: "f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1",
        username: "RingMaster",
        avatarUrl: "https://randomuser.me/api/portraits/men/55.jpg"
      },
      dateCreated: "2023-07-19T23:45:00Z",
      likesCount: 76,
      commentsCount: 11
    },
    {
      id: "7g8h9i0j-1k2l-3m4n-5o6p-7q8r9s0t1u2v",
      title: "Mars Opposition",
      description: "Mars during its closest approach to Earth",
      imageUrl: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      author: {
        id: "g7h8i9j0-k1l2-m3n4-o5p6-q7r8s9t0u1v2",
        username: "RedPlanetFan",
        avatarUrl: "https://randomuser.me/api/portraits/women/66.jpg"
      },
      dateCreated: "2023-09-03T04:30:00Z",
      likesCount: 68,
      commentsCount: 9
    },
    {
      id: "8h9i0j1k-2l3m-4n5o-6p7q-8r9s0t1u2v3w",
      title: "Venus Crescent",
      description: "Crescent phase of Venus captured before dawn",
      imageUrl: "https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      author: {
        id: "h8i9j0k1-l2m3-n4o5-p6q7-r8s9t0u1v2w3",
        username: "MorningStar",
        avatarUrl: "https://randomuser.me/api/portraits/men/77.jpg"
      },
      dateCreated: "2023-05-08T05:15:00Z",
      likesCount: 57,
      commentsCount: 8
    },
    {
      id: "9i0j1k2l-3m4n-5o6p-7q8r-9s0t1u2v3w4x",
      title: "Comet NEOWISE",
      description: "Comet NEOWISE passing near Earth in 2020",
      imageUrl: "https://images.unsplash.com/photo-1596524430615-b46475bff3aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      author: {
        id: "i9j0k1l2-m3n4-o5p6-q7r8-s9t0u1v2w3x4",
        username: "CometHunter",
        avatarUrl: "https://randomuser.me/api/portraits/women/88.jpg"
      },
      dateCreated: "2023-07-20T02:40:00Z",
      likesCount: 63,
      commentsCount: 10
    }
  ];

  return (
    <div className={styles['home-page']}>
      <section className={styles['featured-section']}>
        <h2 className={styles['section-title']}>Featured Astrophotos</h2>
        <FeaturedSlider posts={featuredPosts} />
      </section>

      <section className={styles['popular-section']}>
        <h2 className={styles['section-title']}>Popular Photos</h2>
        <PopularGrid posts={popularPosts} />
      </section>
    </div>
  );
};

export default HomePage;