import apiClient from './index'; 

export const equipmentApi = {
    getAllEquipment: async () => {
        try {
            const response = await apiClient.get('/Equipment');
            return response.data;
        } catch (error) {
            console.error('Error fetching all equipment:', error.response?.data || error.message);
            throw new Error('Failed to retrieve all equipment.');
        }
    },

    getEquipmentById: async (id) => {
        try {
            const response = await apiClient.get(`/Equipment/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching equipment with ID ${id}:`, error.response?.data || error.message);
            if (error.response?.status === 404) {
                throw new Error(error.response.data.error || 'Equipment not found.');
            }
            throw new Error('Failed to retrieve equipment.');
        }
    },

    createEquipment: async (createData) => {
        try {
            const response = await apiClient.post('/Equipment', createData);
            return response.data;
        } catch (error) {
            console.error('Error creating equipment:', error.response?.data || error.message);
            if (error.response?.status === 400 && error.response.data.errors) {
                throw new Error(JSON.stringify(error.response.data));
            }
            if (error.response?.status === 401) {
                throw new Error('Authentication required to create equipment.');
            }
            throw new Error('Failed to create equipment.');
        }
    },

};
