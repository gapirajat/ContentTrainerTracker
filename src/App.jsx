import { useEffect, useState } from 'react'
import './App.css'
// import Login from './pages/login/login'
import { Routes, Route, useNavigate } from 'react-router-dom';
import Coordinator from './pages/coordinator/coordinator';
import Trainer from './pages/trainer/trainer';
import Student from './pages/student/student';
import { useAuth } from './context/authContext';

import Layout from './Layout/layout';
import AdminLayout from './Layout/adminLayout';

import AdminHome from './pages/admin/adminPages/adminHome/adminHome';
import AdminRegister from './pages/admin/adminPages/adminRegister/adminRegister.jsx';
import AdminNotifications from './pages/admin/adminPages/adminNotifications';
import AdminProfile from './pages/admin/adminPages/adminProfile';
import AdminSettings from './pages/admin/adminPages/adminSettings';
import { useGeneral } from './context/generalContext';
import Login from './pages/login/login';

import Course from './pages/admin/adminPages/adminHome/course/course';
import Batch from './pages/admin/adminPages/adminHome/course/batch/batch';




function App() {
  const { authToken, user } = useAuth();
  const {sidebarSelection} = useGeneral();

      // Example: Switch based on userType




    //this is causing the default whenever you hit a parameter route
    const home = (user) => {
        console.log(user.role)
        if (authToken && user?.role) {
          console.log("if loop entered")
              switch (user.role) {
            case 'admin':
                return AdminRoutes();
            case 'coordinator':
                return AdminRoutes();
            case 'trainer':
                return AdminRoutes();
            case 'student':
                return AdminRoutes();
            default:
                return AdminRoutes();
        }
        } else {
          return AdminRoutes()
        }

      }
            //navigation
        const navigate = useNavigate();

        useEffect(() => {
          navigate(`/${sidebarSelection}`)
        }, [sidebarSelection])
      
      


  return (
    <>
    <Routes>
      <Route element={<Layout />}>
        {/* protected routes */}
        {home(user)}
        <Route path='/login' element={<Login />}/>

      </Route>

    </Routes>
    </>

  )
}

export default App

function AdminRoutes() {
  return(
  <Route element={<AdminLayout />}>

      <Route path="/Home" element={<AdminHome />} />
      <Route path="/Register" element={<AdminRegister />} />
      <Route path="/Notifications" element={<AdminNotifications />} />
      <Route path="/Profile" element={<AdminProfile />} />
      <Route path="/Settings" element={<AdminSettings />} />
      <Route path="/" element={<AdminHome />} />

      <Route path="/Home/:course_name" element={<Course />} />
      <Route path="/Home/:course_name/:batch_name" element={<Batch />} />
  </Route>

  )
  
}