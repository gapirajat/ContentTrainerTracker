// store.js
import { configureStore } from '@reduxjs/toolkit';
import trainerReducer from '../pages/trainer/trainerSlice/trainerSlice.jsx';
import generalReducer from '../generalSlice/generalSlice.jsx';
import adminReducer from '../pages/admin/adminSlice/adminSlice.jsx';


const store = configureStore({
  reducer: {
    general: generalReducer,
    admin: adminReducer,
    batches: trainerReducer, // each "slice" of state goes here
  },
});

export default store;
