// src/utils/snackbarUtils.js
let setSnackbarContentFunction;
let showSnackbarFunction;

// Function to set the snackbar content
export const setSnackbarDetails = (fn) => {
  setSnackbarContentFunction = fn;
};

// Function to trigger the snackbar display
export const setShowSnackbar = (fn) => {
  showSnackbarFunction = fn;
};

// Function to set snackbar content
export const setSnackbarContent = (message) => {
  if (setSnackbarContentFunction) {
    setSnackbarContentFunction(message);
  }
};

// Function to show snackbar
export const showSnackbar = () => {
  if (showSnackbarFunction) {
    showSnackbarFunction();
  }
};
