import Link from "next/link";
import { Anchor } from "lucide-react";

export const NAVLINKS = [
    {
        title: "DashBoard",
        href: "/manager/dashBoard",
        icon: Anchor
    },
    {
        title: "Accounting",
        href: "/manager/accounting",
        icon: Anchor
    },
    {
        title: "StockCount",
        href: "/manager/stockCount",
        icon: Anchor
    },
];

export function Navbar() {
    return (
        <nav className="w-full border-b h-16 sticky top-0 z-50 bg-background flex items-center">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="font-bold text-xl">
                        YourAppName
                    </Link>
                    
                    <div className="flex items-center space-x-6">
                        {NAVLINKS.map((item) => (
                            <Link 
                                key={item.title + item.href} 
                                href={item.href} 
                                className="flex items-center gap-2 hover:text-primary transition-colors text-foreground"
                            >
                                <item.icon className="w-4 h-4" />
                                <span>{item.title}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}