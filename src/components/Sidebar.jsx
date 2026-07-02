"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
// import logoPic from "../../public/logo.ico";
import { FaRegCircleUser } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handelLogOut = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };
  return (
    <div className="flex h-screen">
      <aside className="flex flex-col w-16 items-center bg-white text-gray-700 shadow ">
        <ul>
          <li className="mt-4">
            {/* <Image alt="map" className="" src={logoPic}></Image> */}
          </li>
          <li
            className={`${
              pathname === "/"
                ? " bg-blue-100 p-1  "
                : "hover:bg-blue-200 p-1  "
            }
         mt-5 rounded-md  text-lg font-semibold
            `}
          >
            <Link href="/">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.5 12H12V20H18.5V12Z"
                  stroke="#6C6B80"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M28 20H21.5V28H28V20Z"
                  stroke="#6C6B80"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M28 12H21.5V17H28V12Z"
                  stroke="#6C6B80"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.5 22.9998H12V27.9998H18.5V22.9998Z"
                  stroke="#6C6B80"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>
          <hr className="mt-2" />
          <li
            className={`${
              pathname === "/editpage"
                ? " bg-blue-100 p-1   rounded-md  text-lg font-semibold"
                : "hover:bg-blue-200 p-1  t rounded-md  text-lg font-semibold"
            }
         mt-5
            `}
          >
            <Link href="/editpage">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 28L27.2333 26.0271C27.4917 25.9751 27.75 25.7154 27.75 25.4039V12.4233C27.75 12.1637 27.5433 11.9561 27.2333 12.008L20 13.981"
                  stroke="#6C6B80"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 13.9844L20 27.4842"
                  stroke="#4F46E5"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 28L12.7667 26.0271C12.5083 25.9751 12.25 25.7154 12.25 25.4039V12.4233C12.25 12.1637 12.4567 11.9561 12.7667 12.008L20 13.981"
                  fill="#6C6B80"
                />
                <path
                  d="M20 28L12.7667 26.0271C12.5083 25.9751 12.25 25.7154 12.25 25.4039V12.4233C12.25 12.1637 12.4567 11.9561 12.7667 12.008L20 13.981"
                  stroke="#6C6B80"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.3203 15.9062L17.937 16.6331"
                  stroke="#EEF2FF"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.3203 18.5L16.387 18.9153"
                  stroke="#EEF2FF"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>
        </ul>

        <ul className="mt-auto ">
          <li className="hover:bg-blue-100 p-1 py-3 rounded-md mb-2 flex  justify-center items-center">
            <LuLogOut
              className="text-2xl text-gray-500 cursor-pointer"
              onClick={handelLogOut}
            />
          </li>
          <li className="hover:bg-blue-100 p-1 mb-2 rounded-md">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24.8672 20.8533V16.8C24.8672 14.1333 22.721 12 20.0382 12C17.3555 12 15.2093 14.1333 15.2093 16.8V20.8533M15.0484 21.0667L13.0631 24.8533C12.9022 25.12 13.0631 25.3333 13.3851 25.3333H26.6378C26.9598 25.3333 27.0671 25.12 26.9598 24.8533L24.9745 21.0667M22.1845 25.8665C22.1845 27.0398 21.2187 27.9998 20.0383 27.9998C18.8579 27.9998 17.8921 27.0398 17.8921 25.8665"
                stroke="#6C6B80"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </li>
          <li className="hover:bg-blue-100 p-2 py-3 mb-28 rounded-md flex  justify-center items-center">
            <FaRegCircleUser className="text-2xl" />
          </li>
        </ul>
      </aside>
    </div>
  );
}
