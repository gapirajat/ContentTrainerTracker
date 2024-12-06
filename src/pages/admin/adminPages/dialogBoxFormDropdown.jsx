import React, { useState, useEffect } from 'react';
import axios from 'axios';

//coordinator
const DialogBoxFormDropdown = () => {
    const [data, setData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch data with Axios
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://jsonplaceholder.typicode.com/users');
                setData(response.data); // assuming the response is an array
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Toggle Dropdown
    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className="relative inline-block w-64">
            <button
                onClick={toggleDropdown}
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 focus:outline-none"
            >
                {loading ? 'Loading...' : 'Select Item'}
            </button>
            
            {/* Dropdown List */}
            {isOpen && (
                <div className="absolute left-0 w-full mt-2 bg-white rounded-md shadow-lg max-h-60 overflow-y-auto z-10 border border-gray-200">
                    {data.length > 0 ? (
                        data.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => alert(`Selected: ${item.name}`)}
                                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 focus:outline-none"
                            >
                                {item.name}
                            </button>
                        ))
                    ) : (
                        <p className="px-4 py-2 text-gray-700">No data available</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
