
// NavigationMenu.tsx
"use client";

import Link from "next/link";
import { FileText, UserPlus, FileInput, Building2, Settings, CreditCard } from "lucide-react";
import { PageType } from "./types";

interface NavigationMenuProps {
  onNavigate: (page: PageType) => void;
}

interface MenuItem {
  icon: React.ComponentType<any>;
  title: string;
  href: string;
  type: PageType;
}

export const NavigationMenu = ({ onNavigate }: NavigationMenuProps) => {
  const menuItems: MenuItem[] = [
    {
      icon: FileText,
      title: "Create New Bill",
      href: '/manager/accounting/createBill',
      type: 'new-bill'
    },
    {
      icon: UserPlus,
      title: "Add New Customer",
      href: '/manager/accounting/addCustomer',
      type: 'new-customer'
    },
    {
      icon: FileInput,
      title: "Customer Invoices",
      href: '/manager/accounting/customerInvoice',
      type: 'invoices'
    },
    {
      icon: Building2,
      title: "Vendor Bills",
      href: '/manager/accounting/vendorBills',
      type: 'vendor-bills'
    },
    {
      icon: Settings,
      title: "Configure Documents",
      href: '/manager/accounting/configureDocuments',
      type: 'configure'
    },
    {
      icon: CreditCard,
      title: "Track Payment",
      href: '/manager/accounting/trackPayment',
      type: 'payments'
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-6">
      {menuItems.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          onClick={() => onNavigate(item.type)}
          className="flex flex-col items-center justify-center p-8 bg-[#1E293B] rounded-lg border border-blue-500/20 hover:bg-blue-900/20 transition-colors duration-200 group"
        >
          <div className="text-blue-400 mb-3 transform group-hover:scale-110 transition-transform duration-200">
            <item.icon className="w-6 h-6" />
          </div>
          <span className="text-white text-sm font-medium">{item.title}</span>
        </Link>
      ))}
    </div>
  );
};