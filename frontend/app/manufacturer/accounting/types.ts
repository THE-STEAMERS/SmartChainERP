export type Status = 'Paid' | 'Pending' | 'Overdue';
export type PageType = 'new-bill' | 'new-customer' | 'invoices' | 'vendor-bills' | 'configure' | 'payments';
export interface Bill {
  id: number;
  vendor: string;
  billNumber: string;
  amount: number;
  dueDate: string;
  status: Status;
  createdAt: string;
}