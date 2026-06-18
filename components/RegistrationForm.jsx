"use client"

import { addUser } from '@/redux/slices/registerSlice';
import React from 'react'
import { useState } from 'react';
import { useDispatch } from "react-redux";
import { useRouter } from 'next/navigation';
import toast, { Toaster } from "react-hot-toast"; 

const RegistrationForm = () => {

    const dispatch = useDispatch();
    const router = useRouter();
    
          const [registerData,setRegisterData ] = useState({
             UserId:"",
             FullName:"",
             Email:"", 
             Phone:"",
             Address:"",
             MembershipPlan:"",
             MembershipFee:"",
          });

          const [errors, setErrors] = useState({});
            
          const validate = () => {       
             let newErrors = {};
           
             if (!registerData.UserId.trim()) {
               newErrors.UserId = "User ID is required";
             }
           
             if (!registerData.FullName.trim()) {
               newErrors.FullName = "Full Name is required";
             }
           
             if (!registerData.Email.trim()) {
               newErrors.Email = "Email is required";
             } else if (
               !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(registerData.Email)
             ) {
               newErrors.Email = "Invalid Email Address";
             }
           
             if (!registerData.Phone.trim()) {
               newErrors.Phone = "Phone Number is required";
             } else if (!/^\d{10}$/.test(registerData.Phone)) {
               newErrors.Phone = "Phone Number must be 10 digits";
             }
           
             if (!registerData.Address.trim()) {
               newErrors.Address = "Address is required";
             }
              if (!registerData.MembershipPlan?.trim()) {
              newErrors.MembershipPlan = "MembershipPlan is required";
            }

             if (!registerData.MembershipFee) {
               newErrors.MembershipFee = "Membership Fee is required";
             } else if (
               isNaN(registerData.MembershipFee) ||
               Number(registerData.MembershipFee) <= 0
             ) {
               newErrors.MembershipFee =
                 "Membership Fee must be greater than 0";
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
                const resultData = await dispatch(addUser(registerData));
                console.log("result is",resultData)
                if (resultData.payload.success) {
                toast.success("New User Added.....")
                router.push("/userList")
              }
            
              } catch (error) {
                 toast.error("Cannot be add new user")
                 console.log("Add New User Error",error.message)
              }
           
           }
           const handleCancel = () => {
            setErrors({});
            setRegisterData({})
           };

     
     return (

     <form onSubmit={handleSubmit}>
       <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
         <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg p-8">
        {/* Heading */}
         <div className="mb-3 text-center">
            <h1 className="text-3xl font-bold text-purple-600">New Registration</h1>
            <p className="text-gray-500 mt-2">Enter user details to add into library </p>
         </div>

          {/* UserID */}
            <div>
              <label className="block mb-2 font-medium">UserID</label>
               <input type="text" name="UserId" placeholder="Enter User Id"

                 onChange={(e) => {
                 setRegisterData({
                   ...registerData,
                   UserId: e.target.value,
                 });
               
                 setErrors((prev) => ({
                   ...prev,
                   UserId: "",
                 }));}}

               className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400 mb-3 
                ${errors.UserId ? "border-red-500" : ""}`}/>

               {errors.UserId && (<p className="text-red-500 text-sm mt-1">
               {errors.UserId}</p>)}

            </div> 

          {/* UserName */}
          <div>
            <label className="block mb-2 font-medium">User Name</label>

             <input type="text" name="FullName" placeholder="Enter user name"
                onChange={(e) => {
                 setRegisterData({
                   ...registerData,
                   FullName: e.target.value,
                 });
               
                 setErrors((prev) => ({
                   ...prev,
                   FullName: "",
                 }));}}

               className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400 mb-3
                 ${errors.FullName ? "border-red-500" : ""}`}/>

               {errors.FullName && (<p className="text-red-500 text-sm mt-1">
               {errors.FullName}</p>)}
             
             </div>

             {/* Email + Phone */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
             {/* Email */}
               <div>
               <label className="block mb-2 font-medium">Email</label>
               <input type="text" name="Email" placeholder="Enter Email"
               className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400 mb-3 ${errors.UserId ? "border-red-500" : ""}`}
                onChange={(e) => {
                 setRegisterData({
                   ...registerData,
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

                {/* Phone */}
               <div>
                 <label className="block mb-2 font-medium">Phone</label>
                  <input type="Number" name="Phone" placeholder="Enter Phone Number"
                  className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400 mb-3 ${errors.UserId ? "border-red-500" : ""}`}
                  onChange={(e) => {
                 setRegisterData({
                   ...registerData,
                   Phone: e.target.value,
                 });
               
                 setErrors((prev) => ({
                   ...prev,
                   Phone: "",
                 }));}}
                 />

                 {errors.Phone && (<p className="text-red-500 text-sm mt-1">
                 {errors.Phone}</p>)}
                 </div>
              </div>

             {/* Address */}
            <div>
                 <label className="block mb-2 font-medium">Address</label>
                  <input type="text" name="Address" placeholder="Enter Address"

                  className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400 mb-3 ${errors.UserId ? "border-red-500" : ""}`}
                   onChange={(e) => {
                  setRegisterData({
                   ...registerData,
                   Address: e.target.value,
                 });
               
                 setErrors((prev) => ({
                   ...prev,
                   Address: "",
                 }));}} />
                 {errors.Address && (<p className="text-red-500 text-sm mt-1">
                 {errors.Address}</p>)}
              </div>

               {/* MembershipPlan + Membershipfee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Membership Plan */}
                <div>
                  <label className="block mb-2 font-medium">
                    Membership Plan
                  </label>
              
                  <select
                    name="MembershipPlan"
                    value={registerData.MembershipPlan}
                    onChange={(e) => {
                      const plan = e.target.value;
              
                      let fee = "";
              
                      switch (plan) {
                        case "Monthly":
                          fee = 100;
                          break;
                        case "6 Months":
                          fee = 500;
                          break;
                        case "Yearly":
                          fee = 1000;
                          break;
                        default:
                          fee = "";
                      }
              
                      setRegisterData({
                        ...registerData,
                        MembershipPlan: plan,
                        MembershipFee: fee,
                      });
                    }}
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="">Select Plan</option>
                    <option value="Monthly">Monthly</option>
                    <option value="6 Months">6 Months</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>

                 {/* Membership Fee */}
                 <div>
                   <label className="block mb-2 font-medium">
                     Membership Fee
                   </label>
                   <input
                     type="text"
                     name="MembershipFee"
                     value={registerData.MembershipFee}
                     readOnly
                     className="w-full border rounded-xl px-4 py-3"
                   />
                 </div>
               </div>
                          
              {/* Buttons */}
              <div className="flex gap-4 pt-4">
              <button type="submit" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium mb-3">
              Add User
             </button>

             <button onClick={handleCancel}
              type="reset"
              className="bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded-xl font-medium mb-3"
             > Cancel
            </button>
         </div>
      </div>
    </div>
 </form> 
  );
};
export default RegistrationForm
