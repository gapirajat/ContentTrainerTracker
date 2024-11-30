import React from 'react'
import { useNavigate } from 'react-router-dom'

function Announcement() {
  const navigate = useNavigate()
  return (
    <div 
      onClick={()=>navigate(`/Messages/announcement`)} 
      className="cursor-pointer bg-white shadow-md rounded-lg p-5 m-4 max-w-sm w-full flex flex-col items-center justify-center text-center transition-transform transform hover:shadow-lg"
    >
      {/* <PlusIcon className="w-16 h-16 text-blue-500 mb-4" /> */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Announcement</h2>
    </div>
  )
}
export default function AdminMessages() {
  return (
    <div className='lg:ml-[4.5rem]'>
        <h1 className='text-3xl m-4 w-full mb-2'>Message</h1>
        <br />
        <Announcement />
    </div>
  )
}
