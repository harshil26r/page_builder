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
import RichTextEditor from "@/components/RichTextEditor";

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

    const imageRef = ref(storage, `images/${imageUpload.name}`);
    uploadBytes(imageRef, imageUpload).then(() => {
      console.log("imageUpload done");
      // Add visual confirmation
      toast.success("Image uploaded successfully!");
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

    // title validation
    if (!data.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    } else if (data.title.trim().length < 5) {
      newErrors.title = "Title is minimum 4 character";
      isValid = false;
    }

    // subText validation
    if (!data.subText.trim()) {
      newErrors.subText = "Sub Text is required";
      isValid = false;
    }

    // url validation
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
        toast.success("Your Blog saved as Draft!", {
          position: "bottom-center",
          autoClose: 1000,
        });
      } else {
        toast.error("Blog already exists!", {
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
        toast.success("Your Blog updated as Draft!", {
          position: "bottom-center",
          autoClose: 1000,
        });
      } else {
        toast.error("Blog already exists!", {
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
        theme="light"
      />
      <div className="flex">
        <Sidebar />
        <div className="flex flex-col w-full h-fit scroll-m-0 ">
          <div className="flex flex-col md:flex-row p-6 w-full justify-center h-fit  border-b-2 ">
            <div className="flex flex-row justify-center items-center">
              <button className="text-xl me-5" onClick={() => router.push("/")}>
                <IoIosArrowBack />
              </button>
              <p className="font-medium text-xl mt-1 me-5">Home Page</p>
              {(id || currentBlogId) && (
                <span
                  className={`${
                    currentBlog.status === "draft"
                      ? "bg-yellow-100  text-yellow-600"
                      : currentBlog.status === "scheduled"
                      ? "bg-blue-100  text-blue-600"
                      : currentBlog.status === "published"
                      ? "bg-green-100  text-green-600"
                      : ""
                  } font-medium text-base p-2  rounded-md`}
                >
                  {currentBlog.status || "draft"}
                </span>
              )}
            </div>

            <ul className="flex mt-5 justify-center items-center md:mt-0 md:ms-auto">
              <li>
                <div>
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex rounded-sm  p-1 px-2 border-2 me-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-600">
                        ...
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-35 origin-top-right rounded-md bg-white py-1 shadow-lg focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
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
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-red-700"
                              )}
                            >
                              Delete
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </li>
              <li>
                <button
                  onClick={() => router.push("/")}
                  className="bg-white border rounded p-1 me-3"
                >
                  Cancel
                </button>
              </li>
              <li>
                <button
                  onClick={validateForm}
                  className="bg-blue-500 text-white px-3 rounded p-1 me-3"
                >
                  Save
                </button>
              </li>
              <li>
                <button
                  onClick={() => setOpen(true)}
                  className="bg-green-700 text-white px-3  rounded p-1 me-3"
                >
                  Publish
                </button>
              </li>
            </ul>

            <Transition.Root show={open} as={Fragment}>
              <Dialog as="div" className="relative z-30 m-0 " onClose={setOpen}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
                </Transition.Child>

                <div className="fixed  inset-0 z-10 bg-gray-500 bg-opacity-15 overflow-y-auto">
                  <div className="flex  h-fit min-h-screen justify-center text-center items-center md:px-2 lg:px-4">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                      enterTo="opacity-100 translate-y-0 md:scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 translate-y-0 md:scale-100"
                      leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                    >
                      <Dialog.Panel className="w-auto md:w-1/3 rounded-md transform text-left bg-white text-base">
                        <div className="flex bg-black h-20 rounded-t-md p-4 text-xl">
                          <div className="text-white mt-3 ">Publish</div>
                          <button
                            type="button"
                            className="ms-auto"
                            onClick={() => setOpen(false)}
                          >
                            <XMarkIcon
                              className=" w-6 text-white"
                              aria-hidden="true"
                            />
                          </button>
                        </div>

                        <div className="mt-6 p-4">
                          <div>
                            <label
                              htmlFor="publishTime"
                              className="block text-base font-normal leading-6 text-gray-500"
                            >
                              <span className="text-red-500">*</span> Publish
                              Date
                            </label>
                            <div className="mt-2">
                              <input
                                id="publishTime"
                                name="publishTime"
                                type="date"
                                value={data.publishTime}
                                onChange={onChange}
                                required
                                className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-gray-900 shadow-sm placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                          <div className="mt-6 ">
                            <label
                              htmlFor="publishDate"
                              className="block text-base font-normal  leading-6 text-gray-500"
                            >
                              <span className="text-red-500">*</span> Publish
                              Time
                            </label>
                            <div className="mt-2">
                              <input
                                id="publishDate"
                                name="publishDate"
                                type="time"
                                value={data.publishDate}
                                onChange={onChange}
                                required
                                className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-gray-900 shadow-sm placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm sm:leading-6 resize-none"
                              />
                            </div>
                          </div>
                        </div>
                        <hr className="mt-3 " />
                        <div className="flex p-4">
                          <button
                            onClick={() => setOpen(false)}
                            className="mt-4 ms-auto  mr-5 border py-2 px-6 focus:outline-none hover:bg-gray-400 rounded text-lg"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={addPublishTime}
                            className="mt-4 bg-green-500 text-white border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg"
                          >
                            Publish
                          </button>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition.Root>
          </div>
          <div className="flex flex-col md:flex-row h-fit">
            <div className="w-full mb-5  md:m-8  p-3 md:p-0 ">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label
                    htmlFor="title"
                    className="block text-lg font-medium leading-6 text-gray-500"
                  >
                    Title <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={data.title}
                      onChange={onChange}
                      placeholder="Enter your title"
                      className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-gray-900 shadow-sm focus:ring-1 focus:ring-blue-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {errors.title && (
                    <span className="text-red-600">{errors.title}</span>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="subText"
                      className="block text-lg font-medium leading-6 text-gray-500"
                    >
                      Sub Text
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="subText"
                      name="subText"
                      type="text"
                      value={data.subText}
                      onChange={onChange}
                      placeholder="Enter your sub text"
                      className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-gray-900 shadow-sm focus:ring-1 focus:ring-blue-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {errors.subText && (
                    <span className="text-red-600">{errors.subText}</span>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="body"
                      className="block text-lg font-medium leading-6 text-gray-500"
                    >
                      Body
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="body"
                      name="body"
                      type="text"
                      value={data.body}
                      onChange={onChange}
                      placeholder="Enter your content here"
                      className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-gray-900 shadow-sm focus:ring-1 focus:ring-blue-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="attachments"
                      className="block text-lg font-medium leading-6 text-gray-500"
                    >
                      Attachments
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="attachments"
                      name="attachments"
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setImageUpload(e.target.files[0]);
                        }
                      }}
                      className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-gray-900 shadow-sm focus:ring-1 focus:ring-blue-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <p className="text-gray-500 mt-1">
                    Supported files: JPEG, PNG, DOC, XLS, PPT.
                  </p>
                  <button
                    type="button"
                    className="m-3 ms-0 bg-blue-500 p-2 rounded-md text-white"
                    onClick={uploadImage}
                  >
                    Upload
                  </button>

                  {imageList.map((url, index) => {
                    return (
                      <img
                        src={url}
                        key={index}
                        height={10}
                        width={200}
                        alt=""
                      />
                    );
                  })}
                </div>
              </form>
            </div>
            <div className="">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="border-t-2 md:border-t-0  md:border-s-2  md:min-h-screen  w-full "
              >
                <div className="border-b py-5 ps-3 pr-5">Configuration</div>

                <div className="mt-4 px-5 py-3">
                  <label
                    htmlFor="url"
                    className="block text-lg font-medium leading-6 text-gray-500"
                  >
                    URL<span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="url"
                      name="url"
                      type="text"
                      value={data.url}
                      onChange={onChange}
                      required
                      className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-gray-900 shadow-sm focus:ring-1 focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {errors.url && (
                    <span className="text-red-600">{errors.url}</span>
                  )}
                </div>
                <div className="mt-4 px-5 py-3">
                  <label
                    htmlFor="author"
                    className="block text-lg font-medium leading-6 text-gray-500"
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
                      className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-gray-900 shadow-sm sm:text-sm sm:leading-6 bg-gray-100"
                    />
                  </div>
                </div>
                <div className="flex items-center mt-4 px-5 py-3">
                  <input
                    id="showAuthor"
                    name="showAuthor"
                    type="checkbox"
                    checked={data.showAuthor}
                    onChange={(e) =>
                      setData({ ...data, showAuthor: e.target.checked })
                    }
                    className=" w-4 rounded border-gray-100  text-indigo-600 focus:ring-indigo-600"
                  />
                  <p className="ms-2 text-gray-500">Show Author</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function EditPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading page builder...</div>}>
      <EditPageContent />
    </Suspense>
  );
}
