import { FileText, UserPlus, FileInput, Building2, Settings, CreditCard } from "lucide-react";
import { PageType } from "./Accounting";

interface NavigationMenuProps {
  onNavigate: (page: PageType) => void;
}

export const NavigationMenu = ({ onNavigate }: NavigationMenuProps) => {
  const menuItems = [
    { icon: <FileText className="w-6 h-6" />, title: "Create New Bill", page: 'new-bill' as PageType },
    { icon: <UserPlus className="w-6 h-6" />, title: "Add New Customer", page: 'new-customer' as PageType },
    { icon: <FileInput className="w-6 h-6" />, title: "Customer Invoices", page: 'invoices' as PageType },
    { icon: <Building2 className="w-6 h-6" />, title: "Vendor Bills", page: 'vendor-bills' as PageType },
    { icon: <Settings className="w-6 h-6" />, title: "Configure Documents", page: 'configure' as PageType },
    { icon: <CreditCard className="w-6 h-6" />, title: "Track Payment", page: 'payments' as PageType },
  ];

  return (
    <div className="grid grid-cols-2 gap-6">
      {menuItems.map((item) => (
        <button
          key={item.page}
          onClick={() => onNavigate(item.page)}
          className="flex flex-col items-center justify-center p-8 bg-[#1E293B] rounded-lg border border-blue-500/20 hover:bg-blue-900/20 transition-colors duration-200 group"
        >
          <div className="text-blue-400 mb-3 transform group-hover:scale-110 transition-transform duration-200">
            {item.icon}
          </div>
          <span className="text-white text-sm font-medium">{item.title}</span>
        </button>
      ))}
    </div>
  );
};