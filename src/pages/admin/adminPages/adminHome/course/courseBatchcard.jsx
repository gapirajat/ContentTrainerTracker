import { PencilIcon, UserGroupIcon } from "@heroicons/react/solid";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function CourseBatchcard({ props }) {
  //{batch:batch, course_name:course_name, setIsDialogOpen:setIsDialogOpen, setSelection:setSelection}}
  const navigate = useNavigate();
  console.log("batch");
  console.log(props.batch);

  const handleSvgClick = (event) => {
    event.stopPropagation(); // Prevents the click from bubbling up to the div
    props.setSelection(props.batch || ""); //batch name when clicked pencil

    props.setIsDialogOpen(true); //set is dialog opne
    console.log("SVG clicked");
  };

  return (
    <>
      <div
        onClick={() =>
          navigate(`/Home/${props.course_name}/${props.batch.batch_name}`)
        }
        className="group cursor-pointer bg-white shadow-md rounded-lg p-5 m-4 max-w-sm w-full flex flex-col items-center text-center transition-transform transform hover:shadow-lg"
      >
        <UserGroupIcon className="w-16 h-16 text-blue-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {props.batch.batch_name}
        </h2>
        <p className="text-gray-600 text-sm">
          Batch ID: {props.batch.batch_id}
        </p>
        <PencilIcon
          onClick={(event) => handleSvgClick(event)}
          className="absolute top-0 right-0 w-[5%] m-[4%] invisible group-hover:visible text-blue-500"
        />
      </div>
    </>
  );
}

// CourseCard.propTypes = {
//     batch: PropTypes.shape({
//       batch_name: PropTypes.string.isRequired,
//       batch_id: PropTypes.string.isRequired,
//     }).isRequired,
//   };
