// Import necessary libraries and contexts
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../../../context/authContext";
import { useGeneral } from "../../../../../context/generalContext";

// CRUD functions extracted
const postRequest = async (formData, authToken, setSnackbarMessage, showSnackbar, setIsDialogOpen, setSelection) => {
  try {
    console.log(JSON.stringify(formData) + " formData");
    const response = await axios.post(
      `${import.meta.env.VITE_APP_HOST2}/batches/create`,
      formData,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    console.log(response.status);
    setSnackbarMessage(
      "Created Batch successfully " + JSON.stringify(response.data)
    );
    showSnackbar();
    setSelection({});
    setIsDialogOpen((prev) => !prev);
  } catch (error) {
    console.error("Error in post request:", error);
    setSnackbarMessage("Error creating Batch " + error);
    showSnackbar();
  }
};

const batchDelete = async (batch_id, authToken, setSnackbarMessage, showSnackbar, setIsDialogOpen, setSelection) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_APP_HOST2}/batches/delete/${batch_id}`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    console.log("Batch deleted successfully:", response.data);
    setSnackbarMessage(
      "Batch deleted successfully: " + JSON.stringify(response.data)
    );
    showSnackbar();
    setIsDialogOpen((prev) => !prev);
    setSelection({});
  } catch (error) {
    console.error("Error deleting Batch: ", error);
    setSnackbarMessage("Error deleting Batch: " + error);
    showSnackbar();
  }
};

const batchUpdate = async (batch_id, selection, authToken, setSnackbarMessage, showSnackbar, setIsDialogOpen, setSelection) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_APP_HOST2}/batches/update/${batch_id}`,
      {
        batch_name: selection.batch_name,
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    console.log("Batch updated successfully:", response.data);
    setSnackbarMessage(
      "Batch updated successfully: " + JSON.stringify(response.data)
    );
    showSnackbar();
    setIsDialogOpen((prev) => !prev);
    setSelection({});
  } catch (error) {
    console.error("Error updating Batch: ", error);
    setSnackbarMessage("Error updating Batch: " + error);
    showSnackbar();
  }
};

// Components extracted
const BatchNameInput = ({ selection, setSelection, batchUpdate }) => {
  return (
    <div className="mb-4 relative">
      <label
        className="block text-gray-700 text-sm font-medium mb-1"
        htmlFor="batchname"
      >
        Batch Name
      </label>
      <input
        type="text"
        id="batchname"
        value={selection.batch_name}
        onChange={(e) =>
          setSelection((prevSelection) => ({
            ...prevSelection,
            batch_name: e.target.value,
          }))
        }
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
        placeholder="Enter batch name"
      />
      {selection?.batch_name && (
        <button
          type="button"
          onClick={() => batchUpdate(selection.batch_id)}
          className="text-green-600 hover:text-green-800 absolute right-[0.5rem] top-[50%]"
        >
          Save
        </button>
      )}
    </div>
  );
};

const SubmitButton = ({ onSubmit }) => (
  <button
    type="submit"
    className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-all"
    onClick={onSubmit}
  >
    Submit
  </button>
);

const DeleteButton = ({ onDelete }) => (
  <button
    type="button"
    className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all my-2"
    onClick={onDelete}
  >
    Delete
  </button>
);

export default function CourseDialogBoxForm({ props }) {
  const { setSnackbarMessage, showSnackbar } = useGeneral();
  const { authToken } = useAuth();
  const [initialState, setInitialState] = useState();

  useEffect(() => {
    setInitialState(props.selection);
  }, [props.isDialogOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      course_name: props.course_name,
      batch_name: props.selection.batch_name,
    };

    console.log("Form Data:", formData);

    postRequest(formData, authToken, setSnackbarMessage, showSnackbar, props.setIsDialogOpen, props.setSelection);
  };

  return (
    <form onSubmit={handleSubmit}>
      <BatchNameInput
        selection={props.selection}
        setSelection={props.setSelection}
        batchUpdate={() => batchUpdate(props.selection.batch_id, props.selection, authToken, setSnackbarMessage, showSnackbar, props.setIsDialogOpen, props.setSelection)}
      />
      {!initialState?.batch_name && <SubmitButton onSubmit={handleSubmit} />}
      {initialState?.batch_name && (
        <DeleteButton onDelete={() => batchDelete(initialState.batch_id, authToken, setSnackbarMessage, showSnackbar, props.setIsDialogOpen, props.setSelection)} />
      )}
    </form>
  );
}
