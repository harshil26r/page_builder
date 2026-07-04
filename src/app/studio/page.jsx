"use client";
import Sidebar from "@/components/Sidebar";
import RichTextEditor from "@/components/RichTextEditor";
import MarkdownRender from "@/components/MarkdownRender";
import BlockBuilder from "@/components/BlockBuilder";
import BlockRenderer from "@/components/BlockRenderer";
import SeoPreview from "@/components/SeoPreview";
import { IoIosArrowBack } from "react-icons/io";
import { FiMoreHorizontal } from "react-icons/fi";
import {
  HiCog,
  HiChevronRight,
  HiChevronLeft,
  HiSparkles,
  HiEye,
  HiPencilAlt,
  HiDeviceMobile,
  HiDesktopComputer,
  HiGlobe,
  HiCheck,
} from "react-icons/hi";
import React, { useState, useEffect, Fragment, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import "react-toastify/dist/ReactToastify.css";

function StudioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [user, setUser] = useState("");
  const [open, setOpen] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState("");
  const [currentBlog, setCurrentBlog] = useState({});
  const [errors, setErrors] = useState({});
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [contentTab, setContentTab] = useState("blocks");
  const [isConfigCollapsed, setIsConfigCollapsed] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [data, setData] = useState({
    title: "",
    subText: "",
    body: "",
    attachments: "",
    url: "",
    showAuthor: false,
    status: "",
    publishTime: "",
    publishDate: "",
    blocks: [],
    metaTitle: "",
    metaDescription: "",
    ogImage: "",
  });

  const getBlogData = async (blogId) => {
    try {
      const res = await fetch(`/api/blog/getBlog/${blogId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      if (response && response.blog) {
        setCurrentBlogId(response.blog._id);
        setCurrentBlog(response.blog);
        setData({
          title: response.blog.title || "",
          subText: response.blog.subText || "",
          body: response.blog.body || "",
          url: response.blog.url || "",
          showAuthor: !!response.blog.showAuthor,
          status: response.blog.status || "",
          publishTime: response.blog.publishTime || "",
          publishDate: response.blog.publishDate || "",
          blocks: response.blog.blocks || [],
          metaTitle: response.blog.metaTitle || response.blog.title || "",
          metaDescription: response.blog.metaDescription || response.blog.subText || "",
          ogImage: response.blog.ogImage || "",
        });
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const response = await res.json();
        if (response.success) {
          setUser(response.user.username);
          if (id) {
            getBlogData(id);
          } else {
            setData((prev) => ({
              ...prev,
              title: "Demo Landing Page",
              subText: "This is a gorgeous demo page created with Content Studio",
              url: "demo-page",
            }));
          }
        } else {
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/auth/login");
      }
    };
    checkAuth();
  }, [id, router]);

  useEffect(() => {
    const handleOutsideClick = () => {
      setShowActionsDropdown(false);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = (e) => {
    if (e) e.preventDefault();
    let isValid = true;
    const newErrors = {};

    if (!data.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    } else if (data.title.trim().length < 5) {
      newErrors.title = "Title is minimum 5 characters";
      isValid = false;
    }

    if (!data.subText.trim()) {
      newErrors.subText = "Sub Text is required";
      isValid = false;
    }

    if (!data.url.trim()) {
      newErrors.url = "URL is required";
      isValid = false;
    }

    if (isValid) {
      saveBlog();
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    }
  };

  const saveBlog = async () => {
    const targetId = id || currentBlogId;
    if (!targetId) {
      const res = await fetch(`/api/blog/creatBlog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          subText: data.subText,
          body: data.body,
          attachments: data.attachments,
          url: data.url,
          showAuthor: data.showAuthor,
          blocks: data.blocks,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          ogImage: data.ogImage,
        }),
      });
      const response = await res.json();
      if (response.success) {
        setCurrentBlogId(response.id);
        toast.success("Your Page saved as Draft!", {
          position: "bottom-center",
          autoClose: 1000,
        });
      } else {
        toast.error(response.error || "Page already exists!", {
          position: "bottom-center",
          autoClose: 1000,
        });
      }
    } else {
      const res = await fetch(`/api/blog/updateBlog`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: targetId,
          title: data.title,
          subText: data.subText,
          body: data.body,
          attachments: data.attachments,
          url: data.url,
          showAuthor: data.showAuthor,
          blocks: data.blocks,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          ogImage: data.ogImage,
        }),
      });
      const response = await res.json();
      if (response.success) {
        setCurrentBlogId(targetId);
        toast.success("Your Page updated as Draft!", {
          position: "bottom-center",
          autoClose: 1000,
        });
      } else {
        toast.error(response.error || "Failed to update page!", {
          position: "bottom-center",
          autoClose: 1000,
        });
      }
    }
  };

  const handleLiveUrlPreview = async () => {
    if (!data.url.trim()) {
      toast.error("Please specify a URL slug in configuration first!");
      return;
    }
    toast.info("Saving draft for live preview...", { autoClose: 800 });
    await saveBlog();
    const cleanUrl = data.url.startsWith("/") ? data.url : "/" + data.url;
    window.open(`${cleanUrl}?preview=true`, "_blank");
  };

  const addPublishTime = async () => {
    const res = await fetch(`/api/blog/addBlogPublishTime`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: currentBlogId || id,
        status: "scheduled",
        publishTime: data.publishTime,
        publishDate: data.publishDate,
      }),
    });
    const response = await res.json();
    if (response.success) {
      toast.success(response.message, {
        position: "bottom-center",
        autoClose: 1000,
      });
      router.push("/");
    } else {
      toast.error(response.message || "Failed to publish", {
        position: "bottom-center",
        autoClose: 1000,
      });
    }
  };

  const handleDeleteBlog = async () => {
    const targetId = id || currentBlogId;
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
        toast.success("Page deleted successfully!", {
          position: "bottom-center",
          autoClose: 1000,
        });
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        toast.error(response.error || "Failed to delete page.");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("An error occurred while deleting the page.");
    }
  };

  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div className="flex bg-slate-950 text-slate-100 min-h-screen font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
        <Sidebar />

        <div className="flex flex-col w-full min-h-screen pb-24 md:pb-8">
          {/* Top Glassmorphic Navigation Bar */}
          <header className="sticky top-0 z-40 flex flex-wrap p-4 md:px-8 w-full justify-between items-center border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl gap-4">
            <div className="flex items-center gap-3">
              <button
                className="flex items-center justify-center h-10 w-10 rounded-2xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-sm"
                onClick={() => router.push("/")}
              >
                <IoIosArrowBack className="text-xl" />
              </button>
              <div>
                <h1 className="font-extrabold text-lg md:text-xl text-white tracking-tight flex items-center gap-2">
                  <span>{id || currentBlogId ? "Studio Page Editor" : "New Page Studio"}</span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                    <HiSparkles className="text-indigo-400" /> Content Studio
                  </span>
                </h1>
                {(id || currentBlogId) && (
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 mt-0.5 rounded-full uppercase tracking-wider ${
                      currentBlog.status === "draft"
                        ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                        : currentBlog.status === "scheduled"
                        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        : currentBlog.status === "published"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {currentBlog.status || "draft"}
                  </span>
                )}
              </div>
            </div>

            {/* Viewport & Action Buttons */}
            <div className="flex items-center gap-2.5">
              {/* Quick Modal Preview Button */}
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="h-10 px-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center gap-1.5"
              >
                👁️ Quick Preview
              </button>

              {/* Actions Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActionsDropdown(!showActionsDropdown);
                  }}
                  className="flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition"
                >
                  Actions <FiMoreHorizontal size={14} />
                </button>
                {showActionsDropdown && (
                  <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-slate-900 border border-slate-800 py-2 shadow-2xl z-50">
                    <button
                      type="button"
                      onClick={() => {
                        setShowActionsDropdown(false);
                        handleLiveUrlPreview();
                      }}
                      className="block w-full text-left px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                      🔗 Live URL Preview
                    </button>
                    {(id || currentBlogId) && (
                      <button
                        onClick={handleDeleteBlog}
                        className="block w-full text-left px-4 py-2 text-xs font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition"
                      >
                        🗑️ Delete Page
                      </button>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={validateForm}
                className="h-10 px-4 sm:px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition hover:scale-105 active:scale-95 flex items-center gap-1.5"
              >
                <HiCheck className="text-sm" /> Save Draft
              </button>

              <button
                onClick={() => setOpen(true)}
                className="h-10 px-4 sm:px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:scale-105 active:scale-95 flex items-center gap-1.5"
              >
                🚀 Publish
              </button>
            </div>
          </header>

          {/* Main Builder Grid */}
          <div className="flex flex-col xl:flex-row gap-6 p-4 sm:p-6 md:p-8 items-start">
            {/* Left: Interactive Content Workspace */}
            <div className="flex-1 bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-5 sm:p-7 space-y-6 w-full">
              {/* Primary Form Fields */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Page Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={data.title}
                    onChange={onChange}
                    placeholder="e.g. Modern AI Landing Page"
                    className="block w-full rounded-2xl border border-slate-800 bg-slate-950/80 py-3 px-4 text-sm font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  />
                  {errors.title && <span className="text-red-400 text-xs mt-1 block">{errors.title}</span>}
                </div>

                <div>
                  <label htmlFor="subText" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Subtitle / Summary
                  </label>
                  <input
                    id="subText"
                    name="subText"
                    type="text"
                    value={data.subText}
                    onChange={onChange}
                    placeholder="Short catchphrase or introductory tagline"
                    className="block w-full rounded-2xl border border-slate-800 bg-slate-950/80 py-2.5 px-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
                  />
                  {errors.subText && <span className="text-red-400 text-xs mt-1 block">{errors.subText}</span>}
                </div>
              </div>

              {/* Content Studio Workspace */}
              <div className="border-t border-slate-800/80 pt-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5 gap-2 overflow-x-auto">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 shrink-0">
                    <HiPencilAlt className="text-indigo-400 text-sm" /> Content Studio
                  </span>
                  <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-2xl text-xs font-semibold shrink-0">
                    <button
                      type="button"
                      onClick={() => setContentTab("blocks")}
                      className={`px-3.5 py-1.5 rounded-xl transition-all ${
                        contentTab === "blocks"
                          ? "bg-indigo-600 text-white shadow-md font-bold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      🧱 Visual Blocks ({data.blocks ? data.blocks.length : 0})
                    </button>
                    <button
                      type="button"
                      onClick={() => setContentTab("seo")}
                      className={`px-3.5 py-1.5 rounded-xl transition-all ${
                        contentTab === "seo"
                          ? "bg-indigo-600 text-white shadow-md font-bold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      🎯 SEO & Metadata
                    </button>
                  </div>
                </div>

                {contentTab === "blocks" ? (
                  <BlockBuilder
                    blocks={data.blocks || []}
                    onChange={(newBlocks) => setData({ ...data, blocks: newBlocks })}
                  />
                ) : (
                  <SeoPreview
                    title={data.title}
                    subText={data.subText}
                    url={data.url}
                    metaTitle={data.metaTitle}
                    metaDescription={data.metaDescription}
                    ogImage={data.ogImage}
                    onChange={(field, val) => setData((prev) => ({ ...prev, [field]: val }))}
                  />
                )}
              </div>
            </div>

            {/* Sidebar Configuration Panel */}
            <div
              className={`transition-all duration-300 bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-3xl ${
                isConfigCollapsed ? "w-full xl:w-16 p-3 flex flex-col items-center" : "w-full xl:w-80 p-6 space-y-6"
              }`}
            >
              {isConfigCollapsed ? (
                <button
                  type="button"
                  onClick={() => setIsConfigCollapsed(false)}
                  className="flex flex-col items-center gap-2 text-slate-400 hover:text-white py-2 w-full group"
                  title="Expand Configuration"
                >
                  <HiCog className="text-xl text-indigo-400 group-hover:rotate-45 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-wider hidden xl:block text-slate-500 group-hover:text-slate-300">
                    Config
                  </span>
                  <HiChevronLeft className="text-sm mt-1" />
                </button>
              ) : (
                <>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                      <HiCog className="text-indigo-400 text-base" /> Configuration
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsConfigCollapsed(true)}
                      className="p-1 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
                      title="Collapse Configuration"
                    >
                      <HiChevronRight className="text-base" />
                    </button>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label htmlFor="url" className="block text-slate-400 font-semibold mb-1">
                        URL Slug <span className="text-red-400">*</span>
                      </label>
                      <div className="relative rounded-xl shadow-sm">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 text-xs font-mono">
                          /
                        </span>
                        <input
                          id="url"
                          name="url"
                          type="text"
                          value={data.url}
                          onChange={onChange}
                          placeholder="landing-page"
                          required
                          className="block w-full pl-7 rounded-xl border border-slate-800 bg-slate-950 py-2 px-3 text-slate-200 focus:border-indigo-500 outline-none"
                        />
                      </div>
                      {errors.url && <span className="text-red-400 text-xs mt-1 block">{errors.url}</span>}
                    </div>

                    <div>
                      <label htmlFor="author" className="block text-slate-400 font-semibold mb-1">
                        Author
                      </label>
                      <input
                        id="author"
                        name="author"
                        type="text"
                        value={user}
                        readOnly
                        className="block w-full rounded-xl border border-slate-800 bg-slate-950 py-2 px-3 text-slate-500 cursor-not-allowed select-none font-medium"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <input
                        id="showAuthor"
                        name="showAuthor"
                        type="checkbox"
                        checked={data.showAuthor}
                        onChange={(e) => setData({ ...data, showAuthor: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-indigo-500"
                      />
                      <label htmlFor="showAuthor" className="text-slate-300 font-semibold cursor-pointer">
                        Display Author Badge
                      </label>
                    </div>

                    {/* Active Page Sections Overview */}
                    <div className="pt-4 border-t border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-slate-300 font-bold flex items-center gap-1.5">
                          <HiSparkles className="text-indigo-400" /> Active Sections ({data.blocks ? data.blocks.length : 0})
                        </label>
                      </div>

                      {!data.blocks || data.blocks.length === 0 ? (
                        <p className="text-[11px] text-slate-500 italic">No section blocks added yet.</p>
                      ) : (
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {data.blocks.map((b, i) => (
                            <div
                              key={b.id || i}
                              className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px]"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="font-mono text-[9px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                                  #{i + 1}
                                </span>
                                <span className="font-semibold text-slate-200 uppercase truncate">
                                  {b.type}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-500 truncate max-w-[90px]">
                                {b.data?.title || b.data?.headline || "Block"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Publish Modal */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 text-left shadow-2xl transition-all w-full max-w-md">
                  <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800">
                    <Dialog.Title as="h3" className="text-base font-bold text-white">
                      Publish & Schedule Page
                    </Dialog.Title>
                    <button type="button" onClick={() => setOpen(false)} className="text-slate-400 hover:text-white">
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="p-6 space-y-4 text-xs">
                    <div>
                      <label htmlFor="publishTime" className="block font-semibold text-slate-300 mb-1">
                        Publish Date
                      </label>
                      <input
                        id="publishTime"
                        name="publishTime"
                        type="date"
                        value={data.publishTime}
                        onChange={onChange}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-3 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="publishDate" className="block font-semibold text-slate-300 mb-1">
                        Publish Time
                      </label>
                      <input
                        id="publishDate"
                        name="publishDate"
                        type="time"
                        value={data.publishDate}
                        onChange={onChange}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-3 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-950 px-6 py-4 flex justify-end gap-3 border-t border-slate-800">
                    <button
                      onClick={() => setOpen(false)}
                      className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addPublishTime}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg"
                    >
                      Schedule Publish
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Quick Live Preview Modal */}
      <Transition.Root show={showPreviewModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setShowPreviewModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 text-left shadow-2xl transition-all w-full max-w-4xl max-h-[90vh] flex flex-col">
                  <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <Dialog.Title as="h3" className="text-base font-bold text-white flex items-center gap-2">
                        <span>👁️ Live Screen Preview</span>
                      </Dialog.Title>
                      <div className="flex bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setPreviewDevice("desktop")}
                          className={`px-2.5 py-1 rounded-md transition ${
                            previewDevice === "desktop" ? "bg-indigo-600 text-white font-bold" : "text-slate-400"
                          }`}
                        >
                          Desktop
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewDevice("mobile")}
                          className={`px-2.5 py-1 rounded-md transition ${
                            previewDevice === "mobile" ? "bg-indigo-600 text-white font-bold" : "text-slate-400"
                          }`}
                        >
                          Mobile
                        </button>
                      </div>
                    </div>
                    <button type="button" onClick={() => setShowPreviewModal(false)} className="text-slate-400 hover:text-white">
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="p-3 sm:p-6 overflow-y-auto bg-slate-950/80 flex justify-center items-start flex-1 min-h-[500px]">
                    <div
                      className={`bg-slate-950 border transition-all duration-300 shadow-2xl overflow-y-auto ${
                        previewDevice === "mobile"
                          ? "w-[360px] min-h-[640px] rounded-3xl border-slate-800 ring-8 ring-slate-900"
                          : "w-full min-h-[500px] rounded-2xl border-slate-800"
                      }`}
                    >
                      {/* Browser Frame */}
                      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center gap-2 text-xs text-slate-500 rounded-t-2xl select-none">
                        <div className="flex gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                        </div>
                        <div className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-lg text-slate-400 font-mono text-[10px] flex-1 max-w-[220px] mx-auto truncate text-center">
                          {data.url ? `/${data.url.replace(/^\//, "")}` : "/new-page"}
                        </div>
                      </div>

                      {/* Modal Content Preview */}
                      <div className="p-6 font-sans space-y-6">
                        <div className="border-b border-slate-800 pb-4">
                          <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                            {data.title || "Untitled Page"}
                          </h2>
                          {data.subText && <p className="text-sm text-slate-400 mt-1">{data.subText}</p>}
                        </div>

                        <div>
                          {data.blocks && data.blocks.length > 0 ? (
                            <BlockRenderer blocks={data.blocks} />
                          ) : (
                            <MarkdownRender source={data.body} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

export default function StudioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">
          <div className="flex items-center gap-3">
            <HiSparkles className="w-6 h-6 text-indigo-400 animate-spin" />
            <span className="text-sm font-semibold">Loading Content Studio...</span>
          </div>
        </div>
      }
    >
      <StudioContent />
    </Suspense>
  );
}
