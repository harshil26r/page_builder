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
    scheduleDate: "",
    scheduleTime: "",
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
      if (response && response.success && response.blog) {
        setCurrentBlogId(response.blog._id);
        setCurrentBlog(response.blog);
        // Convert scheduledAt Date to separate date/time strings for inputs
        const rawScheduled = response.blog.scheduledAt || "";
        let sDate = "", sTime = "";
        if (rawScheduled) {
          const d = new Date(rawScheduled);
          if (!isNaN(d.getTime())) {
            sDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
            sTime = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
          }
        }
        setData({
          title: response.blog.title || "",
          subText: response.blog.subText || "",
          body: response.blog.body || "",
          url: response.blog.url || "",
          showAuthor: !!response.blog.showAuthor,
          status: response.blog.status || "",
          scheduleDate: sDate,
          scheduleTime: sTime,
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
      } else {
        toast.error(response?.error || "Invalid page ID");
        router.push("/studio");
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
      toast.error("Failed to load page data");
      router.push("/studio");
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
          status: "draft",
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
        const newId = response.id || response.blog?._id;
        if (newId) setCurrentBlogId(newId);
        setCurrentBlog((prev) => ({ ...prev, status: "draft" }));
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
          status: "draft",
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
        setCurrentBlog((prev) => ({ ...prev, status: "draft" }));
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

  const openPublishModal = () => {
    if (!data.scheduleDate && !data.scheduleTime) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 5 - (now.getMinutes() % 5), 0, 0);
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      setData((prev) => ({ ...prev, scheduleDate: dateStr, scheduleTime: timeStr }));
    }
    setOpen(true);
  };

  const handlePublishAction = async (action) => {
    const targetId = currentBlogId || id;
    if (!targetId) {
      toast.error("Please save the page first before publishing.", { position: "bottom-center" });
      return;
    }

    const body = { id: targetId, action };
    if (action === "schedule") {
      if (!data.scheduleDate || !data.scheduleTime) {
        toast.error("Please select both date and time to schedule.", { position: "bottom-center" });
        return;
      }
      body.scheduledAt = new Date(`${data.scheduleDate}T${data.scheduleTime}`).toISOString();
    }

    try {
      const res = await fetch("/api/blog/addBlogPublishTime", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const response = await res.json();
      if (response.success) {
        toast.success(response.message, { position: "bottom-center", autoClose: 1500 });
        setOpen(false);
        router.push("/");
      } else {
        toast.error(response.error || "Failed to update publish status", { position: "bottom-center" });
      }
    } catch (err) {
      toast.error("Network error. Please try again.", { position: "bottom-center" });
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

      <div className="flex bg-[#070a12] bg-grid-pattern text-slate-100 min-h-screen font-sans selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-x-hidden">
        <Sidebar />

        <div className="flex flex-col w-full pl-20 min-h-screen pb-24 md:pb-8 relative">
          {/* Subtle Ambient Glow Blobs */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/3 w-[30rem] h-[30rem] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

          {/* Top Glassmorphic Navigation Bar */}
          <header className="sticky top-0 z-40 flex flex-wrap p-4 md:px-8 w-full justify-between items-center border-b border-white/10 bg-[#070a12]/80 backdrop-blur-2xl gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <button
                className="flex items-center justify-center h-10 w-10 rounded-2xl border border-white/10 bg-slate-900/80 text-slate-400 hover:text-white hover:border-cyan-400/40 hover:bg-slate-800 active:scale-[0.96] transition-all shadow-sm"
                onClick={() => router.push("/")}
                title="Back to Pages Directory"
              >
                <IoIosArrowBack className="text-xl text-cyan-400" />
              </button>
              <div className="ms-1 py-0.5">
                <h1 className="font-extrabold text-lg md:text-xl text-white tracking-tight flex items-center gap-2.5">
                  <span className="gradient-text-aura">{id || currentBlogId ? "Studio Page Editor" : "New Page Studio"}</span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] uppercase font-extrabold font-mono text-cyan-300 bg-cyan-500/15 px-2.5 py-0.5 rounded-full border border-cyan-500/30 shadow-inner">
                    <HiSparkles className="text-cyan-400" /> Content Studio
                  </span>
                </h1>
                {(id || currentBlogId) && (
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        currentBlog.status === "draft"
                          ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                          : currentBlog.status === "scheduled"
                          ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                          : currentBlog.status === "published"
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          currentBlog.status === "published"
                            ? "bg-emerald-400 status-dot-active"
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
                className="h-10 px-3.5 rounded-2xl border border-white/10 bg-slate-900/80 hover:bg-slate-800 hover:border-cyan-400/30 text-xs font-bold text-slate-300 hover:text-white active:scale-[0.96] transition-all flex items-center gap-1.5 shadow-sm"
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
                  className="flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-2xl border border-white/10 bg-slate-900/80 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 active:scale-[0.96] transition-all shadow-sm"
                >
                  Actions <FiMoreHorizontal size={14} />
                </button>
                {showActionsDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 py-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      type="button"
                      onClick={() => {
                        setShowActionsDropdown(false);
                        handleLiveUrlPreview();
                      }}
                      className="block w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      🔗 Live URL Preview
                    </button>
                    {(id || currentBlogId) && (
                      <button
                        onClick={handleDeleteBlog}
                        className="block w-full text-left px-4 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors border-t border-white/10 mt-1"
                      >
                        🗑️ Delete Page
                      </button>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={validateForm}
                className="h-10 px-4 sm:px-5 rounded-2xl bg-slate-900 hover:bg-indigo-900/30 border border-indigo-500/40 text-xs font-extrabold text-indigo-300 hover:text-indigo-200 shadow-md active:scale-[0.96] transition-all flex items-center gap-1.5"
              >
                <HiCheck className="text-sm" /> Save Draft
              </button>

              <button
                onClick={openPublishModal}
                className="h-10 px-4 sm:px-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:brightness-110 text-xs font-extrabold text-white shadow-xl shadow-indigo-600/25 active:scale-[0.96] transition-all flex items-center gap-1.5"
              >
                🚀 Publish
              </button>
            </div>
          </header>

          {/* Main Builder Workspace & Configuration Grid */}
          <div className="flex flex-col xl:flex-row gap-6 p-4 sm:p-6 md:p-8 items-start relative w-full">
            {/* Main Interactive Content Workspace */}
            <div className="flex-1 min-w-0 w-full glass-panel-elevated rounded-3xl p-6 sm:p-8 space-y-7 shadow-2xl border border-white/10">
              {/* Primary Form Fields */}
              <div className="space-y-6">
                <div className="p-1">
                  <label htmlFor="title" className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                    <span>Page Title <span className="text-cyan-400">*</span></span>
                    <span className="text-[10px] font-mono font-bold text-slate-500">Main Heading</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={data.title}
                    onChange={onChange}
                    placeholder="e.g. Next-Gen AI Platform Page"
                    className="block w-full rounded-2xl border border-white/10 bg-slate-950/80 py-3.5 px-5 text-base font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner"
                  />
                  {errors.title && <span className="text-rose-400 text-xs mt-2 font-medium block">{errors.title}</span>}
                </div>

                <div className="p-1">
                  <label htmlFor="subText" className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                    Subtitle / Catchphrase Summary
                  </label>
                  <input
                    id="subText"
                    name="subText"
                    type="text"
                    value={data.subText}
                    onChange={onChange}
                    placeholder="Short catchphrase or introductory tagline for search & social previews"
                    className="block w-full rounded-2xl border border-white/10 bg-slate-950/80 py-3 px-5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner font-medium"
                  />
                  {errors.subText && <span className="text-rose-400 text-xs mt-2 font-medium block">{errors.subText}</span>}
                </div>
              </div>

              {/* Content Studio Tabs & Canvas */}
              <div className="border-t border-white/10 pt-6">
                <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 mb-6 gap-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2 shrink-0">
                    <HiPencilAlt className="text-cyan-400 text-base" /> Visual Workspace
                  </span>
                  <div className="flex bg-slate-950/90 border border-white/10 p-1 rounded-2xl text-xs font-semibold shrink-0 shadow-inner">
                    <button
                      type="button"
                      onClick={() => setContentTab("blocks")}
                      className={`px-4 py-2 rounded-xl active:scale-[0.96] transition-all ${
                        contentTab === "blocks"
                          ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold"
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
                          ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold"
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
                          ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold"
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

            {/* Sidebar Configuration Panel (Fixed width xl:w-80, sticky right collapse state) */}
            {isConfigCollapsed ? (
              <button
                type="button"
                onClick={() => setIsConfigCollapsed(false)}
                className="fixed right-0 top-36 z-50 flex flex-col items-center gap-3 bg-[#0d1424]/95 border-l border-t border-b border-cyan-500/40 text-slate-300 hover:text-white p-3 rounded-l-2xl shadow-2xl backdrop-blur-2xl group active:scale-[0.97] transition-all hover:bg-slate-900 hover:border-cyan-400"
                title="Expand Page Configuration Panel"
              >
                <div className="relative">
                  <HiCog className="text-2xl text-cyan-400 group-hover:rotate-90 transition-transform duration-500" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 status-dot-active" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono text-cyan-300 [writing-mode:vertical-lr] rotate-180 py-1">
                  CONFIG
                </span>
                <span className="text-[9px] font-mono font-bold text-slate-300 bg-cyan-500/20 border border-cyan-400/30 px-1.5 py-0.5 rounded-full">
                  #{data.blocks?.length || 0}
                </span>
                <HiChevronLeft className="text-base text-cyan-400 group-hover:-translate-x-1 transition-transform" />
              </button>
            ) : (
              <div className="w-full xl:w-80 glass-panel-elevated p-5 sm:p-6 rounded-3xl border border-white/10 shadow-2xl sticky top-24 self-start space-y-5 z-30 transition-all shrink-0">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="text-xs font-extrabold text-white flex items-center gap-2 uppercase tracking-wider">
                    <HiCog className="text-cyan-400 text-base" /> Configuration
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsConfigCollapsed(true)}
                    className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white active:scale-[0.96] transition-all border border-transparent hover:border-white/10"
                    title="Collapse to Sticky Right Tab"
                  >
                    <HiChevronRight className="text-base" />
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label htmlFor="url" className="block text-slate-300 font-extrabold mb-1.5 uppercase tracking-wider text-[11px]">
                      URL Slug <span className="text-cyan-400">*</span>
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
                        className="block w-full pl-7 rounded-2xl border border-white/10 bg-slate-950/80 py-2.5 px-3 text-slate-200 font-mono text-xs focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                      />
                    </div>
                    {errors.url && <span className="text-rose-400 text-xs mt-1 block font-medium">{errors.url}</span>}
                  </div>

                  <div>
                    <label htmlFor="author" className="block text-slate-300 font-extrabold mb-1.5 uppercase tracking-wider text-[11px]">
                      Author
                    </label>
                    <input
                      id="author"
                      name="author"
                      type="text"
                      value={user}
                      readOnly
                      className="block w-full rounded-2xl border border-white/10 bg-slate-950/50 py-2.5 px-3 text-slate-400 cursor-not-allowed select-none font-medium text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <input
                      id="showAuthor"
                      name="showAuthor"
                      type="checkbox"
                      checked={data.showAuthor}
                      onChange={(e) => setData({ ...data, showAuthor: e.target.checked })}
                      className="w-4 h-4 rounded border-white/10 bg-slate-950 text-cyan-400 focus:ring-cyan-400/30 cursor-pointer"
                    />
                    <label htmlFor="showAuthor" className="text-slate-300 font-semibold cursor-pointer select-none text-xs">
                      Display Author Badge
                    </label>
                  </div>

                  {/* Active Page Sections Overview */}
                  <div className="pt-4 border-t border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-slate-200 font-extrabold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                        <HiSparkles className="text-cyan-400" /> Active Sections ({data.blocks ? data.blocks.length : 0})
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
                              className={`w-full flex items-center justify-between p-2.5 rounded-2xl border text-[11px] transition-all shadow-sm ${
                                isSelected
                                  ? "bg-slate-900 border-cyan-400/60 ring-1 ring-cyan-400/30 text-white"
                                  : "bg-slate-950/70 border-white/10 text-slate-300 hover:border-cyan-400/30 hover:bg-slate-900/90"
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="font-mono text-[9px] font-bold text-cyan-300 bg-cyan-500/20 px-1.5 py-0.5 rounded-md border border-cyan-500/30">
                                  #{i + 1}
                                </span>
                                <span className="font-bold uppercase truncate">
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
                    <div className="pt-4 border-t border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-slate-200 font-extrabold flex items-center gap-1.5 text-xs uppercase tracking-wider">
                          <HiColorSwatch className="text-cyan-400" />
                          <span>Block Styling (#{selectedBlockIndex + 1})</span>
                        </label>
                        <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-500/30 uppercase font-mono">
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
              </div>
            )}
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

                  {(() => {
                    const hasFutureSchedule = data.scheduleDate && data.scheduleTime &&
                      new Date(`${data.scheduleDate}T${data.scheduleTime}`) > new Date();
                    return (
                      <>
                        <div className="p-6 space-y-5 text-xs">
                          {/* Current Status + Revert to Draft */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 font-semibold">Status:</span>
                              <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                currentBlog.status === "published"
                                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                  : currentBlog.status === "scheduled"
                                  ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                                  : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  currentBlog.status === "published" ? "bg-emerald-400 animate-pulse"
                                    : currentBlog.status === "scheduled" ? "bg-indigo-400"
                                    : "bg-amber-400"
                                }`} />
                                {currentBlog.status || "draft"}
                              </span>
                            </div>
                            {(currentBlog.status === "published" || currentBlog.status === "scheduled") && (
                              <button
                                type="button"
                                onClick={() => handlePublishAction("unpublish")}
                                className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors"
                              >
                                ↩ Revert to Draft
                              </button>
                            )}
                          </div>

                          {/* Date and Time Inputs */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label htmlFor="scheduleDate" className="block font-semibold text-slate-300 mb-1.5">
                                Date
                              </label>
                              <input
                                id="scheduleDate"
                                name="scheduleDate"
                                type="date"
                                value={data.scheduleDate || ""}
                                onChange={onChange}
                                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-3 text-white text-sm focus:outline-none focus:border-indigo-500 [color-scheme:dark]"
                              />
                            </div>
                            <div>
                              <label htmlFor="scheduleTime" className="block font-semibold text-slate-300 mb-1.5">
                                Time
                              </label>
                              <input
                                id="scheduleTime"
                                name="scheduleTime"
                                type="time"
                                value={data.scheduleTime || ""}
                                onChange={onChange}
                                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-3 text-white text-sm focus:outline-none focus:border-indigo-500 [color-scheme:dark]"
                              />
                            </div>
                          </div>
                          {hasFutureSchedule && (
                            <p className="text-indigo-400 text-[11px] font-medium">
                              ⏰ Will be scheduled for {new Date(`${data.scheduleDate}T${data.scheduleTime}`).toLocaleString()}
                            </p>
                          )}
                        </div>

                        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex gap-3">
                          <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-400 hover:text-white hover:border-slate-600 transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePublishAction(hasFutureSchedule ? "schedule" : "publish_now")}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold text-white shadow-lg transition-all active:scale-[0.97] ${
                              hasFutureSchedule
                                ? "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:brightness-110 shadow-indigo-600/25"
                                : "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110 shadow-emerald-600/25"
                            }`}
                          >
                            {hasFutureSchedule ? "⏰ Schedule" : "🚀 Publish Now"}
                          </button>
                        </div>
                      </>
                    );
                  })()}
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
                            <BlockRenderer
                              blocks={data.blocks}
                              pageStyle={{
                                bgColor: data.bgColor,
                                textColor: data.textColor,
                                fontStyle: data.fontStyle,
                                fontSize: data.fontSize,
                                spacing: data.spacing,
                                customCss: data.customCss,
                              }}
                            />
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
