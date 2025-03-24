"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { OrdersTable } from "@/components/employee/OrdersTable";
import { OrderDetails } from "@/components/employee/OrderDetails";
import { DeliveryStatus } from "@/components/employee/DeliveryStatus";
import { CancelOrderDialog } from "@/components/employee/CancelOrderDialog";
import { DeliveryOrder } from "@/components/employee/types";

interface PageProps {
  params: {
    id: string;
  };
}

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

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

export default function EmployeePage({ params }: PageProps) {
  const [mounted, setMounted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employeeId, setEmployeeId] = useState<string | null>(null);

  const getAuthToken = useCallback(async () => {
    let token = localStorage.getItem("access_token");
    if (!token) {
      token = await refreshAccessToken();
    }
    return token;
  }, []);

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    let token = await getAuthToken();
    if (!token)
      throw new Error("Authentication token not found. Please log in again.");

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
      if (!token)
        throw new Error("Authentication token not found. Please log in again.");

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

  useEffect(() => {
    async function fetchEmployeeId() {
      try {
        const response = await fetchWithAuth(`${API_URL}/employee_id/`);
        if (!response.ok) {
          throw new Error("Failed to fetch employee ID");
        }
        const data = await response.json();
        setEmployeeId(data.employee_id);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      }
    }

    fetchEmployeeId();
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchShipments() {
      if (!employeeId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await fetchWithAuth(
          `${API_URL}/employee_shipments?employeeId=${employeeId}`
        );
        const data = await response.json();

        const mappedOrders: DeliveryOrder[] = data.map((shipment: any) => ({
          orderId: `SHIP-${shipment.shipment_id}`,
          orderName: `Order-${shipment.order}`,
          phoneNumber: "N/A",
          address: "N/A",
          isDelivered: shipment.status === "delivered",
          items: [`Order-${shipment.order}`],
          isCancelled: shipment.status === "cancelled",
          cancellationReason:
            shipment.status === "cancelled" ? "Unknown" : undefined,
        }));

        setOrders(mappedOrders);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchShipments();
  }, [employeeId]);

  const handleCancelClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setDialogOpen(true);
  };

  const handleCancelOrder = () => {
    if (selectedOrderId && selectedReason) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === selectedOrderId
            ? {
                ...order,
                isCancelled: true,
                cancellationReason: selectedReason,
              }
            : order
        )
      );
      setDialogOpen(false);
      setSelectedOrderId(null);
      setSelectedReason("");
    }
  };

  const handleUpdateStatus = async (shipmentId: number) => {
    try {
      const response = await fetchWithAuth(
        `${API_URL}/update_shipment_status/`,
        {
          method: "POST",
          body: JSON.stringify({
            shipment_id: shipmentId,
            status: "delivered",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.statusText}`);
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === `SHIP-${shipmentId}`
            ? { ...order, isDelivered: true }
            : order
        )
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  };

  const calculatePieChartData = useMemo(() => {
    const deliveredCount = orders.filter(
      (order) => order.isDelivered && !order.isCancelled
    ).length;
    const notDeliveredCount = orders.filter(
      (order) => !order.isDelivered && !order.isCancelled
    ).length;
    const cancelledCount = orders.filter((order) => order.isCancelled).length;

    return [
      { name: "Delivered", value: deliveredCount, color: "#22c55e" },
      { name: "Pending", value: notDeliveredCount, color: "#3b82f6" },
      { name: "Cancelled", value: cancelledCount, color: "#eab308" },
    ];
  }, [orders]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">
        Employee Dashboard - ID : {employeeId || "Loading..."}
      </h1>

      {error && <p className="text-red-500 p-4">Error: {error}</p>}
      {loading && <p className="text-slate-300 p-4">Loading shipments...</p>}

      <CancelOrderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedReason={selectedReason}
        onReasonChange={setSelectedReason}
        onConfirm={handleCancelOrder}
      />

      <OrdersTable
        orders={orders}
        onCancelClick={handleCancelClick}
        onUpdateStatus={handleUpdateStatus}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OrderDetails />
        {mounted && (
          <DeliveryStatus
            data={calculatePieChartData}
            totalOrders={orders.length}
          />
        )}
      </div>
    </div>
  );
}
