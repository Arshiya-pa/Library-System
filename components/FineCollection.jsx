"use client"

import React from 'react'
import { useState,useEffect } from 'react';
import { useSelector,useDispatch } from "react-redux";
import { useSearchParams, useRouter } from "next/navigation";
import { addFine } from '@/redux/slices/fineSlice';
import { updateBorrow } from "@/redux/slices/borrowSlice";
import { updateBookQuantity,getBooks } from "@/redux/slices/bookSlice";
import Swal from "sweetalert2";


const FineCollection = () => {

    const router = useRouter();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const [errors, setErrors] = useState({});
    const borrowId = searchParams.get("borrowId");
    const returnCount = Number(searchParams.get("returnCount"));
    const borrowRecords = useSelector((state) => state.borrowbook.borrowbook || []);
       const books = useSelector((state) => state.book.books || []);
    
  
    const [fineData, setFineData] = useState({
      UserId: "",
      UserName: "",
      BookTitle: "",
      TotalFine: "",
      PaymentMethod: "",
      DueDate: "",
      DaysOverdue: "",
      FinePerDay: "5",
      AmountPaid: "",
      PaymentDate: "",
   });

     useEffect(() => {
       if (!borrowId || borrowRecords.length === 0) return;
         const borrowDetail = borrowRecords.find((item) => item._id === borrowId);
         if (!borrowDetail) return;
           const dueDate = borrowDetail.BookReturnDate.split("T")[0];
           const { daysOverdue, totalFine } = calculateFine(dueDate);
          setFineData({
            UserId: borrowDetail.UserId,
            UserName: borrowDetail.FullName,
            BookTitle: borrowDetail.BookTitle,
            DueDate: dueDate,
            DaysOverdue: daysOverdue,
            FinePerDay: 5,
            TotalFine: totalFine,
            PaymentMethod: "",
            AmountPaid: totalFine,
            PaymentDate: new Date().toISOString().split("T")[0],
        });
       }, [borrowId, borrowRecords]);

      //  Fine calculation
      const calculateFine = (dueDate, finePerDay = 5) => {
         const today = new Date();
       
         // Remove time part from today's date
         today.setHours(0, 0, 0, 0);
       
         const returnDate = new Date(dueDate);
         returnDate.setHours(0, 0, 0, 0);
       
         const diffTime = today - returnDate;
         const daysOverdue = Math.max(0,Math.floor(diffTime / (1000 * 60 * 60 * 24)));
         const totalFine = daysOverdue * finePerDay;
         return {
           daysOverdue,
           totalFine,
         };
       };

       const handleChange = (e) => {
        setFineData({
         ...fineData,
         [e.target.name]: e.target.value,
        });
      };

       {/*Clear data */}
        const handleReset = () => {
          setFineData({
           UserId: "",
           UserName: "",
           BookTitle: "",
           TotalFine: "",
           PaymentMethod: "",
           DueDate: "",
           DaysOverdue: "",
           FinePerDay: "5",
           AmountPaid: "",
           PaymentDate: "",
         });
       };
   
       /* Validation*/
       const validateForm = () => {
          if (!fineData.PaymentMethod) {
            Swal.fire({
              icon: "warning",
              title: "Payment Method",
              text: "Please select a payment method.",
            });
            return false;
          }
        
          if (!fineData.AmountPaid) {
            Swal.fire({
              icon: "warning",
              title: "Amount Paid",
              text: "Please enter the amount paid.",
            });
            return false;
          }
        
          if (Number(fineData.AmountPaid) <= 0) {
            Swal.fire({
              icon: "warning",
              title: "Invalid Amount",
              text: "Amount paid must be greater than 0.",
            });
            return false;
          }
        
          if (Number(fineData.AmountPaid) > Number(fineData.TotalFine)) {
            Swal.fire({
              icon: "warning",
              title: "Invalid Amount",
              text: "Amount paid cannot be greater than the total fine.",
            });
            return false;
          }
        
          return true;
        };
         
     const handleSubmit = async (e) => {
         e.preventDefault();
         try {
           if (!validateForm()) return;
           // 1. Save Fine
           const result = await dispatch(addFine(fineData));  
           console.log("Result:", result);
console.log("Payload:", result.payload);
          
           if (!addFine.fulfilled.match(result)) {
             Swal.fire({
               icon: "error",
               title: "Error",
               text: "Failed to save fine.",
             });
             return;
           }   
        
           // 2. Find Borrow Record
           const borrow = borrowRecords.find((b) => b._id === borrowId);
           if (!borrow) {
             Swal.fire({
               icon: "error",
               title: "Error",
               text: "Borrow record not found.",
             });
             return;
           }
           // 3. Calculate values
           const totalReturned = Number(borrow.ReturnBookCount || 0) + Number(returnCount);
           const pending = Number(borrow.BookCount) - totalReturned;
           const status = pending > 0 ? "Active" : "Inactive";
       
           // 4. Update Borrow Record
              await dispatch(updateBorrow({
               id: borrow._id,
               ReturnBookCount: totalReturned,
               ActualBookReturnDate: new Date(),
               Fine: Number(fineData.TotalFine),
               Status: status,
              
             })
           );
         
           // 5. Find Book
           const book = books.find(
             (b) => b.BookTitle === borrow.BookTitle
           );
       
           if (book) {
             const updatedQuantity =
               Number(book.Quantity) + Number(returnCount);
       
             await dispatch(
               updateBookQuantity({
                 id: book._id,
                 Quantity: updatedQuantity,
                 Status: updatedQuantity > 0 ? "Available" : "Borrowed",
               })
             );
           }
       
           // 6. Success
           if (addFine.fulfilled.match(result)) {
            Swal.fire({
              icon: "success",
              title: "Fine Collected Successfully",
              text: "Do you want to print the receipt?",
              showCancelButton: true,
              confirmButtonText: "Print Receipt",
              cancelButtonText: "Dashboard",
            }).then((swalResult) => {
              if (swalResult.isConfirmed) {
                router.push(`/FineReceipt/${result.payload.data._id}`);
              } else {
                router.push("/dashboard");
              }
            });
          }
                 
         } catch (error) {
           console.error(error);
       
           Swal.fire({
             icon: "error",
             title: "Error",
             text: "Something went wrong.",
           });
         }
       }; 

  return ( 
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">

         {/* Heading */}
          <div className="mb-3 text-center">
            <h1 className="text-3xl font-bold text-purple-600"> Fine Collection</h1>
            <p className="text-gray-500 mt-2"> Enter the details</p>
         </div>
       
         {/* FORM */}
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
             <div>
              <label className="text-sm font-medium"> User ID</label>
              <input type="text" name="UserId" value={fineData.UserId}  readOnly
              className="w-full mt-1 border rounded-md p-2 bg-gray-100"/>
            </div>

            <div>
               <label className="text-sm font-medium">Due Date</label>
                <input type="date" name="DueDate" value={fineData.DueDate} readOnly
                className="w-full mt-1 border rounded-md p-2  bg-gray-100"/>
             </div>

             <div>
               <label className="text-sm font-medium"> User Name</label>
               <input type="text" name="UserName" value={fineData.UserName} 
               readOnly className="w-full mt-1 border rounded-md p-2  bg-gray-100"/>
             </div>

            <div>
               <label className="text-sm font-medium">Days Overdue </label>
               <input type="number" name="DaysOverdue" value={fineData.DaysOverdue} readOnly
                className="w-full mt-1 border rounded-md p-2  bg-gray-100" />
            </div>

            <div>
              <label className="text-sm font-medium">Book Title</label>
              <input type="text" name="BookTitle" value={fineData.BookTitle}
               readOnly className="w-full mt-1 border rounded-md p-2  bg-gray-100"/>
             </div>

            <div>
              <label className="text-sm font-medium"> Fine Per Day (₹)</label>
              <input type="number" name="FinePerDay" value={fineData.FinePerDay} readOnly
               className="w-full mt-1 border rounded-md p-2  bg-gray-100"/>
            </div>

            <div>
              <label className="text-sm font-medium">Total Fine (₹) </label>
              <input type="number" name="TotalFine"
                value={fineData.TotalFine} readOnly
                className="w-full mt-1 border rounded-md p-2  bg-gray-100"/>
            </div>

            <div>
              <label className="text-sm font-medium"> Amount Paid (₹) </label>

              <input
                type="number"
                name="AmountPaid"
                value={fineData.AmountPaid}
                onChange={handleChange}
                placeholder="Enter Amount"
                className="w-full mt-1 border rounded-md p-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Payment Method </label>
              <select
                name="PaymentMethod"
                value={fineData.PaymentMethod}
                onChange={handleChange}
                className="w-full mt-1 border rounded-md p-2">
                <option value="">Select Method</option>
                <option>Cash</option>
                <option>UPI</option>
                <option>Card</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Payment Date</label>
              <input type="date"
                name="PaymentDate" value={fineData.PaymentDate}
                onChange={handleChange}
                className="w-full mt-1 border rounded-md p-2"/>
            </div>

            <div className="col-span-2 flex gap-3 mt-2 ">
              <button type="submit"
                className="bg-purple-600 hover:bg-purple-900 text-white px-6 py-2 rounded">
                Collect Fine</button>

               <button type="button" onClick={handleReset}
                  className="border px-6 py-2 rounded hover:bg-gray-100"> Reset
               </button>
            </div>
          </form>
        </div>
     </div>      
  )
}
export default FineCollection
