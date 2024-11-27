// src/components/Trainers.jsx
import axios from "axios";
import React, { useEffect } from "react";

const fetchTrainers = async (batch_name, authToken, setTrainers) => {
    console.log(batch_name)
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_HOST2}/users/trainer/all/${batch_name}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setTrainers(response.data);
      console.log("Trainer profiles retrieved:", response.data);
    } catch (error) {
      console.error("Error fetching trainers:", error);
    }
  };

function Trainers({ props }) {
  //{trainers:trainers, handleTrainerClick:handleTrainerClick, handleAddTrainer:handleAddTrainer, handleDeleteTrainer:handleDeleteTrainer}

  useEffect(() => {
    console.log(props.batch_name + "batch_name")
    fetchTrainers(props.batch_name, props.authToken, props.setTrainers)
  }, [])
  
  return (
    <div className="mt-12 mx-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Trainer</h2>
        {/* <button
          onClick={props.handleAddTrainer}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
        >
          Assign Trainer
        </button> */}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {props.trainers?.map((trainer) => (
          <div
            key={trainer?.id}
            onClick={() => props.handleTrainerClick(trainer)}
            className="bg-white rounded-xl shadow-md p-4 flex items-center cursor-pointer hover:shadow-lg transition-shadow duration-200"
          >
            <img
              className="w-16 h-16 rounded-full border-2 border-blue-500 mr-4"
              src={trainer?.avatar || "/default-avatar.png"}
              alt="Avatar"
            />
            <div>
              <p className="text-lg font-semibold text-gray-800">
                {trainer?.name}
              </p>
              <p className="text-sm text-gray-500">@{trainer?.username}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Trainers;
