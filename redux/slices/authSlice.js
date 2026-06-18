import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* ---------------- SIGNUP ---------------- */
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (formData, thunkAPI) => {
    try {
      const res = await axios.post("/api/signUp", formData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

/* ---------------- LOGIN ---------------- */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, thunkAPI) => {
    try {
      const res = await axios.post("/api/login", formData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

/* ---------------- SLICE ---------------- */
const authSlice = createSlice({
  name: "auth",

  initialState: {
    loading: false,
    user: null,
    token: null,
    error: null,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    /* restore after refresh */
    loadUserFromStorage: (state) => {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (user) {
        state.user = JSON.parse(user);
        state.token = token;
      }
    },
  },

  extraReducers: (builder) => {
    builder

      /* -------- LOGIN -------- */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;

        localStorage.setItem("token", action.payload.token);
        localStorage.setItem(
          "user",
          JSON.stringify(action.payload.user)
        );
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------- SIGNUP -------- */
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.error = null;
      })

      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
