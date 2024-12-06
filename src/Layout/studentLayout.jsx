import { useEffect, useLayoutEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import React from 'react';
import Snackbar from "./snackbar";
import { useGeneral } from "../context/generalContext";
import { useAuth } from "../context/authContext";
import Navbar from "../pages/student/studentNavbar";
import Sidebar from "../pages/student/studentSidebar";
import BottomNavbar from "../pages/student/studentBottomNavbar";
import AnnouncementBanner from "./banner";

export default function StudentLayout() {
    const { isSnackbarOpen, hideSnackbar, snackbarMessage } = useGeneral();
    const {authToken} = useAuth()
    const location = useLocation();
    console.log(!authToken)
    console.log(((!authToken)===true))
    console.log(location.pathname)

    useEffect(() => {
      console.log("authToken")
      console.log(!authToken)
      console.log(authToken)
    }, [authToken])
    

    return (
        <>
            {(!authToken) ? (
              <Navigate to="/login" state={{ from: location }} replace />
            ) : (
                <>        
                <Navbar />
                <AnnouncementBanner/>
                <Sidebar />
                <Outlet />
                <Snackbar
                    message={snackbarMessage}
                    isOpen={isSnackbarOpen}
                    onClose={hideSnackbar}
                />
                <BottomNavbar />
            </>
            )}
        </>
    );
}
