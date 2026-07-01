
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// GET USERS
export const getUser = createAsyncThunk("register/getUser",
    async () => {
    const res = await axios.get("/api/register");
    return res.data.registerData;
  }
);

// ADD USER
export const addUser = createAsyncThunk( "register/addUser",
  async (registerData) => {
    const res = await axios.post("/api/register",registerData);
    return res.data;
  }
);

  // Update User
  export const updateUser = createAsyncThunk("register/updateUser",
    async ({ id, userData }) => {
      const res = await axios.put(`/api/register/${id}`,userData);
      console.log("Update Response....:", res.data);
      return res.data.data;
    }
  );
   

  const registerSlice = createSlice({ 
     name: "register",
     initialState: {
     register: [],
     selectedUser:null,
     loading: false,
  },

      reducers: {setSelectedUser : (state,action) =>{
         state.selectedUser = action.payload;
       },
       clearSelectedUser:(state) =>{
          state.selectedUser = null;
      }
    },
      extraReducers: (builder) => {

    builder
      // GET USER
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.register = action.payload;
      })

      .addCase(getUser.rejected, (state) => {
        state.loading = false;
      })


      // ADD USER
      .addCase(addUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload) {
          state.register.push(
            action.payload
          );
        }
      })

      .addCase(addUser.rejected, (state) => {
        state.loading = false;
      })

      // Update User
       .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
       const index = state.register.findIndex(
        (user) => user._id === action.payload._id
      );

      if (index !== -1) {
        state.register[index] = action.payload;
      }
    })

    .addCase(updateUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {setSelectedUser,clearSelectedUser} = registerSlice.actions;
export default registerSlice.reducer;