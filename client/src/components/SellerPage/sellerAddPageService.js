import api from "../../services/axios";

export const getCategories = async () => {
    try {
        const response = await api.get('/categories');
        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }
        
        return []; 
    } catch (error) {
        console.error("Error fetching categories:", error);
        return []; 
    }
};