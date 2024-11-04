import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { AcademicCapIcon, PencilIcon } from "@heroicons/react/solid";

const CourseCard = ({ props }) => {
    const navigate = useNavigate()
  
    const handleSvgClick = (event) => {
      event.stopPropagation(); // Prevents the click from bubbling up to the div
      props.setSelection(props.course || '');//course name when clicked pencil
      props.setIsDialogOpen(!props.isDialogOpen)//set is dialog opne
      console.log('SVG clicked');
      console.log(props.course)
    };

      // Function to get the matching index
      const getMatchingName = (uid) => {
        console.log(props.coordinator)
        console.log(props.course)
        const matchingItem = props.coordinator?.find(item => item.uid === uid);
        return matchingItem ? matchingItem.name : 'No'; // Return name or 'Unknown' if not found
      };
      
  
    return (
      <div onClick={()=>navigate(`/Home/${props.course.course_name}`)} className="group cursor-pointer bg-white shadow-md rounded-lg p-5 m-4 max-w-sm w-full flex flex-row items-center justify-start text-center transition-transform transform hover:shadow-lg">
        <AcademicCapIcon className="w-24 text-blue-500 mb-4" />
        <div className="">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{props.course.course_name}</h2>
        <p className="text-gray-600 text-sm ml-[7%] text-nowrap">Course ID: {props.course.course_id}</p>
        <p>Coordinator: {getMatchingName(props.course.uid)}</p>
        <PencilIcon onClick={(event)=>handleSvgClick(event)} className='absolute top-0 right-0 w-[5%] m-[4%] invisible group-hover:visible text-blue-500'/>
        </div>
</div>
    );
  };

  export default CourseCard;