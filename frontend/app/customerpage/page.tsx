"use client";

import React, { useState } from 'react';

// Mock data remains the same
const MOCK_PRODUCTS = [
  { id: 1, name: 'Laptop Pro', price: 1299.99, category: 'Electronics', stock: 23, image: '/api/placeholder/200/200' },
  { id: 2, name: 'Coffee Maker', price: 89.99, category: 'Household', stock: 15, image: '/api/placeholder/200/200' },
  { id: 3, name: 'Wireless Mouse', price: 29.99, category: 'Electronics', stock: 45, image: '/api/placeholder/200/200' },
  { id: 4, name: 'Desk Lamp', price: 39.99, category: 'Household', stock: 30, image: '/api/placeholder/200/200' },
  { id: 5, name: 'Power Drill', price: 149.99, category: 'Industrial', stock: 12, image: '/api/placeholder/200/200' },
  { id: 6, name: 'Safety Helmet', price: 29.99, category: 'Industrial', stock: 50, image: '/api/placeholder/200/200' },
];

const MOCK_ORDERS = [
  { id: 'ORD-001', date: '2025-02-12', status: 'Delivered', total: 1389.98, items: 2 },
  { id: 'ORD-002', date: '2025-02-13', status: 'Processing', total: 179.98, items: 3 },
];
// Dashboard Tab Component

export const DashboardTab = () => (
  <div className="space-y-6">
    <div className="bg-primary text-primary-foreground rounded-[--radius] p-6">
      <h2 className="text-2xl font-semibold">Welcome back, John!</h2>
      <p className="mt-2">You have 2 active orders</p>
    </div>
    
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-card text-card-foreground p-4 rounded-[--radius] shadow-sm">
        <h3 className="font-medium text-muted-foreground">Total Orders</h3>
        <p className="text-2xl font-bold mt-2">24</p>
      </div>
      <div className="bg-card text-card-foreground p-4 rounded-[--radius] shadow-sm">
        <h3 className="font-medium text-muted-foreground">Total Spent</h3>
        <p className="text-2xl font-bold mt-2">$4,299.00</p>
      </div>
      <div className="bg-card text-card-foreground p-4 rounded-[--radius] shadow-sm">
        <h3 className="font-medium text-muted-foreground">Active Cart Items</h3>
        <p className="text-2xl font-bold mt-2">3</p>
      </div>
    </div>

    <div className="bg-card text-card-foreground rounded-[--radius] shadow-sm p-6">
      <h3 className="text-lg font-medium mb-4">Recent Orders</h3>
      <div className="space-y-4">
        {MOCK_ORDERS.map(order => (
          <div key={order.id} className="flex items-center justify-between border-b pb-4">
            <div>
              <p className="font-medium">{order.id}</p>
              <p className="text-sm text-muted-foreground">{order.date}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">${order.total}</p>
              <p className="text-sm text-muted-foreground">{order.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Products Tab Component
interface ProductsTabProps {
  searchQuery: string;
  selectedCategory: string;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({ searchQuery, selectedCategory }) => {
  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
      product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="grid grid-cols-4 gap-4">
      {filteredProducts.map(product => (
        <div key={product.id} className="bg-card text-card-foreground p-4 rounded-[--radius] shadow-sm">
          <img 
            src={product.image}
            alt={product.name}
            className="w-full aspect-square object-cover rounded-[--radius] mb-4"
          />
          <h3 className="font-medium">{product.name}</h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-bold">${product.price}</span>
            <span className="text-sm text-primary">{product.stock} in stock</span>
          </div>
          <button className="w-full mt-4 bg-primary text-primary-foreground py-2 rounded-[--radius] hover:bg-primary/90 transition-colors">
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

// Orders Tab Component
export const OrdersTab = () => (
  <div className="bg-card text-card-foreground rounded-[--radius] shadow-sm p-6">
    <h2 className="text-xl font-medium mb-6">Your Orders</h2>
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="text-left pb-4">Order ID</th>
          <th className="text-left pb-4">Date</th>
          <th className="text-left pb-4">Items</th>
          <th className="text-left pb-4">Total</th>
          <th className="text-left pb-4">Status</th>
        </tr>
      </thead>
      <tbody>
        {MOCK_ORDERS.map(order => (
          <tr key={order.id} className="border-b">
            <td className="py-4">{order.id}</td>
            <td className="py-4">{order.date}</td>
            <td className="py-4">{order.items}</td>
            <td className="py-4">${order.total}</td>
            <td className="py-4">
              <span className={`px-2 py-1 rounded-full text-sm ${
                order.status === 'Delivered' 
                  ? 'bg-success/10 text-success' 
                  : 'bg-primary/10 text-primary'
              }`}>
                {order.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Profile Tab Component
const ProfileTab = () => {
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Apt 4B, New York, NY 10001'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="bg-card text-card-foreground rounded-[--radius] shadow-sm p-6">
      <h2 className="text-xl font-medium mb-6">Profile Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border rounded-[--radius] bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border rounded-[--radius] bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-[--radius] bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded-[--radius] bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Shipping Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded-[--radius] bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
            rows={3}
          />
        </div>
        <button 
          type="submit" 
          className="bg-primary text-primary-foreground px-6 py-2 rounded-[--radius] hover:bg-primary/90 transition-colors"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

// Main Layout Component
const EcommerceLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', color: 'text-primary' },
    { id: 'products', label: 'Products', icon: '🛍️', color: 'text-primary' },
    { id: 'orders', label: 'Orders', icon: '📦', color: 'text-primary' },
    { id: 'profile', label: 'Profile', icon: '👤', color: 'text-primary' }
  ];

  const categories = ['All', 'Electronics', 'Household', 'Industrial'];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'products':
        return <ProductsTab searchQuery={searchQuery} selectedCategory={selectedCategory} />;
      case 'orders':
        return <OrdersTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-primary">Store Name</h1>
            <div className="flex items-center space-x-2 bg-muted/50 p-2 rounded-[--radius] w-96">
              <span className="text-muted-foreground">🔍</span>
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent w-full outline-none text-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-6">
            {/* Cart Button with Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowCartDropdown(!showCartDropdown)}
                className="flex items-center space-x-2 hover:text-primary transition-colors"
              >
                <span className="text-2xl">🛒</span>
                <span className="text-sm">Cart</span>
              </button>
              
              {showCartDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-popover text-popover-foreground rounded-[--radius] shadow-lg p-4 z-50">
                  <h3 className="font-medium mb-2">Shopping Cart</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">No items in cart</p>
                    <button 
                      className="w-full bg-primary text-primary-foreground py-2 rounded-[--radius] hover:bg-primary/90 transition-colors"
                      onClick={() => setShowCartDropdown(false)}
                    >
                      View Cart
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Button with Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 hover:text-primary transition-colors"
              >
                <span className="text-2xl">👤</span>
                <span className="text-sm">Account</span>
              </button>
              
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-popover text-popover-foreground rounded-[--radius] shadow-lg p-2 z-50">
                  <button 
                    onClick={() => {
                      setActiveTab('profile');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded-[--radius] hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Profile Settings
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 rounded-[--radius] hover:bg-accent hover:text-accent-foreground transition-colors text-destructive"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-2">
            <nav className="space-y-2">
              {tabs.map((tab: { id: string; label: string; icon: string; color: string }) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-2 rounded-[--radius] flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            {activeTab === 'products' && (
              <div className="mt-8">
                <h3 className="font-medium mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category: string) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-2 rounded-[--radius] transition-colors ${
                        selectedCategory === category
                          ? 'bg-accent text-accent-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="col-span-10">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EcommerceLayout;