import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../../context/authContext'
import { AcademicCapIcon, PlusIcon, PencilIcon } from "@heroicons/react/solid"; // Import the hero icon you want
// import { useNavigate } from 'react-router-dom'
import DialogBox from './dialogBox';
import CourseCard from './courseCard'; 
import { fetchData } from '../../adminApi/adminApi';
import api from '../../../../api/apiService';

// CRUD Functions
async function fetchCourses(authToken, setCourses, setCoordinator) {
  try {
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
    const response = await fetchData()

    setCourses(await response.data)
    console.log(await response.data)
    if (response.status >= 200 && response.status < 300) {

      const response2 = await axios.get(`${import.meta.env.VITE_APP_HOST2}/users/coordinator/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setCoordinator(response2.data)
    }
  } catch (error) {
    console.error('Error', error);
  }
}

// Extracted Components

function AddCourse({ setIsDialogOpen }) {
  return (
    <div 
      onClick={() => setIsDialogOpen(true)} 
      className="cursor-pointer bg-white shadow-md rounded-lg p-5 m-4 max-w-sm w-full flex flex-col items-center justify-center text-center transition-transform transform hover:shadow-lg"
    >
      <PlusIcon className="w-16 h-16 text-blue-500 mb-4" />
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Add Course</h2>
    </div>
  )
}

export default function AdminHome() {

  const [selection, setSelection] = useState({}) //To set Course Name in dialog form
  const [courses, setCourses] = useState()//array of courses
  const [coordinator, setCoordinator] = useState()

  const { authToken } = useAuth()

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  //GET course/all & GET users/coordinator/all
  useEffect(() => {
    fetchCourses(authToken, setCourses, setCoordinator)
  }, [selection, authToken])

  return (
    <div className='lg:ml-[4.5rem] flex flex-wrap items-center'>
      <h1 className='text-3xl m-4 w-full mb-2'>Courses</h1>
      <br />
      <div className='w-full h-full flex flex-wrap justify-center'>

        {courses?.map((course) => (
          <CourseCard 
            key={course.course_id} 
            props={{
              course: course, 
              setIsDialogOpen: setIsDialogOpen, 
              setSelection: setSelection, 
              coordinator: coordinator
            }} 
          />
        ))}

        <DialogBox 
          props={{
            isDialogOpen: isDialogOpen, 
            setIsDialogOpen: setIsDialogOpen, 
            selection: selection, 
            setSelection: setSelection 
          }} 
        />
        
        <AddCourse setIsDialogOpen={setIsDialogOpen} />
      </div>
    </div>
  )
}
