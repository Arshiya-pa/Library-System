
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// GET Fine
 export const getFine = createAsyncThunk( "fineCollection/getFine",
  async () => {
    const res = await axios.get("/api/fineCollection");
    return res.data.fineCollectionData;
  }
 );

// ADD Fine
  export const addFine = createAsyncThunk("fineCollection/addFine",
  async (fineData) => {
    const res = await axios.post("/api/fineCollection", fineData);
    return res.data;
  }
 );

 const fineSlice = createSlice({
    name: "fine",
    initialState: {
    fine: [],
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // GET Fine
      .addCase(getFine.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFine.fulfilled, (state, action) => {
        state.loading = false;
        state.fine = action.payload;
      })
      .addCase(getFine.rejected, (state) => {
        state.loading = false;
      })

      // ADD Fine
      .addCase(addFine.pending, (state) => {
        state.loading = true;
      })
      .addCase(addFine.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload) {
          state.fine.push(action.payload);
        }
      })
      .addCase(addFine.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default fineSlice.reducer;