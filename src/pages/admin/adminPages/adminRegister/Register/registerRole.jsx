import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../../../context/authContext';

export default function RegisterRole({props}) {//{formData:formData, handleChange:handleChange, errors:errors}
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);

  const [courseSelection, setCourseSelection] = useState()

  const {authToken} = useAuth();

  useEffect(() => {
    async function fetchOptions() {

      // Fetch Courses for option
      const response = await axios.get(`${import.meta.env.VITE_APP_HOST2}/course/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setCourses(response.data);

    }

    if (
      props.formData.role === "coordinator" ||
      props.formData.role === "trainer" ||
      props.formData.role === "student"
    ) {
      fetchOptions();
    }
  }, [props.formData.role]);

  // Simulated fetch functions
  // const fetchCourses = async () => [
  //   { id: "course1", name: "Course 1" },
  //   { id: "course2", name: "Course 2" },
  // ];

  // const fetchBatches = async () => [
  //   { id: "batch1", name: "Batch 1" },
  //   { id: "batch2", name: "Batch 2" },
  // ];

  //can use useeffect instead
  const handleRoleChange = async (e) => {
    props.handleChange(e)

    
    // Fetch batches only if role is trainer or student
    if (props.formData.role === "trainer" || props.formData.role === "student" ) {
      console.log(props.formData.role)

      try {
        const response2 = await axios.get(`${import.meta.env.VITE_APP_HOST2}/batches/all/${props.formData.course}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setBatches(response2.data);
      } catch (error) {
        console.error("Error retrieving batches:", error);
      }

    } else {
      setBatches([]); // Clear batches if not needed
    }

  }
  



  return (
    <>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role<span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <select
                id="role"
                name="role"
                required
                value={props.formData.role}
                onChange={props.handleChange}
                className={`appearance-none block w-full px-4 py-2 border ${
                  props.errors.role ? "border-red-500" : "border-gray-300"
                } bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm`}
              >
                <option value="" disabled>
                  Select your role
                </option>
                <option value="coordinator">Coordinator</option>
                <option value="admin">Admin</option>
                <option value="trainer">Trainer</option>
                <option value="student">Student</option>
              </select>
            </div>
            {props.errors.role && (
              <p className="mt-2 text-sm text-red-600">{props.errors.role}</p>
            )}
          </div>
          {/* Course Dropdown - Shown for coordinator, trainer, and student */}
          {(props.formData.role === "coordinator" ||
            props.formData.role === "trainer" ||
            props.formData.role === "student") && (
            <div>
              <label
                htmlFor="course"
                className="block text-sm font-medium text-gray-700"
              >
                Course<span className="text-red-500">*</span>
              </label>
              <select
                id="course"
                name="course"
                required
                value={props.formData.course}
                onChange={handleRoleChange}
                className="appearance-none block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
              >
                <option value="" disabled>
                  Select a course
                </option>
                {courses?.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.course_name}
                  </option>
                ))}
              </select>
              {props.errors.course && (
                <p className="mt-2 text-sm text-red-600">{props.errors.course}</p>
              )}
            </div>
          )}

          {/* Batch Dropdown - Shown only for trainer and student */}
          {(props.formData.role === "trainer" || props.formData.role === "student") && (
            <div>
              <label
                htmlFor="batch"
                className="block text-sm font-medium text-gray-700"
              >
                Batch
                {/* <span className="text-red-500">*</span> */}
              </label>
              <select
                id="batch"
                name="batch"
                required
                value={props.formData.batch}
                onChange={props.handleChange}
                className="appearance-none block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
              >
                <option value="" disabled>
                  Select a batch
                </option>
                {batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.batch_name}
                  </option>
                ))}
              </select>
              {props.errors.batch && (
                <p className="mt-2 text-sm text-red-600">{props.errors.batch}</p>
              )}
            </div>
          )}
    </>
  )
}
