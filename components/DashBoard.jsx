
"use client";
 
   import { useSelector } from "react-redux";
   import {Home,ClipboardList,Users,Receipt,Bookmark,FileText,Settings,
   LogOut,Menu,History,BookPlus,UserPlus,BookOpenCheck,Undo2,BookmarkPlus,
   ScanLine,FileBarChart,LibraryBig,LayoutDashboard,} from "lucide-react";
   import { useRouter } from "next/navigation";
   import { logout } from "../redux/slices/authSlice";
   import { useDispatch } from "react-redux";

   const DashBoard = () => {
        const user = useSelector((state) => state.auth?.user);
        const router = useRouter();
        const dispatch = useDispatch();

      const quickActions = [
      {
        title: "Add Book",
        icon: <BookPlus size={28} className="text-green-600" />,
        bg: "bg-green-100",
        route: "/add-Book",
      },
      {
        title: "BookList",
        icon: <LibraryBig size={24} className="text-blue-600" />,
        bg: "bg-blue-100",
        route: "/list-Book",
      },
      {
        title: "Add Member",
        icon: <UserPlus size={28} className="text-purple-600" />,
        bg: "bg-purple-100",
        route:"/registration"
      },
       {
        title: "MemberList",
        icon: <Users size={24}  className="text-emerald-600" />,
        bg: "bg-emerald-100",
         route: "/userList",
      },
      {
        title: "Issue Book",
        icon: <BookOpenCheck size={28} className="text-orange-600" />,
        bg: "bg-orange-100",
         route: "/borrow",
      },
      {
        title: "Return Book",
        icon: <Undo2 size={28} className="text-yellow-600" />,
        bg: "bg-yellow-100",
         route: "/return-Book",
      },
  
      {
        title: "Return History",
        icon: <FileBarChart size={28} className="text-gray-600" />,
        bg: "bg-gray-100",
        route:"/return-History"
      },
    ];
    
      /* Current Date display */
     const today = new Date();
     const dayName = today.toLocaleDateString("en-US", {
       weekday: "long",
     });
     const fullDate = today.toLocaleDateString("en-GB", {
       day: "numeric",
       month: "long",
       year: "numeric",
     });

     const handleLogout = () => {
      dispatch(logout());
      router.push("/login");
     };

   return (
    <div className="min-h-screen flex bg-[#FAF9F6]">
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#01342F] text-white flex flex-col p-6">
        <div>
          <h1 className="text-3xl font-semibold mb-10">
            📚 LIBRARY
            <br />
            SYSTEM
          </h1>

          <nav className="space-y-3">
            <SidebarItem icon={<Home size={20} />} text="Home" />
            <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" />
            <SidebarItem icon={<ClipboardList  size={20} />} text="Book Records" 
             onClick={() => router.push("/book-Records")} />
             <SidebarItem icon={<Receipt  size={20} />} text="Fine Collection List" 
             onClick={() => router.push("/Fine-List")} />
            <SidebarItem icon={<FileText size={20} />} text="Reports" />
           
          </nav>
        </div>

        <div className="mt-auto">
          <div className="border border-green-800 rounded-2xl p-5 mb-6">
            <p className="text-sm">
              Books are a uniquely portable magic.
            </p>
            <p className="mt-3 text-xs text-gray-300">
              — Stephen King
            </p>
          </div>

          <button  onClick={handleLogout} className="flex items-center gap-3">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8  ml-4">
  
         {/* TOPBAR */}
        <div className="flex justify-between items-center mb-10">
          <Menu size={30} />
        <div className="ml-auto flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-green-900 flex items-center justify-center text-white">
            👩🏻
        </div>
          <div>
             <h3 className="font-semibold">
              {user?.FullName || "Librarian Admin"}
             </h3>
             <p className="text-sm text-gray-500">
              Administrator
             </p>
          </div>
        </div>
      </div>

        {/* HERO */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* LEFT */}
          <div>
            <h1 className="text-6xl font-serif text-[#0D2E2A] leading-tight">
              Welcome back,
              <br />
              Librarian!
            </h1>

            <div className="w-16 h-0.5 bg-yellow-700 mt-6 mb-8"></div>

            <p className="text-gray-600 text-2xl">
              Empowering knowledge,
              <br />
              one book at a time.
            </p>

            <p className="mt-10 text-4xl italic text-yellow-700">
              Happy Managing!
            </p>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative">
            <img
              src="/HomeLibrary.jpg"
              alt="Library"
              className="w-full h-112.5 object-cover rounded-[80px]"/>

             <div className="absolute bottom-5 right-5 bg-[#01342F] text-white p-6 rounded-3xl w-72">
               <h3 className="text-2xl font-bold">{dayName}</h3>
                <p className="mb-4">
                  {fullDate}
                </p>
               <p className="text-sm text-gray-200">
              "Google can bring you back 100,000 answers, a librarian can bring you back the right one." 
               </p>

              <p className="mt-3 text-sm">
                — Neil Gaiman 
              </p>
            </div>
          </div>
        </div>

          
        {/* QUICK ACTIONS */}
       <div className="mt-10 bg-white rounded-3xl border border-yellow-700/30 p-6">
        <h2 className="text-2xl font-semibold mb-6">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {quickActions.map((item) => (
            <div
              key={item.title}
              onClick={() => router.push(item.route)}
              className="border rounded-2xl p-5 hover:shadow-lg transition cursor-pointer">
               <div
                className={`w-14 h-14 rounded-full ${item.bg} flex items-center justify-center mb-4`}>
                {item.icon}
               </div>
      
              <h3 className="font-semibold text-sm">
                {item.title}
              </h3>
      
              <p className="text-xs text-gray-500 mt-2">
                Click to manage
              </p>
            </div>
          ))}
        </div>
      </div>
  </main>
</div>
  );
 }
  function SidebarItem({ icon, text, active, onClick }) {
    return (
      <div
        onClick={onClick}
        className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer ${
          active ? "bg-[#839C83]" : "hover:bg-[#0E4B43]"
        }`}
      >
        {icon}
        <span>{text}</span>
      </div>
    );
  }
export default DashBoard;