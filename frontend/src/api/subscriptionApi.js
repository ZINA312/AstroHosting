import apiClient from './index'; 

export const subscriptionApi = {
    createSubscription: async (targetUserId) => {
        try {
            const response = await apiClient.post('/Subscription', { targetUserId }); 
            return response.data;
        } catch (error) {
            console.error('Error creating subscription:', error.response?.data || error.message);
            if (error.response?.status === 404) {
                throw new Error(error.response.data.error || 'Target user not found.');
            }
            if (error.response?.status === 400 && error.response.data.error && error.response.data.error.includes("already subscribed")) {
                 throw new Error(error.response.data.error);
            }
            if (error.response?.status === 400 && error.response.data.errors) { 
                 throw new Error(JSON.stringify(error.response.data));
            }
            if (error.response?.status === 400) {
                 throw new Error(error.response.data.error || 'Invalid request for subscription creation.');
            }
            if (error.response?.status === 401) {
                throw new Error('Authentication required to create a subscription.');
            }
            throw new Error('Failed to create subscription.');
        }
    },

    deleteSubscription: async (targetUserId) => {
        try {
            await apiClient.delete(`/Subscription/target/${targetUserId}`);
            return;
        } catch (error) {
            console.error(`Error deleting subscription for target user ${targetUserId}:`, error.response?.data || error.message);
            if (error.response?.status === 404) {
                throw new Error(error.response.data.error || 'Subscription not found for this user.');
            }
            if (error.response?.status === 403) {
                throw new Error('You do not have permission to delete this subscription.');
            }
            if (error.response?.status === 401) {
                throw new Error('Authentication required to delete a subscription.');
            }
            throw new Error('Failed to delete subscription.');
        }
    },

    getSubscriptionById: async (id) => {
        try {
            const response = await apiClient.get(`/Subscription/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching subscription with ID ${id}:`, error.response?.data || error.message);
            if (error.response?.status === 404) {
                throw new Error(error.response.data.error || 'Subscription not found.');
            }
            throw new Error('Failed to retrieve subscription.');
        }
    },

    getMyFollowing: async () => {
        try {
            const response = await apiClient.get('/Subscription/my-following');
            return response.data;
        } catch (error) {
            console.error('Error fetching my following list:', error.response?.data || error.message);
            if (error.response?.status === 404) { 
                throw new Error(error.response.data.error || 'User not found or no following subscriptions.');
            }
            if (error.response?.status === 401) {
                throw new Error('Authentication required to view your following list.');
            }
            throw new Error('Failed to retrieve your following list.');
        }
    },

    getFollowingForUser: async (userId) => { 
        try {
            const response = await apiClient.get(`/Subscription/following/${userId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching following list for user ${userId}:`, error.response?.data || error.message);
            if (error.response?.status === 404) {
                throw new Error(error.response.data.error || 'User not found when fetching following list.');
            }
            throw new Error('Failed to retrieve following list.');
        }
    },

    getFollowersForUser: async (targetUserId) => {
        try {
            const response = await apiClient.get(`/Subscription/followers/${targetUserId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching followers for user ${targetUserId}:`, error.response?.data || error.message);
            if (error.response?.status === 404) {
                throw new Error(error.response.data.error || 'User not found when fetching followers.');
            }
            throw new Error('Failed to retrieve followers list.');
        }
    },

    isSubscribed: async (targetUserId) => {
        try {
            const response = await apiClient.get(`/Subscription/is-subscribed/${targetUserId}`);
            return response.data; 
        } catch (error) {
            console.error(`Error checking subscription status for target user ${targetUserId}:`, error.response?.data || error.message);
            if (error.response?.status === 401) {
                throw new Error('Authentication required to check subscription status.');
            }
            if (error.response?.status === 404) {
                throw new Error(error.response.data.error || 'User not found when checking subscription status.');
            }
            throw new Error('Failed to check subscription status.');
        }
    },
};
