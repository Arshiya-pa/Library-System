
"use client"

import React from 'react'
import { useEffect,useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getBorrow } from "@/redux/slices/borrowSlice";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ReturnHistory = () => {
   
     const dispatch = useDispatch();
     const [fromDate, setFromDate] = useState("");
     const [toDate, setToDate] = useState("");
     const [filteredHistory, setFilteredHistory] = useState([]);

     const borrowbook = useSelector(
     (state) => state.borrowbook.borrowbook || []);

      useEffect(() => {
      dispatch(getBorrow());}, 
      [dispatch]);
      
        {/* Inactive Borrows Filtering */}
    
       const returnHistory = borrowbook.filter(
         (item) => item.Status === "Inactive"
       );

        useEffect(() => {
          setFilteredHistory(returnHistory);
        }, [borrowbook]);
    
        const handleSearch = () => {
            const filtered = returnHistory.filter((item) => {
            const returnDate = new Date(item.ActualBookReturnDate);
   
            const from = fromDate ? new Date(fromDate) : null;
            const to = toDate ? new Date(toDate) : null;
   
            if (to) {
              to.setHours(23, 59, 59, 999);
            }

         return (
            item.Status === "Inactive" && (!from || returnDate >= from) && (!to || returnDate <= to));
            });  
            setFilteredHistory(filtered);
            };


                 //  Download pdf
                     const downloadPDF = () => {
                     const doc = new jsPDF();
               
                     doc.setFontSize(18);
                     doc.text("LibraryBook Return List", 14, 15);
               
                     const tableColumn = [
                       "UserID",
                       "FullName",
                       "BookTitle",
                       "BookCount",
                       "Fine",
                       "Issue Date",
                       "Return Date",
                       "Actual Return Date",
                     ];
                    
                     const tableRows = filteredHistory.map((item) => [
                       item.UserId || "",
                       item.FullName || "",
                       item.BookTitle || "",
                       item.BookCount || "",
                       item.Fine || "",
                       item.BookIssueDate || "",
                       item.BookReturnDate || "",
                       item.ActualBookReturnDate || "",
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
               
                     doc.save("LibaryReturnHistory.pdf");
                    };

                 const handleCancel = () => {
                  setFromDate("");
                  setToDate("");
                  setFilteredHistory(returnHistory);
                };

    return (
      <div className="p-4">

      {/* PAGE HEADING */}
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-8 uppercase tracking-wider border-b-2 border-purple-300 pb-3">
        RETURN HISTORY
      </h1>


       {/* Date Filters */}
      <div className="flex items-center gap-4 mb-6">
        <p>Search ReturnDate... </p>
         <div>
            <label> From Date</label>
            <input
            type="date" className="border px-3 py-2 rounded"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}/>
         </div>

       <div>
         <label> To Date</label>
         <input
         type="date"
         className="border px-3 py-2 rounded" value={toDate}
         onChange={(e) => setToDate(e.target.value)}/>
        </div>

         <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"> 🔍 Search </button>
        
          <button
           onClick={handleCancel}
           className="bg-red-500 text-white px-4 py-2 rounded">
            ❌ Cancel
           </button>
      
          <button
             onClick={downloadPDF}
             className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
              📥  Download PDF
           </button>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-center text-gray-600">
                  <th className="py-3">UserID</th>
                  <th>FullName</th>
                  <th>BookTitle</th>
                  <th>BookCount</th>
                  <th>Fine</th>
                  <th>Issue Date</th>
                  <th>Return Date</th>
                  <th>Actual Return Date</th>
                </tr>
              </thead>

            <tbody>
               {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
               <tr key={item._id} className="border-b hover:bg-gray-50 text-center">
               <td  className="py-3 px-4">{item.UserId}</td>
               <td  className="py-3 px-4">{item.FullName}</td>
               <td  className="py-3 px-4">{item.BookTitle}</td>
               <td  className="py-3 px-4">{item.BookCount}</td>
               <td  className="py-3 px-4">{item.Fine}</td>
               <td  className="py-3 px-4">
                 {new Date(item.BookIssueDate).toLocaleDateString("en-GB")}
               </td>
               <td className="py-3 px-4">
               {new Date(item.BookReturnDate).toLocaleDateString("en-GB")}
              </td>
               <td className="py-3 px-4">
               {new Date(item.ActualBookReturnDate).toLocaleDateString("en-GB")}
              </td>
             </tr>
              ))
              ) : (
           <tr>
           <td
           colSpan="8"
           className="py-8 text-center text-red-500 font-semibold"
           >📚 No Data Found
      </td>
    </tr>
  )}
</tbody>
</table>
</div>
</div>
  )
}
export default ReturnHistory
