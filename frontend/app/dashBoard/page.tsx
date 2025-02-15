import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-black text-white p-3 flex justify-between items-center">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-lg cursor-pointer">
          <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
          <span className="text-white font-semibold">Modern ERP</span>
          {/* ✅ Explicitly typing the icon components */}
          <IoIosArrowDown className="text-gray-400 w-5 h-5" />
        </div>
        <div className="ml-4 flex gap-4">
          <span className="text-white font-semibold cursor-pointer">Overview</span>
          <span className="text-gray-400 cursor-pointer hover:text-white">Customers</span>
          <span className="text-gray-400 cursor-pointer hover:text-white">Products</span>
          <span className="text-gray-400 cursor-pointer hover:text-white">Settings</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="bg-gray-800 text-white px-3 py-1 rounded-lg focus:outline-none placeholder-gray-400"
        />
        {/* ✅ Ensuring `className` works properly */}
        <FaUserCircle className="text-white text-2xl cursor-pointer w-6 h-6" />
      </div>
    </nav>
  );
};

export default Navbar;

