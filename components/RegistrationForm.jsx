"use client"

import { addUser,getUser } from '@/redux/slices/registerSlice';
import React from 'react'
import { useState,useEffect } from 'react';
import { useDispatch,useSelector } from "react-redux";
import { useRouter } from 'next/navigation';
import Swal from "sweetalert2";

const RegistrationForm = () => {

    const dispatch = useDispatch();
    const router = useRouter();

       const users = useSelector((state) => state.register.register);

          const [registerData,setRegisterData ] = useState({
             UserId:"",
             FullName:"",
             Email:"", 
             Phone:"",
             Address:"",
             MembershipPlan:"",
             MembershipFee:"",
          });

           useEffect(() => {
           dispatch(getUser());
           }, [dispatch]);

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
              } else {
                const emailExists = users.some(
                  (user) =>
                    user.Email?.toLowerCase() ===
                    registerData.Email.toLowerCase()
                );
              
                if (emailExists) {
                  newErrors.Email = "Email already exists";
                }
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

         /* user submission */
           const handleSubmit = async (e) => {
              e.preventDefault();
              try {
                 if (!validate()) return;
                 if (errors.Email) return;

                const resultData = await dispatch(addUser(registerData));
                console.log("result is",resultData)
               if (addUser.fulfilled.match(resultData)) {
                 await Swal.fire({
                   icon: "success",
                   title: "User Added!",
                   text: "New user registered successfully.",
                   confirmButtonColor: "#01342F",
                 });
               
                 router.push("/userList");
                } else {
                 Swal.fire({
                   icon: "error",
                   title: "Registration Failed",
                   text: resultData.error?.message || "Something went wrong!",
                   confirmButtonColor: "#d33",
                 });
                }             
               } catch (error) {
                 toast.error("Cannot be add new user")
                 console.log("Add New User Error",error.message)
               }
            }
            
            const handleCancel = () => {
               setErrors({});
               setRegisterData({
                 UserId: "",
                 FullName: "",
                 Email: "",
                 Phone: "",
                 Address: "",
                 MembershipPlan: "",
                 MembershipFee: "",
               });
             };
 
           /* Email Change function*/
          const handleEmailChange = (e) => {
            const email = e.target.value;
          
            setRegisterData((prev) => ({
              ...prev,
              Email: email,
            }));
          
            if (!email) {
              setErrors((prev) => ({
                ...prev,
                Email: "",
              }));
              return;
            }
          
            const emailExists = users.some(
              (user) =>
                user.Email?.trim().toLowerCase() ===
                email.trim().toLowerCase()
            );
          
            setErrors((prev) => ({
              ...prev,
              Email: emailExists
                ? "Email already exists"
                : "",
            }));
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
                    value={registerData.Email || ""}
                    onChange={handleEmailChange}
                    className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400 mb-3 ${
                    errors.Email ? "border-red-500" : "" }`} />
                
                   {errors.Email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.Email}
                    </p>
                   )}
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
                        MembershipPlan:plan,
                        MembershipFee:fee,
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
