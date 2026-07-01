
"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

 export default function Handler({ children }) {
      const pathname = usePathname();

      // Hide layout on auth pages
      const hideLayout =
         pathname === "/" ||
         pathname === "/login" ||
         pathname === "/signup";
     
       if (hideLayout) {
         return <>{children}</>;
       }

   return (
     <div className="flex h-screen">
       {pathname !== "/dashboard" && pathname !== "/book-Records" && (
         <Sidebar />
       )}
       <div className="flex-1 flex flex-col">
       {pathname !== "/dashboard" && <Topbar />}
       <main className="flex-1 p-5 bg-gray-100">
        {children}
       </main>
    </div>
  </div>
  );
}