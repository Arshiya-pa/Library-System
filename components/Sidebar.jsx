"use client";

   import React, { useState } from "react";
   import { useRouter } from "next/navigation"; 
   import { motion, AnimatePresence } from "framer-motion"; 
   import {Home,LayoutDashboard,BookPlus,BookOpen,Users,UserPlus,RotateCcw,History,LogOut,} from "lucide-react"; 
   
   const Sidebar = () => { 
      const router = useRouter(); 
      const [open, setOpen] = useState(false);

      return (
       <> 
     {/* Toggle Button */} 
     <button onClick={() => setOpen(!open)} 
     className="fixed top-5 left-5 z-50 bg-black text-white px-4 py-2 rounded-lg"> ☰ </button>

     <AnimatePresence>
       {open && (
         <> 
         {/* Overlay */}
          <motion.div initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} exit={{ opacity: 0 }}
           onClick={() => setOpen(false)} className="fixed inset-0 bg-black/50 z-40"/> 
           
           {/* Sidebar */} 
           <motion.aside initial={{ x: -300 }} 
           animate={{ x: 0 }} exit={{ x: -300 }} transition={{ duration: 0.3 }} 
           className="fixed top-0 left-0 w-72 h-screen bg-purple-800 text-white flex flex-col p-6 z-50 shadow-xl"> 
           {/* Close Button */}
          <button onClick={() => setOpen(false)} className="self-end text-white mb-4">✕</button>

           {/* Logo */} 
           <div>
             <h1 className="text-3xl font-semibold mb-10">📚 LIBRARY<br /> MENU </h1> 
             {/* Menu */} 
          <nav className="space-y-3">
             <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-purple-900">
              <Home size={20} />
              Home
             </button>

          <button
            onClick={() => router.push("/add-Book")}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-purple-900"
          >
            <BookPlus size={20} />
            Add Book
          </button>

          <button
            onClick={() => router.push("/list-Book")}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-purple-900"
          >
            <BookOpen size={20} />
            Books List
          </button>

          <button
            onClick={() => router.push("/registration")}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-purple-900"
          >
            <UserPlus size={20} />
            User Registration
          </button>

          <button
            onClick={() => router.push("/userList")}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-purple-900"
          >
            <Users size={20} />
            User List
          </button>

          <button
            onClick={() => router.push("/return-Book")}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-purple-900"
          >
            <RotateCcw size={20} />
            Book Return
          </button>

           {/* <button
            onClick={() => router.push("/Fine-List")}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-purple-900">
            <BookPlus size={20} />
            Fine Collection List
          </button> */}

          <button
            onClick={() => router.push("/return-History")}
            className="flex items-center gap-3 w-full p-3 rounded-xl  hover:bg-purple-900"
          >
            <History size={20} />
            Return History
          </button>
        </nav>
       </div>
    </motion.aside>
   </> 
  )} 
  </AnimatePresence>
  </> 
  ); 
  }; 
  export default Sidebar;