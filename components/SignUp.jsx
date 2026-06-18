 "use client";
 
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useDispatch } from "react-redux";
import { signupUser } from "../redux/slices/authSlice"
import toast, { Toaster } from "react-hot-toast"; //npm install react-hot-toast

  const SignUp = () => {
      const router = new useRouter()

         const dispatch = useDispatch();
         const [formData, setFormData] = useState({
           FullName: "",
           Email: "",
           Password: "",
         });

         const [errors, setErrors] = useState({});
                     
            const validate = () => {       
               let newErrors = {};
             
              if (!formData.FullName.trim()) {
                newErrors.FullName = "Full Name is required";
              } else if (!/^[A-Za-z\s]{3,}$/.test(formData.FullName)) {
                newErrors.FullName =
                  "Full Name must contain only letters and be at least 3 characters";
              }
             
               if (!formData.Email.trim()) {
                 newErrors.Email = "Email is required";
               } else if (
                 !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.Email)
               ) {
                 newErrors.Email = "Invalid Email Address";
               }
             
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
              
                if (!formData.Password) {
                  newErrors.Password = "Password is required";
                } else if (!passwordRegex.test(formData.Password)) {
                  newErrors.Password =
                  "Password must be at least 8 characters and contain uppercase,lowercase, number, and special character";
                }
               setErrors(newErrors);  
               return Object.keys(newErrors).length === 0;
              };
  

         const handleSubmit = async (e) => {
           e.preventDefault();
           try {
            if (!validate()) {
                  return;
                }

           const result = await dispatch(signupUser(formData));
           console.log("result is",result)
           if (result.payload.success) {
             toast.success("Signup Completed.....")
              router.push("/login");
            } 
           }catch (error) {
              toast.error("Signup Incomplete")
              console.log("Signup Error",error.message)
            }
        }

      return (
      <form onSubmit={handleSubmit}>
        <div
         className="min-h-screen bg-cover bg-center flex justify-center items-center"
         style={{ backgroundImage: "url('/library_room_background.jpg')"}}>
         <div className="w-full max-w-6xl flex items-center justify-between">

         {/* Left Content */}
         <div className="text-white max-w-lg">
             <h1 className="text-5xl font-bold leading-tight">
              "To add a library to a house is to give that house a soul."
             </h1>
             <h2 className="mt-6 text-lg font-semibold text-yellow-300">
              — Gail Carson Levine
             </h2>
         </div>

        {/* Signup Card */}
        <div className="bg-[#162433]/95 w-87.5 rounded-xl shadow-2xl p-8">

          <h2 className="text-white text-3xl font-bold text-center mb-8">
           Create an Account
          </h2>

          {/* FullName */}
          <div className="mb-6">
             <label className="text-sm text-gray-300">FullName</label>
             <input type="text" id="FullName" name="FullName"  

              className={`w-full bg-transparent border-b border-cyan-500 outline-none text-white py-2 mt-1
               ${errors.FullName ? "border-red-500" : ""}`}
                onChange={(e) => {
                  setFormData({
                   ...formData,
                   FullName: e.target.value,
                 });
               
                 setErrors((prev) => ({
                   ...prev,
                   FullName: "",
                 }));}}
                 />
                 {errors.FullName && (<p className="text-red-500 text-sm mt-1">
                 {errors.FullName}</p>)}
                  
          </div>
         
         
          {/* Email */}
          <div className="mb-6">
             <label className="text-sm text-gray-300">Email</label>
             <input type="email" id="Email" name="Email"  
             
                className={`w-full bg-transparent border-b border-cyan-500 outline-none text-white py-2 mt-1
                 ${errors.Email ? "border-red-500" : ""}`}
                onChange={(e) => {
                  setFormData({
                   ...formData,
                   Email: e.target.value,
                 });
               
                 setErrors((prev) => ({
                   ...prev,
                   Email: "",
                 }));}}
                 />
 
                 {errors.Email && (<p className="text-red-500 text-sm mt-1">
                 {errors.Email}</p>)}
          </div>

          {/* Password */}
             <div className="mb-8">
              <label className="text-sm text-gray-300">Password</label>
              <input type="password" id="Password" name="Password"  

                className={`w-full bg-transparent border-b border-cyan-500 outline-none text-white py-2 mt-1
                 ${errors.Password ? "border-red-500" : ""}`}
                onChange={(e) => {
                  setFormData({
                   ...formData,
                   Password: e.target.value,
                 });
               
                 setErrors((prev) => ({
                   ...prev,
                   Password: "",
                 }));}}
                 />
 
                 {errors.Password && (<p className="text-red-500 text-sm mt-1">
                 {errors.Password}</p>)}
             </div>

          {/* Button */}
           <button type='submit' 
            className="w-full bg-cyan-600 hover:bg-cyan-700 transition-all text-white py-3 
            rounded-full font-semibold">Sign Up »
           </button>

          {/* Login */}
            <p className="text-center text-gray-400 text-sm mt-6">
               Already have an account?
              <button className="text-cyan-400 cursor-pointer ml-1 hover:underline" onClick={()=>router.push("/login")}>
               Login now
             </button>
          </p>
        </div>
      </div>
    </div>
    </form>
  );
};

export default SignUp;