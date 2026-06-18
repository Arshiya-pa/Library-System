import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// GET BOOKS
export const getBooks = createAsyncThunk(
  "books/getBooks",
  async () => {
    const res = await axios.get("/api/books");
       console.log("API Response in Getbook:", res.data);
      return res.data.books;
  }
);

// ADD BOOK
 export const addBook = createAsyncThunk(
  "books/addBook",
   async (formData) => {
    const res = await axios.post("/api/books", formData);
    return res.data.data;
   }
  );

   //Update Quantity
    export const updateBookQuantity = createAsyncThunk("books/updateBookQuantity",
        async ({ id, ...data }) => {
       const res = await axios.put(`/api/books/${id}`,data);
       console.log(res.data)
        return res.data.data;
      }
    );

    //Delete Book Thunk
    export const deleteBook = createAsyncThunk("books/deleteBook",
    async (id) => {
      await axios.delete(`/api/books/${id}`);
      return id; // return deleted book id
    }
   );
      
   const bookSlice = createSlice({
    name: "books",
    initialState: {
    books: [],
    loading: false,
    selectedBook: null, // ← Add this
  },

  reducers: {
    setSelectedBook: (state, action) => {
      state.selectedBook = action.payload;
    },

    clearSelectedBook: (state) => {
      state.selectedBook = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // GET BOOKS
      .addCase(getBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(getBooks.rejected, (state) => {
        state.loading = false;
      })

      // ADD BOOK
      .addCase(addBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload) {
          state.books.push(action.payload);
        }
      })
      .addCase(addBook.rejected, (state) => {
        state.loading = false;
      })
       
      //updateBook
      .addCase(updateBookQuantity.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateBookQuantity.fulfilled, (state, action) => {
            state.loading = false;

           // Check payload exists
             if (!action.payload) return;
               state.books = state.books.map((book) =>
               book?._id === action.payload?._id
               ? action.payload
               : book
             );
            // Update selectedBook
            if (state.selectedBook?._id === action.payload?._id) {
               state.selectedBook = action.payload;
             }
           })

          .addCase(updateBookQuantity.rejected, (state) => {
              state.loading = false;
           })

           //delete book
           .addCase(deleteBook.pending, (state) => {
             state.loading = true;
           })
           .addCase(deleteBook.fulfilled, (state, action) => {
             state.loading = false;
     
             // Remove deleted book from state
             state.books = state.books.filter(
               (book) => book._id !== action.payload
             );
           })
           .addCase(deleteBook.rejected, (state) => {
             state.loading = false;
            })
         },
       });

 export const { setSelectedBook, clearSelectedBook } =
     bookSlice.actions;

  export default bookSlice.reducer;