// Navbar.js
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { useGeneral } from '../../context/generalContext';

const Navbar = () => {
  const { user, logout } = useAuth(); // Ensure logout is provided by useAuth
  const { setSidebar, sidebar } = useGeneral();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    // You can add additional logout logic here if needed
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b border-gray-200 h-16">
      {/* Left: Burger Menu Button (visible on large screens) */}
      <div className="lg:flex hidden">
        <button
          className="text-gray-700 hover:text-gray-900 focus:outline-none mr-7"
          onClick={() => setSidebar(!sidebar)}
        >
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

      {/* Center: GCP Logo */}
      <div className="flex-grow h-full flex items-center justify-center">
        <img
          className="h-full scale-125 opacity-70"
          src="maxeutech_logo.png"
          alt="Logo"
        />
      </div>

      {/* Right: Profile Section */}
      <div
        className="relative"
        ref={dropdownRef}
        onMouseEnter={() => setDropdownOpen(true)}
        onMouseLeave={() => setDropdownOpen(false)}
      >
        <button
          className="flex items-center space-x-2 focus:outline-none"
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          <span className="text-gray-800 font-medium">{user.username}</span>
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            <img
              src={user.profileImage || 'https://via.placeholder.com/40'} // Replace with actual profile image URL
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
