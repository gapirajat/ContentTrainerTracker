//
// src/components/Carousel.jsx
import { LockClosedIcon } from "@heroicons/react/solid";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

// Function to fetch sessions data
const fetchSessions = async (batch_name, authToken, setSessions, setError) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_HOST2}/session/all/${batch_name}`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    setSessions(response.data);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    setError("Failed to load sessions.");
  }
};

// Function to update session status
const updateSessionStatus = async (session_id, newStatus, authToken) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_APP_HOST2}/session/${session_id}`,
      { completion: newStatus },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Carousel component
const Carousel = ({ props }) => {
  const scrollRef = useRef(null);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [error, setError] = useState(null);

  const scroll = (scrollOffset) => {
    scrollRef.current.scrollBy({
      left: scrollOffset,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    console.log("carousel use effect");
    fetchSessions(
      props.batch_name,
      props.authToken,
      props.setSessions,
      setError
    ).finally(() => setLoadingSessions(false));
  }, [props.batch_name, props.authToken, props.setSessions]);

  return (
    <div className="relative w-full mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 mx-8">
        Sessions
      </h2>
      {loadingSessions ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading sessions...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="flex items-center">
          <ScrollButton direction="left" onClick={() => scroll(-300)} />
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scroll-smooth space-x-6 px-4 py-2 custom-scrollbar"
          >
            {props.sessions.length === 0 ? (
              <div className="min-w-[280px] h-64 flex-shrink-0 flex items-center justify-center">
                <p className="text-gray-500">No sessions available.</p>
              </div>
            ) : (
              <SessionList
                sessions={props.sessions}
                handleSessionClick={props.handleSessionClick}
                setSessions={props.setSessions}
                authToken={props.authToken}
              />
            )}
            {/* <AddSessionCard handleAddSession={props.handleAddSession} /> */}
          </div>
          <ScrollButton direction="right" onClick={() => scroll(300)} />
        </div>
      )}
    </div>
  );
};

export default Carousel;

// ScrollButton Component
function ScrollButton({ direction, onClick }) {
  const iconRotation = direction === "left" ? "rotate-180" : "";

  return (
    <button
      onClick={onClick}
      className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none"
      aria-label={`Scroll ${direction}`}
    >
      <svg
        className={`w-8 h-8 ${iconRotation}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
}

// SessionList Component
function SessionList({ sessions, handleSessionClick, setSessions, authToken }) {
  return (
    <>
      {sessions?.map((session) => (
        <SessionCard
          key={session?.session_id}
          session={session}
          handleSessionClick={handleSessionClick}
          setSessions={setSessions}
          authToken={authToken}
        />
      ))}
    </>
  );
}

// SessionCard Component with enhanced click-based status management and API integration
function SessionCard({ session, handleSessionClick, setSessions, authToken }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const menuRef = useRef(null);

  const statusDescriptions = {
    yes: "Completed",
    no: "Not Started",
    conflict: "Conflict Detected",
  };

  const statusColors = {
    yes: "bg-green-100 text-green-800",
    no: "bg-red-100 text-red-800",
    conflict: "bg-yellow-100 text-yellow-800",
  };

  // Function to handle status change
  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const updatedSession = await updateSessionStatus(
        session.session_id,
        newStatus,
        authToken
      );
      // Update the session in the state
      setSessions((prevSessions) =>
        prevSessions.map((s) =>
          s.session_id === session.session_id ? updatedSession : s
        )
      );
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Error updating session status:", error);
      setUpdateError("Failed to update status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Function to close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div
      className={`relative min-w-[280px] h-64 flex-shrink-0 bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all duration-200 transform ${
        isMenuOpen
          ? "shadow-2xl scale-105"
          : "hover:shadow-lg hover:-translate-y-1"
      }`}
      onClick={() => handleSessionClick(session)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="relative ml-auto" ref={menuRef}>
          <button
            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded cursor-pointer focus:outline-none f ${
              statusColors[session?.completion]
            }`}
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the card click
              setIsMenuOpen(!isMenuOpen);
            }}
            aria-haspopup="true"
            aria-expanded={isMenuOpen}
            aria-label="Change Status"
          >
            {getStatusIcon(session?.completion)}
            {statusDescriptions[session?.completion]}
            {'    '}
            {
              session?.completion !== 'no' && <LockClosedIcon />
            }
          </button>

          {/* Status Change Menu */}
          {isMenuOpen && session?.completion === 'no' && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              <p className="text-gray-700 font-semibold px-4 py-2 border-b">
                Change Status:
              </p>
              <div className="flex flex-col">
                
                
                  <button
                    className={`text-left px-4 py-2 hover:bg-gray-100 flex items-center ${statusColors.yes}`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the card click
                      handleStatusChange("yes");
                    }}
                    disabled={isUpdating}
                  >
                    {getStatusIcon("yes")}
                    {statusDescriptions.yes}
                  </button>
                
              </div>

              {isUpdating && (
                <div className="px-4 py-2 text-center text-sm text-gray-500">
                  Updating...
                </div>
              )}
              {updateError && (
                <div className="px-4 py-2 text-center text-sm text-red-500">
                  {updateError}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-800">
        {session?.topic?.topic_name}
      </h3>
      <div className="mt-2">
        <p className="text-gray-600">
          <strong>Date:</strong>{" "}
          {new Date(session?.start_time).toLocaleDateString()}
        </p>
        <p className="text-gray-600">
          <strong>Start:</strong>{" "}
          {new Date(session?.start_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>End:</strong>{" "}
          {new Date(session?.end_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}

// Function to get status icons (optional enhancement)
const getStatusIcon = (status) => {
  const icons = {
    yes: (
      <svg
        className="w-4 h-4 inline-block mr-1"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 111.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
    no: (
      <svg
        className="w-4 h-4 inline-block mr-1"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    ),
    conflict: (
      <svg
        className="w-4 h-4 inline-block mr-1"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.727-1.36 3.492 0l6.518 11.59c.75 1.334-.213 3.004-1.742 3.004H3.48c-1.53 0-2.492-1.67-1.742-3.004L8.257 3.1zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
  };

  return icons[status] || null;
};

// // AddSessionCard Component with gradient and hover effect
// function AddSessionCard({ handleAddSession }) {
//   return (
//     <div
//       className="min-w-[280px] h-64 flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-md p-6 flex items-center justify-center cursor-pointer hover:from-blue-600 hover:to-indigo-600 transition-colors duration-200"
//       onClick={handleAddSession}
//     >
//       <div className="text-center">
//         <svg
//           className="w-12 h-12 mx-auto text-white"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M12 4v16m8-8H4"
//           />
//         </svg>
//         <p className="mt-2 text-white font-semibold">Add New Session</p>
//       </div>
//     </div>
//   );
// }
