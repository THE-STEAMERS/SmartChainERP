"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { OrdersTable } from "@/components/employee/OrdersTable";
import { UndeliverableOrders } from "@/components/employee/UndeliverableOrders";
import { DeliveryStatus } from "@/components/employee/DeliveryStatus";
import { CancelOrderDialog } from "@/components/employee/CancelOrderDialog";
import { DeliveryOrder, UndeliverableOrder } from "@/components/employee/types";

interface PageProps {
  params: {
    id: string;
  };
}

const API_URL = "http://127.0.0.1:8000/api";

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
  const [undeliverableOrders, setUndeliverableOrders] = useState<UndeliverableOrder[]>([]);

  const getAuthToken = useCallback(async () => {
    let token = localStorage.getItem("access_token");
    if (!token) {
      token = await refreshAccessToken();
    }
    return token;
  }, []);

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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchShipments() {
      try {
        const response = await fetchWithAuth(`${API_URL}/employee_shipments?employeeId=${params.id}`);
        const data = await response.json();

        const mappedOrders: DeliveryOrder[] = data.map((shipment: any) => ({
          orderId: `SHIP-${shipment.shipment_id}`,
          orderName: `Order-${shipment.order}`,
          phoneNumber: "N/A", // No phone number in API, set default or fetch separately
          address: "N/A", // No address in API, set default or fetch separately
          isDelivered: shipment.status === "delivered",
          items: [`Order-${shipment.order}`], // Assuming order details are not available in shipment data
          isCancelled: shipment.status === "cancelled",
          cancellationReason: shipment.status === "cancelled" ? "Unknown" : undefined,
        }));

        setOrders(mappedOrders);
      } catch (error) {
        console.error("Failed to fetch shipments:", error);
      }
    }

    fetchShipments();
  }, [params.id]);

  const handleCancelClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setDialogOpen(true);
  };

  const handleCancelOrder = () => {
    if (selectedOrderId && selectedReason) {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.orderId === selectedOrderId
            ? { ...order, isCancelled: true, cancellationReason: selectedReason }
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
      const response = await fetchWithAuth(`${API_URL}/update_shipment_status/`, {
        method: "POST",
        body: JSON.stringify({
          shipment_id: shipmentId,
          status: "delivered",
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.statusText}`);
      }

      // Update the local state to reflect the change
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.orderId === `SHIP-${shipmentId}`
            ? { ...order, isDelivered: true }
            : order
        )
      );
    } catch (error) {
      console.error("Failed to update shipment status:", error);
    }
  };

  const calculatePieChartData = useMemo(() => {
    const deliveredCount = orders.filter(order => order.isDelivered && !order.isCancelled).length;
    const notDeliveredCount = orders.filter(order => !order.isDelivered && !order.isCancelled).length;
    const cancelledCount = orders.filter(order => order.isCancelled).length;
    const undeliverableCount = undeliverableOrders.length;

    return [
      { name: "Delivered", value: deliveredCount, color: "#22c55e" },
      { name: "Pending", value: notDeliveredCount, color: "#3b82f6" },
      { name: "Cancelled", value: cancelledCount, color: "#eab308" },
      { name: "Undeliverable", value: undeliverableCount, color: "#94a3b8" }
    ];
  }, [orders, undeliverableOrders]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Employee Dashboard - ID: {params.id}</h1>
      
      <CancelOrderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedReason={selectedReason}
        onReasonChange={setSelectedReason}
        onConfirm={handleCancelOrder}
      />

      <OrdersTable orders={orders} onCancelClick={handleCancelClick} onUpdateStatus={handleUpdateStatus} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UndeliverableOrders orders={undeliverableOrders} />
        {mounted && (
          <DeliveryStatus
            data={calculatePieChartData}
            totalOrders={orders.length + undeliverableOrders.length}
          />
        )}
      </div>
    </div>
  );
}