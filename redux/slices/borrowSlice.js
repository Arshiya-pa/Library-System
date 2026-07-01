import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

// GET Borrow details
 export const getBorrow = createAsyncThunk("borrowbook/getBorrow",
  async () => {
    const res = await axios.get("/api/borrowbook");
    console.log("data is", res.data.borrowData)
    return res.data.borrowData;
  }
);
  // Add Borrow details
     export const addBorrow = createAsyncThunk("borrowbook/addBorrow",
     async (borrowData) => {
       console.log("borrowData===",borrowData)
       const res = await axios.post("/api/borrowbook",borrowData)
       return res.data;
  }
);

  // Update BorrowData
   export const updateBorrow = createAsyncThunk("borrowbook/updateBorrow",
    async ({ id, BookReturnDate,BookCount,ReturnBookCount, ActualBookReturnDate,Status,Fine, }) => {
       const res = await axios.put(
        `/api/borrowbook/${id}`,
        { BookReturnDate,BookCount,ReturnBookCount,ActualBookReturnDate,Status,Fine});
       console.log("Update Response....:", res.data);
       return res.data.data;
    }
  );

 const borrowbookSlice = createSlice({
    name: "borrowbook",
    initialState: {
    borrowbook: [],
    loading: false,
    selectedUserId: null, // ← Add this
  },

  reducers: {
    setselectedUserId: (state, action) => {
      state.selectedUserId = action.payload;
    },
   },

    extraReducers: (builder) => {
    builder
      // GET user
      .addCase(getBorrow.pending, (state) => {
         state.loading = true;
      })

      .addCase(getBorrow.fulfilled, (state, action) => {
        state.loading = false;
        state.borrowbook = action.payload;
      })

      .addCase(getBorrow.rejected, (state) => {
        state.loading = false;
      })


      // ADD user
      .addCase(addBorrow.pending, (state) => {
        state.loading = true;
      })

      .addCase(addBorrow.fulfilled, (state, action) => {
        state.loading = false;
         if (action.payload) {
        state.borrowbook = [
       ...state.borrowbook,
        action.payload
        ];}
      })

      .addCase(addBorrow.rejected, (state) => {
        state.loading = false;
      })

       //Update Borrow Data
         .addCase(updateBorrow.pending, (state) => {
              state.loading = true;
            })
      
         .addCase(updateBorrow.fulfilled, (state, action) => {
              state.loading = false;
      
           // Check payload exists
             if (!action.payload) return;
               state.borrowbook = state.borrowbook.map((borrow) =>
               borrow?._id === action.payload?._id
               ? action.payload
               : borrow
               );
             })
            .addCase(updateBorrow.rejected, (state) => {
                state.loading = false;
             });
          },
      });
 export const { setselectedUserId } = borrowbookSlice.actions;
 export default borrowbookSlice.reducer;