// Snackbar.js
import React, { useEffect } from 'react';

const Snackbar = ({ message, isOpen, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  return (
    <div
      className={`fixed w-[95%] -bottom-6 right-4 left-4 p-4 dark:bg-gray-800 dark:text-white rounded-lg shadow-lg transition-transform transform mx-auto z-[11] ${
        isOpen ? '-translate-y-8 opacity-100' : 'translate-y-4 opacity-0'
      }`}
      style={{ transition: 'all 0.3s ease' }}
    >
      {message}
    </div>
  );
};

export default Snackbar;
