// store.js
import { configureStore } from '@reduxjs/toolkit';
import trainerReducer from '../pages/trainer/trainerSlice/trainerSlice.jsx';
import generalReducer from '../generalSlice/generalSlice.jsx';
import adminReducer from '../pages/admin/adminSlice/adminSlice.jsx';
import studentReducer from '../pages/student/studentSlice/studentSlice.jsx';


const store = configureStore({
  reducer: {
    general: generalReducer,
    admin: adminReducer,
    batches: trainerReducer, // each "slice" of state goes here
    student: studentReducer,
  },
});

export default store;
