// src/components/TrainerDialog.jsx
import React, { useState, useEffect } from "react";
import Select from "react-select";
// Import any necessary libraries for fetching data
// For example, axios or fetch API can be used
import axios from "axios";
import { useAuth } from "../../../../../context/authContext";
import { useGeneral } from "../../../../../context/generalContext";


// CRUD functions
const createOrUpdateTrainer = async (e, formData, authToken, isEditMode, selectedTrainerOption, batch_name) => {
  e.preventDefault();
  try {
    // if (formData.id) {
      // Update existing trainer
    //   await axios.put(
    //     `/api/trainers/${formData.id}`,
    //     {
    //       name: formData.name,
    //       username: formData.username,
    //       avatar: formData.avatar,
    //     },
    //     {
    //       headers: { Authorization: `Bearer ${authToken}` },
    //     }
    //   );
    console.log(JSON.stringify(selectedTrainerOption))
    const response = await axios.put(`${import.meta.env.VITE_APP_HOST2}/batches/update-uid/${batch_name}`, {//batch_name
        uid: selectedTrainerOption.trainerData.uid
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`
        },
      });  
    // } else {
      // Create new trainer
    //   await axios.post(
    //     "/api/trainers",
    //     {
    //       name: formData.name,
    //       username: formData.username,
    //       avatar: formData.avatar,
    //     },
    //     {
    //       headers: { Authorization: `Bearer ${authToken}` },
    //     }
    //   );
    // }
    // Handle success (e.g., refresh trainer list, close dialog)

  } catch (error) {
    console.error("Error creating/updating trainer:", error);
    // Handle error (e.g., show notification)
  }
};

const deleteTrainer = async (authToken, batch_name) => {
  console.log("deleteTrainer")
  try {
    const response = await axios.delete(`${import.meta.env.VITE_APP_HOST2}/batches/clear-uid/${batch_name}`, {
      headers: {
        Authorization: `Bearer ${authToken}`, // Replace with your actual auth token
      },
    });
    // Handle success (e.g., refresh trainer list, close dialog)
    // show
  } catch (error) {
    console.error("Error deleting trainer:", error);
    // Handle error (e.g., show notification)
  }
};

// Fetch Trainers Function
const fetchTrainers = async (authToken, setTrainersOptions) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_APP_HOST2}/users/find?role=trainer`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log(JSON.stringify(response) + " fetchTrainer response");
    const options = response?.data.data.map((trainer) => ({
      value: trainer.uid,
      label: `${trainer.name} (@${trainer.username})`,
      trainerData: trainer,
    }));
    setTrainersOptions(options);
  } catch (error) {
    console.error("Error fetching trainers:", error);
    // Handle error (e.g., show notification)
  }
};

// Close Button Component
function CloseButton({ onClose }) {
  return (
    <button
      className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      onClick={onClose}
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
}

// Form Component
function TrainerForm({
  formData,
  handleChange,
  handleSubmit,
  handleDelete,
  isEditMode,
  trainersOptions,
  handleSelectTrainer,
  selectedTrainerOption,
  clearSelection,
}) {
  return (
    <form onSubmit={handleSubmit}>
      {/* Avatar Preview */}
      <div className="mb-6 text-center">
        <img
          src={formData.avatar || "/default-avatar.png"}
          alt="Avatar Preview"
          className="w-24 h-24 rounded-full mx-auto border-2 border-gray-300"
        />
      </div>
      {/* Trainer Selection Dropdown */}
      {!isEditMode &&
            <div className="mb-4">
            <label className="block text-gray-700">Select Trainer</label>
            <div className="mt-2">
              <Select
                options={trainersOptions}
                value={selectedTrainerOption}
                onChange={handleSelectTrainer}
                isClearable
                placeholder="Search and select a trainer..."
              />
            </div>
          </div>
      }

      {/* Name Field */}
{isEditMode &&      <div className="mb-4">
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter trainer name"
          disabled={isEditMode}
        />
      </div>}
      {/* Username Field */}
{isEditMode &&      <div className="mb-4">
        <label className="block text-gray-700">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter trainer username"
          disabled={isEditMode}
        />
      </div>}
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
          disabled={isEditMode}
        />
      </div>
      {/* Buttons */}
      <div className="flex justify-end mt-6">
        {/* {isEditMode && (
          <button
            type="button"
            onClick={handleDelete}
            className="mr-auto text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        )} */}
        {!isEditMode &&
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
        >
          Assign Trainer
        </button>
        }

      </div>
    </form>
  );
}

// Main Component
function TrainerDialog({ props }) {
  const { authToken } = useAuth();
  const {setSnackbarMessage, showSnackbar} = useGeneral()
  const [formData, setFormData] = useState({
    uid: null,
    name: "",
    username: "",
    avatar: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [trainersOptions, setTrainersOptions] = useState([]);//dropdown
  const [selectedTrainerOption, setSelectedTrainerOption] = useState(null);//dropwdown

  // Fetch all trainers to populate the DROPDOWN
  // useEffect(() => {
  //   fetchTrainers(authToken, setTrainersOptions);
  // }, [authToken]);

  // Populate form when a trainer is selected
  useEffect(() => {
    if (props.selectedTrainer) {
      setFormData({
        uid: props.selectedTrainer.uid || null,
        name: props.selectedTrainer.name || "",
        username: props.selectedTrainer.username || "",
        avatar: props.selectedTrainer.avatar || "",
      });
      setIsEditMode(true);
    } else {
      setFormData({
        uid: null,
        name: "",
        username: "",
        avatar: "",
      });
      setIsEditMode(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectTrainer = (selectedOption) => {
    if (selectedOption) {
      setFormData({
        uid: selectedOption.trainerData.uid,
        name: selectedOption.trainerData.name,
        username: selectedOption.trainerData.username,
        avatar: selectedOption.trainerData.avatar,
      });
    //   setIsEditMode(true);
      setSelectedTrainerOption(selectedOption);
    } else {
      // If selection is cleared, reset form
      setFormData({
        uid: null,
        name: "",
        username: "",
        avatar: "",
      });
      setIsEditMode(false);
      setSelectedTrainerOption(null);
    }
  };

  const handleSubmit = (e) => {
    createOrUpdateTrainer(e, formData, authToken, isEditMode, selectedTrainerOption, props.batch_name).then(() => {
      // Refresh the trainers list after creation/update
      // You might need to re-fetch trainers or update the state accordingly
      // For simplicity, you can reload the page or implement a state refresh
      props.onClose();
    });
  };

  const handleDelete = () => {

    console.log(formData)
    if (formData.uid) {
      deleteTrainer(authToken, props.batch_name).then(() => {
        // console.log("batchname", batch_name)
        // Refresh the trainers list after deletion
        // You might need to re-fetch trainers or update the state accordingly
        // For simplicity, you can reload the page or implement a state refresh
        props.onClose();
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <CloseButton onClose={props.onClose} />
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Trainer
        </h2>
        <TrainerForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleDelete={handleDelete}
          isEditMode={isEditMode}
          trainersOptions={trainersOptions}
          handleSelectTrainer={handleSelectTrainer}
          selectedTrainerOption={selectedTrainerOption}
          clearSelection={() => handleSelectTrainer(null)}
        />
      </div>
    </div>
  );
}

export default TrainerDialog;
