import React, { useEffect, useState } from 'react';

const DialogBox = ({ isDialogOpen, setFunction }) => {
    if (!isDialogOpen) return null; // Don't render if dialog isn't open

    const handleClose = () => {
      setFunction(false); // Close dialog by setting `isDialogOpen` to false
    };
    


  return (
    <div className="flex justify-center items-center h-screen absolute">
      {/* Button to open the dialog */}

      {/* Dialog overlay */}
      {isDialogOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div 
            className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/3"
          >
            {/* Dialog Title */}
            <h2 
              className="text-lg font-semibold text-gray-800"
            >
              Login Issue
            </h2>

            {/* Dialog Content */}
            <p 
              className="mt-4 text-gray-600"
            >
              Contact Number: 9518771694 <br />
              Email: rajatshinde01@gmail.com
            </p>

            {/* OK Button */}
            <div 
              className="mt-6 flex justify-end"
            >
              <button 
                className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md transition"
                onClick={handleClose}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DialogBox;
