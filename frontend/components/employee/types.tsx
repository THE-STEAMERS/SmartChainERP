export interface PieChartData {
  name: string;
  value: number;
  color: string;
}

export interface DeliveryOrder {
  orderId: string;
  orderName: string;
  phoneNumber: string;
  address: string;
  isDelivered: boolean;
  isCancelled?: boolean;
  cancellationReason?: string;
  items: string[];
}

export interface UndeliverableOrder {
  orderId: string;
  name: string;
  phone: string;
}