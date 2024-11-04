// src/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { setShowSnackbar, setSnackbarDetails } from '../utils/snackbarUtils';

const GeneralContext = createContext();

export const GeneralProvider = ({ children }) => {
    const [isSnackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const [Loading, setLoading] = useState(false);
    



    const showSnackbar = () => {
        setSnackbarOpen(true);
      };
    
      const hideSnackbar = () => {
        setSnackbarOpen(false);
      };

      //sidebar menu
      const [sidebar, setSidebar] = useState(false)

        // Using the same state as of sidebar
      const [sidebarSelection, setSidebarSelection] = useState("Home")

      useEffect(() => {
        setSnackbarDetails(setSnackbarMessage);
        setShowSnackbar(showSnackbar)
        
      }, [])
      




  return (
    <GeneralContext.Provider value={{isSnackbarOpen, hideSnackbar, showSnackbar, snackbarMessage, setSnackbarMessage, sidebar, setSidebar, sidebarSelection, setSidebarSelection}}>
      {children}
    </GeneralContext.Provider>
  );
};

export const useGeneral = () => useContext(GeneralContext);

//role, *course, username, validity status(no need to check validity as it would automatically remove invalid token)
