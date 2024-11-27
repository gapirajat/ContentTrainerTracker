// src/components/SessionDialog.jsx
// RUD session (topic, timestamp, completion) or create new
import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../../../../context/authContext";
import { useGeneral } from "../../../../../context/generalContext";

function SessionDialog({ props }) {
  // {selectedSession, onClose, course_name}
  const { authToken } = useAuth();
  const [topics, setTopics] = useState([]);

  const { setSnackbarMessage, showSnackbar } = useGeneral();

  // Local data
  const [formData, setFormData] = useState({
    topic_name: "",
    start_time: new Date(),
    end_time: new Date(),
  });

  // Toggle between add new and edit (by checking session presence)
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (props.selectedSession) {
      // VIEW SESSION
      console.log(`Viewing session: ${JSON.stringify(props.selectedSession)}`);
      setFormData({
        topic_name: props.selectedSession?.topic?.topic_name || "",
        start_time: new Date(props.selectedSession?.start_time),
        end_time: new Date(props.selectedSession?.end_time),
      });
      setIsEditMode(true);
    } else {
      // ADD NEW
      setFormData({
        topic_name: "",
        start_time: new Date(),
        end_time: new Date(),
      });
      setIsEditMode(false);
    }
  }, [props.selectedSession]);

  // GET topics/all/{course_name}
  useEffect(() => {
    async function fetchTopics() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_HOST2}/topics/all/${props.course_name}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setTopics(response.data);
      } catch (error) {
        console.error("Error while fetching topics", error);
      }
    }

    if (props.course_name) {
      fetchTopics();
    }
  }, [authToken, props.course_name]);

  const handleTopicChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log("Form Data Updated:", formData);
  };

  const handleDateChange = (date, name) => {
    setFormData({ ...formData, [name]: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Logic to create or update session
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_APP_HOST2}/session/delete/${sessionId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      props.setSessions(
        props.sessions.filter((session) => session.session_id !== sessionId)
      );
      setSnackbarMessage(`Session deleted successfully: ${response.data}`);
      showSnackbar();
    } catch (error) {
      console.error("Error deleting session:", error);
      setSnackbarMessage(`Error deleting session: ${error}`);
      showSnackbar();
    }
  };

  const handleAddOrUpdateSession = async () => {
    try {
      if (!isEditMode) {
        const response = await axios.post(
          `${import.meta.env.VITE_APP_HOST2}/session/bulkCreate`,
          {
            sessions: [
              {
                start_time: formData.start_time,
                end_time: formData.end_time,
                topic_name: formData.topic_name,
                batch_name: props.batch_name,
                completion: "no",
              },
            ],
          },
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setSnackbarMessage(`Session created successfully: ${response.data}`);
        showSnackbar();
      } else {
        //PUT session/bulkUpdate
        const response = await axios.put(
          `${import.meta.env.VITE_APP_HOST2}/session/bulkUpdate`,
          {
            sessions: [
              {
                session_id: props.selectedSession?.session_id,
                start_time: formData.start_time,
                end_time: formData.end_time,
                topic_name: formData.topic_name,
                batch_name: props.batch_name,
              },
            ],
          },
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setSnackbarMessage(`Session updated successfully: ${response.data}`);
        showSnackbar();
      }
    } catch (error) {
      console.error("Error creating session:", error);
      setSnackbarMessage(`Error: ${error}`);
      showSnackbar();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={props.onClose}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          {isEditMode ? "Edit Session" : "Add Session"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Topic Name Field */}
          <div className="mb-4">
            <label className="block text-gray-700">Topic Name</label>
            <select
              id="topic_name"
              name="topic_name"
              required
              value={formData.topic_name}
              onChange={handleTopicChange}
              className="appearance-none block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            >
              <option value="" disabled>
              {formData.topic_name}
              </option>
              {/* {topics?.map((topic) => (
                <option key={topic.topic_id} value={topic.topic_name}>
                  {topic.topic_name}
                </option>
              ))} */}
            </select>
          </div>
          {/* Start Time Picker */}
          <div className="mb-4">
            <label className="block text-gray-700">Start Time</label>
            <DatePicker
              selected={formData.start_time}
              onChange={(date) => handleDateChange(date, "start_time")}
              showTimeSelect
              dateFormat="Pp"
              className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={true}
            />
          </div>
          {/* End Time Picker */}
          <div className="mb-4">
            <label className="block text-gray-700">End Time</label>
            <DatePicker
              selected={formData.end_time}
              onChange={(date) => handleDateChange(date, "end_time")}
              showTimeSelect
              dateFormat="Pp"
              className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={true}
            />
          </div>
          {/* Buttons */}
          <div className="flex justify-end mt-6">
            {/* {isEditMode && (
              <button
                type="button"
                onClick={() =>
                  handleDeleteSession(props.selectedSession?.session_id)
                }
                className="mr-auto text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            )} */}
            {/* <button
              type="submit"
              onClick={handleAddOrUpdateSession}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
            >
              {isEditMode ? "Update Session" : "Add Session"}
            </button> */}
          </div>
        </form>
      </div>
    </div>
  );
}

export default SessionDialog;
