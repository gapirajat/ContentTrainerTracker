import React, { useEffect, useState } from "react";
import RegisterName from "./registerName";
import RegisterDob from "./registerDob";
import RegisterEmail from "./registerEmail";
import RegisterPassword from "./registerPassword";
import RegisterRole from "./registerRole";
import RegisterUsername from "./registerUsername";
import RegisterExperience from "./registerExperience";
import { useGeneral } from "../../../../../context/generalContext";
import { useAuth } from "../../../../../context/authContext";
import axios from "axios";

export default function Register() {

  const {setSnackbarMessage, showSnackbar} = useGeneral()
  const {authToken} = useAuth()

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    password: "",
    role: "",
    username: "",
    experience: "",
    course: "",
    batch: "",
  });


  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset errors
    setErrors({});
    console.log(formData);
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_HOST2}/users/register`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`
        },
      });
  
      // Check for success (status code 2xx)
      if (response.status >= 200 && response.status < 300) {
          let response2
        if (formData.role === 'coordinator') {//formData.course is course_name
          response2 = await axios.put(`${import.meta.env.VITE_APP_HOST2}/course/update-uid/${formData.course}`, {
            uid: response.data.uid
          }, {
            headers: {
              Authorization: `Bearer ${authToken}`
            },
          });          
        }

        if (formData.role === 'student' || formData.role === 'trainer' ) {
          response2 = await axios.put(`${import.meta.env.VITE_APP_HOST2}/batches/update-uid/${formData.batch}`, {
            uid: response.data.uid
          }, {
            headers: {
              Authorization: `Bearer ${authToken}`
            },
          });    
          
        }

        console.log("Registration successful:", JSON.stringify(response.data) + JSON.stringify(response2.data));
        setSnackbarMessage('Registration successful');
        showSnackbar();
  
        // Optionally, reset form or redirect
        setFormData({
          name: "",
          dob: "",
          email: "",
          password: "",
          role: "",
          username: "",
          experience: "",
        });
      }
    } catch (err) {
      console.error("Error submitting form:", err);
  
      // Check if the error response exists and has a structured format
      if (err.response && err.response.data) {
        const apiErrors = {};
        if (err.response.data.errors) {
          err.response.data.errors.forEach((error) => {
            apiErrors[error.param] = error.msg;
          });
        } else if (err.response.data.message) {
          apiErrors.submit = err.response.data.message;
        }
  
        setErrors(apiErrors);
        setSnackbarMessage('Error during registration: ' + (err.response.data.message || 'Please check the input fields.'));
      } else {
        setErrors({ submit: "An unexpected error occurred. Please try again." });
        setSnackbarMessage('Server error: An unexpected error occurred.');
      }
  
      showSnackbar();
    }
  };
  


  return (
    <>
      {/* Optional Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-4 px-4">
        <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
          Create Profile
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4"
        noValidate
      >
        <div className="space-y-6">

          <RegisterName props={{formData:formData, handleChange:handleChange, errors:errors}} />

          <RegisterDob props={{formData:formData, handleChange:handleChange, errors:errors}} />  

          <RegisterEmail props={{formData:formData, handleChange:handleChange, errors:errors}} />  

          <RegisterPassword props={{formData:formData, handleChange:handleChange, errors:errors}} />

          <RegisterRole props={{formData:formData, handleChange:handleChange, errors:errors}} />      

          <RegisterUsername props={{formData:formData, handleChange:handleChange, errors:errors}} />

          <RegisterExperience props={{formData:formData, handleChange:handleChange, errors:errors}} />



          {/* Submission Errors */}
          {errors.submit && (
            <div className="text-sm text-red-600">{errors.submit}</div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
            >
              Register
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
