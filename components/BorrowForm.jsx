
"use client";

import React, { useState, useEffect } from "react";
import { addBorrow } from "@/redux/slices/borrowSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getUser } from "@/redux/slices/registerSlice";
import { updateBookQuantity } from "@/redux/slices/bookSlice";

const BorrowForm = () => {

  const dispatch = useDispatch();
  const router = useRouter();
  const [errors, setErrors] = useState({});

  // Selected Book from Redux
  const selectedBook = useSelector(
    (state) => state.book.selectedBook
  );

  // Users Array from Redux
   const users = useSelector(
   (state) => state.register.register
    ) || [];
    
   console.log("User array",users);

   useEffect(() => {
    dispatch(getUser());
    }, [dispatch]);
   
   const [borrowData, setBorrowData] = useState({
    UserId: "",
    FullName: "",
    Email: "",
    BookTitle: "",
    BookCount: "",
    BookIssueDate:"",
    BookReturnDate:"",
  });

  // Auto Fill Book Title
  useEffect(() => {
    if (selectedBook) {
      setBorrowData((prev) => ({
        ...prev,
        BookTitle: selectedBook.BookTitle,
      }));
    }
  }, [selectedBook]);


      const validate = () => {
         let newErrors = {};
      
         // UserId
         if (!borrowData.UserId.trim()) {
           newErrors.UserId = "User ID is required";
         }

         //Book title
          if (!borrowData.BookTitle.trim()) {
           newErrors.BookTitle = "BookTitle is required selected from booklist";
         }
         
        //Fullname
         if (!borrowData.FullName.trim()) {
           newErrors.FullName = "FullName is empty..Check UserId?";
         }

         //Email
         if (!borrowData.Email.trim()) {
           newErrors.Email = "Email is empty..Check UserId?";
         }
      
         // Book Count
         if (!borrowData.BookCount) {
          newErrors.BookCount = "Book count is required";
        } else if (
          isNaN(borrowData.BookCount) ||
          Number(borrowData.BookCount) <= 0
        ) {
          newErrors.BookCount =
            "Book count must be greater than 0";
        }
        
      
         // Issue Date
         if (!borrowData.BookIssueDate) {
           newErrors.BookIssueDate = "Issue date is required";
         }
      
         // Return Date
         if (!borrowData.BookReturnDate) {
           newErrors.BookReturnDate = "Return date is required";
         }
      
         // Return Date should be after Issue Date
         if (
           borrowData.BookIssueDate &&
           borrowData.BookReturnDate &&
           new Date(borrowData.BookReturnDate) <=
             new Date(borrowData.BookIssueDate)
         ) {
           newErrors.BookReturnDate =
             "Return date must be after issue date";
         }
      console.log("Validation Errors:", newErrors);
         setErrors(newErrors);
         return Object.keys(newErrors).length === 0;
};
 
  // Handle UserId Change
    const handleUserIdChange = (e) => {
       const userId = e.target.value;

        setErrors((prev) => ({
        ...prev,
        UserId: "",
        FullName:"",
        Email:""
        }));

       const selectedUser = users.find(
       (user) => String(user.UserId) === String(userId));
       console.log(selectedUser);

      if (selectedUser) {
        setBorrowData((prev) => ({
         ...prev,
         UserId: userId,
         FullName: selectedUser.FullName,
         Email: selectedUser.Email,
      }));

     } else {
      setBorrowData((prev) => ({
         ...prev,
         UserId: userId,
         FullName: "",
         Email: "",
      }));
   }
};


  // Submit Form
    const handleSubmit = async (e) => {
       e.preventDefault();

      console.log("Add button clicked");
    
       if (!validate()) {
          return;
        }
          console.log("Validation passed");
      console.log("Validation:", validate());
      console.log("Borrow Data:", borrowData);
      console.log("Selected Book:", selectedBook);

     // Add Borrow Entry
      const resultData =
      await dispatch(addBorrow(borrowData));
console.log("Result:", resultData);
      // If Borrow Success
     if (resultData.payload.success) {
      // Calculate New Quantity
      const updatedQuantity = selectedBook.Quantity - Number(borrowData.BookCount);
      console.log("Updated Quantity:", updatedQuantity);
       let status;
      if(updatedQuantity > 0) {
        status = "Available";
      } else {
        status = "Borrowed";
      }
      console.log("Updated status------:", status);

      // Update Book Quantity
      await dispatch(
         updateBookQuantity({
            id: selectedBook._id,
            Quantity: updatedQuantity,
            Status: status
         })
      );
      router.push("/list-Book");
   }
};

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen bg-gray-300 flex justify-center items-center p-6">
        <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg p-8">
          {/* Heading */}
          <div className="mb-3 text-center">
            <h1 className="text-3xl font-bold text-purple-600">
              Borrow Form
            </h1>
            <p className="text-gray-500 mt-2">
              Enter Borrow details
            </p>
          </div>

          {/* UserId */}
          <div>
            <label className="block mb-2 font-medium">
              UserId
            </label>
            <input
              type="text"
              placeholder="Enter User Id"
              name="UserId"
              value={borrowData.UserId}
              onChange={handleUserIdChange}  
               className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400 mb-3
                ${errors.UserId ? "border-red-500" : ""}`}         
               />

              {errors.UserId && (
              <p className="text-red-500 text-sm mb-3">
              {errors.UserId}
              </p>)}
               
          </div>

          {/* FullName */}
          <div>
            <label className="block mb-2 font-medium">
              FullName
            </label>
             <input
              type="text"
              name="FullName"
              value={borrowData.FullName}
               readOnly
               
               className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400 mb-3
                ${errors.FullName ? "border-red-500" : ""}`}
               />

              {errors.FullName && (
              <p className="text-red-500 text-sm mb-3">
              {errors.FullName}
              </p>)}
            
           </div>

          {/* Email + Book Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Email */}
            <div>
              <label className="block mb-2 font-medium">
                Email
              </label>
              <input
                type="text"
                name="Email"
                value={borrowData.Email}
                readOnly
                 className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400 mb-3
                ${errors.Email ? "border-red-500" : ""}`}
               />

              {errors.Email && (
              <p className="text-red-500 text-sm mb-3">
              {errors.Email}
              </p>)}
              
            </div>
       
          {/* Book Count */}
            <div>
            <label className="block mb-2 font-medium">
              BookCount
            </label>
            <input
              type="number" min="1"
              name="BookCount"
              value={borrowData.BookCount}
              onChange={(e) => {
                 setBorrowData({
                   ...borrowData,
                   BookCount: e.target.value,
                 });
               
                 setErrors((prev) => ({
                   ...prev,
                   BookCount: "",
                 }));}}
                 
               className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400 mb-3
                ${errors.BookCount ? "border-red-500" : ""}`}
             />

             {errors.BookCount && (
              <p className="text-red-500 text-sm mb-3">
              {errors.BookCount}
              </p>)}
             </div>
          </div>

          {/* Book Title */}
            <div>
              <label className="block mb-2 font-medium">
                BookTitle
              </label>
              <input
                type="text"
                name="BookTitle"
                value={borrowData.BookTitle}
                readOnly
                className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400 mb-3
                ${errors.BookTitle ? "border-red-500" : ""}`}
               />

              {errors.BookTitle && (
              <p className="text-red-500 text-sm mb-3">
              {errors.BookTitle}
              </p> )}
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Date of book issue */}
            <div>
              <label className="block mb-2 font-medium">Date of Book Issue </label>
              <input type="date" name="BookIssueDate"
                 value={borrowData.BookIssueDate}

                 onChange={(e) => {
                 setBorrowData({
                   ...borrowData,
                   BookIssueDate: e.target.value,
                 });
               
                 setErrors((prev) => ({
                   ...prev,
                   BookIssueDate: "",
                 }));}}

                className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400 mb-3
                ${errors.BookIssueDate ? "border-red-500" : ""}`}
                />

              {errors.BookIssueDate && (
              <p className="text-red-500 text-sm mb-3">
              {errors.BookIssueDate}

              </p> )}
            </div>

            {/* Date of book return */}
            <div>
              <label className="block mb-2 font-medium">Date of Book Return</label>
              <input
                type="date"
                name="BookReturnDate"
                value={borrowData.BookReturnDate}
                
                 onChange={(e) => {
                 setBorrowData({
                   ...borrowData,
                   BookReturnDate: e.target.value,
                 });
               
                 setErrors((prev) => ({
                   ...prev,
                   BookReturnDate: "",
                 }));}}

               className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400 mb-3
                ${errors.BookReturnDate ? "border-red-500" : ""}`}
               />

              {errors.BookReturnDate && (
              <p className="text-red-500 text-sm mb-3">
              {errors.BookReturnDate}
              </p> )}
            </div>
          </div>

          {/* Button */}
            <div className="flex gap-4 pt-4">
             <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium">
              Add
             </button>

             <button onClick={() => router.push("/list-Book")}
              type="reset"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium"
             > Cancel
            </button>
         </div>
        </div>
      </div>
    </form>
  );
};

export default BorrowForm;