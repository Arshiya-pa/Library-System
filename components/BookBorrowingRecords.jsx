"use client";

import React from 'react'
import { useState,useEffect } from 'react';
import {useSelector,useDispatch } from "react-redux";
import { getBorrow } from "@/redux/slices/borrowSlice";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const BookBorrowingRecords = () => {

     const [searchTitle, setSearchTitle] = useState("");
     const borrowData = useSelector((state) => state.borrowbook.borrowbook);
     const dispatch = useDispatch();
    
     const [currentPage, setCurrentPage] = useState(1);
     const usersPerPage = 5;

     useEffect(() => {
      dispatch(getBorrow());
     }, [dispatch]);

     /* BookTitle filter*/
     const filteredBorrows = searchTitle.trim() === ""
     ? []
     : borrowData?.filter((item) => item.BookTitle?.toLowerCase().includes(searchTitle.toLowerCase()));

      const indexOfLastUser = currentPage * usersPerPage;
      const indexOfFirstUser = indexOfLastUser - usersPerPage;
      
      const currentUsers = filteredBorrows.slice(
        indexOfFirstUser,
        indexOfLastUser
      );
      const totalPages = Math.ceil(
        filteredBorrows.length / usersPerPage
      );
      console.log("Borrow Data:", borrowData);

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

        <Link href="/dashboard" className="inline-flex items-center gap-2 text-green-900 text-xl font-medium hover:underline mb-4">
        <ArrowLeft size={18} /> Back to Home</Link>

        {/* PAGE HEADING */}
         <h1 className="text-3xl font-bold text-center text-purple-700 mb-8 uppercase tracking-wider border-b-2 border-purple-300 pb-3">
           BOOK BORROWING RECORDS</h1>

             <div className="flex justify-between items-center mb-4">
              <input type="text" placeholder="Enter Book Title to view history..."
              className="border p-3 rounded-xl  w-200"
              value={searchTitle}
              onChange={(e) => {
               setSearchTitle(e.target.value);setCurrentPage(1);}}/>
             </div>
              
              {/* Display the book name */}
              {searchTitle.trim() !== "" && filteredBorrows.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-purple-700">
                    Book Title: {filteredBorrows[0].BookTitle}
                  </h2>
                </div>
              )}

             <table className="w-full table-auto border-collapse">
             <thead>
              <tr className="border-b text-center text-gray-600">
              <th className="py-3">UserID</th>
              <th>UserName</th>
              <th>Email</th>
              <th>BookCount</th>
              <th>IssueDate</th>
              <th>ReturnDate</th>
              <th>Status</th>
            </tr>
          </thead>

       <tbody className="text-center">
            {searchTitle.trim() === "" ? (
              <tr>
                <td colSpan="7" className="py-6 text-gray-500">
                  Enter a book title to view borrowing records
                </td>
              </tr>
             ) : filteredBorrows?.length > 0 ? (
               filteredBorrows.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-4">{item.UserId}</td>
                  <td className="px-4 py-2">{item.FullName}</td>
                  <td className="px-4 py-2">{item.Email}</td>
                  <td className="px-4 py-2">{item.BookCount}</td>
                  <td className="px-4 py-2">
                    {new Date(item.BookIssueDate).toLocaleDateString("en-GB")}</td>
                  <td className="px-4 py-2">
                    {item.ActualBookReturnDate
                      ? new Date(item.ActualBookReturnDate).toLocaleDateString("en-GB")
                      : "-"}</td>
                  <td className="px-4 py-2">{item.Status}</td>
                </tr>
              ))
             ) : (
              <tr>
                <td colSpan="7" className="py-6 text-red-500 font-semibold">
                  📚 No borrowing records found for this book.
                </td>
              </tr>
            )}
          </tbody>
       </table>

       {/* next and previous page*/}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"}`}>Previous</button>
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
            }`}>
            Next
          </button>
        </div>
    </div>
  )
}
export default BookBorrowingRecords
