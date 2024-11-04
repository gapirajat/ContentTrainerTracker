// src/components/Carousel.jsx
import React, { useRef } from 'react';

const Carousel = ({ props }) => { //{sessions:sessions, handleSessionClick:handleSessionClick, handleAddSession:handleAddSession, handleDeleteSession:handleDeleteSession}
  const scrollRef = useRef(null);

  const scroll = (scrollOffset) => {
    scrollRef.current.scrollLeft += scrollOffset;
  };

  console.log(props.sessions)

  return (
    <div className="relative w-full mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 mx-8">
        Sessions
      </h2>
      <div className="flex items-center">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll(-300)}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto scroll-smooth space-x-4 px-4 py-2"
        >

          <SessionCard props={{sessions:props.sessions, handleSessionClick: props.handleSessionClick}} />

          {/* Add Session Card */}
          <div
            className="min-w-[280px] h-64 flex-shrink-0 bg-gray-100 rounded-xl shadow-md p-6 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors duration-200"
            onClick={props.handleAddSession}
          >
            <div className="text-center">
              <svg
                className="w-12 h-12 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <p className="mt-2 text-gray-600">Add New Session</p>
            </div>
          </div>
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll(300)}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Carousel;



function SessionCard({props}) {
  return (
    <>
        {props.sessions?.map((session) => (
      <div
        key={session?.session_id}
        className="relative min-w-[280px] h-64 flex-shrink-0 bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
        onClick={() => props.handleSessionClick(session)}
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {session?.topic?.topic_name}
        </h3>
        <p className="text-gray-600">
          <strong>Date:</strong>{' '}
          {new Date(session?.start_time).toLocaleDateString()}
        </p>
        <p className="text-gray-600">
          <strong>Start:</strong>{' '}
          {new Date(session?.start_time).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
        <p className="text-gray-600 mb-4">
          <strong>End:</strong>{' '}
          {new Date(session?.end_time).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
        <p className="text-gray-500 text-sm">
          <strong>Status:</strong> {session?.completion}
        </p>
      </div>
    ))}
    </>

  )
}

