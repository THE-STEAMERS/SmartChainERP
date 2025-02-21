export interface StockItem {
    productName: string;
    stock: string;
    available: number;
    sold: number;
    category: string;
    demanded: number;
    lastUpdated: string;
  }
  
  export const stockData: StockItem[] = [
    { 
      productName: "iPhone 13",
      stock: "Electronics", 
      available: 150, 
      sold: 50, 
      category: "tech", 
      demanded: 200, 
      lastUpdated: "2024-02-12T10:30:00" 
    },
    { 
      productName: "Plastic Containers",
      stock: "Plastics", 
      available: 300, 
      sold: 120, 
      category: "materials", 
      demanded: 350, 
      lastUpdated: "2024-02-12T09:15:00" 
    },
    { 
      productName: "Coffee Maker",
      stock: "Household", 
      available: 200, 
      sold: 75, 
      category: "home", 
      demanded: 180, 
      lastUpdated: "2024-02-12T11:45:00" 
    },
    { 
      productName: "Car Battery",
      stock: "Automotive", 
      available: 100, 
      sold: 25, 
      category: "vehicles", 
      demanded: 150, 
      lastUpdated: "2024-02-11T16:20:00" 
    },
    { 
      productName: "Power Tools",
      stock: "Industrial", 
      available: 250, 
      sold: 90, 
      category: "manufacturing", 
      demanded: 280, 
      lastUpdated: "2024-02-12T08:00:00" 
    },
    { 
      productName: "Gaming Console",
      stock: "Electronics", 
      available: 75, 
      sold: 45, 
      category: "tech", 
      demanded: 200, 
      lastUpdated: "2024-02-12T07:30:00" 
    },
    { 
      productName: "Smart Watch",
      stock: "Electronics", 
      available: 80, 
      sold: 60, 
      category: "tech", 
      demanded: 150, 
      lastUpdated: "2024-02-12T06:45:00" 
    }
  ];
  
  export const categoryData = [
    { name: "Electronics", value: 150, fill: "#0088FE" },
    { name: "Plastics", value: 300, fill: "#00C49F" },
    { name: "Household", value: 200, fill: "#FFBB28" },
    { name: "Automotive", value: 100, fill: "#FF8042" },
    { name: "Industrial", value: 250, fill: "#8884d8" }
  ];