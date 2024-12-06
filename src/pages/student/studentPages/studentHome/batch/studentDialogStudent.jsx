// src/components/StudentDialog.jsx
import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import debounce from "lodash.debounce";
import axios from "axios";
import { useAuth } from "../../../../../context/authContext";

// Components

const CloseButton = ({ onClose }) => (
  <button
    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
    onClick={onClose}
    aria-label="Close Dialog"
  >
    {/* Close Icon */}
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
);

const AvatarPreview = ({ avatarUrl }) => (
  <div className="mb-6 text-center">
    <img
      src={avatarUrl || "/default-avatar.png"}
      alt="Avatar Preview"
      className="w-24 h-24 rounded-full mx-auto border-2 border-gray-300"
    />
  </div>
);

const InputField = ({ label, type, name, value, onChange, placeholder, disabled }) => (
  <div className="mb-4">
    <label className="block text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={type === "text"}
      className={`w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        disabled ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
      placeholder={placeholder}
      disabled={disabled}
    />
  </div>
);

// Main Component
function StudentDialog({props}) {
  const { authToken } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    avatar: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [studentOptions, setStudentOptions] = useState([]); // Searchable dropdown
  const [selectedStudentOption, setSelectedStudentOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Determine if the dialog is in edit mode based on props.selectedStudent
  useEffect(() => {
    if (props.selectedStudent) {
      setFormData({
        name: props.selectedStudent.name || "",
        username: props.selectedStudent.username || "",
        avatar: props.selectedStudent.avatar || "",
      });
      setIsEditMode(true);
      setSelectedStudentOption({
        value: props.selectedStudent.uid,
        label: `${props.selectedStudent.name} (@${props.selectedStudent.username})`,
        studentData: props.selectedStudent,
      });
    } else {
      setFormData({
        name: "",
        username: "",
        avatar: "",
      });
      setIsEditMode(false);
      setSelectedStudentOption(null);
    }
  }, [props.selectedStudent]);

  // Function to fetch students based on search term
  const fetchStudents = async (authToken, searchTerm, setStudentOptions) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_HOST2}/users/find`,
        {
          params: { role: "student", query: searchTerm },
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      console.log(JSON.stringify(response) + " fetchStudent response");
      const options = response?.data.data.map((student) => ({
        value: student.uid,
        label: `${student.name} (@${student.username})`,
        studentData: student,
      }));
      setStudentOptions(options);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to fetch students. Please try again.");
    }
  };

  // Debounced version of fetchStudents to prevent excessive API calls
  const debouncedFetchStudents = useCallback(
    debounce((searchTerm) => {
      fetchStudents(authToken, searchTerm, setStudentOptions);
    }, 500), // 500ms debounce
    [authToken]
  );

  // Handle input change in the Select component
  const handleStudentInputChange = (inputValue) => {
    if (inputValue.length >= 3) {
      debouncedFetchStudents(inputValue);
    } else {
      setStudentOptions([]);
    }
  };

  // Handle student selection
  const handleSelectStudent = (selectedOption) => {
    setSelectedStudentOption(selectedOption);
    if (selectedOption) {
      setFormData({
        name: selectedOption.studentData.name,
        username: selectedOption.studentData.username,
        avatar: selectedOption.studentData.avatar,
      });
    } else {
      setFormData({
        name: "",
        username: "",
        avatar: "",
      });
    }
  };

  // Cleanup debounce on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      debouncedFetchStudents.cancel();
    };
  }, [debouncedFetchStudents]);

  // Handle form submission to add/update student in batch
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate that a student is selected
    if (!selectedStudentOption) {
      setError("Please select a student.");
      return;
    }

    const payload = {
      uid: selectedStudentOption.value,
      batch_name: props.batch_name,
    };

    try {
      setIsSubmitting(true);
      if (isEditMode) {
        // Update existing student assignment
        await axios.put(
          `${import.meta.env.VITE_APP_HOST2}/batches/update-uid/${props.batch_name}`,
          { uid: selectedStudentOption.value },
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        console.log("Batch student updated:", payload);
      } else {
        // Add new student to batch
        await axios.post(
          `${import.meta.env.VITE_APP_HOST2}/batchStudents/create`,
          payload,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        console.log("Batch student created:", payload);
      }

      // Optionally, show a success message (e.g., using a toast notification)

      // Refresh the batch students list if a refresh function is provided
      if (props.refreshBatchStudents) {
        props.refreshBatchStudents();
      }

      // Close the dialog after successful submission
      props.onClose();
    } catch (error) {
      console.error("Error adding/updating student in batch:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("Failed to add/update student in batch. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting student from batch
  const handleDelete = async () => {
    if (!isEditMode || !selectedStudentOption) return;

    try {
      setIsSubmitting(true);
      await axios.delete(
        `${import.meta.env.VITE_APP_HOST2}/batchStudents/delete/${props.selectedStudent.uid}`,
        {
          headers: { Authorization: `Bearer ${authToken}` }, // Include UID in the request body if required
        }
      );
      console.log("Batch student deleted:", selectedStudentOption.value);

      // Optionally, show a success message

      // Refresh the batch students list if a refresh function is provided
      if (props.refreshBatchStudents) {
        props.refreshBatchStudents();
      }

      // Close the dialog after successful deletion
      props.onClose();
    } catch (error) {
      console.error("Error deleting student from batch:", error);
      setError("Failed to delete student from batch. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input change for other form fields (if any)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <CloseButton onClose={props.onClose} />
        <h2 id="dialog-title" className="text-2xl font-semibold mb-6 text-gray-800">
          Student in Batch
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Avatar Preview (Optional) */}
          <AvatarPreview avatarUrl={formData.avatar} />

          {/* Student Selection Dropdown */}
          <div className="mb-4">
            <label className="block text-gray-700">Select Student</label>
            <div className="mt-2">
              <Select
                options={studentOptions}
                value={selectedStudentOption}
                onChange={handleSelectStudent}
                onInputChange={handleStudentInputChange}
                isClearable
                placeholder="Search and select a student..."
                noOptionsMessage={() =>
                  "Type at least 3 characters to search students"
                }
                isLoading={isSubmitting}
                isDisabled={isEditMode}
              />
            </div>
          </div>

          {/* Display Error Message */}
          {error && (
            <div className="mb-4 text-red-500">
              <p>{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end mt-6">
            {/* {isEditMode && (
              <button
                type="button"
                onClick={handleDelete}
                className="mr-auto text-red-500 hover:text-red-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </button>
            )} */}
{/* { !isEditMode &&           <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isEditMode ? null : (isSubmitting ? "Adding..." : "Add Student")}
            </button>} */}
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentDialog;
