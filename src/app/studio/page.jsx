"use client";
import Sidebar from "@/components/Sidebar";
import RichTextEditor from "@/components/RichTextEditor";
import MarkdownRender from "@/components/MarkdownRender";
import BlockBuilder from "@/components/BlockBuilder";
import BlockRenderer from "@/components/BlockRenderer";
import SeoPreview from "@/components/SeoPreview";
import ThemeSelector from "@/components/ThemeSelector";
import BlockStyleEditor from "@/components/BlockStyleEditor";
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
  HiColorSwatch,
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
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(0);

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
    theme: "slate",
    fontFamily: "Inter",
    bgColor: "#0f172a",
    textColor: "#f8fafc",
    fontStyle: "sans",
    fontSize: "base",
    spacing: "normal",
    customCss: "",
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
          theme: response.blog.theme || "slate",
          fontFamily: response.blog.fontFamily || "Inter",
          bgColor: response.blog.bgColor || "#0f172a",
          textColor: response.blog.textColor || "#f8fafc",
          fontStyle: response.blog.fontStyle || "sans",
          fontSize: response.blog.fontSize || "base",
          spacing: response.blog.spacing || "normal",
          customCss: response.blog.customCss || "",
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
          theme: data.theme,
          fontFamily: data.fontFamily,
          bgColor: data.bgColor,
          textColor: data.textColor,
          fontStyle: data.fontStyle,
          fontSize: data.fontSize,
          spacing: data.spacing,
          customCss: data.customCss,
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
          theme: data.theme,
          fontFamily: data.fontFamily,
          bgColor: data.bgColor,
          textColor: data.textColor,
          fontStyle: data.fontStyle,
          fontSize: data.fontSize,
          spacing: data.spacing,
          customCss: data.customCss,
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
          <header className="sticky top-0 z-40 flex flex-wrap p-4 md:px-8 w-full justify-between items-center border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-2xl gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                className="flex items-center justify-center h-10 w-10 rounded-2xl border border-slate-800 bg-slate-900/70 text-slate-400 hover:text-white hover:bg-slate-800 active:scale-[0.96] transition-transform shadow-sm"
                onClick={() => router.push("/")}
                title="Back to Dashboard"
              >
                <IoIosArrowBack className="text-xl" />
              </button>
              <div className="ms-1 py-0.5">
                <h1 className="font-extrabold text-lg md:text-xl text-white tracking-tight flex items-center gap-2.5">
                  <span>{id || currentBlogId ? "Studio Page Editor" : "New Page Studio"}</span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] uppercase font-extrabold text-indigo-300 bg-indigo-500/15 px-2.5 py-0.5 rounded-full border border-indigo-500/30 shadow-inner">
                    <HiSparkles className="text-indigo-400" /> Content Studio
                  </span>
                </h1>
                {(id || currentBlogId) && (
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        currentBlog.status === "draft"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : currentBlog.status === "scheduled"
                          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          : currentBlog.status === "published"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          currentBlog.status === "published"
                            ? "bg-emerald-400 animate-pulse"
                            : currentBlog.status === "scheduled"
                            ? "bg-indigo-400"
                            : "bg-amber-400"
                        }`}
                      />
                      {currentBlog.status || "draft"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Viewport & Action Buttons */}
            <div className="flex items-center gap-2.5">
              {/* Quick Modal Preview Button */}
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="h-10 px-3.5 rounded-2xl border border-slate-800 bg-slate-900/70 hover:bg-slate-800 text-xs font-bold text-slate-300 hover:text-white active:scale-[0.96] transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>👁️</span> Quick Preview
              </button>

              {/* Actions Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActionsDropdown(!showActionsDropdown);
                  }}
                  className="flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-2xl border border-slate-800 bg-slate-900/70 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 active:scale-[0.96] transition-all shadow-sm"
                >
                  Actions <FiMoreHorizontal size={14} />
                </button>
                {showActionsDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-slate-900 border border-slate-800 py-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      type="button"
                      onClick={() => {
                        setShowActionsDropdown(false);
                        handleLiveUrlPreview();
                      }}
                      className="block w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      🔗 Live URL Preview
                    </button>
                    {(id || currentBlogId) && (
                      <button
                        onClick={handleDeleteBlog}
                        className="block w-full text-left px-4 py-2.5 text-xs font-semibold text-red-400/90 hover:bg-red-500/10 hover:text-red-400 transition-colors border-t border-slate-800/60 mt-1"
                      >
                        🗑️ Delete Page
                      </button>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={validateForm}
                className="h-10 px-4 sm:px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-xs font-extrabold text-white shadow-lg shadow-indigo-600/25 active:scale-[0.96] transition-all flex items-center gap-1.5"
              >
                <HiCheck className="text-sm" /> Save Draft
              </button>

              <button
                onClick={() => setOpen(true)}
                className="h-10 px-4 sm:px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-extrabold text-white shadow-lg shadow-emerald-600/20 active:scale-[0.96] transition-all flex items-center gap-1.5"
              >
                🚀 Publish
              </button>
            </div>
          </header>

          {/* Main Builder Grid */}
          <div className="flex flex-col xl:flex-row gap-6 p-4 sm:p-6 md:p-8 items-start">
            {/* Left: Interactive Content Workspace */}
            <div className="flex-1 bg-slate-900/50 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 space-y-7 shadow-xl w-full">
              {/* Primary Form Fields */}
              <div className="space-y-6">
                <div className="p-1">
                  <label htmlFor="title" className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center justify-between">
                    <span>Page Title <span className="text-red-400">*</span></span>
                    <span className="text-[10px] font-medium text-slate-500">Main Heading</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={data.title}
                    onChange={onChange}
                    placeholder="e.g. Modern AI Landing Page"
                    className="block w-full rounded-2xl border border-slate-800 bg-slate-950/90 py-4 px-5 text-base font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner"
                  />
                  {errors.title && <span className="text-red-400 text-xs mt-2 font-medium block">{errors.title}</span>}
                </div>

                <div className="p-1">
                  <label htmlFor="subText" className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                    Subtitle / Summary
                  </label>
                  <input
                    id="subText"
                    name="subText"
                    type="text"
                    value={data.subText}
                    onChange={onChange}
                    placeholder="Short catchphrase or introductory tagline"
                    className="block w-full rounded-2xl border border-slate-800 bg-slate-950/90 py-3.5 px-5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner"
                  />
                  {errors.subText && <span className="text-red-400 text-xs mt-2 font-medium block">{errors.subText}</span>}
                </div>
              </div>

              {/* Content Studio Workspace */}
              <div className="border-t border-slate-800/80 pt-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-6 gap-2 overflow-x-auto">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2 shrink-0">
                    <HiPencilAlt className="text-indigo-400 text-base" /> Content Studio
                  </span>
                  <div className="flex bg-slate-950/90 border border-slate-800/90 p-1 rounded-2xl text-xs font-semibold shrink-0 shadow-inner">
                    <button
                      type="button"
                      onClick={() => setContentTab("blocks")}
                      className={`px-4 py-2 rounded-xl active:scale-[0.96] transition-all ${
                        contentTab === "blocks"
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      🧱 Visual Blocks ({data.blocks ? data.blocks.length : 0})
                    </button>
                    <button
                      type="button"
                      onClick={() => setContentTab("seo")}
                      className={`px-4 py-2 rounded-xl active:scale-[0.96] transition-all ${
                        contentTab === "seo"
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      🎯 SEO & Metadata
                    </button>
                    <button
                      type="button"
                      onClick={() => setContentTab("theme")}
                      className={`px-4 py-2 rounded-xl active:scale-[0.96] transition-all ${
                        contentTab === "theme"
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      🎨 Theme & Styling
                    </button>
                  </div>
                </div>

                {contentTab === "blocks" ? (
                  <BlockBuilder
                    blocks={data.blocks || []}
                    onChange={(newBlocks) => setData({ ...data, blocks: newBlocks })}
                  />
                ) : contentTab === "seo" ? (
                  <SeoPreview
                    title={data.title}
                    subText={data.subText}
                    url={data.url}
                    metaTitle={data.metaTitle}
                    metaDescription={data.metaDescription}
                    ogImage={data.ogImage}
                    onChange={(field, val) => setData((prev) => ({ ...prev, [field]: val }))}
                  />
                ) : (
                  <ThemeSelector
                    bgColor={data.bgColor || "#0f172a"}
                    textColor={data.textColor || "#f8fafc"}
                    fontStyle={data.fontStyle || "sans"}
                    fontSize={data.fontSize || "base"}
                    spacing={data.spacing || "normal"}
                    customCss={data.customCss || ""}
                    onChange={(field, val) => setData((prev) => ({ ...prev, [field]: val }))}
                  />
                )}
              </div>
            </div>

            {/* Sidebar Configuration Panel */}
            <div
              className={`transition-all duration-300 bg-slate-900/50 border border-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl sticky top-6 self-start z-30 ${
                isConfigCollapsed ? "w-full xl:w-16 p-3 flex flex-col items-center" : "w-full xl:w-80 p-5 space-y-5"
              }`}
            >
              {isConfigCollapsed ? (
                <button
                  type="button"
                  onClick={() => setIsConfigCollapsed(false)}
                  className="flex flex-col items-center gap-2 text-slate-400 hover:text-white py-2 w-full group active:scale-[0.96] transition-all"
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
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2 uppercase tracking-wider">
                      <HiCog className="text-indigo-400 text-base" /> Configuration
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsConfigCollapsed(true)}
                      className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white active:scale-[0.96] transition-all"
                      title="Collapse Configuration"
                    >
                      <HiChevronRight className="text-base" />
                    </button>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label htmlFor="url" className="block text-slate-400 font-bold mb-1.5">
                        URL Slug <span className="text-red-400">*</span>
                      </label>
                      <div className="relative rounded-xl shadow-sm">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 text-xs font-mono select-none">
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
                          className="block w-full pl-7 rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-3 text-slate-200 font-mono text-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all"
                        />
                      </div>
                      {errors.url && <span className="text-red-400 text-xs mt-1 block font-medium">{errors.url}</span>}
                    </div>

                    <div>
                      <label htmlFor="author" className="block text-slate-400 font-bold mb-1.5">
                        Author
                      </label>
                      <input
                        id="author"
                        name="author"
                        type="text"
                        value={user}
                        readOnly
                        className="block w-full rounded-xl border border-slate-800/80 bg-slate-950/70 py-2.5 px-3 text-slate-500 cursor-not-allowed select-none font-medium"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <input
                        id="showAuthor"
                        name="showAuthor"
                        type="checkbox"
                        checked={data.showAuthor}
                        onChange={(e) => setData({ ...data, showAuthor: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950 cursor-pointer"
                      />
                      <label htmlFor="showAuthor" className="text-slate-300 font-semibold cursor-pointer select-none">
                        Display Author Badge
                      </label>
                    </div>

                    {/* Active Page Sections Overview */}
                    <div className="pt-4 border-t border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-slate-300 font-extrabold flex items-center gap-1.5">
                          <HiSparkles className="text-indigo-400" /> Active Sections ({data.blocks ? data.blocks.length : 0})
                        </label>
                      </div>

                      {!data.blocks || data.blocks.length === 0 ? (
                        <p className="text-[11px] text-slate-500 italic">No section blocks added yet.</p>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                          {data.blocks.map((b, i) => {
                            const isSelected = selectedBlockIndex === i;
                            return (
                              <button
                                key={b.id || i}
                                type="button"
                                onClick={() => setSelectedBlockIndex(i)}
                                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-[11px] transition-all shadow-sm ${
                                  isSelected
                                    ? "bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/30"
                                    : "bg-slate-950 border-slate-800/80 hover:border-indigo-500/30 hover:bg-slate-900/90"
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <span className="font-mono text-[9px] font-bold text-indigo-400 bg-indigo-500/15 px-1.5 py-0.5 rounded-md border border-indigo-500/25">
                                    #{i + 1}
                                  </span>
                                  <span className="font-bold text-slate-200 uppercase truncate">
                                    {b.type}
                                  </span>
                                </div>
                                <span className="text-[10px] font-medium text-slate-400 truncate max-w-[100px]">
                                  {b.data?.title || b.data?.headline || "Block"}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Block Custom Styling & Spacing in Right Configuration Panel */}
                    {data.blocks && data.blocks.length > 0 && data.blocks[selectedBlockIndex] && (
                      <div className="pt-4 border-t border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-slate-200 font-extrabold flex items-center gap-1.5 text-xs uppercase tracking-wider">
                            <HiColorSwatch className="text-indigo-400" />
                            <span>Block Styling (#{selectedBlockIndex + 1})</span>
                          </label>
                          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/15 px-2 py-0.5 rounded-full border border-indigo-500/25 uppercase">
                            {data.blocks[selectedBlockIndex]?.type}
                          </span>
                        </div>

                        <BlockStyleEditor
                          style={data.blocks[selectedBlockIndex]?.data?.style || {}}
                          onChange={(newStyle) => {
                            const updatedBlocks = [...data.blocks];
                            if (updatedBlocks[selectedBlockIndex]) {
                              updatedBlocks[selectedBlockIndex] = {
                                ...updatedBlocks[selectedBlockIndex],
                                data: {
                                  ...updatedBlocks[selectedBlockIndex].data,
                                  style: newStyle,
                                },
                              };
                              setData({ ...data, blocks: updatedBlocks });
                            }
                          }}
                        />
                      </div>
                    )}
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
                enterFrom="opacity-0 scale-95 translate-y-2"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-2"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 text-left shadow-2xl w-full max-w-md">
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
                enterFrom="opacity-0 scale-95 translate-y-2"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-2"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 text-left shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                  <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800/80">
                    <div className="flex items-center gap-4">
                      <Dialog.Title as="h3" className="text-sm font-extrabold text-white flex items-center gap-2">
                        <span className="text-base">👁️</span> Live Screen Preview
                      </Dialog.Title>
                      <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold shadow-inner">
                        <button
                          type="button"
                          onClick={() => setPreviewDevice("desktop")}
                          className={`px-3 py-1 rounded-lg active:scale-[0.96] transition-all flex items-center gap-1.5 ${
                            previewDevice === "desktop" ? "bg-indigo-600 text-white font-bold shadow-md" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <HiDesktopComputer className="text-sm" /> Desktop
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewDevice("mobile")}
                          className={`px-3 py-1 rounded-lg active:scale-[0.96] transition-all flex items-center gap-1.5 ${
                            previewDevice === "mobile" ? "bg-indigo-600 text-white font-bold shadow-md" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <HiDeviceMobile className="text-sm" /> Mobile
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPreviewModal(false)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 active:scale-[0.96] transition-all"
                    >
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="p-4 sm:p-6 overflow-y-auto bg-slate-950/80 flex justify-center items-start flex-1 min-h-[500px]">
                    <div
                      className={`bg-slate-950 border transition-all duration-300 shadow-2xl overflow-y-auto ${
                        previewDevice === "mobile"
                          ? "w-[360px] min-h-[640px] rounded-[32px] border-slate-800 ring-8 ring-slate-900 shadow-2xl shadow-indigo-500/10"
                          : "w-full min-h-[500px] rounded-2xl border-slate-800 shadow-2xl"
                      }`}
                    >
                      {/* Browser Frame */}
                      <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between text-xs text-slate-500 rounded-t-2xl select-none">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90 inline-block"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90 inline-block"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90 inline-block"></span>
                        </div>
                        <div className="bg-slate-950 border border-slate-800/80 px-3 py-1 rounded-lg text-slate-400 font-mono text-[10px] flex items-center justify-center gap-1.5 max-w-[240px] w-full truncate shadow-inner">
                          <span className="text-emerald-400 text-[10px]">🔒</span>
                          <span className="truncate">{data.url ? `https://pagebuilder.app/${data.url.replace(/^\//, "")}` : "https://pagebuilder.app/new-page"}</span>
                        </div>
                        <div className="w-10"></div>
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
