// SubmitComplaintForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBatchesByUid,
  fetchComplaints,
  postComplaint,
  selectBatches,
} from '../../studentSlice/studentSlice'; // Adjust the path as needed
import { useAuth } from '../../../../context/authContext';

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
  selectedBatch,
  issueType,
  message,
  isAnonymous,
  dispatch
) => {
  e.preventDefault();

  // Basic form validation
  if (!selectedBatch) {
    alert('Please select your batch.');
    return;
  }
  if (!issueType || message.trim() === '') {
    alert('Please select an issue type and describe your issue.');
    return;
  }

  // Prepare complaint data
  const complaintData = {
    batch_id: selectedBatch.batch_id,
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
  batches,
  selectedBatch,
  setSelectedBatch,
  isBatchDropdownOpen,
  setIsBatchDropdownOpen,
  batchDropdownRef,
}) => (
  <div>
    <label htmlFor="batch" className="block text-gray-700 font-medium mb-2 ">
      Select Your Batch
    </label>
    <div
      className="relative flex-shrink-0 w-full rounded-md"
      ref={batchDropdownRef}
    >
      <button
        disabled={!batches}
        type="button"
        onClick={() => setIsBatchDropdownOpen(!isBatchDropdownOpen)}
        className={`w-full text-gray-700 py-2 px-3 border-2 rounded-md flex items-center justify-between focus:outline-none ${
          isBatchDropdownOpen ? 'rounded-b-none border-b-0' : ''
        }`}
      >
        {selectedBatch?.batch_name || 'Select Your Batch'}
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
          {batches?.map((batch) => (
            <li
              key={batch.batch_id}
              className="cursor-pointer hover:bg-gray-100 px-3 py-2"
              onClick={() => {
                setSelectedBatch(batch);
                setIsBatchDropdownOpen(false);
              }}
            >
              {batch.batch_name}
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
              'Billing',
              'Technical Support',
              'Account Management',
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

// Complaints List Component
const ComplaintsList = ({ complaints, fetchStatus, fetchError }) => {
    const resolved = complaints.filter((c) => c.isResolved);
    const unresolved = complaints.filter((c) => !c.isResolved);
  
    return (
      <div className="w-full max-w-3xl mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Complaints</h2>
        {fetchStatus === 'loading' && <p>Loading complaints...</p>}
        {fetchStatus === 'failed' && <p className="text-red-500">Error: {fetchError}</p>}
        {fetchStatus === 'succeeded' && (
          <>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Resolved</h3>
            {resolved.length > 0 ? (
              resolved.map((complaint) => (
                <div key={complaint.id} className="p-4 bg-gray-100 rounded-lg mb-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">{complaint.issue}</span>
                    <span className="text-sm font-medium text-green-600">Resolved</span>
                  </div>
                  <p className="text-gray-600 mt-2">{complaint.comment}</p>
                </div>
              ))
            ) : (
              <p>No resolved complaints.</p>
            )}
  
            <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-2">Not Resolved</h3>
            {unresolved.length > 0 ? (
              unresolved.map((complaint) => (
                <div key={complaint.id} className="p-4 bg-gray-100 rounded-lg mb-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">{complaint.issue}</span>
                    <span className="text-sm font-medium text-red-600">Pending</span>
                  </div>
                  <p className="text-gray-600 mt-2">{complaint.comment}</p>
                </div>
              ))
            ) : (
              <p>No unresolved complaints.</p>
            )}
          </>
        )}
      </div>
    );
  };

// -------------------- Main Component --------------------

const SubmitComplaintForm = () => {
    const dispatch = useDispatch();
    const batches = useSelector(selectBatches);
    const { complaints, fetchStatus, fetchError, postStatus, postError } = useSelector((state) => state.student);
    const { user, authToken } = useAuth();
  
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [issueType, setIssueType] = useState('');
    const [message, setMessage] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isIssueDropdownOpen, setIsIssueDropdownOpen] = useState(false);
    const [isBatchDropdownOpen, setIsBatchDropdownOpen] = useState(false);
    const [showComplaints, setShowComplaints] = useState(false);
  
    const issueDropdownRef = useRef(null);
    const batchDropdownRef = useRef(null);
  
    useEffect(() => {
      fetchUserBatches(user.uid, authToken, dispatch);
    }, [user.uid, authToken, dispatch]);
  
    useEffect(() => {
      fetchAllComplaints(dispatch);
    }, [dispatch]);
  
    useEffect(() => {
      if (postStatus === 'succeeded') {
        setSelectedBatch(null);
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
  
    return (
      <div className="bg-gradient-to-r flex flex-col items-center justify-center min-h-screen p-4">
        {/* Tabs */}
        <Tabs showComplaints={showComplaints} setShowComplaints={setShowComplaints} />
  
        {!showComplaints ? (
          <form
            onSubmit={(e) =>
              handleFormSubmit(
                e,
                selectedBatch,
                issueType,
                message,
                isAnonymous,
                dispatch
              )
            }
            className="space-y-6 w-full max-w-3xl"
          >
            <BatchDropdown
              batches={batches}
              selectedBatch={selectedBatch}
              setSelectedBatch={setSelectedBatch}
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
          <ComplaintsList
            complaints={complaints}
            fetchStatus={fetchStatus}
            fetchError={fetchError}
          />
        )}
      </div>
    );
  };

export default SubmitComplaintForm;
