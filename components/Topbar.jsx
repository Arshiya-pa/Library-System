"use client";

import React from "react";
import { useSelector } from "react-redux";

const Topbar = () => {

  const user = useSelector((state) => state.auth?.user);

  return (

    <div className="bg-gray-300 p-5">

      {/* Topbar */}
      <div className="flex justify-center items-center mb-8 relative">

        {/* Center Title */}
        <h2 className="text-3xl font-bold text-purple-600">
          Library Management System
        </h2>

        {/* User Name Right Side */}
         <div className="absolute top-0 right-0 mt-2 mr-4 flex items-center gap-3 text-lg font-medium
         text-black border border-black px-4 py-2 rounded-lg">🙋🏻‍♂️
          {user?.FullName ? user.FullName : "Guest"}
        </div>
       </div>

       {/* Header */}
       <div className="flex justify-center items-center mb-8 relative">
        <div className="text-center">
          <h2 className="text-3xl font-bold">
           "When In Doubt Go To The Library..." 
          </h2>

          <p className="text-gray-500 mt-1">
            Find and borrow your favorite books
          </p>
        </div>

      </div>

    </div>
  );
};

export default Topbar;