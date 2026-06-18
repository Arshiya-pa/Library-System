"use client"

import React from 'react';
import { useSelector } from 'react-redux';
 
const DashBoard = () => {

 const user = useSelector((state) => state.auth?.user);
 console.log("user is:",user);
  return ( 
     <div
      className="relative min-h-screen bg-cover bg-center flex items-center"
      style={{ backgroundImage: "url('/Dashboard-Library.jpg')",}}>

         <div className="absolute top-0 right-0 mt-2 mr-4 flex items-center gap-3 text-lg font-medium
         text-white border border-white px-4 py-2 rounded-lg">🙋🏻‍♂️
          {user?.FullName ? user.FullName : "Guest"}
         </div>
         
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Quote Content */}
      <div className="relative z-10 max-w-2xl px-10 text-white">
        <p className="text-2xl leading-relaxed font-light italic">
         ”When I look back, I am so impressed again with the life-giving power of literature. 
         If I were a young person today, trying to gain a sense of myself in the world, 
         I would do that again by reading, just as I did when I was young.” 
        </p>

        <h2 className="mt-6 text-lg font-semibold text-yellow-300">
          — Maya Angelou
        </h2>
      </div>
    </div>
  
  );
}
export default DashBoard;