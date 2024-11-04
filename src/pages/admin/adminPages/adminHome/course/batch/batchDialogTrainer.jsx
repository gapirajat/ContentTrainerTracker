// src/components/TrainerDialog.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../../../../context/authContext';

function TrainerDialog({ props }) {//{selectedTrainer:selectedTrainer, onClose:() => setTrainerDialogOpen(false)}
  const { authToken } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    avatar: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (props.selectedTrainer) {
      setFormData({
        name: trainer.name || '',
        username: trainer.username || '',
        avatar: trainer.avatar || '',
      });
      setIsEditMode(true);
    } else {
      setFormData({
        name: '',
        username: '',
        avatar: '',
      });
      setIsEditMode(false);
    }
  }, [props.selectedTrainer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Logic to create or update trainer
    // ... [Implementation remains the same]
  };

  const handleDelete = async () => {
    // Logic to delete trainer
    // ... [Implementation remains the same]
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={props.onClose}
        >
          {/* Close Icon */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          {isEditMode ? 'Edit Trainer' : 'Add Trainer'}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Avatar Preview */}
          <div className="mb-6 text-center">
            <img
              src={formData.avatar || '/default-avatar.png'}
              alt="Avatar Preview"
              className="w-24 h-24 rounded-full mx-auto border-2 border-gray-300"
            />
          </div>
          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter trainer name"
            />
          </div>
          {/* Username Field */}
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter trainer username"
            />
          </div>
          {/* Avatar URL Field */}
          <div className="mb-6">
            <label className="block text-gray-700">Avatar URL</label>
            <input
              type="url"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter avatar image URL"
            />
          </div>
          {/* Buttons */}
          <div className="flex justify-end mt-6">
            {isEditMode && (
              <button
                type="button"
                onClick={handleDelete}
                className="mr-auto text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
            >
              {isEditMode ? 'Update Trainer' : 'Add Trainer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TrainerDialog;
