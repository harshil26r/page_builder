"use client";
import Sidebar from "@/components/Sidebar";
import { IoIosArrowBack } from "react-icons/io";
import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect, Fragment, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import "react-toastify/dist/ReactToastify.css";
import { storage } from "@/components/firebase";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";

function EditPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [user, setUser] = useState("");
  const [open, setOpen] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState("");
  const [currentBlog, setCurrentBlog] = useState({});
  const [errors, setErrors] = useState({});
  const [imageUpload, setImageUpload] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const imageListRef = ref(storage, "images/");

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
        });
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth/login");
      return;
    }
    const decoded = jwtDecode(token);
    setUser(decoded.username);

    if (id) {
      getBlogData(id);
    }
  }, [id]);

  useEffect(() => {
    listAll(imageListRef).then((res) => {
      res.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageList((prev) => [url]);
        });
      });
    });
  }, []);

  const uploadImage = () => {
    if (imageUpload === null) return;
    setUploading(true);

    const imageRef = ref(storage, `images/${imageUpload.name}`);
    uploadBytes(imageRef, imageUpload)
      .then(() => {
        toast.success("Image uploaded successfully!");
        setUploading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Upload failed.");
        setUploading(false);
      });
  };

  const onChange = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: value,
    });

    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = (e) => {
    e.preventDefault();
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
    const token = localStorage.getItem("token");

    if (!id) {
      const res = await fetch(`/api/blog/creatBlog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          title: data.title,
          subText: data.subText,
          body: data.body,
          attachments: data.attachments,
          url: data.url,
          showAuthor: data.showAuthor,
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
        toast.error("Page already exists!", {
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
          token,
          id: id,
          title: data.title,
          subText: data.subText,
          body: data.body,
          attachments: data.attachments,
          url: data.url,
          showAuthor: data.showAuthor,
        }),
      });
      const response = await res.json();
      if (response.success) {
        setCurrentBlogId(id);
        toast.success("Your Page updated as Draft!", {
          position: "bottom-center",
          autoClose: 1000,
        });
      } else {
        toast.error("Page already exists!", {
          position: "bottom-center",
          autoClose: 1000,
        });
      }
    }
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

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

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
      <div className="flex bg-gray-950 text-gray-100 min-h-screen">
        <Sidebar />
        <div className="flex flex-col w-full h-fit scroll-m-0">
          
          {/* Header Action Bar */}
          <div className="flex flex-col md:flex-row p-6 w-full justify-between items-center border-b border-gray-800 bg-gray-900/10 backdrop-blur-sm gap-4">
            <div className="flex items-center gap-4">
              <button
                className="flex items-center justify-center h-10 w-10 rounded-xl border border-gray-800 bg-gray-900/40 text-gray-400 hover:text-white hover:bg-gray-800 transition duration-150"
                onClick={() => router.push("/")}
              >
                <IoIosArrowBack className="text-xl" />
              </button>
              <div>
                <p className="font-bold text-xl text-white">
                  {id ? "Edit Page" : "Create Page"}
                </p>
                {(id || currentBlogId) && (
                  <span
                    className={`inline-block text-xs font-bold px-2 py-0.5 mt-1 rounded-full uppercase tracking-wider ${
                      currentBlog.status === "draft"
                        ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                        : currentBlog.status === "scheduled"
                        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        : currentBlog.status === "published"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : ""
                    }`}
                  >
                    {currentBlog.status || "draft"}
                  </span>
                )}
              </div>
            </div>

            <ul className="flex items-center gap-3">
              <li>
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center justify-center h-10 px-4 rounded-xl border border-gray-800 bg-gray-900/40 text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800 transition duration-150">
                    Actions •••
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right rounded-xl bg-gray-900 border border-gray-800 py-1.5 shadow-2xl z-20">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-gray-800 text-white" : "text-gray-400",
                              "block px-4 py-2 text-xs font-medium transition duration-150"
                            )}
                          >
                            Preview
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-red-500/10 text-red-400" : "text-red-400/80",
                              "block px-4 py-2 text-xs font-medium transition duration-150"
                            )}
                          >
                            Delete
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </li>
              <li>
                <button
                  onClick={() => router.push("/")}
                  className="h-10 px-4 rounded-xl border border-gray-800 bg-gray-900/20 text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800/40 transition duration-150"
                >
                  Cancel
                </button>
              </li>
              <li>
                <button
                  onClick={validateForm}
                  className="h-10 px-5 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition duration-150"
                >
                  Save Draft
                </button>
              </li>
              <li>
                <button
                  onClick={() => setOpen(true)}
                  className="h-10 px-5 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-md hover:bg-emerald-500 transition duration-150"
                >
                  Publish
                </button>
              </li>
            </ul>

            {/* Publish Scheduler Modal */}
            <Transition.Root show={open} as={Fragment}>
              <Dialog as="div" className="relative z-30" onClose={setOpen}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-gray-950/80 transition-opacity" />
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
                      <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 text-left shadow-2xl transition-all w-full max-w-md">
                        <div className="bg-gray-950 px-6 py-4 flex items-center justify-between border-b border-gray-800">
                          <Dialog.Title as="h3" className="text-lg font-bold text-white">
                            Publish Settings
                          </Dialog.Title>
                          <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="text-gray-400 hover:text-white"
                          >
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>

                        <div className="p-6 space-y-5">
                          <div>
                            <label
                              htmlFor="publishTime"
                              className="block text-sm font-semibold text-gray-400"
                            >
                              Publish Date <span className="text-red-400">*</span>
                            </label>
                            <div className="mt-2">
                              <input
                                id="publishTime"
                                name="publishTime"
                                type="date"
                                value={data.publishTime}
                                onChange={onChange}
                                required
                                className="block w-full rounded-xl border border-gray-800 bg-gray-955 py-2.5 px-3.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                              />
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="publishDate"
                              className="block text-sm font-semibold text-gray-400"
                            >
                              Publish Time <span className="text-red-400">*</span>
                            </label>
                            <div className="mt-2">
                              <input
                                id="publishDate"
                                name="publishDate"
                                type="time"
                                value={data.publishDate}
                                onChange={onChange}
                                required
                                className="block w-full rounded-xl border border-gray-800 bg-gray-955 py-2.5 px-3.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-950/40 px-6 py-4 flex justify-end gap-3 border-t border-gray-800">
                          <button
                            onClick={() => setOpen(false)}
                            className="h-10 px-4 rounded-xl border border-gray-800 text-sm font-semibold text-gray-400 hover:text-white transition"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={addPublishTime}
                            className="h-10 px-5 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-md hover:bg-emerald-500 transition"
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
          </div>

          {/* Builder / Configuration Sections */}
          <div className="flex flex-col lg:flex-row gap-6 p-8">
            {/* Editor Workspace */}
            <div className="flex-1 bg-gray-900/30 border border-gray-800/85 backdrop-blur-md rounded-2xl p-6 md:p-8 space-y-6">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-semibold text-gray-400"
                  >
                    Page Title <span className="text-red-400">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={data.title}
                      onChange={onChange}
                      placeholder="My Awesome Landing Page"
                      className="block w-full rounded-xl border border-gray-800 bg-gray-950 py-2.5 px-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    />
                  </div>
                  {errors.title && (
                    <span className="text-red-400 text-xs mt-1 block">{errors.title}</span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="subText"
                    className="block text-sm font-semibold text-gray-400"
                  >
                    Sub Text
                  </label>
                  <div className="mt-2">
                    <input
                      id="subText"
                      name="subText"
                      type="text"
                      value={data.subText}
                      onChange={onChange}
                      placeholder="A short subtitle for SEO description"
                      className="block w-full rounded-xl border border-gray-800 bg-gray-950 py-2.5 px-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    />
                  </div>
                  {errors.subText && (
                    <span className="text-red-400 text-xs mt-1 block">{errors.subText}</span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="body"
                    className="block text-sm font-semibold text-gray-400"
                  >
                    Body Content
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="body"
                      name="body"
                      value={data.body}
                      onChange={onChange}
                      placeholder="Write your HTML or Markdown content here..."
                      rows="8"
                      className="block w-full rounded-xl border border-gray-800 bg-gray-955 py-2.5 px-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 resize-y font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="attachments"
                    className="block text-sm font-semibold text-gray-400"
                  >
                    Featured Media Attachment
                  </label>
                  <div className="mt-2 flex flex-col md:flex-row items-stretch md:items-center gap-3">
                    <input
                      id="attachments"
                      name="attachments"
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setImageUpload(e.target.files[0]);
                        }
                      }}
                      className="block w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gray-800 file:text-gray-300 file:hover:bg-gray-700 transition cursor-pointer"
                    />
                    <button
                      type="button"
                      disabled={uploading || !imageUpload}
                      onClick={uploadImage}
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {uploading ? "Uploading..." : "Upload Media"}
                    </button>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    Supported media: JPEG, PNG, DOC, XLS, PPT.
                  </p>

                  {imageList.length > 0 && (
                    <div className="mt-4 border border-gray-800 bg-gray-950/40 p-4 rounded-xl max-w-sm">
                      <p className="text-xs text-gray-500 mb-2">Uploaded Preview:</p>
                      {imageList.map((url, index) => (
                        <img
                          src={url}
                          key={index}
                          className="rounded-lg max-h-48 w-auto border border-gray-800 object-cover"
                          alt="Uploaded Attachment"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Sidebar Configuration Panel */}
            <div className="w-full lg:w-80 bg-gray-900/30 border border-gray-800/85 backdrop-blur-md rounded-2xl p-6 space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-3">
                Configuration
              </h3>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="url"
                    className="block text-sm font-semibold text-gray-400"
                  >
                    Path URL <span className="text-red-400">*</span>
                  </label>
                  <div className="mt-2 relative rounded-xl shadow-sm">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 text-sm pointer-events-none">
                      /
                    </span>
                    <input
                      id="url"
                      name="url"
                      type="text"
                      value={data.url}
                      onChange={onChange}
                      placeholder="about-us"
                      required
                      className="block w-full pl-7 rounded-xl border border-gray-800 bg-gray-955 py-2.5 px-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    />
                  </div>
                  {errors.url && (
                    <span className="text-red-400 text-xs mt-1 block">{errors.url}</span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="author"
                    className="block text-sm font-semibold text-gray-400"
                  >
                    Author
                  </label>
                  <div className="mt-2">
                    <input
                      id="author"
                      name="author"
                      type="text"
                      value={user}
                      readOnly
                      className="block w-full rounded-xl border border-gray-800 bg-gray-955 py-2.5 px-3.5 text-gray-500 sm:text-sm sm:leading-6 cursor-not-allowed select-none font-medium"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <input
                    id="showAuthor"
                    name="showAuthor"
                    type="checkbox"
                    checked={data.showAuthor}
                    onChange={(e) =>
                      setData({ ...data, showAuthor: e.target.checked })
                    }
                    className="w-4.5 h-4.5 rounded border-gray-800 bg-gray-950 text-indigo-500 focus:ring-indigo-500/50"
                  />
                  <label
                    htmlFor="showAuthor"
                    className="text-sm font-semibold text-gray-400 hover:text-gray-300 cursor-pointer select-none"
                  >
                    Show Author Profile
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function EditPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400 font-sans">Loading page builder...</div>}>
      <EditPageContent />
    </Suspense>
  );
}
