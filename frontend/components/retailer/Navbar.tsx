import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Anchor from "@/components/retailer/anchor";

export const NAVLINKS = [
  {
    title: "Dashboard",
    href: "/retailer/dashboard",
  },
  {
    title: "Orders",
    href: "/retailer/Orders",
  },
  {
    title: "Products",
    href: "/retailer/Products",
  },
  {
    title: "Profile",
    href: "/retailer/Profile",
  },
];

export function Navbar() {
  return (
    <nav className="w-full border-b h-16 sticky top-0 z-50 bg-background">
      <div className="sm:container mx-auto w-[95vw] h-full flex items-center justify-between md:gap-2">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-6">
            <div className="sm:flex hidden">
              <Logo />
            </div>
            <div className="lg:flex hidden items-center gap-4 text-sm font-medium text-muted-foreground text-blue-400">
              <NavMenu />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function Logo() {
  return (
    <Link href="/customerpage/dashboard" className="flex items-center gap-2.5">
      <h2 className="text-md font-bold font-code">CustomerPage</h2>
    </Link>
  );
}

export function NavMenu() {
  return (
    <>
      {NAVLINKS.map((item) => (
        <Anchor
          key={item.title + item.href}
          activeClassName="!text-primary dark:font-medium font-semibold"
          absolute
          className="flex items-center gap-1 dark:text-stone-300/85 text-stone-800"
          href={item.href}
        >
          {item.title}
        </Anchor>
      ))}
    </>
  );
}