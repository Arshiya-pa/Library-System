"use client";

import React from "react";
import Login from "@/components/Login";
import { redirect } from "next/navigation";

const Page = () => {

  return (
       <div>
         <Login/>
       </div>
    )
}
export default Page;

  //  <div>
  
  //      <Login/>
  //  </div>

    // <div className="flex min-h-screen bg-gray-100">

    //   {/* Sidebar */}
    //   <aside className="w-64 bg-white border-r p-5">

    //     <h1 className="text-2xl font-bold text-purple-600 mb-10">
    //      📖 LibraryMS
    //     </h1>

    //     <nav className="space-y-3">

    //       <button className="w-full text-left p-3 rounded-xl hover:bg-purple-100"
    //       onClick={() =>
    //        router.push("/dashboard")}
    //       >
    //         🏠︎ Dashboard
    //       </button>

    //       <button className="w-full text-left p-3 rounded-xl bg-purple-100 text-purple-700 font-semibold"
    //        onClick={() =>
    //        router.push("/list-Book")}>📚 Books
    //       </button>

    //       <button className="w-full text-left p-3 rounded-xl hover:bg-purple-100">
    //        📕 My Borrowed Books
    //       </button>

    //       <button className="w-full text-left p-3 rounded-xl hover:bg-purple-100">
    //         🕰️ History
    //       </button>

    //       <button className="w-full text-left p-3 rounded-xl hover:bg-purple-100">
    //         👨🏻‍💼 Profile
    //       </button>

    //       <button className="w-full text-left p-3 rounded-xl hover:bg-red-100 text-red-500">
    //         ➜] Logout
    //       </button>

    //     </nav>

    //   </aside>

    //   {/* Main Content */}
    //   <main className="flex-1 p-8">

    //     {/* Topbar */}
    //     <div className="flex justify-between items-center mb-8">

    //       <h2 className="text-3xl font-bold text-purple-600">
    //         Library Managememt System
    //       </h2>

    //       <div className="flex items-center gap-3">

    //         <div>
    //           <h3 className="font-semibold">
    //             Arshiya 
    //           </h3>

    //           <p className="text-sm text-gray-500">
    //             User
    //           </p>
    //         </div>

    //       </div>

    //     </div>

    //     {/* Header */}
    //     <div className="flex justify-between items-center mb-6">

    //       <div>

    //         <h2 className="text-3xl font-bold">
    //           All Books
    //         </h2>

    //         <p className="text-gray-500 mt-1">
    //           Find and borrow your favorite books
    //         </p>

    //       </div>

    //       <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-medium"
    //        onClick={() =>
    //        router.push("/add-Book")}>
    //         + Add Book
    //       </button>

    //     </div>

    //     {/* Add Book Form */}
    //     <div className="bg-white p-6 rounded-2xl shadow-sm">
            
    //     </div>

    //   </main>

    // </div>
 