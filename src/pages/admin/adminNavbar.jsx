// Navbar.js
import React from 'react';
import { useAuth } from '../../context/authContext';
import { useGeneral } from '../../context/generalContext';


const Navbar = () => {

    const {user} = useAuth()
    const {setSidebar, sidebar} = useGeneral()
  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b-[1px] border-gray-200 h-[4rem]">
      {/* Left: Burger Menu Button (visible on large screens) */}
      <div className="lg:flex hidden">
        <button className="text-gray-700 hover:text-gray-900 focus:outline-none mr-7" onClick={()=>setSidebar(!sidebar)}>
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
        </button>
      </div>

      {/* Center: GCP Logo (optional or adjust as desired) */}
      <div className="flex-grow h-full">
        <img className='h-full scale-125 opacity-70' src="maxeutech_logo.png" alt="Logo" />
      </div>

      {/* Right: Profile Section */}
      <div className="flex items-center space-x-2">
        <span className="text-gray-800 font-medium">{user.username}</span>
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
          <img
            src="https://via.placeholder.com/40" // Replace with actual profile image URL
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
