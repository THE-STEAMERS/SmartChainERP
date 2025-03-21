"use client";
import React from 'react';

const ProfileTab = () => {
 

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between max-w-[1600px] mx-auto">
            <div className="text-xl font-bold">Store Name</div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8 max-w-[1600px] mx-auto">
          <h2 className="text-xl font-bold mb-4">Profile</h2>
          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-gray-400 mb-2">Username</h3>
            
          </div>
        </main>
      </div>
    </>
  );
};

export default ProfileTab;