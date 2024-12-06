// SubmitComplaintForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../../../context/authContext';

import { selectBatches } from '../../adminSlice/adminSlice'; // Adjust the path as needed
import { fetchBatchesByUid } from '../../adminSlice/adminSliceBatches';
import { postComplaint, fetchComplaints, updateStatus } from '../../adminSlice/adminSliceIssue';
import { fetchAllCoordinators } from '../../adminSlice/adminSliceCoordinators';

import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationIcon,
  ExclamationCircleIcon,
  RefreshIcon, // Ensure this icon exists in your exports
} from '@heroicons/react/outline'; // Adjust the path accordingly

// -------------------- Helper Functions --------------------

// Fetch batches by UID
const fetchUserBatches = (userId, authToken, dispatch) => {
  if (userId && authToken) {
    console.log('Fetching batches for UID:', userId);
    const props = {
      uid: userId,
      authToken: authToken,
    };
    dispatch(fetchBatchesByUid(props));
  }
};

// Fetch all complaints
const fetchAllComplaints = (dispatch) => {
  dispatch(fetchComplaints());
};

// Post a new complaint
const submitComplaint = (complaintData, dispatch) => {
  dispatch(postComplaint(complaintData));
};

// Handle form submission
const handleFormSubmit = (
  e,
  selectedCoordinator,
  issueType,
  message,
  isAnonymous,
  dispatch
) => {
  e.preventDefault();

  // Basic form validation
  if (!selectedCoordinator) {
    console.log(selectedCoordinator)
    alert('Please select your Coordinator.');
    return;
  }
  if (!issueType || message.trim() === '') {
    alert('Please select an issue type and describe your issue.');
    return;
  }

  // Prepare complaint data
  //sender username is derived from auth
  const complaintData = {
    reciever_username: selectedCoordinator.username,
    issue: issueType,
    comment: message,
    isAnonymous,
  };

  console.log(complaintData);

  // Dispatch postComplaint thunk
  submitComplaint(complaintData, dispatch);
};

// Handle clicks outside of dropdowns to close them
const handleClickOutside = (
  event,
  issueDropdownRef,
  batchDropdownRef,
  setIsIssueDropdownOpen,
  setIsBatchDropdownOpen
) => {
  if (
    issueDropdownRef.current &&
    !issueDropdownRef.current.contains(event.target)
  ) {
    setIsIssueDropdownOpen(false);
  }
  if (
    batchDropdownRef.current &&
    !batchDropdownRef.current.contains(event.target)
  ) {
    setIsBatchDropdownOpen(false);
  }
};

// -------------------- Subcomponents --------------------

// Tabs Component
const Tabs = ({ showComplaints, setShowComplaints }) => (
    <div className="flex space-x-4 mb-6">
      <button
        onClick={() => setShowComplaints(false)}
        className={`px-4 py-2 font-medium ${
          !showComplaints ? 'text-gray-800 border-b-2 border-gray-800' : 'text-gray-500'
        }`}
      >
        Submit Complaint
      </button>
      <button
        onClick={() => setShowComplaints(true)}
        className={`px-4 py-2 font-medium ${
          showComplaints ? 'text-gray-800 border-b-2 border-gray-800' : 'text-gray-500'
        }`}
      >
        Complaints List
      </button>
    </div>
  );

