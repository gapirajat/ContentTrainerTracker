import React, { useState } from "react";

export default function SearchResult({props}) {
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    const handleResultClick = (profile) => {
        setSelectedProfile(profile);
        setShowDialog(true);
      };
    
      const closeDialog = () => {
        setShowDialog(false);
        setSelectedProfile(null);
      };
    
  return (
    <>
      {/* Loading State */}
      {props.loading && <p className="text-gray-500">Loading...</p>}

      {/* Results List */}
      <ul className="w-[90%] space-y-2">
        {props.results?.map((profile) => (
          <li
            key={profile.id}
            onClick={() => handleResultClick(profile)}
            className="p-4 bg-white border rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer"
          >
            <p className="font-semibold">{profile.name}</p>
            <p className="text-sm text-gray-600">{profile.email}</p>
          </li>
        ))}
      </ul>

      {/* Dialog */}
      {showDialog && selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Profile Details</h2>
            <p>
              <strong>Name:</strong> {selectedProfile.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedProfile.email}
            </p>
            <p>
              <strong>Role:</strong> {selectedProfile.role}
            </p>
            <p>
              <strong>Username:</strong> {selectedProfile.username}
            </p>
            {/* Add more details if necessary */}
            <button
              onClick={closeDialog}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
