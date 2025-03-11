"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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
  BarChartIcon,
  ClockIcon,
  DollarSignIcon,
  ShoppingBagIcon,
  StoreIcon,
  TableIcon,
  TrendingUpIcon,
  TruckIcon,
  UsersIcon,
} from "lucide-react";

//Interface for all the tabs
interface OverviewCard {
  totalSales: number;
  numStores: number;
  deliveryAgents: number;
  pendingOrders: number;
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

//Hardcoded data

const testData: OverviewCard = {
  totalSales: 50000,
  numStores: 120,
  deliveryAgents: 45,
  pendingOrders: 230,
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
  // ...
];

// const API_URL = "";

const Dashboard: React.FC = () => {
  const [data] = useState<OverviewCard>(testData);
  const [analytics] = useState<AnalyticsData>(analyticsData);
  const [reports] = useState<ReportData>(reportData);
  const [notif] = useState<Notification[]>(notifications);

  //WAITING FOR BACKEND :)))

  // const [data, setData] = useState<O
  // verviewCard | null>(null);
  // const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(API_URL);
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch data");
  //       }
  //       const result: OverviewCard = await response.json();
  //       setData(result);
  //     } catch (err) {
  //       setError((err as Error).message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <div className="flex  flex-col min-h-screen bg-neutral-950 text-white p-6">
      <h1 className="text-4xl font-bold text-white mb-4 px-3 py-2">
        Dashboard
      </h1>

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
          {/* Loading State
          {loading && <p className="text-blue-500 text-lg">Loading...</p>}

         
          {error && <p className="text-red-500 text-lg">Error: {error}</p>} */}

          {/* Display Data */}
          {data && (
            <div className="h-screen flex flex-col gap-4 overflow-hidden p-6">
              {/* Top Section - Four Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-start">
                <Card className="shadow-lg rounded-xl px-4 pt-4 transition-all duration-300 hover:shadow-xl h-auto py-6 border border-gray-600">
                  <h2 className="text-lg font-medium text-white mb-1 flex items-center gap-2">
                    <TrendingUpIcon className="w-5 h-5 text-green-400" /> Total
                    Sales
                  </h2>
                  <p className="text-2xl font-bold text-white tracking-tight">
                    ${data.totalSales}
                  </p>
                  <p className="text-gray-400 text-sm mt-0.5">
                    Total revenue generated this month.
                  </p>
                </Card>

                <Card className="shadow-lg rounded-xl px-4 pt-4 transition-all duration-300 hover:shadow-xl h-auto py-6 border border-gray-600">
                  <h2 className="text-lg font-medium text-white mb-1 flex items-center gap-2">
                    <StoreIcon className="w-5 h-5 text-white" /> Number of
                    Stores
                  </h2>
                  <p className="text-2xl font-bold text-white tracking-tight">
                    {data.numStores}
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
                    {data.deliveryAgents}
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
                    {data.pendingOrders}
                  </p>
                  <p className="text-gray-400 text-sm mt-0.5">
                    Total number of pending customer orders.
                  </p>
                </Card>
              </div>

              {/* Bottom Section - Chart and Data Table*/}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow overflow-hidden mt-18">
                {/* Chart Section */}
                <Card className="shadow-lg rounded-xl px-4 pt-4 transition-all duration-300 hover:shadow-xl h-full min-h-[500px] py-6 flex flex-col border border-gray-600">
                  <h2 className="text-lg font-medium text-white mb-1 flex items-center gap-2">
                    <BarChartIcon className="w-5 h-5 text-green-400" /> Monthly
                    Sales
                  </h2>
                  <div className="flex-grow w-full overflow-hidden">
                    <ChartContainer
                      config={chartConfig}
                      className="w-full h-full"
                    >
                      <BarChart data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                          tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="desktop" fill="#C0E1FF" radius={2} />{" "}
                        {/* White Bars */}
                        <Bar dataKey="mobile" fill="#ffffff" radius={2} />{" "}
                        {/* White Bars */}
                      </BarChart>
                    </ChartContainer>
                  </div>
                </Card>

                {/* Data Table Section */}
                <Card className="shadow-lg rounded-xl px-4 pt-4 transition-all duration-300 hover:shadow-xl h-auto py-6 border border-gray-600">
                  <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2 ">
                    <TableIcon className="w-5 h-5 text-blue-400 " /> Transaction
                    Data
                  </h2>
                  
                  <DataTable columns={columns} data={payments} />
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
        {/* Analytics Tab */}
        <TabsContent value="Analytics">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            <Card className="bg-transparent p-6 rounded-lg shadow-md border border-gray-600">
              <h2 className="text-xl font-semibold mb-2 text-blue-400">
                Daily Orders
              </h2>
              <p className="text-3xl font-bold text-gray-200">
                {analytics.dailyOrders}
              </p>
            </Card>
            <Card className="bg-transparent p-6 rounded-lg shadow-md border border-gray-600">
              <h2 className="text-xl font-semibold mb-2 text-blue-400">
                Avg. Order Value
              </h2>
              <p className="text-3xl font-bold text-gray-200">
                ${analytics.avgOrderValue.toFixed(2)}
              </p>
            </Card>
            <Card className="bg-transparent p-6 rounded-lg shadow-md border border-gray-600">
              <h2 className="text-xl font-semibold mb-2 text-blue-400">
                Returning Customers
              </h2>
              <p className="text-3xl font-bold text-gray-200">
                {analytics.returningCustomers}
              </p>
            </Card>
            <Card className="bg-transparent p-6 rounded-lg shadow-md border border-gray-600">
              <h2 className="text-xl font-semibold mb-2 text-blue-400">
                Conversion Rate
              </h2>
              <p className="text-3xl font-bold text-gray-200">
                {analytics.conversionRate}%
              </p>
            </Card>
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="Reports">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            <Card className="bg-transparent p-6 rounded-lg shadow-md border border-gray-600">
              <h2 className="text-xl font-semibold mb-2 text-blue-400">
                Monthly Revenue
              </h2>
              <p className="text-3xl font-bold text-gray-200">
                ${reports.monthlyRevenue.toLocaleString()}
              </p>
            </Card>
            <Card className="bg-transparent p-6 rounded-lg shadow-md border border-gray-600">
              <h2 className="text-xl font-semibold mb-2 text-blue-400">
                Monthly Expenses
              </h2>
              <p className="text-3xl font-bold text-gray-200">
                ${reports.monthlyExpenses.toLocaleString()}
              </p>
            </Card>
            <Card className="bg-transparent p-6 rounded-lg shadow-md border border-gray-600">
              <h2 className="text-xl font-semibold mb-2 text-blue-400">
                Profit
              </h2>
              <p className="text-3xl font-bold text-gray-200">
                ${reports.profit.toLocaleString()}
              </p>
            </Card>
            <Card className="bg-transparent p-6 rounded-lg shadow-md border border-gray-600">
              <h2 className="text-xl font-semibold mb-2 text-blue-400">
                Customer Satisfaction
              </h2>
              <p className="text-3xl font-bold text-gray-200">
                {reports.customerSatisfaction}%
              </p>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="Notifications">
          <div className="bg-transparent p-6 rounded-lg shadow-md border border-gray-600">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              Recent Notifications
            </h2>
            <ul className="space-y-3">
              {notif.map((note) => (
                <li key={note.id} className="border-b border-gray-600 pb-2">
                  <p className="text-gray-200">{note.message}</p>
                  <p className="text-gray-400 text-sm">{note.date}</p>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
