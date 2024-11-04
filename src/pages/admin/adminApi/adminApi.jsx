import api from "../../../api/apiService";


// Example GET request
export const fetchData = async () => {
   const response = await api.get(`${import.meta.env.VITE_APP_HOST2}/course/all`);
  return response;
};
// Add more functions as needed