// Batch Dropdown Component
const BatchDropdown = ({
  coordinators,
  selectedCoordinator,
  setSelectedCoodinator,
  isBatchDropdownOpen,
  setIsBatchDropdownOpen,
  batchDropdownRef,
}) => (
  <div>
    <label htmlFor="batch" className="block text-gray-700 font-medium mb-2 ">
      Select Coordinator
    </label>
    <div
      className="relative flex-shrink-0 w-full rounded-md"
      ref={batchDropdownRef}
    >
      <button
        disabled={!coordinators}
        type="button"
        onClick={() => setIsBatchDropdownOpen(!isBatchDropdownOpen)}
        className={`w-full text-gray-700 py-2 px-3 border-2 rounded-md flex items-center justify-between focus:outline-none ${
          isBatchDropdownOpen ? 'rounded-b-none border-b-0' : ''
        }`}
      >
        {selectedCoordinator?.name || 'Select Coordinator'}
        <svg
          className={`fill-current h-4 w-4 transition-transform ${
            isBatchDropdownOpen ? 'transform rotate-180' : ''
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M5.516 7.548l4.484 4.484 4.484-4.484L15 8.032l-5 5-5-5z" />
        </svg>
      </button>
      {isBatchDropdownOpen && (
        <ul className="absolute z-10 top-full w-full rounded-b-md bg-white border-2 border-t">
          {coordinators?.map((coordinator) => (
            <li
              key={coordinator.uid}
              className="cursor-pointer hover:bg-gray-100 px-3 py-2"
              onClick={() => {
                setSelectedCoodinator(coordinator);
                setIsBatchDropdownOpen(false);
              }}
            >
              {coordinator.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

// Issue Type Dropdown and Message Input Component
const IssueAndMessageInput = ({
  issueType,
  setIssueType,
  message,
  setMessage,
  isIssueDropdownOpen,
  setIsIssueDropdownOpen,
  issueDropdownRef,
}) => (
  <div>
    <label
      htmlFor="issue-and-message"
      className="block text-gray-700 font-medium mb-2"
    >
      Issue Details
    </label>
    <div className="flex items-center space-x-2">
      {/* Custom Issue Type Dropdown */}
      <div className="relative flex-shrink-0" ref={issueDropdownRef}>
        <button
          type="button"
          onClick={() => setIsIssueDropdownOpen(!isIssueDropdownOpen)}
          className={`w-32 bg-gray-100 text-gray-700 py-2 px-3 rounded-l-md flex items-center justify-between focus:outline-none ${
            isIssueDropdownOpen ? 'rounded-bl-none' : ''
          }`}
        >
          {issueType || 'Select'}
          <svg
            className={`fill-current h-4 w-4 transition-transform ${
              isIssueDropdownOpen ? 'transform rotate-180' : ''
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M5.516 7.548l4.484 4.484 4.484-4.484L15 8.032l-5 5-5-5z" />
          </svg>
        </button>
        {isIssueDropdownOpen && (
          <ul className="absolute z-10 top-full w-full bg-gray-100 rounded-b-md rounded-br-none shadow-lg">
            {[
              'Refund',
              'Server',
              'Schedule',
              'Technical',
              'Other',
            ].map((option) => (
              <li
                key={option}
                className="cursor-pointer hover:bg-gray-200 px-3 py-2"
                onClick={() => {
                  setIssueType(option);
                  setIsIssueDropdownOpen(false);
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Message Input */}
      <input
        type="text"
        id="message"
        name="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 block w-full bg-gray-100 rounded-r-md py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none"
        placeholder="Describe your issue..."
      />
    </div>
  </div>
);

// Anonymous Toggle Switch Component
const AnonymousToggle = ({ isAnonymous, setIsAnonymous }) => (
  <div className="flex items-center justify-between">
    <label htmlFor="anonymous" className="flex items-center cursor-pointer">
      {/* Toggle */}
      <div className="relative">
        <input
          id="anonymous"
          name="anonymous"
          type="checkbox"
          checked={isAnonymous}
          onChange={() => setIsAnonymous(!isAnonymous)}
          className="sr-only"
          disabled
        />
        <div
          className={`toggle-bg w-11 h-6 rounded-full shadow-inner transition-colors duration-200 ${
            isAnonymous ? 'bg-gray-500' : 'bg-gray-100'
          }`}
        ></div>
        <div
          className={`toggle-dot absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
            isAnonymous ? 'translate-x-full' : ''
          }`}
        ></div>
      </div>
      {/* Label */}
      <span className="ml-3 text-gray-700 font-medium">
        Submit Anonymously
      </span>
    </label>
  </div>
);

// Submit Button Component
const SubmitButton = ({ isDisabled, isLoading }) => (
  <div className="flex space-x-4">
    <button
      type="submit"
      disabled={isDisabled}
      className={`flex-1 relative transition-all max-lg:w-[40%] inline-flex justify-center px-5 py-2 border-2 rounded-lg font-medium text-center text-sm ${
        isLoading
          ? 'bg-gray-200 text-gray-700 border-gray-200 cursor-not-allowed'
          : 'bg-gray-600 text-white border-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500'
      }`}
    >
      {isLoading ? 'Processing...' : 'Send'}
    </button>
  </div>
);

// Complaints List 


const ComplaintsList = ({ complaints, fetchStatus, fetchError, onPendingClick, fetchAllComplaints }) => {
  console.log(complaints)
  useEffect(() => {
    fetchAllComplaints();
  }, [])
  // if (complaints == null) return null
  const resolved = complaints?.filter((c) => c.isResolved);
  const unresolved = complaints?.filter((c) => !c.isResolved);

  return (
    <div className="w-full max-w-4xl mt-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Complaints</h2>
      
      {/* Loading State */}
      {fetchStatus === 'loading' && (
        <div className="flex items-center justify-center">
          <RefreshIcon className="h-6 w-6 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Loading complaints...</span>
        </div>
      )}
      
      {/* Error State */}
      {fetchStatus === 'failed' && (
        <div className="flex items-center text-red-500">
          <ExclamationCircleIcon className="h-6 w-6 mr-2" />
          <span>Error: {fetchError}</span>
        </div>
      )}
      
      {/* Complaints List */}
      {fetchStatus === 'succeeded' && (
        <>
          {/* Resolved Complaints */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-green-600 mb-4 flex items-center">
              <CheckCircleIcon className="h-6 w-6 mr-2" /> Resolved Complaints
            </h3>
            {resolved?.length > 0 ? (
              <div className="space-y-4">
                {resolved?.map((complaint) => (
                  <div key={complaint.id} className="p-5 bg-white shadow rounded-lg flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-medium text-gray-700">{complaint.issue}</h4>
                      <p className="text-gray-600 mt-1">{complaint.comment}</p>
                    </div>
                    <span className="flex items-center text-green-600 font-semibold">
                      <CheckCircleIcon className="h-5 w-5 mr-1" /> Resolved
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No resolved complaints.</p>
            )}
          </section>

          {/* Unresolved Complaints */}
          <section>
            <h3 className="text-2xl font-semibold text-yellow-600 mb-4 flex items-center">
              <ExclamationIcon className="h-6 w-6 mr-2" /> Pending Complaints
            </h3>
            {unresolved?.length > 0 ? (
              <div className="space-y-4">
                {unresolved?.map((complaint) => (
                  <div key={complaint.id} className="p-5 bg-white shadow rounded-lg flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-medium text-gray-700">{complaint.issue}</h4>
                      <p className="text-gray-600 mt-1">{complaint.comment}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center text-yellow-600 font-semibold">
                        <ExclamationIcon className="h-5 w-5 mr-1" /> Pending
                      </span>
                      <button
                        onClick={() => onPendingClick(complaint.id)}
                        className="flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        aria-label={`Resolve complaint regarding ${complaint.issue}`}
                      >
                        <ExclamationIcon className="h-5 w-5 mr-1" /> Resolve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No pending complaints.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
};



// -------------------- Main Component --------------------

const AdminComplaintForm = () => {
    const dispatch = useDispatch();
    const batches = useSelector(selectBatches);
    const { complaints, fetchStatus, fetchError, postStatus, postError, coordinators } = useSelector((state) => state.admin);
    const { user, authToken } = useAuth();
  
    const [selectedCoordinator, setSelectedCoodinator] = useState(null);
    const [issueType, setIssueType] = useState('');
    const [message, setMessage] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isIssueDropdownOpen, setIsIssueDropdownOpen] = useState(false);
    const [isBatchDropdownOpen, setIsBatchDropdownOpen] = useState(false);
    const [showComplaints, setShowComplaints] = useState(false);
  
    // New state variables for dialog
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  
    const issueDropdownRef = useRef(null);
    const batchDropdownRef = useRef(null);
  
    // Existing useEffect hooks
    useEffect(() => {
      dispatch(fetchAllCoordinators())
    }, [])
    
  
    useEffect(() => {
      fetchAllComplaints(dispatch);
    }, [dispatch]);
  
    useEffect(() => {
      if (postStatus === 'succeeded') {
        setSelectedCoodinator(null);
        setIssueType('');
        setMessage('');
        setIsAnonymous(false);
      }
    }, [postStatus]);
  
    useEffect(() => {
      const handleDocumentClick = (event) =>
        handleClickOutside(
          event,
          issueDropdownRef,
          batchDropdownRef,
          setIsIssueDropdownOpen,
          setIsBatchDropdownOpen
        );
  
      document.addEventListener('mousedown', handleDocumentClick);
      return () => document.removeEventListener('mousedown', handleDocumentClick);
    }, []);
  
    // Function to open the dialog
    const openDialog = (complaintId) => {
      setSelectedComplaintId(complaintId);
      setIsDialogOpen(true);
    };
  
    // Function to close the dialog
    const closeDialog = () => {
      setIsDialogOpen(false);
      setSelectedComplaintId(null);
    };
  
    // Function to handle confirmation
    const handleConfirm = () => {
      if (selectedComplaintId) {
        dispatch(updateStatus({ complaintId: selectedComplaintId, status: 'resolved' }));
        // Optionally, refetch complaints or handle post-update logic here
        closeDialog();
      }
    };
  
    return (
      <div className="bg-gradient-to-r flex flex-col items-center justify-center min-h-screen p-4">
        {/* Tabs */}
        <Tabs showComplaints={showComplaints} setShowComplaints={setShowComplaints} />
  
        {!showComplaints ? (
          <form
            onSubmit={(e) =>
              handleFormSubmit(
                e,
                selectedCoordinator,
                issueType,
                message,
                isAnonymous,
                dispatch
              )
            }
            className="space-y-6 w-full max-w-3xl"
          >
            <BatchDropdown
              coordinators={coordinators}
              selectedCoordinator={selectedCoordinator}
              setSelectedCoodinator={setSelectedCoodinator}
              isBatchDropdownOpen={isBatchDropdownOpen}
              setIsBatchDropdownOpen={setIsBatchDropdownOpen}
              batchDropdownRef={batchDropdownRef}
            />
  
            <IssueAndMessageInput
              issueType={issueType}
              setIssueType={setIssueType}
              message={message}
              setMessage={setMessage}
              isIssueDropdownOpen={isIssueDropdownOpen}
              setIsIssueDropdownOpen={setIsIssueDropdownOpen}
              issueDropdownRef={issueDropdownRef}
            />
  
            <AnonymousToggle
              isAnonymous={isAnonymous}
              setIsAnonymous={setIsAnonymous}
            />
  
            <SubmitButton
              isDisabled={!batches || postStatus === 'loading'}
              isLoading={postStatus === 'loading'}
            />
          </form>
        ) : (
          complaints &&
          <ComplaintsList
          fetchAllComplaints={() => fetchAllComplaints(dispatch)}
            complaints={complaints?.complaints}
            fetchStatus={fetchStatus}
            fetchError={fetchError}
            onPendingClick={openDialog} // Pass the openDialog function
          />
        )}
  
        {/* Dialog Box */}
        {isDialogOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-80">
              <h3 className="text-lg font-semibold mb-4">Update Complaint Status</h3>
              <p className="mb-6">Do you want to update the status to resolved?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeDialog}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  No
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
export default AdminComplaintForm;