import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/authContext';
import { useGeneral } from '../../../../context/generalContext';

// Custom hook for fetching topics
const useFetchTopics = (courseName, authToken, setTopics) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_HOST2}/topics/all/${courseName}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setTopics(response.data);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    if (courseName) {
      fetchData();
    }
  }, [courseName, authToken, setTopics]);
};

// Custom function for topic deletion
const deleteTopic = async (index, topic, authToken, setTopics, topics, setSnackbarMessage, showSnackbar) => {
  try {
    const response = await axios.delete(`${import.meta.env.VITE_APP_HOST2}/topics/delete/${topic.topic_id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    setSnackbarMessage("Topic deleted successfully: " + response.data);
    showSnackbar();
    setTopics(topics.filter((_, i) => i !== index));
  } catch (error) {
    console.error('Error deleting data:', error);
    setSnackbarMessage("Error deleting data: " + error);
    showSnackbar();
  }
};

// Custom function for adding a topic
const addTopic = async (topicInput, initialState, authToken, topics, setTopics, setTopicInput, setSnackbarMessage, showSnackbar) => {
  if (topicInput.trim()) {
    const numberedTopic = `${topics.length + 1}._${topicInput}`;

    if (initialState.course_name) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_APP_HOST2}/topics/bulkCreate/${initialState.course_name}`,
          { topics: [numberedTopic] },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        setSnackbarMessage("Topic added successfully: " + JSON.stringify(response.data));
        showSnackbar();
      } catch (error) {
        setSnackbarMessage("Error adding topics: " + JSON.stringify(error));
        showSnackbar();
      }
    }

    setTopics([...topics, { topic_name: numberedTopic }]);
    setTopicInput('');
  }
};

// Custom function for updating a topic
const updateTopic = async (topic_id, topic_name, authToken, setSnackbarMessage, showSnackbar) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_APP_HOST2}/topics/update/${topic_id}`,
      { topic_name, topic_id },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    setSnackbarMessage("Topic updated successfully: " + JSON.stringify(response.data));
    showSnackbar();
  } catch (error) {
    console.error('Error updating topic:', error);
    setSnackbarMessage("Error updating topic: " + error);
    showSnackbar();
  }
};

// Component for rendering each topic
const TopicItem = ({ topic, index,initialState, updateTopic, deleteTopic, authToken, setTopics, topics, setSnackbarMessage, showSnackbar }) => (
  <div className="w-full flex items-center justify-between border border-gray-200 p-2 rounded-md">
    <input
      className="w-full text-black placeholder-black outline-none"
      onChange={(e) =>
        setTopics((topics) => {
          const updatedTopics = [...topics];
          updatedTopics[index] = { ...topics[index], topic_name: e.target.value };
          return updatedTopics;
        })
      }
      value={topic?.topic_name}
    />
    {(initialState[index]?.topic_name && initialState[index]?.topic_name !== topic?.topic_name) && (
      <button
        type="button"
        onClick={() => updateTopic(topic?.topic_id, topic?.topic_name, authToken, setSnackbarMessage, showSnackbar)}
        className="text-green-600 hover:text-green-800 ml-auto mr-[2%]"
      >
        Save
      </button>
    )}
    <button
      type="button"
      onClick={() => deleteTopic(index, topic, authToken, setTopics, topics, setSnackbarMessage, showSnackbar)}
      className="text-red-600 hover:text-red-800"
    >
      Delete
    </button>
  </div>
);

// Component for the topic input form
const TopicInputForm = ({ topicInput, setTopicInput, handleAddTopic }) => (
  <div className="flex items-center mb-2">
    <input
      type="text"
      id="topicInput"
      value={topicInput}
      onChange={(e) => setTopicInput(e.target.value)}
      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
      placeholder="Enter topic"
    />
    <button
      type="button"
      onClick={handleAddTopic}
      className="ml-2 px-3 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
    >
      Add
    </button>
  </div>
);

const DialogBoxFormTopics = ({ props }) => {
  const [topicInput, setTopicInput] = useState('');
  const [initialState, setInitialState] = useState('');
  const [initialTopicState, setInitialTopicState] = useState('');
  const { authToken } = useAuth();
  const { setSnackbarMessage, showSnackbar } = useGeneral();

  useEffect(() => {
    setInitialState(props.selection);
    setInitialTopicState(props.topics);
    console.log(initialState)
    console.log("Save DialogBoxFromTopics",initialState, props.selection);
  }, [props.isDialogOpen]);

  useFetchTopics(initialState.course_name, authToken, props.setTopics);

  const handleAddTopic = () => {
    addTopic(topicInput, initialState, authToken, props.topics, props.setTopics, setTopicInput, setSnackbarMessage, showSnackbar);
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="topicInput">
        Add Topics
      </label>
      <TopicInputForm topicInput={topicInput} setTopicInput={setTopicInput} handleAddTopic={handleAddTopic} />
      <div className="space-y-2">
        {props.topics?.map((topic, index) => (
          <TopicItem
            key={index}
            topic={topic}
            index={index}
            initialState={initialTopicState}
            updateTopic={updateTopic}
            deleteTopic={deleteTopic}
            authToken={authToken}
            setTopics={props.setTopics}
            topics={props.topics}
            setSnackbarMessage={setSnackbarMessage}
            showSnackbar={showSnackbar}
          />
        ))}
      </div>
    </div>
  );
};

export default DialogBoxFormTopics;