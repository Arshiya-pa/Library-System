
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

      {/* Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        {pathname !== "/dashboard" &&  <Topbar />}
        
       
        {/* Main Content */}
        <main className="flex-1 p-5 bg-gray-100">
          {children}
        </main>

      </div>

    </div>
  );
}