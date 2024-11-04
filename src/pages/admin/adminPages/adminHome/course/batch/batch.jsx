import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../../../../../context/authContext';
import Carousel from './batchCarousel';
import Trainers from './batchTrainer';
import Students from './batchStudent';
import SessionDialog from './batchDialogSession';
import TrainerDialog from './batchDialogTrainer';
import StudentDialog from './batchDialogStudent';

export default function Batch() {
  const { course_name, batch_name } = useParams();
  // const [Course] = useState(course_name);
  // const [batch] = useState(batch_name);

  const { authToken } = useAuth();

  /*All states for dialog and selection */
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
    axios.get(`${import.meta.env.VITE_APP_HOST2}/session/all/${batch_name}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    .then(response => setSessions(response.data))
    .catch(error => console.error('Error fetching sessions:', error));

    // Fetch trainers
    async function getAllTrainerByBatch() {
      try {
        // Replace with appropriate headers if authorization or other headers are needed
        const response = await axios.get(`${import.meta.env.VITE_APP_HOST2}/users/trainer/all/${batch_name}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        }) .then(response => setStudents(response.data));
    
        // If the request is successful, log the data
        console.log('Student profiles retrieved:', response.data);
      } catch (error) {
        // Check if error response is available
        console.error('Error details:', error);
      }
    }
    getAllTrainerByBatch()

    async function getAllStudentsByBatch() {
      try {
        // Replace with appropriate headers if authorization or other headers are needed
        const response = await axios.get(`${import.meta.env.VITE_APP_HOST2}/users/student/all/${batch_name}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        }).then(response => setStudents(response.data));
    
        // If the request is successful, log the data
        console.log('Student profiles retrieved:', response.data);
      } catch (error) {
        // Check if error response is available
        console.error('Error details:', error);
      }
    }
    getAllStudentsByBatch()

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

// ??
  const handleDeleteTrainer = async (trainerId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_APP_HOST2}/trainer/${trainerId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setTrainers(trainers.filter(trainer => trainer.id !== trainerId));
    } catch (error) {
      console.error('Error deleting trainer:', error);
    }
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

  const handleDeleteStudent = async (studentId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_APP_HOST2}/student/${studentId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setStudents(students.filter(student => student.id !== studentId));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  return (
    <div className='lg:ml-[4.5rem]'>
      <h1 className='text-3xl m-4'>{course_name} {'>'} {batch_name}</h1>
      <button className='text-lg mx-2 ml-8 text-gray-500' onClick={goBack}>← Back</button>

      {/* Sessions Carousel */}
      <Carousel props={{sessions:sessions, handleSessionClick:handleSessionClick, handleAddSession:handleAddSession}}
      />

      {/* Trainers Section */}
      <Trainers props={{trainers:trainers, handleTrainerClick:handleTrainerClick, handleAddTrainer:handleAddTrainer, handleDeleteTrainer:handleDeleteTrainer}}
      />

      {/* Students Section */}
      <Students props={{students:students, handleStudentClick:handleStudentClick, handleAddStudent:handleAddStudent, handleDeleteStudent:handleDeleteStudent}}

      />

      {/* Dialogs */}
      {sessionDialogOpen && (
        <SessionDialog props={{selectedSession:selectedSession, onClose:() => setSessionDialogOpen(!sessionDialogOpen), course_name:course_name, batch_name:batch_name, sessions:sessions, setSessions:setSessions}}//session does not contain course name
          // Add onUpdate and onDelete handlers as needed
        />
      )}
      {trainerDialogOpen && (
        <TrainerDialog props={{selectedTrainer:selectedTrainer, onClose:() => setTrainerDialogOpen(!trainerDialogOpen)}}
          // Add onUpdate and onDelete handlers as needed
        />
      )}
      {studentDialogOpen && (
        <StudentDialog props={{selectedStudent:selectedStudent, onClose:() => setStudentDialogOpen(!studentDialogOpen)}}
          // Add onUpdate and onDelete handlers as needed
        />
      )}
    </div>
  );
}
