import { useLayoutEffect } from "react";
import { Outlet } from "react-router-dom"
import React from 'react'
import Snackbar from "./snackbar";
import { useGeneral } from "../context/generalContext";

export default function () {
    const { isSnackbarOpen, hideSnackbar, snackbarMessage} = useGeneral()

  return (
    <>
        <Outlet />
        <Snackbar
        message={snackbarMessage}
        isOpen={isSnackbarOpen}
        onClose={hideSnackbar}
      />
    </>
  )
}
