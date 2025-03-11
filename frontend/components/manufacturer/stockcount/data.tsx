import { useState, useEffect } from "react";

const BASE_URL = "http://127.0.0.1:8000/api";

export interface StockItem {
  productName: string;
  category: number;
  available: number;
  sold: number;
  demanded: number;
}

export interface CategoryItem {
  category_id: number;
  name: string;
  product_count: number;
  fill: string;
}

const getAccessToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${BASE_URL}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      console.error("Failed to refresh token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      return null;
    }

    const data = await response.json();
    if (data.access) {
      localStorage.setItem("access_token", data.access);
      return data.access;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
  }

  return null;
};

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  let accessToken = getAccessToken();

  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    console.warn("Access token expired, attempting to refresh...");
    const newAccessToken = await refreshAccessToken();

    if (newAccessToken) {
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
    }
  }

  return response;
};

export const useStockData = () => {
  const [stockData, setStockData] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetchWithAuth(`${BASE_URL}/stock/`);
        if (!response.ok) throw new Error("Failed to fetch stock data");

        const data = await response.json();
        console.log("Fetched stock data:", data);

        const formattedData = Array.isArray(data)
          ? data.map((item) => ({
              productName: item.name || "Unknown",
              category: item.category || 0,
              available: item.available_quantity || 0,
              sold: item.total_shipped || 0,
              demanded: item.total_required_quantity || 0,
            }))
          : [];

        setStockData((prevStockData) =>
          JSON.stringify(prevStockData) === JSON.stringify(formattedData)
            ? prevStockData
            : formattedData
        );

        setError(null);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setError("Failed to load stock data");
      } finally {
        setLoading(false);
      }
    };

    fetchStockData(); // Initial fetch
    const interval = setInterval(fetchStockData, 5000); // Polling every 5 sec

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return { stockData, loading, error };
};

export const useCategoryData = () => {
  const [categoryData, setCategoryData] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await fetchWithAuth(`${BASE_URL}/category-stock/`);
        if (!response.ok) throw new Error("Failed to fetch category data");

        const result = await response.json();
        console.log("Fetched category data:", result);

        const data = result.data || [];

        const formattedData: CategoryItem[] = data.map(
          (
            category: {
              category_id: number;
              name: string;
              product_count: number;
            },
            index: number
          ) => ({
            category_id: category.category_id,
            name: category.name,
            product_count: category.product_count,
            fill: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28AFF"][
              index % 5
            ],
          })
        );

        setCategoryData((prevCategoryData) =>
          JSON.stringify(prevCategoryData) === JSON.stringify(formattedData)
            ? prevCategoryData
            : formattedData
        );

        setError(null);
      } catch (error) {
        console.error("Error fetching category data:", error);
        setError("Failed to load category data");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData(); // Initial fetch
    const interval = setInterval(fetchCategoryData, 5000); // Polling every 5 sec

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return { categoryData, loading, error };
};