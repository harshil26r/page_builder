"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import Sidebar from "@/components/Sidebar";
import { CiSearch } from "react-icons/ci";
import { FiMoreHorizontal } from "react-icons/fi";

export default function Home() {
  const router = useRouter();

  const [blogs, setBlogs] = useState([]);
  const [filterBlogs, setFilterBlogs] = useState([]);
  const [selectBlogId, setSelectBlogId] = useState("");

  const [data, setData] = useState({
    searchInput: "",
    statusInput: "",
    authorInput: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: value,
    });
  };

  const allBlogs = async () => {
    try {
      const res = await fetch(`/api/blog/getBlogs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      setBlogs(response);
      if (response && response.blog) {
        setFilterBlogs(response.blog);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const response = await res.json();
        if (response.success) {
          allBlogs();
        } else {
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/auth/login");
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const handleOutsideClick = () => {
      setSelectBlogId("");
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/blog/deleteBlog`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectBlogId,
        }),
      });
      const response = await res.json();
      if (response.success) {
        allBlogs();
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  // filter Blogs
  useEffect(() => {
    if (blogs.blog) {
      const filtered = blogs.blog.filter((item) => {
        if (
          data.searchInput &&
          !item.title.toLowerCase().includes(data.searchInput.toLowerCase())
        ) {
          return false;
        }

        if (
          data.statusInput &&
          data.statusInput.toLowerCase() !== item.status.toLowerCase()
        ) {
          return false;
        }
        if (data.authorInput && data.authorInput !== item.createdBy) {
          return false;
        }
        return true;
      });
      setFilterBlogs(filtered);
    }
  }, [data, blogs]);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      <div className="flex h-screen bg-gray-950 text-gray-100 font-sans">
        <Sidebar />
        
        {blogs.blog && blogs.blog.length === 0 && (
          <div className="flex-1 flex justify-center items-center p-8">
            <div className="flex flex-col justify-center items-center border border-gray-800 bg-gray-900/40 backdrop-blur-md rounded-2xl p-8 md:p-16 max-w-2xl text-center shadow-xl">
              <div className="mb-6">
                <p className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  No Pages Found
                </p>
                <p className="text-gray-400 mt-4 text-sm max-w-md">
                  Looks like you don’t have any pages yet. Let’s add a new page to get started with the builder.
                </p>
              </div>
              <button
                type="submit"
                onClick={() => {
                  router.push("/studio");
                }}
                className="flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-indigo-600 hover:to-purple-700 transition duration-150 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                + Add Page
              </button>
            </div>
          </div>
        )}

        {blogs.blog && blogs.blog.length > 0 && (
          <div className="flex flex-col flex-1 h-screen overflow-hidden">
            {/* Header section */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-800/80 bg-gray-900/20 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <RiMenu2Fill className="text-xl text-gray-400 cursor-pointer hover:text-white transition duration-150" />
                <div>
                  <p className="font-bold text-2xl tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Pages</p>
                  <span className="text-xs text-gray-500 font-medium">
                    Create and publish pages
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  router.push("/studio");
                }}
                className="flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-indigo-600 hover:to-purple-700 transition duration-150 transform hover:-translate-y-0.5"
              >
                + Add Page
              </button>
            </div>

            {/* Filter section */}
            <div className="flex flex-col md:flex-row items-center gap-4 p-8 border-b border-gray-800/40 bg-gray-900/10">
              <div className="relative flex items-center bg-gray-900/50 border border-gray-800 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500/50 transition duration-200 w-full md:w-80">
                <CiSearch className="text-xl text-gray-500 mr-2" />
                <input
                  id="searchInput"
                  name="searchInput"
                  type="text"
                  value={data.searchInput}
                  placeholder="Search pages..."
                  onChange={onChange}
                  className="bg-transparent border-0 outline-none text-white text-sm w-full placeholder-gray-500"
                />
              </div>

              <div className="text-xs text-gray-500 font-semibold bg-gray-900/40 border border-gray-800 px-3 py-2 rounded-xl">
                {filterBlogs.length} records found
              </div>

              <div className="flex items-center gap-6 md:ml-auto w-full md:w-auto justify-between md:justify-end">
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="statusInput"
                    className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Status:
                  </label>
                  <select
                    id="statusInput"
                    name="statusInput"
                    value={data.statusInput}
                    onChange={onChange}
                    className="bg-gray-900/60 border border-gray-800 text-gray-300 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition cursor-pointer"
                  >
                    <option value="">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="authorInput"
                    className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Author:
                  </label>
                  <select
                    id="authorInput"
                    name="authorInput"
                    value={data.authorInput}
                    onChange={onChange}
                    className="bg-gray-900/60 border border-gray-800 text-gray-300 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition cursor-pointer"
                  >
                    <option value="">All Authors</option>
                    {blogs.blog &&
                      [
                        ...new Set(blogs.blog.map((item) => item.createdBy)),
                      ].map((createdBy) => (
                        <option key={createdBy} value={createdBy}>
                          {createdBy}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Table Section */}
            <div className="flex-1 overflow-auto p-8">
              <div className="border border-gray-800/80 bg-gray-900/20 backdrop-blur-md rounded-2xl shadow-lg relative z-10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 bg-gray-900/40 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      <th className="px-6 py-4 rounded-tl-2xl">Title</th>
                      <th className="px-6 py-4">URL</th>
                      <th className="px-6 py-4">Created By</th>
                      <th className="px-6 py-4">Created At</th>
                      <th className="px-6 py-4">Modified By</th>
                      <th className="px-6 py-4">Modified At</th>
                      <th className="px-6 py-4 text-center rounded-tr-2xl">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50 text-sm text-gray-300">
                    {filterBlogs.map((item, index) => {
                      return (
                        <tr
                          key={index}
                          className={`hover:bg-gray-800/20 transition duration-150 ${
                            selectBlogId === item._id ? "relative z-30" : ""
                          }`}
                        >
                          <td className={`px-6 py-4 ${selectBlogId === item._id ? "relative z-30" : ""}`}>
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-white">{item.title}</span>
                              <div className={`relative inline-block text-left ml-4 ${selectBlogId === item._id ? "z-40" : ""}`}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectBlogId(selectBlogId === item._id ? "" : item._id);
                                  }}
                                  className="inline-flex items-center justify-center rounded-lg border border-gray-800/80 bg-gray-900/60 p-1 px-2 text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800 transition duration-150"
                                >
                                  <FiMoreHorizontal size={16} />
                                </button>
                                {selectBlogId === item._id && (
                                  <div className="absolute right-0 mt-2 w-32 rounded-xl bg-gray-900 border border-gray-800 py-1.5 shadow-2xl focus:outline-none z-50">
                                    <button
                                      onClick={() => {
                                        router.push(`/studio?id=${item._id}`);
                                      }}
                                      className="block w-full text-left px-4 py-2 text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition duration-150"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={handleDelete}
                                      className="block w-full text-left px-4 py-2 text-xs font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition duration-150"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-mono">
                            <a
                              href={item.url.startsWith('/') ? item.url : '/' + item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-400 hover:text-indigo-300 hover:underline transition duration-150"
                            >
                              {item.url}
                            </a>
                          </td>
                          <td className="px-6 py-4">{item.createdBy}</td>
                          <td className="px-6 py-4 text-xs text-gray-400">{item.createdAt}</td>
                          <td className="px-6 py-4">{item.modifiedBy}</td>
                          <td className="px-6 py-4 text-xs text-gray-400">{item.updatedAt}</td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                item.status === "draft"
                                  ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                  : item.status === "scheduled"
                                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                  : item.status === "published"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : ""
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
