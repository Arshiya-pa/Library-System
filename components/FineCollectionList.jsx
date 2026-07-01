
"use client"

import React from 'react'
import { useEffect } from 'react';
import {useSelector,useDispatch } from "react-redux";
import { getFine } from "@/redux/slices/fineSlice";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

   const FineCollectionList = () => {

      const dispatch = useDispatch();
      const fineData = useSelector((state) => state.fineData.fine || []);
      
        useEffect(() => {
         dispatch(getFine());
        }, [dispatch]);

     return (
     <div className="overflow-x-auto">

          <Link href="/dashboard" className="inline-flex items-center gap-2 text-green-900 text-xl font-medium hover:underline mb-4">
          <ArrowLeft size={18} /> Back to Home</Link>
        {/* PAGE HEADING */}
         <h1 className="text-3xl font-bold text-center text-purple-700 mb-8 uppercase tracking-wider border-b-2 border-purple-300 pb-3">
           FINE COLLECTION LIST</h1>
            
             <table className="w-full table-auto border-collapse">
             <thead>
              <tr className="border-b text-center text-gray-600">
              <th className="py-3">UserID</th>
              <th>UserName</th>
              <th>BookTitle</th>
              <th>DueDate</th>
              <th>Days Overdue</th>
              <th>Fine(₹)</th>
              <th>Paid(₹)</th>
              <th>PaymentDate</th>
              <th>Action</th>
            </tr>
          </thead>
          
         <tbody className="text-center">
            {fineData?.length > 0 ? (
              fineData.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{item.UserId}</td>
                  <td className="px-4 py-2">{item.UserName}</td>
                  <td className="px-4 py-2">{item.BookTitle}</td>
                  <td className="px-4 py-2">
                    {item.DueDate
                      ? new Date(item.DueDate).toLocaleDateString("en-GB")
                      : "-"} </td>
                  <td className="px-4 py-2">{item.DaysOverdue}</td>
                  <td className="px-4 py-2">₹{item.TotalFine}</td>
                  <td className="px-4 py-2">₹{item.AmountPaid}</td>
                  <td className="px-4 py-2">
                    {item.PaymentDate
                      ? new Date(item.PaymentDate).toLocaleDateString("en-GB")
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    <button className="text-blue-600 hover:text-blue-800 text-lg">
                      👁
                    </button>
                  </td>
                </tr>
              ))
              ) : (
              <tr>
                <td colSpan={9} className="py-6 text-center text-gray-500">
                  No fine records found.
                </td>
              </tr>
            )}
       </tbody>
      </table>
   </div> 
  )
}
export default FineCollectionList
