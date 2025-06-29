import apiClient from './index'; 

export const searchApi = {
    globalSearch: async (searchTerm) => {
        try {
            const response = await apiClient.get(`/Search?searchTerm=${encodeURIComponent(searchTerm)}`);
            return response.data;
        } catch (error) {
            console.error('Error during global search:', error.response?.data || error.message);
            throw new Error(error.response?.data?.error || 'Failed to perform search.');
        }
    },
};
