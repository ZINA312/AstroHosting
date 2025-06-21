import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import HomePage from './pages/HomePage';
import './App.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserProfilePage from './pages/UserProfilePage';
import PostPage from './pages/PostPage';
import PostUploadPage from './pages/PostUploadPage';
import RecentPostsPage from './pages/RecentPostsPage';
import PopularUsersPage from './pages/PopularUsersPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="/login" element={<MainLayout />}>
          <Route index element={<LoginPage />} />
        </Route>
        <Route path="/register" element={<MainLayout />}>
          <Route index element={<RegisterPage />} />
        </Route>
        <Route path="/user/:userId" element={<MainLayout />}>
          <Route index element={<UserProfilePage />} />
        </Route>
        <Route path="/post/:postId" element={<MainLayout />}>
          <Route index element={<PostPage />} />
        </Route>
        <Route path="/post-upload" element={<MainLayout />}>
          <Route index element={<PostUploadPage />} />
        </Route>
        <Route path="/recent-posts" element={<MainLayout />}>
          <Route index element={<RecentPostsPage />} />
        </Route>
        <Route path="/popular-users" element={<MainLayout />}>
          <Route index element={<PopularUsersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
