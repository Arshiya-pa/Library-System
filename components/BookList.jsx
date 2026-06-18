"use client";

import React, { useEffect,useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import { getBooks,updateBookQuantity ,deleteBook } from "../redux/slices/bookSlice"
import { useRouter } from "next/navigation";
import { setSelectedBook } from "../redux/slices/bookSlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";

  const BookList = () => {
        const dispatch = useDispatch();
        const router = useRouter();
        const [search, setSearch] = useState("");  

        const [editId, setEditId] = useState(null);
        const [editData, setEditData] = useState({});

        const [errors, setErrors] = useState({});

        const [currentPage, setCurrentPage] = useState(1);
        const booksPerPage = 5;
  
       const books = useSelector((state) => state.book.books || []);
 
       useEffect(() => {
        dispatch(getBooks());
       }, [dispatch]);

       const filteredBooks = books?.filter((book) =>
         book.BookTitle?.toLowerCase().includes(search.toLowerCase()) ||
         book.AuthorName?.toLowerCase().includes(search.toLowerCase()) ||
         book.Category?.toLowerCase().includes(search.toLowerCase()) ||
         book.Status?.toLowerCase().includes(search.toLowerCase())
        );
          const indexOfLastBook = currentPage * booksPerPage;
          const indexOfFirstBook = indexOfLastBook - booksPerPage;

          const currentBooks = filteredBooks.slice(indexOfFirstBook,indexOfLastBook);       

           const totalPages = Math.ceil(
             filteredBooks.length / booksPerPage
           );

         const handleEdit = (item) => {
           setEditData(item);
           setEditId(item._id);
          };

       // validation table data
            const validate = (name, value) => {
               let error = "";
             
               if (name === "BookTitle") {
                 if (!value.trim()) {
                   error = "Book title is required";
                 }
               }
             
               if (name === "AuthorName") {
                 if (!value.trim()) {
                   error = "Author name is required";
                 } else if (!/^[A-Za-z\s]{3,}$/.test(value)) {
                   error =
                     "Name must contain only letters and be at least 3 characters";
                 }
               }
             
               if (name === "Category") {
                 if (!value.trim()) {
                   error = "Category is required";
                 }
               }
             
              if (name === "Quantity") {
                if (!value) {
                  error = "Quantity is required";
                } else if (!/^\d+$/.test(value)) {
                  error = "Quantity must contain only numbers";
                } else if (Number(value) <= 0) {
                  error = "Quantity must be greater than 0";
                }
              }

                 setErrors((prev) => ({
                   ...prev,
                   [name]: error,
                 }));
               };

         const handleChange = (e) => {
          setEditData({
            ...editData,
            [e.target.name]: e.target.value,
          });
         };

           const handleSave = async () => {
            console.log("Edit Data:", editData);
            await dispatch(updateBookQuantity({
               id: editId,
              ...editData,
             })
            );
           
           setEditId(null);
           dispatch(getBooks());
           };
            
           const handleDelete = (id) => {
            dispatch(deleteBook(id));
            router.push("/list-Book")
           };

         const handleBorrow = (book) => {
           dispatch(setSelectedBook(book));
           router.push("/borrow");
         };
      
     //  Download pdf
      const downloadPDF = () => {
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("Library Books List", 14, 15);

      const tableColumn = [
        "Title",
        "Author",
        "Category",
        "Quantity",
        "Status",
      ];

      const tableRows = filteredBooks.map((book) => [
        book.BookTitle || "",
        book.AuthorName || "",
        book.Category || "",
        book.Quantity || "",
        book.Status || "",
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

      doc.save("LibraryBooks.pdf");
     };

       const handleConfirmUpdate = (book) => {
        Swal.fire({
        title: "Update Record?",
        text: "Are you sure you want to update this record?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Update",
        cancelButtonText: "Cancel",
        }).then((result) => {
         if (result.isConfirmed) {
            handleEdit(book);
          }
        });
       };

       const handleConfirmDelete = (id) => {
         Swal.fire({
         title: "Delete Record?",
         text: "Are you sure you want to delete this record?",
         icon: "warning",
         showCancelButton: true,
         confirmButtonText: "Yes, Delete",
         cancelButtonText: "Cancel",
         }).then(async (result) => {
          if (result.isConfirmed) {
           await handleDelete(id); 
          
          }
        });
      };

      const handleConfirmSave = () => {
         Swal.fire({
           title: "Update Book?",
           text: "Are you sure you want to save these changes?",
           icon: "question",
           showCancelButton: true,
           confirmButtonText: "Yes, Save",
           }).then(async (result) => {
           if (result.isConfirmed) {
           await handleSave();
           Swal.fire({
             icon: "success",
             title: "Book Details Updated!",
             text: "Book has been updated successfully.",
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
           <div className="overflow-x-auto">
            {/* PAGE HEADING */}
             <h1 className="text-3xl font-bold text-center text-purple-700 mb-8 uppercase tracking-wider border-b-2 border-purple-300 pb-3">
                LIST OF BOOKS
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
                  onClick={() => router.push("/add-Book")}
                  className="bg-blue-600 hover:bg-blue-900 text-white px-4 py-2 rounded-lg">
                  📝 Add New Book
                </button>

               <button
                  onClick={downloadPDF}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                   📥  Download PDF
                </button>
              </div>

            <table className="w-full">
              <thead>
                <tr className="border-b text-center text-gray-600">
                  <th className="py-3">Book</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
   
              {currentBooks?.length > 0 ? (
                 currentBooks.map((book) => (
                //  {books?.filter((book) => book?._id).map((book) => (
                   <tr
                    key={book?._id}
                    className="border-b hover:bg-gray-50 text-center"
                   >

                    {/* Book Image */}
                    <td className="py-4">

                      <img
                        src={book?.BookImage}
                        alt={book?.BookTitle}
                        className="w-14 h-20 object-cover rounded-lg shadow mx-auto"
                      />
                  {/* mx-auto : Image moves to the center horizontally. */}
                    </td>

                    {/* Title */}
                 
                 <td>
                  {editId === book._id ? (
                    <>
                      <input
                        name="BookTitle"
                        value={editData.BookTitle || ""}
                      
                        onChange={(e) => {
                         handleChange(e);
                          validate(e.target.name, e.target.value);}}
                            className={`border p-2 rounded ${
                            errors.BookTitle ? "border-red-500" : ""
                           }`}
                         />
                         {errors.BookTitle && (
                          <p className="text-red-500 text-xs mt-1">
                          {errors.BookTitle}
                        </p>
                      )}
                    </>
                  ) : (
                    book.BookTitle
                  )}
                </td>

                    {/* Author */}
                    <td>
                  {editId === book._id ? (
                    <>
                      <input
                        name="AuthorName"
                        value={editData.AuthorName || ""}
                      
                        onChange={(e) => {
                         handleChange(e);
                          validate(e.target.name, e.target.value);}}
                            className={`border p-2 rounded ${
                            errors.AuthorName ? "border-red-500" : ""
                           }`}
                         />
                         {errors.AuthorName && (
                          <p className="text-red-500 text-xs mt-1">
                          {errors.AuthorName}
                        </p>
                      )}
                    </>
                  ) : (
                    book.AuthorName
                  )}
                </td>
                
              <td>
                 {editId === book._id ? (
                   <>
                     <select
                       name="Category"
                       value={editData.Category || ""}
                       onChange={(e) => {
                         handleChange(e);
                         validate(e.target.name, e.target.value);
                       }}
                       className={`border p-2 rounded ${
                         errors.Category ? "border-red-500" : ""
                       }`}
                       >
                       <option value="">Select Category</option>
               
                       <option value="Self Help">Self Help</option>
               
                       <option value="Finance">Finance</option>
               
                       <option value="Fiction">Fiction</option>
               
                       <option value="Spirituality">Spirituality</option>
                     </select>
               
                     {errors.Category && (
                       <p className="text-red-500 text-xs mt-1">
                         {errors.Category}
                       </p>
                     )}
                   </>
                 ) : (
                   book.Category
                 )}
            </td>
                   
              <td>
                   {editId === book._id ? (
                      <>
                      <input
                        name="Quantity"
                        value={editData.Quantity || ""}
                      
                        onChange={(e) => {
                         handleChange(e);
                          validate(e.target.name, e.target.value);}}
                            className={`border p-2 rounded ${
                            errors.Quantity ? "border-red-500" : ""
                           }`}
                         />
                         {errors.Quantity && (
                          <p className="text-red-500 text-xs mt-1">
                          {errors.Quantity}
                        </p>
                      )}
                    </>
                  ) : (
                    book.Quantity
                  )}
               
               </td>
                    {/* Status */}
                    <td>

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          book?.Status === "Available"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {book?.Status}
                      </span>

                    </td>

                    {/* Button */}
                    <td>
                      
                    <div className="flex gap-2 justify-center">

                      <button
                          disabled={book?.Status === "Borrowed" || editId === book._id}
                          onClick={() => handleBorrow(book)}
                          className={`px-4 py-2 rounded-lg text-white ${
                            book?.Status === "Borrowed" || editId === book._id
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-purple-600 hover:bg-purple-700"
                          }`}> Borrow
                      </button>
                   
                       {editId === book._id ? (
                       <div className="flex gap-2">

                        {/* Update Button */}
                     <button
                      onClick={handleConfirmSave}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                     > Update</button>

                    {/* Cancel Button */}
                    <button
                      onClick={() => {
                        setEditId(null);
                        setEditData({});
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded">
                      Cancel
                    </button>
                 </div>
                  ) : (
                  <div className="flex gap-2">
                
                    {/* Edit Button */}
                    
                     <button
                     onClick={() => handleConfirmUpdate(book)}
                      className="bg-purple-600 hover:bg-gray-400 
                      px-4 py-2 rounded-lg text-white">✏️</button>
                    

                   {/* Delete Button */}
                     <button
                         onClick={() => handleConfirmDelete(book._id)}
                         className="bg-purple-600 hover:bg-purple-400 
                         px-4 py-2 rounded-lg text-white">🗑️
                     </button>
                  </div>
                 )}
                 </div>
               </td>      
            </tr>
           ))
           ) : (
           <tr>
           <td
          colSpan="7"
          className="py-8 text-center text-red-500 font-semibold"
          >
        📚 No Books Found
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
  )
}
export default BookList;