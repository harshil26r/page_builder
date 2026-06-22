"use client";
import React from "react";
import Link from "next/link";
import { FaRegCircleUser } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handelLogOut = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (err) {
      console.error("Error logging out from server:", err);
    }
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className="flex h-screen sticky top-0">
      <aside className="flex flex-col w-20 items-center bg-gray-900/60 border-r border-gray-800/80 text-gray-400 backdrop-blur-md py-6 px-2">
        <div className="flex flex-col items-center flex-1 space-y-8 w-full">
          {/* Logo / Branding */}
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-md shadow-indigo-500/20">
            RP
          </div>

          <nav className="flex flex-col space-y-4 w-full items-center">
            {/* Dashboard Link */}
            <Link
              href="/"
              className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 ${
                pathname === "/"
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
                  : "hover:bg-gray-800/60 hover:text-gray-200"
              }`}
              title="Pages Dashboard"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 3H5C3.89543 3 3 3.89543 3 5V9C3 10.1046 3.89543 11 5 11H9C10.1046 11 11 10.1046 11 9V5C11 3.89543 10.1046 3 9 3Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19 13H15C13.8954 13 13 13.8954 13 15V19C13 20.1046 13.8954 21 15 21H19C20.1046 21 21 20.1046 21 19V15C21 13.8954 20.1046 13 19 13Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19 3H15C13.8954 3 13 3.89543 13 5V9C13 10.1046 13.8954 11 15 11H19C20.1046 11 21 10.1046 21 9V5C21 3.89543 20.1046 3 19 3Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 13H5C3.89543 13 3 13.8954 3 15V19C3 20.1046 3.89543 21 5 21H9C10.1046 21 11 20.1046 11 19V15C11 13.8954 10.1046 13 9 13Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            {/* Create Page Link */}
            <Link
              href="/editpage"
              className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 ${
                pathname === "/editpage"
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
                  : "hover:bg-gray-800/60 hover:text-gray-200"
              }`}
              title="Add New Page"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4V20M4 12H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </nav>
        </div>

        <div className="flex flex-col space-y-4 w-full items-center">
          {/* Logout */}
          <button
            onClick={handelLogOut}
            className="flex h-12 w-12 items-center justify-center rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
            title="Log Out"
          >
            <LuLogOut className="text-xl" />
          </button>

          {/* User Icon */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-all duration-200 cursor-pointer">
            <FaRegCircleUser className="text-xl" />
          </div>
        </div>
      </aside>
    </div>
  );
}
