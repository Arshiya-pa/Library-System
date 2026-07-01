import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
       UserId: {
       type: String,
       required: [true, "User ID is required"],
       unique: true,
       trim: true,
    },

     FullName: {
       type: String,
       required: [true, "Full Name is required"],
       trim: true,
       minlength: [3, "Full Name must be at least 3 characters"],
     },

      Email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        match: [
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          "Please enter a valid email address",
        ],
      },

      Phone: {
        type: String,
        required: [true, "Phone Number is required"],
        match: [
         /^\d{10}$/,
         "Phone Number must be exactly 10 digits",
       ],
     },

      Address: {
        type: String,
        required: [true, "Address is required"],
        trim: true,
        minlength: [5, "Address must be at least 5 characters"],
      },
       
         MembershipPlan: {
         type: String,
         required: [true, "Membership Plan is required"],
         trim: true,
       },
       
       MembershipFee: {
         type: Number,
         required: [true, "Membership Fee is required"],
         min: [0, "Membership Fee cannot be negative"],
       },
    })
   const Register = mongoose.models.Register || mongoose.model("Register",registrationSchema)
   export default Register;