"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {

  const router = useRouter();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <>
    
      {/* Toggle Button */}
       <button
        onClick={() => setOpen(!open)}
        className="fixed top-5 left-5 z-50 bg-black text-white px-4 py-2 rounded-lg">
        ☰ </button>
        
         <AnimatePresence>
          {open && (
           <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            {/* Sidebar */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 w-64 min-h-screen bg-black text-white p-5 z-50 shadow-xl">
                 
              {/* Close Button */}
               <button
                onClick={() => setOpen(false)}
                className="mb-5 text-amber-600 font-bold"
               > ✕ 
               </button>
                   
               <h1 className="text-2xl font-bold text-purple-600 mb-10">   
                <span className="text-6xl">📖</span>
                <span className="text-xl">LibraryMS</span> </h1>

                <nav className="space-y-3">
                 <button
                  className="w-full text-left p-3 rounded-xl hover:bg-gray-800"
                  onClick={() => router.push("/dashboard")}>
                  🏠 Home
                  </button>

                  <button
                  className="w-full text-left p-3 rounded-xl  hover:bg-gray-800"
                  onClick={() => router.push("/add-Book")}>
                  📝 Add Book
                 </button>
             
                 <button
                  className="w-full text-left p-3 rounded-xl hover:bg-gray-800"
                  onClick={() => router.push("/list-Book")}
                 > 📚 BooksList </button>
                 
                 <button className="w-full text-left p-3 rounded-xl hover:bg-gray-800"
                 onClick={() => router.push("/registration")}>
                  ✍ User Registration
                 </button>
                  
                  <button className="w-full text-left p-3 rounded-xl hover:bg-gray-800"
                    onClick={() => router.push("/userList")}>
                   🙋‍♂️ UserList
                  </button>


                  <button className="w-full text-left p-3 rounded-xl hover:bg-gray-800"
                    onClick={() => router.push("/return-Book")}>
                   ↩️ Book Return
                  </button>

                   <button className="w-full text-left p-3 rounded-xl hover:bg-gray-800"
                    onClick={() => router.push("/return-History")}>
                   📜 Return History
                  </button>

                
                
                 <button
                  className="w-full text-left p-3 rounded-xl hover:bg-red-900 text-red-500"
                  onClick={handleLogout}>
                  ➜ Logout
                  </button>
                 </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;