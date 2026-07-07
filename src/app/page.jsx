"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LuSearch, LuPlus, LuMoreHorizontal, LuExternalLink, LuPencil, LuTrash2, LuFileText, LuCheck, LuClock, LuLayers } from "react-icons/lu";
import Sidebar from "@/components/Sidebar";

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
  }, [router]);

  useEffect(() => {
    const handleOutsideClick = () => {
      setSelectBlogId("");
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleDelete = async (idToDelete) => {
    const targetId = idToDelete || selectBlogId;
    if (!targetId) return;
    if (!confirm("Are you sure you want to delete this page?")) return;

    try {
      const res = await fetch(`/api/blog/deleteBlog`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: targetId,
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

  // Filter logic
  useEffect(() => {
    if (blogs.blog) {
      const filtered = blogs.blog.filter((item) => {
        if (
          data.searchInput &&
          !item.title.toLowerCase().includes(data.searchInput.toLowerCase()) &&
          !item.url.toLowerCase().includes(data.searchInput.toLowerCase())
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

  // Stat metrics
  const totalCount = blogs.blog ? blogs.blog.length : 0;
  const publishedCount = blogs.blog ? blogs.blog.filter(b => b.status === "published").length : 0;
  const draftCount = blogs.blog ? blogs.blog.filter(b => b.status === "draft" || !b.status).length : 0;

  return (
    <div className="flex h-screen bg-[#070a12] bg-grid-pattern text-slate-100 font-sans overflow-hidden">
      <Sidebar />

      <main className="flex flex-col flex-1 h-screen overflow-y-auto custom-scrollbar relative">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Top Sticky Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-5 border-b border-white/10 bg-[#070a12]/80 backdrop-blur-2xl">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span className="gradient-text-aura">Pages Directory</span>
              <span className="text-[11px] font-mono font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {totalCount} Active
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Craft, edit, style, and publish glassmorphic pages with live blocks
            </p>
          </div>

          <button
            onClick={() => router.push("/studio")}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-xl shadow-indigo-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <LuPlus className="text-base" /> Create New Page
          </button>
        </header>

        <div className="p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel rounded-2xl p-4 flex items-center justify-between shadow-md">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Pages</p>
                <p className="text-2xl font-black text-white mt-1">{totalCount}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <LuLayers className="text-xl" />
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-4 flex items-center justify-between shadow-md">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Published Live</p>
                <p className="text-2xl font-black text-emerald-400 mt-1">{publishedCount}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <LuCheck className="text-xl" />
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-4 flex items-center justify-between shadow-md">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Draft Status</p>
                <p className="text-2xl font-black text-amber-400 mt-1">{draftCount}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <LuClock className="text-xl" />
              </div>
            </div>
          </div>

          {/* Search and Filters Card */}
          <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 justify-between shadow-lg">
            <div className="relative flex items-center bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 w-full md:w-96 focus-within:border-indigo-500/60 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <LuSearch className="text-lg text-slate-500 mr-2 shrink-0" />
              <input
                id="searchInput"
                name="searchInput"
                type="text"
                value={data.searchInput}
                placeholder="Search by title or URL slug..."
                onChange={onChange}
                className="bg-transparent border-0 outline-none text-white text-xs w-full placeholder-slate-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center space-x-2">
                <label htmlFor="statusInput" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Status:
                </label>
                <select
                  id="statusInput"
                  name="statusInput"
                  value={data.statusInput}
                  onChange={onChange}
                  className="bg-slate-950/90 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500 transition cursor-pointer font-medium"
                >
                  <option value="">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <label htmlFor="authorInput" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Author:
                </label>
                <select
                  id="authorInput"
                  name="authorInput"
                  value={data.authorInput}
                  onChange={onChange}
                  className="bg-slate-950/90 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500 transition cursor-pointer font-medium"
                >
                  <option value="">All Authors</option>
                  {blogs.blog &&
                    [...new Set(blogs.blog.map((item) => item.createdBy))].map((createdBy) => (
                      <option key={createdBy} value={createdBy}>
                        {createdBy}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {blogs.blog && filterBlogs.length === 0 && (
            <div className="glass-panel rounded-3xl p-12 text-center max-w-xl mx-auto my-12 border border-slate-800/80 shadow-2xl relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto mb-5 shadow-inner">
                <LuFileText className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">No Pages Found</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                {data.searchInput || data.statusInput || data.authorInput
                  ? "No matching pages found for your filter criteria. Try adjusting your search query."
                  : "You haven't created any pages yet. Launch the Content Studio to build your first page."}
              </p>
              <button
                type="button"
                onClick={() => router.push("/studio")}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
              >
                <LuPlus className="text-base" /> Build Your First Page
              </button>
            </div>
          )}

          {/* Pages Table / Cards View */}
          {blogs.blog && filterBlogs.length > 0 && (
            <div className="glass-panel rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/80 bg-slate-950/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="px-6 py-4">Page Title & Slug</th>
                      <th className="px-6 py-4">Author</th>
                      <th className="px-6 py-4">Created Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                    {filterBlogs.map((item, index) => {
                      const formattedUrl = item.url.startsWith("/") ? item.url : "/" + item.url;
                      return (
                        <tr
                          key={item._id || index}
                          className="hover:bg-slate-800/40 transition-colors duration-150 group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
                                {item.title}
                              </span>
                              {item.subText && (
                                <span className="text-[11px] text-slate-400 truncate max-w-md mt-0.5">
                                  {item.subText}
                                </span>
                              )}
                              <a
                                href={formattedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-mono text-indigo-400 hover:text-indigo-300 hover:underline mt-1"
                              >
                                {formattedUrl} <LuExternalLink className="text-[10px]" />
                              </a>
                            </div>
                          </td>

                          <td className="px-6 py-4 font-medium text-slate-300">
                            {item.createdBy || "Admin"}
                          </td>

                          <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                            {item.createdAt || "Recent"}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                item.status === "published"
                                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                  : item.status === "scheduled"
                                  ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
                                  : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  item.status === "published"
                                    ? "bg-emerald-400 animate-pulse"
                                    : item.status === "scheduled"
                                    ? "bg-indigo-400"
                                    : "bg-amber-400"
                                }`}
                              />
                              {item.status || "draft"}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => router.push(`/studio?id=${item._id}`)}
                                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-600/15 transition-all shadow-sm"
                                title="Edit Page in Studio"
                              >
                                <LuPencil className="text-sm" />
                              </button>
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 hover:bg-rose-500/10 transition-all shadow-sm"
                                title="Delete Page"
                              >
                                <LuTrash2 className="text-sm" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
