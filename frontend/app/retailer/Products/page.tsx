"use client";
import React, { useState } from 'react';
import { ShoppingCart, User } from 'lucide-react';
import { PRODUCTS } from '../../../components/retailer/data/mockData';

const ProductsTab = () => {

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = search === '' || 
      (product.name && product.name.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = category === 'All' || 
      product.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between max-w-[1600px] mx-auto">
            <div className="text-xl font-bold">Store Name</div>
            <div className="flex-1 mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full max-w-xl px-4 py-2 bg-gray-900 rounded-lg text-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center">
                <ShoppingCart className="w-6 h-6" />
                <span className="ml-2">Cart</span>
              </button>
              <button className="flex items-center">
                <User className="w-6 h-6" />
                <span className="ml-2">Account</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-gray-900 rounded-lg p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-square object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-lg font-bold">${product.price}</span>
                  <span className="text-sm text-gray-400">{product.stock} in stock</span>
                </div>
                <button className="w-full mt-4 bg-white text-black py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default ProductsTab;