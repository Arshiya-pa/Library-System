
"use client"
import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useEffect,useRef } from "react";
import { getFine } from "@/redux/slices/fineSlice";
import { useParams } from "next/navigation";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const FineReceipt = () => {
    
     const dispatch = useDispatch();
     const receiptRef = useRef();
     const { id } = useParams();
     const fineData = useSelector((state) => state.fineData.fine || []);
 
     
         useEffect(() => {
           dispatch(getFine());
         }, [dispatch]);
   
        const receipt = fineData.find((item) => item._id === id);
        if (!receipt) {
           return <h1 className="text-center mt-10">Loading...</h1>;
         }

       const downloadPDF = async () => {
         const input = receiptRef.current;
         const canvas = await html2canvas(input, {
           scale: 2,
         });
         const imgData = canvas.toDataURL("image/png");
         const pdf = new jsPDF("p", "mm", "a4");
         const pdfWidth = pdf.internal.pageSize.getWidth();
         const imgWidth = pdfWidth - 20;
         const imgHeight = (canvas.height * imgWidth) / canvas.width;
         pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
         pdf.save(`Receipt-${receipt.UserId}.pdf`);
      };

     return (
     <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">

      {/* Receipt */}
      <div
        ref={receiptRef}
        style={{
          backgroundColor: "#ffffff",
          color: "#000000",
          border: "2px solid #d1d5db",
        }}
        className="max-w-md w-full rounded-lg shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-center">LIBRARY MANAGEMENT SYSTEM</h2>
        <h3 className="text-center mb-5">PAYMENT RECEIPT</h3>
        <hr className="my-4"/>
        <p><b>Receipt No :</b> {receipt._id.slice(-6).toUpperCase()}</p>
        <p><b>User ID :</b> {receipt.UserId}</p> 
        <p><b>User Name :</b> {receipt.UserName}</p>
        <p><b>Book Title :</b> {receipt.BookTitle}</p>
        <p><b>Due Date :</b>
        {new Date(receipt.DueDate).toLocaleDateString("en-GB")}
        </p>
        <p><b>Days Late :</b> {receipt.DaysOverdue}</p>
        <p><b>Fine / Day :</b> ₹{receipt.FinePerDay}</p>
        <p><b>Total Fine :</b> ₹{receipt.TotalFine}</p>
        <p><b>Amount Paid :</b> ₹{receipt.AmountPaid}</p>
        <p><b>Payment Method :</b> {receipt.PaymentMethod}</p>
        <p><b>Payment Date :</b>
        {new Date(receipt.PaymentDate).toLocaleDateString("en-GB")}
        </p>
        <p><b>Collected By :</b> Librarian</p>
        <hr className="my-4"/>
        <h3 className="text-center font-semibold">
        Thank You!
        </h3> 
     </div>
          <div className="text-center mt-5">
            <button onClick={downloadPDF} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
            📥  Download PDF
            </button>
          </div>
       
        </div>
      )
    }
export default FineReceipt
