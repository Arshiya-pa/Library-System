
import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "../redux/slices/bookSlice"
import authReducer from "../redux/slices/authSlice"
import registerReducer from "../redux/slices/registerSlice"
import borrowReducer from "../redux/slices/borrowSlice"

export const store = configureStore({
  reducer: {
    book: bookReducer,
    auth:authReducer,
    register:registerReducer,
    borrowbook:borrowReducer,
  },
});