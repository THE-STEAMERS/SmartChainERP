import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Change this to your backend URL

export const fetchStocks = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/stocks`);
        return response.data;
    } catch (error) {
        console.error("Error fetching stocks:", error);
        return [];
    }
};

export const addStock = async (stock: { name: string; category: string; available: number }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/stocks`, stock, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error("Error adding stock:", error);
    }
};
