import { useEffect } from 'react';
import './App.css';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './context/authContext';
import { useGeneral } from './context/generalContext';

import Login from './pages/login/login';
import Coordinator from './pages/coordinator/coordinator';
// import Student from './pages/studentx/student.jsx';
import TrainerHome from './pages/trainer/trainerPages/trainerHome/trainerHome.jsx';
import AdminHome from './pages/admin/adminPages/adminHome/adminHome';
import AdminRegister from './pages/admin/adminPages/adminRegister/adminRegister.jsx';
import AdminMessages from './pages/admin/adminPages/adminMessages/adminMessages.jsx';
import AdminSettings from './pages/admin/adminPages/adminSettings';
import Course from './pages/admin/adminPages/adminHome/course/course';
import Batch from './pages/admin/adminPages/adminHome/course/batch/batch';

import AdminLayout from './Layout/adminLayout';
import TrainerLayout from './Layout/trainerLayout.jsx';
import TrainerBatch from './pages/trainer/trainerPages/trainerHome/batch/batch.jsx';
import StudentLayout from './Layout/studentLayout.jsx';
import StudentHome from './pages/student/studentPages/studentHome/studentHome.jsx';
import StudentBatch from './pages/student/studentPages/studentHome/batch/batch.jsx';
import Announcement from './pages/admin/adminPages/adminMessages/announcement/announcement.jsx';
// import FeedbackForm from './pages/student/studentPages/studentFeedback/studentFeedback.jsx';
// import IssueFeedbackForm from './pages/student/studentPages/studentFeedback/studentFeedback.jsx';
import SubmitComplaintForm from './pages/student/studentPages/studentFeedback/studentFeedback.jsx';
import AdminComplaintForm from './pages/admin/adminPages/adminFeedback/AdminComplaintForm.jsx';



// Import other layouts if needed

function App() {            

  const { authToken, user } = useAuth();

  // Function to determine which routes to render based on user role
  const renderRoutes = () => {
    if (!authToken) {
      return (
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="*" element={<Navigate to="/Login" replace />} />
        </Routes>
      );
    }

    switch (user?.role) {
      case 'admin':
        return <AdminRoutes />;
      case 'coordinator':
        return <CoordinatorRoutes />;
      case 'trainer':
        return <TrainerRoutes />;
      case 'student':
        return <StudentRoutes />;
      default:
        return (
          <Routes>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        );
    }
  };

  return (
    <>
      {renderRoutes()}
    </>
  );
}

export default App;

// Admin Routes
function AdminRoutes() {
  const {sidebarSelection} = useGeneral();
  const navigate = useNavigate();
          //Conflicting!!!
          useEffect(() => {
            navigate(`/${sidebarSelection}`)
          }, [sidebarSelection])
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/Home" element={<AdminHome />} />
        <Route path="/Register" element={<AdminRegister />} />

        <Route path="/Messages" element={<AdminMessages />} />
        <Route path="/Messages/announcement" element={<Announcement />} />

        <Route path="/Feedback" element={<AdminComplaintForm />} />
        <Route path="/Settings" element={<AdminSettings />} />

        {/* Nested Routes for Courses and Batches */}
        <Route path="/Home/:course_name" element={<Course />} />
        <Route path="/Home/:course_name/:batch_name" element={<Batch />} />

        {/* Redirect root to /Home */}
        <Route path="/" element={<Navigate to="/Home" replace />} />
      </Route>

      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to="/Home" replace />} />
    </Routes>
  );
}

// Trainer Routes
function TrainerRoutes() {
  const {sidebarSelection} = useGeneral();
  const navigate = useNavigate();
          //Conflicting!!!
          useEffect(() => {
            navigate(`/${sidebarSelection}`)
          }, [sidebarSelection]);

  return (
    <Routes>
      <Route element={<TrainerLayout />}>
        <Route path="/Home" element={<TrainerHome />} />
        <Route path="/Register" element={<TrainerHome />} />
        <Route path="/Messages" element={<TrainerHome />} />
        <Route path="/Profile" element={<TrainerHome />} />
        <Route path="/Settings" element={<TrainerHome />} />

        {/* Nested Routes for Courses and Batches */}
        <Route path="/Home/:course_name/:batch_name" element={<TrainerBatch />} />

        {/* Redirect root to /Home */}
        <Route path="/" element={<Navigate to="/Home" replace />} />
      </Route>

      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to="/Home" replace />} />
    </Routes>
  );
}

// Student Routes
function StudentRoutes() {
  const {sidebarSelection} = useGeneral();

  const navigate = useNavigate();
          //Conflicting!!!
          useEffect(() => {
            navigate(`/${sidebarSelection}`)
          }, [sidebarSelection])

  return (
    <Routes>
      <Route element={<StudentLayout />}> {/* Use a different layout if available */}
        <Route path="/Home" element={<StudentHome />} />
        <Route path="/Feedback" element={<SubmitComplaintForm />} />

        {/* Nested Routes for Courses and Batches */}
        <Route path="/Home/:course_name/:batch_name" element={<StudentBatch />} />

        {/* Redirect root to /Home */}
        <Route path="/" element={<Navigate to="/Home" replace />} />
      </Route>

      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to="/Home" replace />} />
    </Routes>
  );
}

// Coordinator Routes
function CoordinatorRoutes() {
  const {sidebarSelection} = useGeneral();
  const navigate = useNavigate();
          //Conflicting!!!
          useEffect(() => {
            navigate(`/${sidebarSelection}`)
          }, [sidebarSelection])
  return (
    <Routes>
      <Route element={<AdminLayout />}> {/* Use a different layout if available */}
        <Route path="/Home" element={<AdminHome />} />
        <Route path="/Register" element={<AdminRegister />} />
        <Route path="/Messages" element={<AdminMessages />} />
        <Route path="/Feedback" element={<AdminComplaintForm />} />
        <Route path="/Settings" element={<AdminSettings />} />

        {/* Nested Routes for Courses and Batches */}
        <Route path="/Home/:course_name" element={<Course />} />
        <Route path="/Home/:course_name/:batch_name" element={<Batch />} />

        {/* Redirect root to /Home */}
        <Route path="/" element={<Navigate to="/Home" replace />} />
      </Route>

      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to="/Home" replace />} />
    </Routes>
  );
}
