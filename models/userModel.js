import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
      FullName: {
        type: String,
        required:[true,"Please provide a FullName"],
        unique: false,
      },

      Email: {
       type: String,
       required: [true, "Please provide an Email"],
       unique: true,
       match: [
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
         "Please provide a valid Email",
       ],
     },
     // Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.
     Password: {
       type: String,
       required: [true, "Please provide a Password"],
       minlength: [8, "Password must be at least 8 characters"],
       validate: {
       validator: function (value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/.test(value);
       },
       message:
        "Password must contain uppercase, lowercase, number and special character",
     },
    },
  })
   const User = mongoose.models.User || mongoose.model("User",userSchema)
   export default User;