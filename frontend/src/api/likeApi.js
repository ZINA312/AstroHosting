import apiClient from './index'; 

export const likeApi = {
    createLike: async (postId) => {
        try {
            const payload = { 
                postId: postId 
            };
            const response = await apiClient.post('/Like', payload);
            return response.data;
        } catch (error) {
            console.error('Error creating like:', error.response?.data || error.message);
            if (error.response?.status === 400 && error.response.data.error && error.response.data.error.includes("already liked")) {
                throw new Error(error.response.data.error);
            }
            if (error.response?.status === 404) {
                throw new Error(error.response.data.error || 'Post not found.');
            }
            if (error.response?.status === 401) {
                throw new Error('Authentication required to like a post.');
            }
            if (error.response?.status === 400 && error.response.data.errors) {
                throw new Error(JSON.stringify(error.response.data));
            }
            throw new Error('Failed to like post.');
        }
    },

    deleteLike: async (postId) => {
        try {
            await apiClient.delete(`/Like/post/${postId}`);
            return;
        } catch (error) {
            console.error(`Error deleting like for post ${postId}:`, error.response?.data || error.message);
            if (error.response?.status === 404) {
                throw new Error(error.response.data.error || 'Like not found for this post.');
            }
            if (error.response?.status === 401) {
                throw new Error('Authentication required to unlike a post.');
            }
            throw new Error('Failed to unlike post.');
        }
    },

    
    
    
    
    
    
    
    
    
    
    
};
