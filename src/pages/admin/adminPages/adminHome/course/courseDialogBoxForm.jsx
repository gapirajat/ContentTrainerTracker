//

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useAuth } from '../../../../../context/authContext';
import { useGeneral } from '../../../../../context/generalContext';

export default function CourseDialogBoxForm({props}) {//{selection: props.selection, setSelection: props.setSelection, setIsDialogOpen: props.setIsDialogOpen, isDialogOpen:props.isDialogOpen, course_name: props.course_name}

    const {setSnackbarMessage, showSnackbar} = useGeneral()
    // const [test, settest] = useState(props.isDialogOpen)
    const {authToken} = useAuth()

    const [initialState, setInitialState] = useState() 

    useEffect(() => {
        setInitialState(props.selection)
      }, [props.isDialogOpen])
      



          // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
          course_name: props.course_name,
          batch_name: props.selection.batch_name,
        };
    
        console.log('Form Data:', formData);
        // Reset form or close dialog if needed
    
        const postRequest = async () => {
          try {
            console.log(JSON.stringify(formData)+" formData")
            const response = await axios.post(`${import.meta.env.VITE_APP_HOST2}/batches/create`,
                formData
              , {
            headers: { Authorization: `Bearer ${authToken}` },
          });
    
            console.log(response.status)
            setSnackbarMessage("Created Batch successfully "+JSON.stringify(response.data))
            showSnackbar()
    
          } catch (error) {
            console.error('Error in post request:', error);
            // throw error; // Throw error to handle it higher up if needed
            setSnackbarMessage("Error creating Batch "+JSON.stringify(response.data))
            showSnackbar()
          }
        };
        try {
                    postRequest();
        } catch (error) {
            setSnackbarMessage("Error creating Batch "+JSON.stringify(response.data))
            showSnackbar()
        }

        props.setSelection({});
        // setTopics([]);
        props.setIsDialogOpen(!props.isDialogOpen)
      };

      const batchDelete =  async (batch_id) => {
        try {
          const response = await axios.delete(`${import.meta.env.VITE_APP_HOST2}/batches/delete/${batch_id}`
            , {
              headers: { Authorization: `Bearer ${authToken}` },
            }
          );
          console.log('Batch deleted successfully:', response.data);
          setSnackbarMessage("Batch deleted successfully: " + JSON.stringify(response.data))
          showSnackbar()
        //   console.log(authToken)
          props.setIsDialogOpen(!props.isDialogOpen)
          props.setSelection({})
        } catch (error) {
          console.error('Error deleting Batch: ', error);
          setSnackbarMessage("Error deleting Batch: " + error)
          showSnackbar()
        }
        
      }

      const batchUpdate =  async (batch_id) => {
        try {
          const response = await axios.put(`${import.meta.env.VITE_APP_HOST2}/batches/update/${batch_id}`,
            {
                batch_name: props.selection.batch_name
            }
            , {
              headers: { Authorization: `Bearer ${authToken}` },
            }
          );
          console.log('Batch updated successfully:', response.data);
          setSnackbarMessage("Batch updated successfully: " + JSON.stringify(response.data))
          showSnackbar()
        //   console.log(authToken)
          props.setIsDialogOpen(!props.isDialogOpen)
          props.setSelection({})
        } catch (error) {
          console.error('Error updating Batch: ', error);
          setSnackbarMessage("Error updating Batch: " + error)
          showSnackbar()
        }
        
      }
      

      
  return (
    <form onSubmit={handleSubmit}>
    {/* Course Name Input */}
    <div className="mb-4 relative">
      <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="batchname">
        Batch Name
      </label>
      <input
        type="text"
        id="batchname"
        value={props.selection.batch_name}
        onChange={(e) => 
          props.setSelection((prevSelection) => ({
            ...prevSelection,
            batch_name: e.target.value,
          }))}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
        placeholder="Enter batch name"
      />
      {
        (initialState?.batch_name && (initialState?.batch_name !== props.selection.batch_name)) &&  
        <button
        type="button"
        onClick={()=>batchUpdate(props.selection.batch_id)}
        className="text-green-600 hover:text-green-800 absolute right-[0.5rem] top-[50%]"
        >
        Save
        </button>
      }

    </div>
    {/* Submit Button */}
    {!initialState?.batch_name &&
        <button
        type="submit"
        className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-all"
      >
        Submit
      </button>
    }

    {initialState?.batch_name &&     
    <button
      type="button"
      className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all my-2"
      onClick={()=>batchDelete(initialState.batch_id)}

    >
      Delete
    </button>
    }


  </form>
  )
}
