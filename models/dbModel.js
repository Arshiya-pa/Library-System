import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
   BookTitle: {
    type: String,
    required: [true, "Book Title is required"],
    trim: true,
    minlength: [2, "Book Title must be at least 2 characters"],
  },

   AuthorName: {
    type: String,
    required: [true, "Author Name is required"],
    trim: true,
   },

   Category: {
    type: String,
    required: [true, "Category is required"],
    enum: {
      values: ["Self Help", "Finance", "Fiction", "Spirituality"],
      message: "Invalid Category",
    },
  },

   Quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [0, "Quantity cannot be negative"],
   },

   Status: {
    type: String,
    required: [true, "Status is required"],
    enum: {
      values: ["Available", "Borrowed"],
      message: "Status must be Available or Borrowed",
    },
    default: "Available",
   },

   BookImage: {
    type: String,
    required: [true, "Book Image is required"],
   },
  })
   const Book = mongoose.models.Book || mongoose.model("Book",bookSchema)
   export default Book;
