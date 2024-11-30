// src/components/AnnouncementForm.js
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAnnouncement, removeAnnouncement, clearMessages, fetchAnnouncement } from "../../../adminSlice/adminSlice";

// Extracted Handler Functions
const handleSet = async (e, announcement, dispatch) => {
    e.preventDefault();
    if (announcement.trim() === "") {
      dispatch({ type: "announcement/setAnnouncement/rejected", payload: "Announcement cannot be empty." });
      return;
    }
    dispatch(setAnnouncement(announcement));
};
  
const handleRemove = (dispatch) => {
    dispatch(removeAnnouncement());
};

// Message Component
const Message = ({ type, text }) => {
  if (!text) return null;

  const messageStyles =
    type === "success"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  return (
    <div className={`mb-4 text-sm p-3 rounded ${messageStyles}`}>
      {text}
    </div>
  );
};

// CurrentAnnouncementDisplay Component
const CurrentAnnouncementDisplay = ({ announcement }) => {
  if (!announcement) return null;

  return (
    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded">
      <strong>Current Announcement:</strong> {announcement.announcement}
    </div>
  );
};

// AnnouncementInput Component
const AnnouncementInput = ({ value, onChange, disabled }) => (
  <div>
    <label
      htmlFor="announcement"
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      Announce
    </label>
    <input
      type="text"
      id="announcement"
      name="announcement"
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
        disabled ? "bg-gray-100" : ""
      }`}
      placeholder="Enter your announcement"
    />
  </div>
);

// AnnouncementButtons Component
const AnnouncementButtons = ({
  onRemove,
  loading,
  isSetDisabled,
  isRemoveDisabled,
}) => (
  <div className="flex justify-between space-x-4">
    {/* Set Button */}
    <button
      type="submit"
      disabled={isSetDisabled || loading}
      className={`flex-1 relative transition-all max-lg:w-[40%] inline-flex justify-center px-5 py-2 border-2 rounded-lg font-medium text-center text-sm
        ${
          isSetDisabled || loading
            ? "bg-gray-400 text-gray-700 border-gray-400 cursor-not-allowed"
            : "bg-black text-white border-white hover:bg-gray-800 hover:border-gray-800"
        }
        focus:outline-none
      `}
    >
      {loading ? "Setting..." : "Set"}
    </button>
    {/* Remove Button */}
    <button
      type="button"
      onClick={onRemove}
      disabled={isRemoveDisabled || loading}
      className={`flex-1 relative transition-all max-lg:w-[40%] inline-flex justify-center px-5 py-2 border-2 rounded-lg font-medium text-center text-sm
        ${
          isRemoveDisabled || loading
            ? "bg-gray-200 text-gray-700 border-gray-200 cursor-not-allowed"
            : "bg-white text-black border-black hover:bg-gray-100 hover:border-gray-300"
        }
        focus:outline-none
      `}
    >
      {loading ? "Processing..." : "Remove"}
    </button>
  </div>
);

// Main AnnouncementForm Component
export default function Announcement() {
  const [announcementInput, setAnnouncementInput] = useState("");

  const dispatch = useDispatch();

  const { currentAnnouncement, loading, error, successMessage } = useSelector(
    (state) => state.admin
  );

  //fetch
  useEffect(() => {
    dispatch(fetchAnnouncement());
  }, [dispatch]);

  // Clear messages after some time or on component unmount
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 5000); // Clear after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [error, successMessage, dispatch]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8">
        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Announcement
        </h2>

        {/* Message */}
        <Message type={error ? "error" : "success"} text={error || successMessage} />

        {/* Current Announcement */}
        <CurrentAnnouncementDisplay announcement={currentAnnouncement} />

        {/* Form */}
        <form
          onSubmit={(e) => handleSet(e, announcementInput, dispatch)}
          className="space-y-4"
        >
          {/* Announcement Input */}
          <AnnouncementInput
            value={announcementInput}
            onChange={(e) => setAnnouncementInput(e.target.value)}
            disabled={loading}
          />

          {/* Buttons */}
          <AnnouncementButtons
            onRemove={() => handleRemove(dispatch)}
            loading={loading}
            isSetDisabled={announcementInput.trim() === ""}
            isRemoveDisabled={!currentAnnouncement || loading}
          />
        </form>
      </div>
    </div>
  );
}
