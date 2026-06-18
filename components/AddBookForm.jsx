"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addBook } from "../redux/slices/bookSlice"
import { useRouter } from "next/navigation";

const AddBookForm = () => {

    const dispatch = useDispatch();
    const router = useRouter();
    const [preview, setPreview] = useState(null);


    const [bookData, setBookData] = useState({
     BookTitle: "",
     AuthorName: "",
     Category: "",
     Quantity: "",
     Status: "Available",
     BookImage: "",
   });

    const [file, setFile] = useState(null);

     const [errors, setErrors] = useState({});
                     
        const validate = () => {
            let newErrors = {};
          
            if (!bookData.BookTitle?.trim()) {
              newErrors.BookTitle = "Book title is required";
            }
          
            if (!bookData.AuthorName?.trim()) {
              newErrors.AuthorName = "Author name is required";
            }
          
            if (!bookData.Category?.trim()) {
              newErrors.Category = "Category is required";
            }
          
           if (!bookData.Quantity) {
             newErrors.Quantity = "Quantity is required";
           } else if (Number(bookData.Quantity) <= 0) {
             newErrors.Quantity = "Quantity must be greater than 0";
           }
          
            if (!file) {
              newErrors.BookImage = "Book Image is required";
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
                    const formData = new FormData();
                     formData.append("BookTitle",bookData.BookTitle);
                     formData.append("AuthorName",bookData.AuthorName);
                     formData.append("Category",bookData.Category);
                     formData.append("Quantity",bookData.Quantity);
                     formData.append("Status",bookData.Status);
                     formData.append("BookImage", file);
                     dispatch(addBook(formData));
                     router.push("/list-Book");

                    } catch (error) {
                      console.log("Add New Book Error",error.message)
                  }                
                };

                 const handleCancel = () => {
                   setErrors({});
                   setBookData({});
                   setPreview(null);
                 };

              
   
   return (
    <form onSubmit={handleSubmit}>
     <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
       <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg p-8">
        {/* Heading */}
        <div className="mb-3 text-center">
            <h1 className="text-3xl font-bold text-purple-600"> Add New Book</h1>
            <p className="text-gray-500 mt-2">Enter book details to add into library </p>
        </div>

          {/* Title */}
           <div>
               <label className="block mb-2 font-medium">Book Title</label>
               <input type="text" placeholder="Enter book title" name="BookTitle" 

                 onChange={(e) => {
                 setBookData({
                   ...bookData,
                   BookTitle: e.target.value,
                 });
               
                 setErrors((prev) => ({
                   ...prev,
                   BookTitle: "",
                 }));}}
                
                 className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400 mb-3 
                 ${errors.BookTitle ? "border-red-500" : ""}`}/>
                 {errors.BookTitle && ( <p className="text-red-500 text-sm">{errors.BookTitle}</p>)}
              </div>

          {/* Author */}
          <div>
            <label className="block mb-2 font-medium">Author Name</label>

            <input type="text" name="AuthorName" placeholder="Enter author name"
              
               onChange={(e) => {
                 setBookData({
                   ...bookData,
                   AuthorName: e.target.value,
                 });
               
                 setErrors((prev) => ({
                   ...prev,
                   AuthorName: "",
                 }));}}
              
               className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400 mb-3
               ${errors.AuthorName ? "border-red-500" : ""}`}/>
               {errors.AuthorName && ( <p className="text-red-500 text-sm">{errors.AuthorName}</p>)}
           </div>

          {/* Category + Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Category */}
          <div>
           <label className="block mb-2 font-medium">Category</label>

           <select
            name="Category"
            value={bookData.Category}
            className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400 mb-3
              ${errors.Category ? "border-red-500" : ""}`}
              onChange={(e) => {
                 setBookData({
                   ...bookData,
                   Category: e.target.value,
                 });
               
                 setErrors((prev) => ({
                   ...prev,
                   Category: "",
                 }));}}>
    
           <option value="">Select Category</option>
           <option value="Self Help">Self Help</option>
           <option value="Finance">Finance</option>
           <option value="Fiction">Fiction</option>
           <option value="Spirituality">Spirituality</option>
         </select>

         {errors.Category && (
           <p className="text-red-500 text-sm mt-1">
             {errors.Category}
           </p>
         )}
       </div>

            {/* Quantity */}
            <div>
               <label className="block mb-2 font-medium">Quantity</label>
               <input type="number"  min="1"
                name="Quantity" placeholder="Enter quantity"

                onChange={(e) => {
                 setBookData({
                   ...bookData,
                   Quantity: e.target.value,
                 });
               
                 setErrors((prev) => ({
                   ...prev,
                   Quantity: "",
                 }));}}
              
                 className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400 mb-3
                 ${errors.Quantity ? "border-red-500" : ""}`}/>
                 {errors.Quantity && ( <p className="text-red-500 text-sm">{errors.Quantity}</p>)}
                 </div>
             </div>

          {/* Status */}
          <div>

             <label className="block mb-2 font-medium">Availability Status</label>

             <select
              name="Status"
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400 mb-3"
               onChange={(e) => setBookData({...bookData,Status: e.target.value,})}>

              <option value="Available">
                Available
              </option>

              <option value="Borrowed">
                Borrowed
              </option>

              </select>

          </div>
          
          {/* Upload Image */}
          <div>
             <label className="block mb-2 font-medium">
               Upload Book Image
             </label>
            
             <input
               type="file"
               accept="image/*"
               className={`w-full border rounded-xl px-4 py-3 mb-3
                 ${errors.BookImage ? "border-red-500" : ""}`}
               onChange={(e) => {
                 const selectedFile = e.target.files[0];
            
                 if (selectedFile) {
                   setFile(selectedFile);
                   setPreview(URL.createObjectURL(selectedFile));
            
                   // Remove image error after selecting a file
                   setErrors((prev) => ({
                     ...prev,
                     BookImage: "",
                   }));
                 }
               }}
             />
            
             {errors.BookImage && (
               <p className="text-red-500 text-sm mb-3">
                 {errors.BookImage}
               </p>
             )}
            
             {preview && (
               <div className="mt-4">
                 <img
                   src={preview}
                   alt="preview"
                   className="w-40 h-52 object-cover rounded-lg shadow"
                 />
               </div>
             )}
        </div>
          {/* Buttons */}
          <div className="flex gap-4 pt-4">

             <button
              type="submit" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium mb-3">
              Add Book
             </button>

             <button onClick={handleCancel}
              type="reset"
              className="bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded-xl font-medium mb-3">
              Cancel
            </button>
         </div>
      </div>
    </div>
  </form> 
  );
};
export default AddBookForm;


