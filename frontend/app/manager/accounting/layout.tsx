"use client";  // Add this at the top
import { Navbar } from "@/app/manager/Navbar/navbar";

export default function AccountingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
