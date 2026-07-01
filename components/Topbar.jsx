"use client";

import React from "react";
import { useSelector } from "react-redux";

const Topbar = () => {
  const user = useSelector((state) => state.auth?.user);
  return (
    <div className="bg-gray-300 p-5">
      {/* Title */}
      <div className="flex justify-center items-center mb-8 relative">
         <h2 className="text-3xl font-bold text-purple-700">
          Library Management System</h2>
    
         <div className="absolute top-0 right-0 flex items-center gap-3 text-lg font-medium text-black border border-black px-4 py-2 rounded-lg">
          🙋🏻‍♂️ {user?.FullName || "Guest"}
         </div>
      </div>
    
  {/* Quote */}
  <div className="text-center mt-1">
    <h2 className="text-xl font-semibold">
      "When In Doubt Go To The Library..."
      <span className="ml-2">- J.K. Rowling</span>
    </h2>
   </div>
  </div>
  );
};
export default Topbar;
