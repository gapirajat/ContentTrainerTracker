// src/components/Students.jsx
import React from 'react';

function Students({ props }) {//{students:students, handleStudentClick:handleStudentClick, handleAddStudent:handleAddStudent, handleDeleteStudent:handleDeleteStudent}
  return (
    <div className="mt-12 mx-8 mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Students</h2>
        <button
          onClick={props.handleAddStudent}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
        >
          Add Student
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {props.students.map((student) => (
          <div
            key={student?.id}
            onClick={() => props.handleStudentClick(student)}
            className="bg-white rounded-xl shadow-md p-4 flex items-center cursor-pointer hover:shadow-lg transition-shadow duration-200"
          >
            <img
              className="w-16 h-16 rounded-full border-2 border-green-500 mr-4"
              src={student?.avatar || '/default-avatar.png'}
              alt="Avatar"
            />
            <div>
              <p className="text-lg font-semibold text-gray-800">
                {student?.name}
              </p>
              <p className="text-sm text-gray-500">@{student?.username}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Students;
