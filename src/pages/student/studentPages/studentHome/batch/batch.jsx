import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Carousel from "./batchCarousel";
import Trainers from "./studentTrainer";
import Students from "./studentStudent";
import SessionDialog from "./studentDialogSession";
import TrainerDialog from "./studentDialogTrainer";
import StudentDialog from "./studentDialogStudent";
import { useAuth } from "../../../../../context/authContext";

// CRUD Functions



const deleteTrainer = async (trainerId, authToken, setTrainers, trainers) => {
  try {
    await axios.delete(`${import.meta.env.VITE_APP_HOST2}/trainer/${trainerId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    setTrainers(trainers.filter((trainer) => trainer.id !== trainerId));
  } catch (error) {
    console.error("Error deleting trainer:", error);
  }
};

const deleteStudent = async (studentId, authToken, setStudents, students) => {
  try {
    await axios.delete(`${import.meta.env.VITE_APP_HOST2}/student/${studentId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    setStudents(students.filter((student) => student.id !== studentId));
  } catch (error) {
    console.error("Error deleting student:", error);
  }
};

// Main Component

export default function StudentBatch() {
  const { course_name, batch_name } = useParams();
  // const [Course] = useState(course_name);
  // const [batch] = useState(batch_name);

  const { authToken } = useAuth();

  /* All states for dialog and selection */
  const [sessions, setSessions] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);

  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [trainerDialogOpen, setTrainerDialogOpen] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);

  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  useEffect(() => {
    // Fetch sessions
    // fetchSessions(batch_name, authToken, setSessions);

    // Fetch trainers
    // fetchTrainers(batch_name, authToken, setTrainers);

    // Fetch students
    // fetchStudents(batch_name, authToken, setStudents);

  }, [batch_name, authToken]);

  // Handlers for sessions
  const handleSessionClick = (session) => {
    setSelectedSession(session);
    setSessionDialogOpen(true);
  };

  const handleAddSession = () => {
    setSelectedSession(null);
    setSessionDialogOpen(true);
  };

  // Handlers for trainers
  const handleTrainerClick = (trainer) => {
    setSelectedTrainer(trainer);
    setTrainerDialogOpen(true);
  };

  const handleAddTrainer = () => {
    setSelectedTrainer(null);
    setTrainerDialogOpen(true);
  };

  const handleDeleteTrainerClick = (trainerId) => {
    deleteTrainer(trainerId, authToken, setTrainers, trainers);
  };

  // Handlers for students
  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setStudentDialogOpen(true);
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setStudentDialogOpen(true);
  };

  const handleDeleteStudentClick = (studentId) => {
    deleteStudent(studentId, authToken, setStudents, students);
  };

  return (
    <div className="lg:ml-[4.5rem]">
      <h1 className="text-3xl m-4">
        {course_name} {">"} {batch_name}
      </h1>
      <button className="text-lg mx-2 ml-8 text-gray-500" onClick={goBack}>
        ← Back
      </button>

      {/* Sessions Carousel */}
      <Carousel
        props={{
          sessions: sessions,
          handleSessionClick: handleSessionClick,
          handleAddSession: handleAddSession,
          batch_name: batch_name,
          authToken: authToken,
          setSessions:setSessions
        }}
      />

      {/* Trainers Section */}
      <Trainers
        props={{
          trainers: trainers,
          handleTrainerClick: handleTrainerClick,
          handleAddTrainer: handleAddTrainer,
          handleDeleteTrainer: handleDeleteTrainerClick,
          batch_name: batch_name,
          authToken: authToken,
          setTrainers: setTrainers
        }}
      />

      {/* Students Section */}
      <Students
        props={{
          students: students,
          handleStudentClick: handleStudentClick,
          handleAddStudent: handleAddStudent,
          handleDeleteStudent: handleDeleteStudentClick,
          batch_name: batch_name,
          authToken: authToken,
          setStudents: setStudents
        }}
      />

      {/* Dialogs */}
      {sessionDialogOpen && (
        <SessionDialog
          props={{
            selectedSession: selectedSession,
            onClose: () => setSessionDialogOpen(!sessionDialogOpen),
            course_name: course_name,
            batch_name: batch_name,
            sessions: sessions,
            setSessions: setSessions,
          }} // session does not contain course name
          // Add onUpdate and onDelete handlers as needed
        />
      )}
      {trainerDialogOpen && (
        <TrainerDialog
          props={{
            selectedTrainer: selectedTrainer,
            onClose: () => setTrainerDialogOpen(!trainerDialogOpen),
            batch_name:batch_name
          }}
          // Add onUpdate and onDelete handlers as needed
        />
      )}
      {studentDialogOpen && (
        <StudentDialog
          props={{
            selectedStudent: selectedStudent,
            onClose: () => setStudentDialogOpen(!studentDialogOpen),
            batch_name:batch_name
          }}
          // Add onUpdate and onDelete handlers as needed
        />
      )}
    </div>
  );
}
