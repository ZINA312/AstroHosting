import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import HomePage from './pages/HomePage/HomePage';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/Auth/LoginPage/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage/RegisterPage';

import UserProfilePage from './pages/UserProfilePage/UserProfilePage';
import PostPage from './pages/PostPage/PostPage';
import PostUploadPage from './pages/PostUploadPage/PostUploadPage';
import RecentPostsPage from './pages/RecentPostsPage/RecentPostsPage';
import PopularUsersPage from './pages/PopularUsers/PopularUsersPage';
import SearchResultPage from './pages/SearchResultPage/SearchResultPage'
import EquipmentPage from './pages/EquipmentPage/EquipmentPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
          <Route path="/search" element={<MainLayout />}>
            <Route index element={<SearchResultPage />} />
          </Route>
          <Route path="/equipment/:equipmentId" element={<MainLayout />}>
            <Route index element={<EquipmentPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
