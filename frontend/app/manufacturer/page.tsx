"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import mqtt from "mqtt";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { DataTable } from "../../components/manufacturer/data-table";
import { columns } from "../../components/manufacturer/columns";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AlertCircle,
  BarChartIcon,
  ClockIcon,
  DollarSignIcon,
  ShoppingBagIcon,
  StoreIcon,
  TableIcon,
  TrendingUpIcon,
  TruckIcon,
  UsersIcon,
  WifiIcon,
  XIcon,
} from "lucide-react";

// Interfaces
interface OverviewCard {
  totalOrders: number;
  numStores: number;
  deliveryAgents: number;
  pendingOrders: number;
}

interface CountsResponse {
  orders_placed: number;
  pending_orders: number;
  employees_available: number;
  retailers_available: number;
}

interface AnalyticsData {
  dailyOrders: number;
  avgOrderValue: number;
  returningCustomers: number;
  conversionRate: number;
}

interface ReportData {
  monthlyRevenue: number;
  monthlyExpenses: number;
  profit: number;
  customerSatisfaction: number;
}

interface Notification {
  id: number;
  message: string;
  date: string;
}

interface Shipment {
  shipment_id: number;
  shipment_date: string;
  status: string;
  order: number;
  employee: number;
}

interface ShipmentResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Shipment[];
}

// Interface for anomaly notifications
interface AnomalyNotification {
  id: string;
  message: string;
  timestamp: Date;
}

// Hardcoded data for fallback
const testData: OverviewCard = {
  totalOrders: 0,
  numStores: 0,
  deliveryAgents: 0,
  pendingOrders: 0,
};

const analyticsData: AnalyticsData = {
  dailyOrders: 450,
  avgOrderValue: 35.75,
  returningCustomers: 320,
  conversionRate: 8.5,
};

const reportData: ReportData = {
  monthlyRevenue: 150000,
  monthlyExpenses: 85000,
  profit: 65000,
  customerSatisfaction: 92,
};

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

const notifications: Notification[] = [
  { id: 1, message: "New order placed: #12345", date: "2025-02-15" },
  { id: 2, message: "Low stock alert for Store #24", date: "2025-02-14" },
  {
    id: 3,
    message: "Delivery agent #12 completed order #67890",
    date: "2025-02-14",
  },
  { id: 4, message: "New customer feedback received", date: "2025-02-13" },
];

type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  {
    id: "489e1d4552",
    amount: 125,
    status: "success",
    email: "example@gmail.com",
  },
  {
    id: "489e1d432",
    amount: 125,
    status: "failed",
    email: "example@gmail.com",
  },
  {
    id: "489e1d422",
    amount: 125,
    status: "failed",
    email: "example@gmail.com",
  },
];

// API URL for fetching counts
const API_URL = "http://127.0.0.1:8000/api";

// MQTT Topics
const ANOMALY_TOPIC = "manufacturing/anomalies";
const RASPBERRY_PI_PRESENCE_TOPIC = "device/raspberry-pi/presence/raspberrypi";

