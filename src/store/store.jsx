// store.js
import { configureStore } from '@reduxjs/toolkit';
import trainerReducer from '../pages/trainer/trainerSlice/trainerSlice.jsx';


const store = configureStore({
  reducer: {
    batches: trainerReducer, // each "slice" of state goes here
  },
});

export default store;
