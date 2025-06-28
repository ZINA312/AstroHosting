import apiClient from './index'; 

export const postApi = {
    getAllNonDeletedPosts: async () => {
        try {
            const response = await apiClient.get('/Post');
            return response.data;
        } catch (error) {
            console.error('Error fetching all non-deleted posts:', error.response?.data || error.message);
            throw new Error('Failed to retrieve all posts.');
        }
    },

    getMySoftDeletedPosts: async () => {
        try {
            const response = await apiClient.get('/Post/deleted');
            return response.data;
        } catch (error) {
            console.error('Error fetching my soft-deleted posts:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                throw new Error('Authentication required to view your deleted posts.');
            }
            throw new Error('Failed to retrieve your soft-deleted posts.');
        }
    },

    getPostsByAuthor: async (authorId) => {
        try {
            const response = await apiClient.get(`/Post/user/${authorId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching posts by author ${authorId}:`, error.response?.data || error.message);
            if (error.response?.status === 404) {
                throw new Error(error.response.data.error || 'Author not found or no posts exist.');
            }
            throw new Error('Failed to retrieve posts by author.');
        }
    },

    getPopularPosts: async (count = 10) => {
        try {
            const response = await apiClient.get(`/Post/popular?count=${count}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching popular posts:', error.response?.data || error.message);
            throw new Error('Failed to retrieve popular posts.');
        }
    },

    getPostDetailsById: async (id, includeDeleted = false) => {
        try {
            const response = await apiClient.get(`/Post/${id}?includeDeleted=${includeDeleted}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching post details for ID ${id}:`, error.response?.data || error.message);
            if (error.response?.status === 404) {
                throw new Error(error.response.data.error || 'Post not found.');
            }
            throw new Error('Failed to retrieve post details.');
        }
    },

    createPost: async (createData) => {
        try {
            const formData = new FormData();
            formData.append('title', createData.title);
            formData.append('content', createData.content);
            if (createData.imageFile) {
                formData.append('imageFile', createData.imageFile);
            }

            const response = await apiClient.post('/Post', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating post:', error.response?.data || error.message);
            if (error.response?.status === 400 && error.response.data.errors) {
                throw new Error(JSON.stringify(error.response.data));
            }
            if (error.response?.status === 400) {
                throw new Error(error.response.data.error || 'Invalid data for post creation.');
            }
            if (error.response?.status === 401) {
                throw new Error('Authentication required to create a post.');
            }
            throw new Error('Failed to create post.');
        }
    },

    updatePost: async (id, updateData) => {
        try {
            await apiClient.put(`/Post/${id}`, updateData);
            return; 
        } catch (error) {
            console.error(`Error updating post ${id}:`, error.response?.data || error.message);
            if (error.response?.status === 404) {
                throw new Error(error.response.data.error || 'Post not found.');
            }
            if (error.response?.status === 403) {
                throw new Error('You do not have permission to update this post.');
            }
            if (error.response?.status === 400 && error.response.data.errors) {
                throw new Error(JSON.stringify(error.response.data));
            }
            if (error.response?.status === 401) {
                throw new Error('Authentication required to update a post.');
            }
            throw new Error('Failed to update post.');
        }
    },

    softDeletePost: async (id) => {
        try {
            await apiClient.delete(`/Post/${id}`);
            return;
        } catch (error) {
            console.error(`Error soft-deleting post ${id}:`, error.response?.data || error.message);
            if (error.response?.status === 404) {
                throw new Error(error.response.data.error || 'Post not found.');
            }
            if (error.response?.status === 403) {
                throw new Error('You do not have permission to soft delete this post.');
            }
            if (error.response?.status === 400) { 
                 throw new Error(error.response.data.error || 'Invalid request for soft deletion.');
            }
            if (error.response?.status === 401) {
                throw new Error('Authentication required to soft delete a post.');
            }
            throw new Error('Failed to soft delete post.');
        }
    },

    hardDeletePost: async (id) => {
        try {
            await apiClient.delete(`/Post/hard/${id}`);
            return; 
        } catch (error) {
            console.error(`Error hard-deleting post ${id}:`, error.response?.data || error.message);
            if (error.response?.status === 404) {
                throw new Error(error.response.data.error || 'Post not found.');
            }
            if (error.response?.status === 403) {
                throw new Error('You do not have permission to permanently delete this post.');
            }
            if (error.response?.status === 401) {
                throw new Error('Authentication required to permanently delete a post.');
            }
            throw new Error('Failed to permanently delete post.');
        }
    },
};
