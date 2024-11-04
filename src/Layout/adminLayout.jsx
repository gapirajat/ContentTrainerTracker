import { useEffect, useLayoutEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import React from 'react';
import Snackbar from "./snackbar";
import { useGeneral } from "../context/generalContext";
import Navbar from "../pages/admin/adminNavbar";
import Sidebar from "../pages/admin/adminSidebar";
import BottomNavbar from "../pages/admin/adminBottomNavbar";
import { useAuth } from "../context/authContext";

export default function AdminLayout() {
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
