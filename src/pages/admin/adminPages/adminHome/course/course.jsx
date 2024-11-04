import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserGroupIcon, PlusIcon } from "@heroicons/react/solid"; // Import the hero icon you want
import PropTypes from "prop-types";
import { useAuth } from "../../../../../context/authContext";
import CourseBatchcard from "./courseBatchcard";
import CourseDialogbox from "./courseDialogBox";

export default function Course() {
  const { course_name } = useParams(); //actually course_name

  const [batches, setBatches] = useState(); //will be filled after response

  const [selection, setSelection] = useState({}); //will be used to update batchName and to notify if dialog is an update type

  const navigate = useNavigate();
  const { authToken } = useAuth();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // console.log("Course")
  // console.log(course)

  useEffect(() => {
    async function fetchData() {
      try {
        console.log(course_name + "course_name");
        const response = await axios.get(
          `${import.meta.env.VITE_APP_HOST2}/batches/all/${course_name}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setBatches(await response.data); //filled after GET all
        console.log(await response.data);
      } catch (error) {
        console.error("Error", error);
      }
    }
    fetchData();
  }, []);

  // const goToNestedFolder = () => {
  //   // if (!folder2) navigate(`/${folder1}/folder2`);
  //   // else navigate(`/${folder1}/${folder2}/file`);
  //   // navigate(`${course}/${batch}`);
  // };

  const goBack = () => navigate(-1); // Goes to the previous page in the history stack

  return (
    <div className="lg:ml-[4.5rem]">
      {/* BreadCrumb */}
      <h1 className="text-3xl m-4">
        {course_name ? course_name : "Course"} {` > `}
      </h1>
      {/* Back navigation */}
      <button className="text-lg mx-2 ml-8 text-gray-500" onClick={goBack}>
        ← Back
      </button>

      <div className="w-full h-full flex flex-wrap justify-center">
        {batches?.map((batch) => (
          <CourseBatchcard
            props={{
              batch: batch,
              course_name: course_name,
              setIsDialogOpen: setIsDialogOpen,
              setSelection: setSelection,
            }}
          />
        ))}
        {/* Dialog Box - CRUD Batches RUD Trainer or add Trainer */}
        <CourseDialogbox
          props={{
            isDialogOpen: isDialogOpen,
            setIsDialogOpen: setIsDialogOpen,
            selection: selection,
            setSelection: setSelection,
            course_name: course_name,
          }}
        />
        {/* Add Batches Card */}
        <div
          onClick={() => setIsDialogOpen(true)}
          className="cursor-pointer bg-white shadow-md rounded-lg p-5 m-4 max-w-sm w-full flex flex-col items-center justify-center text-center transition-transform transform hover:shadow-lg"
        >
          <PlusIcon className="w-16 h-16 text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Add Batch
          </h2>
        </div>
      </div>
    </div>
  );
}
