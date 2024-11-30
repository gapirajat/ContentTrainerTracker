import { useEffect, useLayoutEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import React from 'react';
import Snackbar from "./snackbar";
import { useGeneral } from "../context/generalContext";
import Navbar from "../pages/admin/adminNavbar";
import Sidebar from "../pages/admin/adminSidebar";
import BottomNavbar from "../pages/admin/adminBottomNavbar";
import { useAuth } from "../context/authContext";
import AnnouncementBanner from "./banner";
import { fetchAnnouncement } from '../generalSlice/generalSlice'
import { useDispatch } from "react-redux";


export default function AdminLayout() {
    const { isSnackbarOpen, hideSnackbar, snackbarMessage } = useGeneral();
    const {authToken} = useAuth()
    const location = useLocation();
    console.log(!authToken)
    console.log(((!authToken)===true))
    console.log(location.pathname)

    const dispatch = useDispatch();

    useEffect(() => {
      console.log("authToken")
      console.log(!authToken)
      console.log(authToken)
    }, [authToken])

    useEffect(() => {
        // Replace with actual token retrieval logic
        console.log("first")
        dispatch(fetchAnnouncement());

      }, [dispatch]);
    

    return (
        <>
            {(!authToken) ? (
                null
            //   <Navigate to="/login" state={{ from: location }} replace />
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
