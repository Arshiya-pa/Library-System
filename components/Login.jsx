
"use client"
import React from 'react'
import { useState } from 'react';
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/slices/authSlice"
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const Login = () => {

      const dispatch = useDispatch();
      const router = useRouter();

      const [formData, setFormData] = useState({
         Email: "",
         Password: "",
      });

       const [errors, setErrors] = useState({});
                           
         const validate = () => {       
            let newErrors = {};
          
        
            if (!formData.Email.trim()) {
              newErrors.Email = "Email is required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.Email)
            ) {
              newErrors.Email = "Invalid Email Address";
            }
               
             if (!formData.Password) {
               newErrors.Password = "Password is required";
             } 
            setErrors(newErrors);  
            return Object.keys(newErrors).length === 0;
           };
        /*Login submission*/
          const handleSubmit = async (e) => {
            e.preventDefault();
            try {
              if (!validate()) { return; }
              const result = await dispatch(loginUser(formData));

              if (loginUser.fulfilled.match(result)) {
               Swal.fire({
                 icon: "success",
                 title: "Login Successful",
                 text: "Welcome Back!",
                 confirmButtonColor: "#01342F",
               }).then(() => {
                 router.push("/dashboard");
               });
             } else {
               Swal.fire({
                 icon: "error",
                 title: "Login Failed",
                 text:
                   result.payload?.message ||
                   result.payload?.error ||
                   "Invalid Email or Password",
                 confirmButtonColor: "#d33",
               });
             }
            }catch (error){
              console.log("Error in Login",error)
            }
        };
      
  return (
   <form onSubmit={handleSubmit}>
      <div
         className="min-h-screen bg-cover bg-center flex justify-center items-center"
         style={{ backgroundImage: "url('/library_room_background.jpg')"}}>
         <div className="w-full max-w-6xl flex items-center justify-between">

         {/* Left Content */}
         <div className="text-white max-w-lg">
             <h1 className="text-5xl font-bold leading-tight">
                "The only thing that you absolutely have to know, is the location of the library."
             </h1>
             <h2 className="mt-6 text-lg font-semibold text-yellow-300">
              —  Albert Einstein
             </h2>
         </div>

        {/* Login Card */}
        <div className="bg-[#162433]/95 w-87.5 rounded-xl shadow-2xl p-8">

          <h2 className="text-white text-3xl font-bold text-center mb-8">
               Login
          </h2>
 
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
            rounded-full font-semibold">Login »
           </button>

          {/* SignUp */}
            <p className="text-center text-gray-400 text-sm mt-6">
               Don't have an account?
              <button className="text-cyan-400 cursor-pointer ml-1 hover:underline" onClick={()=>router.push("/signup")}>
               SignUp now
             </button>
          </p>
        </div>
      </div>
    </div>
    </form>
  )
}

export default Login
