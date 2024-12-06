// BottomNavbar.js
import React, { useState } from 'react';
import { HomeIcon, UserAddIcon, ChatIcon, UserIcon, CogIcon, SpeakerphoneIcon, ChartPieIcon } from '@heroicons/react/outline'; // Import icons from Heroicons
import { useGeneral } from '../../context/generalContext';

const BottomNavbar = () => {
  // Using the same state as of sidebar
  const { setSidebarSelection, sidebarSelection} = useGeneral();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 shadow-md lg:hidden">
      <div className="flex justify-around py-2">
        {/* Home Icon */}
        <div
          onClick={() => setSidebarSelection('Home')}
          className={`flex flex-col items-center cursor-pointer ${
            sidebarSelection === 'Home' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <HomeIcon className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </div>

        {/* Search Icon */}
        <div
          onClick={() => setSidebarSelection('Register')}
          className={`flex flex-col items-center cursor-pointer ${
            sidebarSelection === 'Register' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <UserAddIcon className="h-6 w-6" />
          <span className="text-xs">Register</span>
        </div>

        {/* Messages Icon */}
        <div
          onClick={() => setSidebarSelection('Messages')}
          className={`flex flex-col items-center cursor-pointer ${
            sidebarSelection === 'Messages' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <ChatIcon className="h-6 w-6" />
          <span className="text-xs">Messages</span>
        </div>

        {/* Feedback Icon */}
        <div
          onClick={() => setSidebarSelection('Feedback')}
          className={`flex flex-col items-center cursor-pointer ${
            sidebarSelection === 'Feedback' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <SpeakerphoneIcon className="h-6 w-6" />
          <span className="text-xs">Feedback</span>
        </div>

        {/* Settings Icon */}
        <div
          onClick={() => setSidebarSelection('Dashboard')}
          className={`flex flex-col items-center cursor-pointer ${
            sidebarSelection === 'Dashboard' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <ChartPieIcon className="h-6 w-6" />
          <span className="text-xs">Dashboard</span>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavbar;
