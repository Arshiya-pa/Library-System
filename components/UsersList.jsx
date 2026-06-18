
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, updateUser } from "@/redux/slices/registerSlice";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";

const UsersList = () => {
    const dispatch = useDispatch();
    const router = useRouter();

   const users = useSelector(
    (state) => state.register.register || []
   );
    const [search, setSearch] = useState("");  
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({});

   const [currentPage, setCurrentPage] = useState(1);
   const usersPerPage = 5;

   const [errors, setErrors] = useState({});
    useEffect(() => {
    dispatch(getUser());
   }, [dispatch]);

   const handleEdit = (item) => {
    setEditId(item._id);
    setEditData(item);
   };

   const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
   };

        const validate = (name, value) => {
             let error = "";
           
             if (name === "UserId") {
               if (!value.trim()) {
                 error = "User ID is required";
               }
             }
           
             if (name === "FullName") {
               if (!value.trim()) {
                 error = "Full name is required";
               } else if (!/^[A-Za-z\s]{3,}$/.test(value)) {
                 error =
                   "Name must contain only letters and be at least 3 characters";
               }
             }
           
             if (name === "Email") {
               if (!value.trim()) {
                 error = "Email is required";
               } else if (
                 !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
               ) {
                 error = "Invalid email address";
               }
             }
           
             if (name === "Phone") {
               if (!value.trim()) {
                 error = "Phone number is required";
               } else if (!/^[0-9]{10}$/.test(value)) {
                 error = "Phone number must be 10 digits";
               }
             }
           
             if (name === "Password") {
               if (!value) {
                 error = "Password is required";
               } else if (
                 !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(value)
               ) {
                 error =
                   "Password must contain uppercase, lowercase, number, special character and minimum 8 characters";
               }
             }
           
             if (name === "Address") {
               if (!value.trim()) {
                 error = "Address is required";
               }
             }
           
             setErrors((prev) => ({
               ...prev,
               [name]: error,
             }));
           };

      const filteredUsers = users?.filter((user) =>
         user.FullName?.toLowerCase().includes(search.toLowerCase()) ||
         user.Email?.toLowerCase().includes(search.toLowerCase()) ||
         user.Address?.toLowerCase().includes(search.toLowerCase())
      );
      const indexOfLastUser = currentPage * usersPerPage;
      const indexOfFirstUser = indexOfLastUser - usersPerPage;
      
      const currentUsers = filteredUsers.slice(
        indexOfFirstUser,
        indexOfLastUser
      );
      
      const totalPages = Math.ceil(
        filteredUsers.length / usersPerPage
      );


      const handleSave = async () => {
        await dispatch(updateUser({ id: editId, userData: editData }));
        setEditId(null);
        dispatch(getUser());  //refresh the userdata
      };

       //  Download pdf
         const downloadPDF = () => {
         const doc = new jsPDF();
   
         doc.setFontSize(18);
         doc.text("Library Users List", 14, 15);
   
         const tableColumn = [
           "UserId",
           "FullName",
           "Email",
           "Phone",
           "Address",
         ];
   
         const tableRows = filteredUsers.map((item) => [
           item.UserId || "",
           item.FullName || "",
           item.Email || "",
           item.Phone || "",
           item.Address || "",
         ]);
   
         autoTable(doc, {
           head: [tableColumn],
           body: tableRows,
           startY: 25,
           theme: "grid",
           styles: {
             fontSize: 10,
           },
           headStyles: {
             fillColor: [111, 66, 193],
           },
         });
   
         doc.save("LibraryUsers.pdf");
        };

           const handleConfirmUpdate = (item) => {
                Swal.fire({
                title: "Update User?",
                text: "Are you sure you want to update this User?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Yes, Update",
                cancelButtonText: "Cancel",
                }).then((result) => {
                 if (result.isConfirmed) {
                  handleEdit(item);
                
                }
             });
           };

           const handleConfirmSave = () => {
              Swal.fire({
                title: "Update User?",
                text: "Are you sure you want to save these changes?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Yes, Save",
                }).then(async (result) => {
                if (result.isConfirmed) {
                await handleSave();
                Swal.fire({
                  icon: "success",
                  title: "Updated!",
                  text: "Userdata has been updated successfully.",
                });
              }
            });
         };
           
          const nextPage = () => {
             if (currentPage < totalPages) {
               setCurrentPage(currentPage + 1);
             }
           };
           
           const prevPage = () => {
             if (currentPage > 1) {
               setCurrentPage(currentPage - 1);
             }
           };
   
   return (
    // <div className="p-6">
     <div className="overflow-x-auto">

      {/* PAGE HEADING */}
         <h1 className="text-3xl font-bold text-center text-purple-700 mb-8 uppercase tracking-wider border-b-2 border-purple-300 pb-3">
           LIST OF USERS
         </h1>
              <div className="flex justify-between items-center mb-4">
              <input
              type="text"
              placeholder="Search......."
              className="border p-3 rounded-xl  w-200"
              value={search}
              onChange={(e) => {
               setSearch(e.target.value);
               setCurrentPage(1);
              }}/>
             
               <button
                  onClick={() => router.push("/registration")}
                  className="bg-blue-600 hover:bg-blue-900 text-white px-4 py-2 rounded-lg">
                  ✍ Add New User
                </button>

               <button
                  onClick={downloadPDF}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                   📥 Download PDF
                </button>
              </div>

       
         <table className="w-full">
          <thead>
            <tr className="border-b text-center text-gray-600">
              <th className="py-3">UserID</th>
              <th>FullName</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody className="text-center">
          {currentUsers?.length > 0 ? (
             currentUsers.map((item) => (
            //<tr key={`${item._id || item.UserId}-${Math.random()}`} className="border-b">
              <tr key={item._id || item.UserId} className="border-b">
                <td className="py-6">{item.UserId}</td>
               
         <td>
            {editId === item._id ? (
             <>
               <input
                 name="FullName"
                 value={editData.FullName || ""}
                 onChange={(e) => {
                   handleChange(e);
                   validate(e.target.name, e.target.value);
                 }}
                 className={`border p-2 rounded ${
                   errors.FullName ? "border-red-500" : ""
                 }`}
               />
         
               {errors.FullName && (
                 <p className="text-red-500 text-xs mt-1">
                   {errors.FullName}
                 </p>
               )}
             </>
           ) : (
             item.FullName
           )}
         </td>

          <td>
            {editId === item._id ? (
             <>
               <input
                 name="Email"
                 value={editData.Email || ""}
                 onChange={(e) => {
                   handleChange(e);
                   validate(e.target.name, e.target.value);
                 }}
                 className={`border p-2 rounded ${
                   errors.Email ? "border-red-500" : ""
                 }`}
               />
         
               {errors.Email && (
                 <p className="text-red-500 text-xs mt-1">
                   {errors.Email}
                 </p>
               )}
             </>
           ) : (
             item.Email
           )}
         </td>

               <td>
            {editId === item._id ? (
             <>
               <input
                 name="Phone"
                 value={editData.Phone || ""}
                 onChange={(e) => {
                   handleChange(e);
                   validate(e.target.name, e.target.value);
                 }}
                 className={`border p-2 rounded ${
                   errors.Phone ? "border-red-500" : ""
                 }`}
               />
         
               {errors.Phone && (
                 <p className="text-red-500 text-xs mt-1">
                   {errors.Phone}
                 </p>
               )}
             </>
           ) : (
             item.Phone
           )}
         </td>
           <td>
            {editId === item._id ? (
             <>
               <input
                 name="Address"
                 value={editData.Address || ""}
                 onChange={(e) => {
                   handleChange(e);
                   validate(e.target.name, e.target.value);
                 }}
                 className={`border p-2 rounded ${
                   errors.Address ? "border-red-500" : ""
                 }`}
               />
         
               {errors.Address && (
                 <p className="text-red-500 text-xs mt-1">
                   {errors.Address}
                 </p>
               )}
             </>
           ) : (
             item.Address
           )}
         </td>

               <td>
                 {editId === item._id ? (
                 <div className="flex gap-2">
      
                  {/* Update Button */}
                  <button
                   onClick={handleConfirmSave}
                  className="bg-green-500 text-white px-4 py-2 rounded"> Save </button>

                 {/* Cancel Button */}
                 <button onClick={() => {
                   setEditId(null);
                   setEditData({});
                 }}
                 className="bg-red-500 text-white px-4 py-2 rounded"> Cancel </button>
                 </div>
                 ) : (
                 <button
                   onClick={() => handleConfirmUpdate(item)}
                  //  onClick={() => handleEdit(item)}
                  className="bg-blue-600 hover:bg-gray-400 px-6 py-3 rounded-xl font-medium">
                  Update
                 </button>
                 )}
               </td>
             </tr>
             ))
            ) : (
           <tr>
             <td
              colSpan="6"
              className="py-8 text-center text-red-500 font-semibold">
              👤 No Users Found
            </td>
           </tr>
         )}
         </tbody>
        </table>
                <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            Previous
          </button>
        
          <span className="font-semibold">
            Page {currentPage} of {totalPages}
          </span>
        
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages || totalPages === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            Next
          </button>
        </div>
     </div>
  );
};

export default UsersList;