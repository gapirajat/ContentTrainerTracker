import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseBatchcard from "./batchCard";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBatchesByUid,
  selectBatches,
  selectBatchesError,
  selectBatchesLoading,
} from "../../trainerSlice/trainerSlice";
import { useAuth } from "../../../../context/authContext";
import { useGeneral } from "../../../../context/generalContext";

export default function TrainerHome() {
  //   const { course_name } = useParams(); //actually course_name
  const { sidebarSelection } = useGeneral();

    // const [batches, setBatches] = useState(); //will be filled after response

  const [selection, setSelection] = useState({}); //will be used to update batchName and to notify if dialog is an update type

  const navigate = useNavigate();
  const { user, authToken } = useAuth();

  const dispatch = useDispatch();
  const batches = useSelector(selectBatches);
  const loading = useSelector(selectBatchesLoading);
  const error = useSelector(selectBatchesError);

  useEffect(() => {
    console.log(user.uid);
    console.log(user.username);
    if (user.uid && authToken) {
      console.log("UID IS GET");
    //   if (authToken) {
    //     return;
    //   }
    const props = {
      uid: user.uid,
      authToken: authToken
    }
      dispatch(fetchBatchesByUid(props)); // Dispatch the thunk to fetch data by UID
    }
  }, [user.uid, dispatch,authToken]);

  useEffect(() => {
    navigate(`/${sidebarSelection}`);
  }, [sidebarSelection]);

  

  // console.log("Course")
  // console.log(course)

  // const goToNestedFolder = () => {
  //   // if (!folder2) navigate(`/${folder1}/folder2`);
  //   // else navigate(`/${folder1}/${folder2}/file`);
  //   // navigate(`${course}/${batch}`);
  // };

  const goBack = () => navigate(-1); // Goes to the previous page in the history stack

  return (
    <div className="lg:ml-[4.5rem]">
        <h1 className='text-3xl m-4 w-full mb-2'>You are teaching to</h1>
      {/* BreadCrumb
      <h1 className="text-3xl m-4">
        {course_name ? course_name : "Course"} {` > `}
      </h1> */}
      {/* Back navigation */}
      {/* <button className="text-lg mx-2 ml-8 text-gray-500" onClick={goBack}>
        ← Back
      </button> */}

      <div className="w-full h-full flex flex-wrap justify-center">
        {batches?.map((batch) => (
          <CourseBatchcard
            props={{
              batch: batch,
              setSelection: setSelection,
            }}
          />
        ))}
        {/* Dialog Box - CRUD Batches RUD Trainer or add Trainer */}
      </div>
    </div>
  );
}