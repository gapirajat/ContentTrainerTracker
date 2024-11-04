import React, { useState } from 'react';

const AdminRegister = () => {
  const [selected, setSelected] = useState(0);
  const buttons = ['Register', 'Search'];

  const handleSelect = (index) => {
    setSelected(index === selected ? null : index);
  };

  return (
    <div className="h-fit flex flex-col justify-evenly py-12 sm:px-6 lg:px-8">
     <div className="h-fit flex items-stretch justify-evenly">
      <div className="flex w-full space-x-4 max-lg:justify-between mx-[5%]">
        {buttons.map((label, index) => (
          <SelectableButton
            key={index}
            label={label}
            onSelect={() => handleSelect(index)}
            isSelected={selected === index}
          />
        ))}
      </div>
    </div>
    {
      selected===0 ? <Register /> : <SearchBar />
    }
      

    </div>
  );
};


import { CheckIcon } from '@heroicons/react/solid';
import Register from './Register/register';
import SearchBar from './Search/search';

const SelectableButton = ({ label, onSelect, isSelected }) => {
  return (
    <button
      onClick={onSelect}
      className={`relative transition-all max-lg:w-[40%] inline-flex justify-center  px-5 py-2 border-2 rounded-lg font-medium text-center text-sm
        ${
          isSelected
            ? 'bg-black text-white border-white '
            : 'bg-white text-black border-black'
        }
        focus:outline-none 
      `}
    >
      {label}
    </button>
  );
};


export default AdminRegister;
