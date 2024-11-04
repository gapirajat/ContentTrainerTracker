// Sidebar.js
import React, { useState } from 'react';
import { HomeIcon, UserAddIcon, BellIcon, UserIcon, CogIcon } from '@heroicons/react/outline';
import { useGeneral } from '../../context/generalContext';

const Sidebar = () => {
    const {sidebar, setSidebarSelection, sidebarSelection} = useGeneral();


  const menuItems = [
    { name: 'Home', icon: HomeIcon },
    { name: 'Register', icon: UserAddIcon },
    { name: 'Notifications', icon: BellIcon },
    { name: 'Profile', icon: UserIcon },
    { name: 'Settings', icon: CogIcon },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-50 shadow-lg transform transition-all mt-[4rem] max-lg:hidden duration-300 ease-in-out z-[3] ${
        sidebar ? 'w-3/5' : 'w-16'
      }`}
    >
      {/* Toggle Button */}
      {/* <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 text-gray-700 focus:outline-none"
      >
        {sidebar ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        )}
      </button> */}

      {/* Sidebar Content */}
      <div className="flex flex-col items-start mt-16 space-y-6 px-4">
        {menuItems.map((item) => (
          <div
            key={item.name}
            onClick={() => setSidebarSelection(item.name)}
            className={`flex items-center space-x-4 cursor-pointer ${
              sidebarSelection === item.name ? 'text-blue-600 font-semibold' : 'text-gray-600'
            }`}
          >
            <item.icon className="h-6 w-6" />
            {sidebar && <span>{item.name}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
