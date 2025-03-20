"use client";
import React from 'react';
import { Navbar } from '@/components/retailer/Navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar/>
      <main>{children}</main>
    </div>
  );
}