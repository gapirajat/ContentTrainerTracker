import React, { useEffect, useState } from 'react'
import DialogBoxFormTopics from './dialogBoxFormTopics'
import { useGeneral } from '../../../../context/generalContext';
import axios from 'axios';
import { useAuth } from '../../../../context/authContext';

// CRUD functions
const courseDelete = async (course_name, authToken, setSnackbarMessage, showSnackbar, props) => {
  try {
    const response = await axios.delete(`${import.meta.env.VITE_APP_HOST2}/course/delete/${course_name}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Data deleted successfully:', response.data);
    setSnackbarMessage("Data deleted successfully: " + JSON.stringify(response.data))
    showSnackbar()
    props.setIsDialogOpen(!props.isDialogOpen)
    props.setSelection({})
  } catch (error) {
    console.error('Error deleting data: ', error);
    setSnackbarMessage("Error deleting data: " + error)
    showSnackbar()
  }
};

const courseUpdate = async (course_id, authToken, setSnackbarMessage, showSnackbar, props) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_APP_HOST2}/course/update/${course_id}`, {
      course_name: props.selection.course_name
    }, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Course updated successfully:', response.data);
    setSnackbarMessage("Course updated successfully: " + JSON.stringify(response.data))
    showSnackbar()
    props.setIsDialogOpen(!props.isDialogOpen)
    props.setSelection({})
  } catch (error) {
    console.error('Error updating course: ', error);
    setSnackbarMessage("Error updating course: " + error)
    showSnackbar()
  }
};

const postRequest = async (formData, authToken, setSnackbarMessage, showSnackbar, props, setTopics) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_APP_HOST2}/course/create`, {
      course_name: formData.course_name
    }, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (response.status === 201) {
      const response2 = await axios.post(
        `${import.meta.env.VITE_APP_HOST2}/topics/bulkCreate/${props.selection.course_name}`, {
          topics: formData.topics.map(topic => topic.topic_name)
        }, {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setSnackbarMessage("Successfully created Course and Topics " + JSON.stringify(response.data) + " " + JSON.stringify(response2.data))
      showSnackbar()
    }
  } catch (error) {
    console.error('Error in post request:', error);
    setSnackbarMessage("Error creating Course and Topics " + JSON.stringify(error))
    showSnackbar()
  }
  
  props.setSelection({});
  setTopics([]);
  props.setIsDialogOpen(!props.isDialogOpen)
};

// Main Component
export default function DialogBoxForm({ props }) {
  const [topics, setTopics] = useState([]);
  const { setSnackbarMessage, showSnackbar } = useGeneral();
  const { authToken } = useAuth();
  const [initialState, setInitialState] = useState();

  useEffect(() => {
    if (props.selection.course_name) {
      setInitialState(props.selection)
    }
  }, [props.isDialogOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      course_name: props.selection.course_name,
      topics,
    };
    postRequest(formData, authToken, setSnackbarMessage, showSnackbar, props, setTopics);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CourseNameInput
        selection={props.selection}
        setSelection={props.setSelection}
        courseUpdate={() => courseUpdate(props.selection.course_id, authToken, setSnackbarMessage, showSnackbar, props)}
        initialState={initialState}
      />
      <DialogBoxFormTopics props={{ topics, setTopics, selection: props.selection, isDialogOpen: props.isDialogOpen }} />
      
      {!initialState?.course_name && (
        <button type="submit" className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-all">
          Submit
        </button>
      )}

      {initialState && (
        <button
          type="button"
          className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all my-2"
          onClick={() => courseDelete(initialState.course_name, authToken, setSnackbarMessage, showSnackbar, props)}
        >
          Delete
        </button>
      )}
    </form>
  );
}

// Extracted CourseNameInput component
function CourseNameInput({ selection, setSelection, courseUpdate, initialState }) {
  return (
    <div className="mb-4 relative">
      <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="courseName">
        Course Name
      </label>
      <input
        type="text"
        id="courseName"
        value={selection.course_name}
        onChange={(e) =>
          setSelection((prevSelection) => ({
            ...prevSelection,
            course_name: e.target.value,
          }))
        }
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
        placeholder="Enter course name"
      />
      {initialState && initialState?.course_name !== selection.course_name && (
        <button
          type="button"
          onClick={courseUpdate}
          className="text-green-600 hover:text-green-800 absolute right-[0.5rem] top-[50%]"
        >
          Save
        </button>
      )}
    </div>
  );
}