import apiClient from './index'; 

export const commentApi = {
    getCommentsForPost: async (postId) => {
        try {
            const response = await apiClient.get(`/Comment/post/${postId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching comments for post ${postId}:`, error.response?.data || error.message);
            if (error.response?.status === 404) {
                throw new Error(error.response.data.error || 'Post not found or no comments exist.');
            }
            throw new Error('Failed to retrieve comments.');
        }
    },

    createComment: async (createData) => {
        try {
            const response = await apiClient.post('/Comment', createData);
            return response.data;
        } catch (error) {
            console.error('Error creating comment:', error.response?.data || error.message);
            if (error.response?.status === 400 && error.response.data.errors) {
                throw new Error(JSON.stringify(error.response.data));
            }
            if (error.response?.status === 400) {
                throw new Error(error.response.data.error || 'Invalid data for comment creation.');
            }
            if (error.response?.status === 401) {
                throw new Error('Authentication required to create a comment.');
            }
            throw new Error('Failed to create comment.');
        }
    },

    updateComment: async (commentId, updateData) => {
        try {
            await apiClient.put(`/Comment/${commentId}`, updateData);
            return;
        } catch (error) {
            console.error(`Error updating comment ${commentId}:`, error.response?.data || error.message);
            if (error.response?.status === 404) {
                throw new Error(error.response.data.error || 'Comment not found.');
            }
            if (error.response?.status === 403) {
                throw new Error('You do not have permission to update this comment.');
            }
            if (error.response?.status === 400 && error.response.data.errors) {
                throw new Error(JSON.stringify(error.response.data));
            }
            if (error.response?.status === 401) {
                throw new Error('Authentication required to update a comment.');
            }
            throw new Error('Failed to update comment.');
        }
    },

    deleteComment: async (commentId) => {
        try {
            await apiClient.delete(`/Comment/${commentId}`);
            return;
        } catch (error) {
            console.error(`Error deleting comment ${commentId}:`, error.response?.data || error.message);
            if (error.response?.status === 404) {
                throw new Error(error.response.data.error || 'Comment not found.');
            }
            if (error.response?.status === 403) {
                throw new Error('You do not have permission to delete this comment.');
            }
            if (error.response?.status === 401) {
                throw new Error('Authentication required to delete a comment.');
            }
            throw new Error('Failed to delete comment.');
        }
    }
};
