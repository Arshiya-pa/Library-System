import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema({
     UserId: String,
     FullName: String,
     Email: String,  
     BookTitle: String,
     
     BookCount: {
     type: Number,
     required: [true, "BookCount is required"],
      min: [1, "BookCount cannot be negative"],
     },

     BookIssueDate:Date,
     BookReturnDate:Date,
     ActualBookReturnDate: {
      type: Date,
      default: null,
     },
     Status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
     },
      Fine: {
      type: Number,
      default: 0,
       },
     })
   const Borrows = mongoose.models.Borrows || mongoose.model("Borrows",borrowSchema)
   export default Borrows;