const Dashboard: React.FC = () => {
  const [overviewData, setOverviewData] = useState<OverviewCard>(testData);
  const [analytics] = useState<AnalyticsData>(analyticsData);
  const [reports] = useState<ReportData>(reportData);
  const [notif] = useState<Notification[]>(notifications);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [shipmentsLoading, setShipmentsLoading] = useState<boolean>(true);
  const [shipmentsError, setShipmentsError] = useState<string | null>(null);
  const [allocateLoading, setAllocateLoading] = useState<boolean>(false);
  const [allocateError, setAllocateError] = useState<string | null>(null);
  const [mqttConnected, setMqttConnected] = useState<boolean>(false);
  const [raspberryPiConnected, setRaspberryPiConnected] = useState<boolean>(false);
  const [anomalyNotifications, setAnomalyNotifications] = useState<AnomalyNotification[]>([]);
  const lastRpiHeartbeatTime = useRef<number>(0);

  // Define columns for the shipment data table
  const shipmentColumns = [
    {
      accessorKey: "shipment_id",
      header: "ID",
    },
    {
      accessorKey: "order",
      header: "Order ID",
    },
    {
      accessorKey: "employee",
      header: "Employee ID",
    },
    {
      accessorKey: "shipment_date",
      header: "Date",
      cell: ({ row }: { row: any }) => {
        const dateValue = row.getValue("shipment_date");
        if (!dateValue) return "N/A";

        const date = new Date(dateValue);
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const status = row.getValue("status") as string;
        let statusClass = "";

        switch (status.toLowerCase()) {
          case "delivered":
            statusClass = "text-green-500";
            break;
          case "pending":
            statusClass = "text-yellow-500";
            break;
          case "processing":
            statusClass = "text-blue-500";
            break;
          default:
            statusClass = "text-gray-400";
        }

        return <span className={statusClass}>{status}</span>;
      },
    },
  ];

  // Function to add a new anomaly notification
  const addAnomalyNotification = useCallback(() => {
    const newNotification: AnomalyNotification = {
      id: Date.now().toString(),
      message: "Anomaly Detected",
      timestamp: new Date(),
    };

    setAnomalyNotifications((prev) => [newNotification, ...prev]);

    // Auto-hide the toast notification after 5 seconds
    setTimeout(() => {
      setAnomalyNotifications((prev) =>
        prev.filter((notification) => notification.id !== newNotification.id)
      );
    }, 5000);
  }, []);

  // Get auth token with error handling
  const getAuthToken = useCallback(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      refreshAccessToken();
    }
    return token;
  }, []);

  const getRefreshToken = () => localStorage.getItem("refresh_token");

  const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${API_URL}/token/refresh/`, {
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
    let token = await getAuthToken();
    if (!token) throw new Error("Authentication token not found. Please log in again.");

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      token = await refreshAccessToken();
      if (!token) throw new Error("Authentication token not found. Please log in again.");

      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    }

    return response;
  };

  // Fetch shipments data with improved error handling
  const fetchShipments = useCallback(async () => {
    try {
      setShipmentsLoading(true);
      const token = getAuthToken();

      const response = await fetchWithAuth("http://127.0.0.1:8000/api/shipments/");

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `Server responded with status ${response.status}`
        );
      }

      const data: ShipmentResponse = await response.json();
      setShipments(data.results || []);
      setShipmentsError(null);
    } catch (err) {
      console.error("Error fetching shipments:", err);
      setShipmentsError((err as Error).message);
    } finally {
      setShipmentsLoading(false);
    }
  }, [getAuthToken]);

  // Handle allocate orders with improved error handling and loading state
  const handleAllocateOrders = async () => {
    try {
      setAllocateLoading(true);
      setAllocateError(null);
      const token = getAuthToken();
      console.log(token);
      const response = await fetchWithAuth("http://127.0.0.1:8000/api/allocate-orders/", {
        method: "POST",
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error) {
          setAllocateError(errorData.error);
        } else {
          throw new Error(
            errorData.detail || `Server responded with status ${response.status}`
          );
        }
      } else {
        await Promise.all([fetchShipments(), fetchCounts()]);
        alert("Orders allocated successfully!");
      }
    } catch (err) {
      console.error("Error allocating orders:", err);
      if (!allocateError) {
        alert(`Failed to allocate orders: ${(err as Error).message}`);
      }
    } finally {
      setAllocateLoading(false);
    }
  };

  // Fetch count data with improved error handling
  const fetchCounts = useCallback(async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      const response = await fetchWithAuth(`${API_URL}/count`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `Server responded with status ${response.status}`
        );
      }

      const countsData: CountsResponse = await response.json();
      setOverviewData((prevData) => ({
        totalOrders: countsData.orders_placed,
        numStores: countsData.retailers_available,
        deliveryAgents: countsData.employees_available,
        pendingOrders: countsData.pending_orders,
      }));

      setError(null);
    } catch (err) {
      console.error("Error fetching counts:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [getAuthToken]);

  // Set up polling with cleanup
  useEffect(() => {
    fetchCounts();
    fetchShipments();

    const countsIntervalId = setInterval(fetchCounts, 5000);
    const shipmentsIntervalId = setInterval(fetchShipments, 30000);

    return () => {
      clearInterval(countsIntervalId);
      clearInterval(shipmentsIntervalId);
    };
  }, [fetchCounts, fetchShipments]);

  // MQTT connection setup
  useEffect(() => {
    console.log("Attempting to connect to MQTT broker...");
    setMqttConnected(false);
    setRaspberryPiConnected(false);
  
    const client = mqtt.connect("wss://broker.emqx.io:8084/mqtt", {
      clientId: `mqttjs_${Math.random().toString(16).substr(2, 8)}`,
      connectTimeout: 30000,
      reconnectPeriod: 5000,
    });
  
    client.on("connect", () => {
      console.log("MQTT connected successfully");
      setMqttConnected(true);
  
      // Subscribe to Raspberry Pi presence topic
      client.subscribe(RASPBERRY_PI_PRESENCE_TOPIC, { qos: 1 }, (err: Error | null) => {
        if (err) {
          console.error("Failed to subscribe to Raspberry Pi presence topic:", err);
        }
      });
  
      // Subscribe to anomaly topic
      client.subscribe(ANOMALY_TOPIC, { qos: 1 }, (err: Error | null) => {
        if (err) {
          console.error("Failed to subscribe to anomaly topic:", err);
        }
      });
    });
  
    client.on("message", (topic: string, message: Buffer) => {
      const messageStr = message.toString();
  
      if (topic === RASPBERRY_PI_PRESENCE_TOPIC) {
        console.log("Raspberry Pi presence detected:", messageStr);
        try {
          const payload = JSON.parse(messageStr);
          lastRpiHeartbeatTime.current = Date.now();
          setRaspberryPiConnected(payload.status === "online");
        } catch (err) {
          console.error("Failed to parse Raspberry Pi presence message:", err);
          setRaspberryPiConnected(false);
        }
        return;
      }
  
      if (topic === ANOMALY_TOPIC) {
        const payload = messageStr.trim().toLowerCase();
        console.log(`Received message on topic ${topic}: ${payload}`);
  
        if (payload === "anomaly detected: no qr code detected for over 10 seconds!") {
          console.log("Anomaly detected! Adding notification.");
          addAnomalyNotification();
        }
      }
    });
  
    client.on("error", (err: Error) => {
      console.error("MQTT connection error:", err);
      setMqttConnected(false);
      setRaspberryPiConnected(false);
    });
  
    client.on("close", () => {
      console.log("MQTT connection closed");
      setMqttConnected(false);
      setRaspberryPiConnected(false);
    });
  
    const rpiCheckTimer: NodeJS.Timeout = setInterval(() => {
      if (Date.now() - lastRpiHeartbeatTime.current > 30000) {
        if (raspberryPiConnected) {
          console.log("No recent heartbeat from Raspberry Pi, marking as disconnected");
          setRaspberryPiConnected(false);
        }
      }
    }, 10000);
  
    return () => {
      console.log("Cleaning up MQTT client");
      clearInterval(rpiCheckTimer);
      if (client) {
        client.unsubscribe(ANOMALY_TOPIC);
        client.unsubscribe(RASPBERRY_PI_PRESENCE_TOPIC);
        client.end(true);
      }
    };
  }, [addAnomalyNotification]);

  // Determine overall connection status
  const isFullyConnected = mqttConnected && raspberryPiConnected;

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-white p-6">
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-white px-3 py-2">Dashboard</h1>
        <div className="flex items-center gap-4">
          {/* Connection Status Icon */}
          {isFullyConnected ? (
            <div className="text-green-500 bg-green-900/20 p-2 rounded-full" title="Connected to Raspberry Pi and Backend">
              <WifiIcon className="w-5 h-5" />
            </div>
          ) : (
            <div className="text-red-500 bg-red-900/20 p-2 rounded-full" title="Disconnected">
              <WifiIcon className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>

      {/* Toast Notifications for Anomalies */}
      {anomalyNotifications.length > 0 && (
        <div className="fixed top-6 right-6 z-50 max-w-md">
          {anomalyNotifications.slice(0, 1).map((notification) => (
            <div
              key={notification.id}
              className="mb-2 p-4 rounded-lg shadow-lg flex items-start gap-3 animate-slideIn transition-all duration-300 bg-yellow-900/90 border border-yellow-700"
            >
              <AlertCircle className="w-5 h-5 mt-0.5 text-yellow-400" />
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{notification.message}</p>
                <p className="text-xs text-gray-300 mt-1">
                  {notification.timestamp.toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={() =>
                  setAnomalyNotifications((prev) =>
                    prev.filter((n) => n.id !== notification.id)
                  )
                }
                className="text-gray-300 hover:text-white"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Tabs defaultValue="Overview" className="w-full mb-6">
        <TabsList className="flex flex-wrap justify-center md:justify-evenly bg-gray-300 p-2 rounded-2xl shadow-lg w-full md:w-3/4 lg:w-1/2 mb-4 h-14 border border-gray-700">
          {["Overview", "Analytics", "Reports", "Notifications"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="px-5 py-2 text-black font-semibold text-sm rounded-xl md:px-6 transition-all duration-300
                data-[state=active]:bg-black data-[state=active]:text-white
                focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="Overview">
          {error && error.includes("Authentication") && (
            <div className="bg-red-900/30 border border-red-600 p-4 rounded-lg mb-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-500 text-lg">{error}</p>
            </div>
          )}

          {error && !error.includes("Authentication") && (
            <div className="bg-red-900/30 border border-red-600 p-4 rounded-lg mb-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-500 text-lg">Error: {error}</p>
            </div>
          )}

          <div className="h-screen flex flex-col gap-4 overflow-hidden p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-start">
              <Card className="shadow-lg rounded-xl px-4 pt-4 transition-all duration-300 hover:shadow-xl h-auto py-6 border border-gray-600">
                <h2 className="text-lg font-medium text-white mb-1 flex items-center gap-2">
                  <TrendingUpIcon className="w-5 h-5 text-green-400" /> Total Orders
                </h2>
                <p className="text-2xl font-bold text-white tracking-tight">
                  {overviewData.totalOrders}
                </p>
                <p className="text-gray-400 text-sm mt-0.5">
                  Total Number of Orders placed
                </p>
              </Card>

              <Card className="shadow-lg rounded-xl px-4 pt-4 transition-all duration-300 hover:shadow-xl h-auto py-6 border border-gray-600">
                <h2 className="text-lg font-medium text-white mb-1 flex items-center gap-2">
                  <StoreIcon className="w-5 h-5 text-white" /> Number of Stores
                </h2>
                <p className="text-2xl font-bold text-white tracking-tight">
                  {overviewData.numStores}
                </p>
                <p className="text-gray-400 text-sm mt-0.5">
                  Total operational stores in the region.
                </p>
              </Card>

              <Card className="shadow-lg rounded-xl px-4 pt-4 transition-all duration-300 hover:shadow-xl h-auto py-6 border border-gray-600">
                <h2 className="text-lg font-medium text-white mb-1 flex items-center gap-2">
                  <TruckIcon className="w-5 h-5 text-white" /> Delivery Agents
                </h2>
                <p className="text-2xl font-bold text-white tracking-tight">
                  {overviewData.deliveryAgents}
                </p>
                <p className="text-gray-400 text-sm mt-0.5">
                  Total active delivery personnel.
                </p>
              </Card>

              <Card className="shadow-lg rounded-xl px-4 pt-4 transition-all duration-300 hover:shadow-xl h-auto py-6 border border-gray-600">
                <h2 className="text-lg font-medium text-white mb-1 flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-white" /> Pending Orders
                </h2>
                <p className="text-2xl font-bold text-white tracking-tight">
                  {overviewData.pendingOrders}
                </p>
                <p className="text-gray-400 text-sm mt-0.5">
                  Total number of pending customer orders.
                </p>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow overflow-hidden mt-6">
              <Card className="shadow-lg rounded-xl px-4 pt-4 transition-all duration-300 hover:shadow-xl h-full min-h-[500px] py-6 flex flex-col border border-gray-600">
                <h2 className="text-lg font-medium text-white mb-1 flex items-center gap-2">
                  <BarChartIcon className="w-5 h-5 text-green-400" /> Monthly Sales
                </h2>
                <div className="flex-grow w-full overflow-hidden">
                  <ChartContainer config={chartConfig} className="w-full h-full">
                    <BarChart data={chartData}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <YAxis hide />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="desktop" fill="#C0E1FF" radius={2} />
                      <Bar dataKey="mobile" fill="#ffffff" radius={2} />
                    </BarChart>
                  </ChartContainer>
                </div>
              </Card>

              <Card className="shadow-lg rounded-xl px-4 pt-4 transition-all duration-300 hover:shadow-xl h-auto py-6 border border-gray-600">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-white flex items-center gap-2">
                    <TableIcon className="w-5 h-5 text-blue-400" /> Order Details
                  </h2>
                  <Button
                    onClick={handleAllocateOrders}
                    className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-800 disabled:text-gray-300"
                  >
                    {allocateLoading ? "Allocating..." : "Allocate Orders"}
                  </Button>
                </div>
                {allocateError && (
                  <div className="bg-yellow-900/30 border border-yellow-600 p-3 rounded-lg mb-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <p className="text-yellow-500">Warning: {allocateError}</p>
                  </div>
                )}

                {shipmentsLoading && (
                  <p className="text-blue-500">Loading transaction data...</p>
                )}

                {shipmentsError && (
                  <div className="bg-red-900/30 border border-red-600 p-3 rounded-lg mb-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-red-500">Error: {shipmentsError}</p>
                  </div>
                )}

                {!shipmentsLoading &&
                  !shipmentsError &&
                  (shipments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <DataTable columns={shipmentColumns} data={shipments} />
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No shipment data available.</p>
                      <Button
                        onClick={fetchShipments}
                        className="mt-4 bg-gray-700 hover:bg-gray-600 text-white"
                      >
                        Refresh Data
                      </Button>
                    </div>
                  ))}
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="Analytics">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            <Card className="bg-transparent p-6 rounded-lg shadow-md border border-gray-600">
              <h2 className="text-xl font-semibold mb-2 text-blue-400">Daily Orders</h2>
              <p className="text-3xl font-bold text-gray-200">{analytics.dailyOrders}</p>
            </Card>
            <Card className="bg-transparent p-6 rounded-lg shadow-md border border-gray-600">
              <h2 className="text-xl font-semibold mb-2 text-blue-400">Avg. Order Value</h2>
              <p className="text-3xl font-bold text-gray-200">${analytics.avgOrderValue.toFixed(2)}</p>
            </Card>
            <Card className="bg-transparent p-6 rounded-lg shadow-md border border-gray-600">
              <h2 className="text-xl font-semibold mb-2 text-blue-400">Returning Customers</h2>
              <p className="text-3xl font-bold text-gray-200">{analytics.returningCustomers}</p>
            </Card>
            <Card className="bg-transparent p-6 rounded-lg shadow-md border border-gray-600">
              <h2 className="text-xl font-semibold mb-2 text-blue-400">Conversion Rate</h2>
              <p className="text-3xl font-bold text-gray-200">{analytics.conversionRate}%</p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="Reports">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            <Card className="bg-transparent p-6 rounded-lg shadow-md border border-gray-600">
              <h2 className="text-xl font-semibold mb-2 text-blue-400">Monthly Revenue</h2>
              <p className="text-3xl font-bold text-gray-200">${reports.monthlyRevenue.toLocaleString()}</p>
            </Card>
            <Card className="bg-transparent p-6 rounded-lg shadow-md border border-gray-600">
              <h2 className="text-xl font-semibold mb-2 text-blue-400">Monthly Expenses</h2>
              <p className="text-3xl font-bold text-gray-200">${reports.monthlyExpenses.toLocaleString()}</p>
            </Card>
            <Card className="bg-transparent p-6 rounded-lg shadow-md border border-gray-600">
              <h2 className="text-xl font-semibold mb-2 text-blue-400">Profit</h2>
              <p className="text-3xl font-bold text-gray-200">${reports.profit.toLocaleString()}</p>
            </Card>
            <Card className="bg-transparent p-6 rounded-lg shadow-md border border-gray-600">
              <h2 className="text-xl font-semibold mb-2 text-blue-400">Customer Satisfaction</h2>
              <p className="text-3xl font-bold text-gray-200">{reports.customerSatisfaction}%</p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="Notifications">
          <div className="bg-transparent p-6 rounded-lg shadow-md border border-gray-600">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">Recent Notifications</h2>
            {notif.length > 0 ? (
              <ul className="space-y-3">
                {notif.map((note) => (
                  <li key={note.id} className="border-b border-gray-600 pb-2">
                    <p className="text-gray-200">{note.message}</p>
                    <p className="text-gray-400 text-sm">{note.date}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-center py-4">No notifications available.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;