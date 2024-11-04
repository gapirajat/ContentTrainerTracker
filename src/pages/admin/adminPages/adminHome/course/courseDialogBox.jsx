import { useEffect, useState } from "react";
import CourseDialogBoxForm from "./courseDialogBoxForm";

//coursename acts as a update switch
const DialogBox = ({ props }) => {
  //{isDialogOpen:isDialogOpen, setIsDialogOpen:setIsDialogOpen, selection:selection, setSelection:setSelection, course_name:course_name }

  // const [courseName, setCourseName] = useState(courseData || '');
  // const [topicId, setTopicId] = useState()

  // const [action, setAction] = useState('') //delete update add

  // const handleDeleteRequest = async () => {
  //   const response = await axios.post(`${import.meta.env.VITE_APP_HOST2}/course/create`,{
  //     course_name: formData.course_name
  //   }
  //     , {
  //   headers: { Authorization: `Bearer ${authToken}` },
  // });

  // };

  //empties courseName so that on next dialog load/add course the content is empty
  useEffect(() => {
    console.log("isDialog open");
    if (!props.isDialogOpen) {
      props.setSelection({}); //topics fetch only if courseName not empty
    }
  }, [props.isDialogOpen]);

  return (
    <div className="flex items-center justify-center h-full bg-gray-100 z-[5] ">
      {/* Button to open the dialog */}
      {props.isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative overflow-y-scroll h-fit max-h-[90%]">
            <button
              onClick={() => props.setIsDialogOpen(false)}
              className="absolute scale-150 m-2 top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Batch Details
            </h2>
            <CourseDialogBoxForm
              props={{
                selection: props.selection,
                setSelection: props.setSelection,
                setIsDialogOpen: props.setIsDialogOpen,
                isDialogOpen: props.isDialogOpen,
                course_name: props.course_name,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DialogBox;
