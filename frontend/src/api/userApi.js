import apiClient from './index'; 

export const userApi = {
    login: async (authData) => {
        try {
            const response = await apiClient.post('/User/login', authData, { withCredentials: true });
            return response.data; 
        } catch (error) {
            console.error('Error during login:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                throw new Error(error.response.data.error || 'Invalid login credentials.');
            }
            throw new Error('Failed to log in. Please try again.');
        }
    },

    register: async (registerData) => { 
        try {
            const response = await apiClient.post('/User/register', registerData);
            return response.data; 
        } catch (error) {
            console.error('Error during registration:', error.response?.data || error.message);
            if (error.response?.status === 409) { 
                throw new Error(error.response.data.error || 'User with this login already exists.');
            }
            if (error.response?.status === 400 && error.response.data.errors) {
                throw new Error(JSON.stringify(error.response.data));
            }
            if (error.response?.status === 400) {
                 throw new Error(error.response.data.error || 'Invalid data for registration.');
            }
            throw new Error('Failed to register. Please try again.');
        }
    },

    refreshTokens: async () => {
        try {
            const response = await apiClient.post('/User/refresh', {}, { withCredentials: true });
            return response.data; 
        } catch (error) {
            console.error('Error during token refresh:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                throw new Error(error.response.data.error || 'Authentication required or invalid tokens.');
            }
            throw new Error('Failed to refresh tokens. Please log in again.');
        }
    },

    getUserProfile: async (id) => {
        try {
            const response = await apiClient.get(`/User/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching user profile for ID ${id}:`, error.response?.data || error.message);
            if (error.response?.status === 404) { 
                throw new Error(error.response.data.error || 'User not found.');
            }
            throw new Error('Failed to retrieve user profile.');
        }
    },

    getSelfProfile: async () => {
        try {
            const response = await apiClient.get('/User/my-profile');
            return response.data;
        } catch (error) {
            console.error('Error fetching current user profile:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                throw new Error('Authentication required to view your profile.');
            }
            throw new Error('Failed to retrieve your profile.');
        }
    },

    getAllUsers: async () => {
            try {
                const response = await apiClient.get('/User/all'); 
                return response.data;
            } catch (error) {
                console.error('Error fetching all users:', error.response?.data || error.message);
                throw new Error('Failed to retrieve user list.');
            }
        },
    
    getPopularUsers: async () => {
            try {
                const response = await apiClient.get('/User/popular'); 
                return response.data;
            } catch (error) {
                console.error('Error fetching popular users:', error.response?.data || error.message);
                throw new Error('Failed to retrieve user list.');
            }
        },

    updateUserProfile: async (updateData) => {
        try {
            const formData = new FormData();
            
            
            
            if (updateData.username !== undefined) {
                formData.append('username', updateData.username);
            }
            
            if (updateData.email !== undefined) {
                formData.append('email', updateData.email);
            }
            if (updateData.bio !== undefined) {
                formData.append('bio', updateData.bio);
            }
            
            if (updateData.newAvatarFile) { 
                formData.append('NewAvatarFile', updateData.newAvatarFile); 
            }
            if (updateData.removeAvatar) { 
                formData.append('removeAvatar', 'true');
            }

            
            await apiClient.put('/User/my-profile', formData, { 
                headers: {
                    'Content-Type': 'multipart/form-data', 
                },
                withCredentials: true, 
            });
            return;
        } catch (error) {
            console.error('Error updating user profile:', error.response?.data || error.message);
            if (error.response?.status === 404) { 
                throw new Error(error.response.data.error || 'User not found.');
            }
            if (error.response?.status === 400 && error.response.data.errors) {
                throw new Error(JSON.stringify(error.response.data));
            }
            if (error.response?.status === 401) {
                throw new Error('Authentication required to update your profile.');
            }
            throw new Error('Failed to update user profile.');
        }
    },

    deleteMyAccount: async () => {
        try {
            await apiClient.delete('/User/my-account', { withCredentials: true });
            return;
        } catch (error) {
            console.error('Error deleting user account:', error.response?.data || error.message);
            if (error.response?.status === 404) { 
                throw new Error(error.response.data.error || 'User account not found.');
            }
            if (error.response?.status === 401) {
                throw new Error('Authentication required to delete your account.');
            }
            throw new Error('Failed to delete user account.');
        }
    },
};
