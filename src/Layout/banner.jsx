// src/components/AnnouncementBanner.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideAnnouncement, selectAnnouncementMessage, selectAnnouncementLink, selectAnnouncementVisibility } from '../generalSlice/generalSlice';


const AnnouncementBanner = () => {
  const dispatch = useDispatch();
  const message = useSelector(selectAnnouncementMessage);
  const link = useSelector(selectAnnouncementLink);
  const isVisible = useSelector(selectAnnouncementVisibility);

  console.log(isVisible)
  if (!isVisible) return null;

  return (
    
    <div className="z-[3] lg:w-[100%] max-lg:w-[100%] bg-yellow-300 text-gray-800 py-3 px-4 md:px-6 flex flex-col md:flex-row items-center justify-between absolute">
      <div className="text-sm md:text-base flex flex-col md:flex-row items-center text-center md:text-left lg:ml-[4rem]">
        <span className="font-semibold">Announcement:</span>
        <span className="ml-0 md:ml-2 mt-1 md:mt-0">{message}</span>
        {link && (
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 md:mt-0 md:ml-4 text-blue-600 underline"
          >
            {link.text}
          </a>
        )}
      </div>
      <button
        onClick={() => dispatch(hideAnnouncement())}
        className="mt-3 md:mt-0 text-gray-800 hover:text-gray-900 md:ml-4"
        aria-label="Close announcement"
      >
        ✕
      </button>
    </div>
  );
};

export default AnnouncementBanner;
