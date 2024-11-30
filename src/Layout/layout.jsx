import { useLayoutEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom"
import React from 'react'
import Snackbar from "./snackbar";
import { useGeneral } from "../context/generalContext";
import { useAuth } from "../context/authContext";

export default function Layout () {
    const { isSnackbarOpen, hideSnackbar, snackbarMessage} = useGeneral()
    const {user} = useAuth();
    const navigate = useNavigate();

  return (
    <>
        {user ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace /> }
        <Snackbar
        message={snackbarMessage}
        isOpen={isSnackbarOpen}
        onClose={hideSnackbar}
      />
    </>
  )
}
