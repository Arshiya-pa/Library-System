
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBorrow,updateBorrow } from "@/redux/slices/borrowSlice";
import { updateBookQuantity,getBooks } from "@/redux/slices/bookSlice";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const ReturnBook = () => {

  const [searchId, setSearchId] = useState();
  const [fine, setFine] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  

   const dispatch = useDispatch();
   const router = useRouter();

    const borrowbook = useSelector((state) => state.borrowbook.borrowbook || []);
      const books = useSelector((state) => state.book.books || []);

          useEffect(() => {
           dispatch(getBorrow());
            dispatch(getBooks());
          }, [dispatch]);


         // EDIT CLICK
       const handleEdit = (item) => {
          setEditId(item._id);
        
          setEditData({
            ...item,
            PreviousReturnedCount: item.ReturnBookCount || 0,
            PreviousFine: item.Fine || 0,
            ReturnBookCount: "",
          });
        };


        const handleChange = (e) => {
           const { name, value } = e.target;
         
           setEditData({
             ...editData,
             [name]: value,
           });
         
           if (name === "ReturnBookCount") {
             const today = new Date();
             const dueDate = new Date(editData.BookReturnDate);
         
             dueDate.setHours(0, 0, 0, 0);
             today.setHours(0, 0, 0, 0);
         
             const diffTime = today.getTime() - dueDate.getTime();
             const diffDays = diffTime / (1000 * 60 * 60 * 24);
         
             const finePerDay = 5;
         
             const calculatedFine =
               diffDays > 0
                 ? diffDays * finePerDay * Number(value)
                 : 0;
         
             setFine(calculatedFine);
           }
         };


     const filteredData = selectedUserId
       ? borrowbook.filter(
        (item) =>
          String(item.UserId).trim() ===
          String(selectedUserId).trim()  && item.Status === "Active"
      )
    : [];

   
      
       // SAVE / RETURN UPDATE
        const handleSave = async () => {
             console.log("EDIT DATA:", editData);
              const oldReturned = Number(editData.PreviousReturnedCount || 0);
               const currentReturned = Number(editData.ReturnBookCount || 0);
               const oldFine = Number(editData.PreviousFine || 0);
               const totalFine = oldFine + Number(fine);
               const totalReturned = oldReturned + currentReturned;
                 const pendingCount =
                   Number(editData.BookCount) - totalReturned;
               
                 const Status =
                   pendingCount <= 0
                   ? "Inactive"
                   : "Active";
                                          
                 await dispatch(updateBorrow({
                 id: editId,
                 BookReturnDate: editData.BookReturnDate,
                 ActualBookReturnDate: new Date(),
                 BookCount: editData.BookCount,
                 ReturnBookCount: totalReturned,
                 Status,
                 Fine: totalFine,
               })
             );
            
           // Find the actual book
           const book = books.find(
           (b) => String(b.BookTitle) === String(editData.BookTitle)
           );

           if (!book) {
           console.log("Book not found");
            return;
           }
           console.log("Book Found:", book);

    
           const updatedQuantity = Number(book.Quantity) + Number(editData.ReturnBookCount);
           let status = updatedQuantity > 0 ? "Available" : "Borrowed";
         
            console.log("Updated Quantity:", updatedQuantity);
            console.log("Status:", status);
        
            //  Update Book Quantity
              await dispatch(updateBookQuantity({
                   id: book._id,
                   Quantity: updatedQuantity,
                   Status: status,
                  })
               );
               setEditId(null);
               setSearchId(null)
               dispatch(getBorrow()); // refresh table
           };

         // CANCEL
         const handleCancel = () => {
           setEditId(null);
           setEditData({});
         };

          const handleConfirmUpdate = (item) => {
              Swal.fire({
              title: "Return Book?",
              text: "Are you sure you want to return this Book?",
              icon: "question",
              showCancelButton: true,
              confirmButtonText: "Yes, Return",
              cancelButtonText: "Cancel",
              }).then((result) => {
               if (result.isConfirmed) {
                 handleEdit(item);
               }
             });
            };

             const handleConfirmSave = () => {
                 Swal.fire({
                   title: "Confirm Return Book?",
                   text: "Are you sure you want to save these changes?",
                   icon: "question",
                   showCancelButton: true,
                   confirmButtonText: "Yes, Save",
                   }).then(async (result) => {
                     if (!result.isConfirmed) return;

                    // If fine exists, go to Fine Collection page
                      if (fine > 0) {
                       router.push(`/fineCollection?borrowId=${editData._id}&returnCount=${editData.ReturnBookCount}`);
                        return;
                      }
                  
                      // No fine, save directly
                      await handleSave();
                  
                       Swal.fire({
                        icon: "success",
                        title: "Returned!",
                        text: "Book has been returned successfully.",
                       }).then(() => {
                        router.push("/dashboard"); 
                      });
                    });
                  };

   return (
    <div className="p-4">
   
   {/* PAGE HEADING */}
    <h1 className="text-3xl font-bold text-center text-purple-700 mb-8 uppercase tracking-wider border-b-2 border-purple-300 pb-3">
      RETURN BOOK 
    </h1>

      {/* SEARCH */}
      <div className="flex items-center justify-center mb-4 gap-3">
        <input
          type="text"
          value={searchId || ""}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Enter User ID..."
          className="w-1/3 border rounded-lg px-4 py-2"/>

         <button
          onClick={() =>
            setSelectedUserId(String(searchId).trim())}
          className="bg-blue-500 text-white px-5 py-2 rounded-lg">
          Search
         </button>

        <p className="ml-auto font-medium">
          👨🏻‍💼 {filteredData[0]?.FullName}
        </p>
       </div>

       {/* TABLE */}
       <div className="flex overflow-x-auto">
              <table className="w-full">
                  <thead>
                      <tr className="border-b text-center text-gray-600">
                          <th className="py-3">Book Title</th>
                          <th>BorrowBook Count</th>
                          <th>ReturnBook Count</th>
                          <th>PendingBook Count</th>
                          <th>Issue Date</th>
                          <th>Return Date</th>
                          <th>Fine</th>
                          <th>Return Status </th>
                          <th>Action</th>
                      </tr>
              </thead>

               <tbody className="text-center">
                 {filteredData.length > 0 ? (
                   filteredData.map((item) => (
                    <tr key={item?._id} className="border-b hover:bg-gray-50">

                    {/* Title */}
                    <td className="font-medium">{item?.BookTitle}</td>

                      {/* BookCount */}
                     <td className="font-medium">{item?.BookCount}</td>

                    {/* ReturnBookCount */}
                     <td>
                      {editId === item._id ? (
                        <input
                          type="number"
                          name="ReturnBookCount"
                          value={editData.ReturnBookCount || ""}
                          onChange={handleChange}
                          min="0"
                          max={
                            Number(item.BookCount) -
                            Number(item.ReturnBookCount || 0)
                          }
                          className="border p-2 rounded w-24"
                        />
                      ) : (
                        item.ReturnBookCount || 0
                      )}
                    </td>
                    
                   {/* PendingCount */}
                 <td>
                    {editId === item._id
                      ? Number(editData.BookCount) -
                        (
                          Number(editData.PreviousReturnedCount || 0) +
                          Number(editData.ReturnBookCount || 0)
                        )
                      : Number(item.BookCount) -
                        Number(item.ReturnBookCount || 0)}
                  </td>

                    {/* IssueDate */}
                    {/* <td>{item?.BookIssueDate}</td> */}
                    <td>{new Date(item?.BookIssueDate).toLocaleDateString("en-GB")}</td>

                 {/* RETURN DATE */}
                 <td>{new Date(item?.BookReturnDate).toLocaleDateString("en-GB")}</td>
               
               
                    {/* Fine */}
                   <td>
                     {editId === item._id ? `₹${fine}` : `₹${item.Fine || 0}`}
                   </td>

                     {/* Status Activation */}
                                   
                   <td>
                    {editId === item._id
                      ? (
                          Number(editData.BookCount) -
                          (
                            Number(editData.PreviousReturnedCount || 0) +
                            Number(editData.ReturnBookCount || 0)
                          )
                        ) > 0
                        ? "🟢 Active"
                        : "🔴 Inactive"
                      : (
                          Number(item.BookCount) -
                          Number(item.ReturnBookCount || 0)
                        ) > 0
                        ? "🟢 Active"
                        : "🔴 Inactive"}
                  </td>
                                  
 
                 {/* ACTION */}
                <td>
                  {editId === item._id ? (
                    <div className="flex gap-2 justify-center">
                          
                       <button
                        onClick={handleConfirmSave}
                        className="bg-green-500 text-white px-4 py-2 rounded">
                        Save
                       </button>

                      <button
                        onClick={handleCancel}
                        className="bg-red-500 text-white px-4 py-2 rounded">
                        Cancel
                      </button>
                        
                     </div>
                     ) : (
                    <button
                      onClick={() => handleConfirmUpdate(item)}
                      className="bg-blue-100 hover:bg-gray-300 px-4 py-2 rounded">
                      Return
                    </button>
                  )}
                </td>

              </tr>
            ))
            ) : (
            selectedUserId && (
          <tr>
           <td
          colSpan="7"
          className="py-6 text-center text-red-500 font-semibold"
         >
          📚 No Books Found For Return
        </td>
      </tr>
    )
  )}
</tbody>
        </table>
      </div>
    </div>
  );
};

export default ReturnBook;