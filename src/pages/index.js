"use client";
import Image from "next/image";
import lodingPic from "../../public/32-loading.png";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect, useState, Fragment } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { Dialog, Menu, Transition } from "@headlessui/react";
import Sidebar from "@/components/Sidebar";
import { CiSearch } from "react-icons/ci";

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
    }
    const allBlogs = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/blog/getBlogs`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response = await res.json();
        setBlogs(response);
        setFilterBlogs(response.blog);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    allBlogs();
  }, []);

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/blog/deleteBlog`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectBlogId,
        }),
      });
      const response = await res.json();
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  // filter Blogs
  useEffect(() => {
    if (blogs.blog) {
      const filterBlogs = blogs.blog.filter((item) => {
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
      setFilterBlogs(filterBlogs);
    }
  }, [data]);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      <div className="flex h-screen">
        <Sidebar />
        {blogs.blog && blogs.blog.length === 0 && (
          <div className="h-screen flex mx-auto">
            <div className="flex flex-col justify-center items-center  border-2 rounded p-5 md:p-20 mx-auto my-auto m-10 lg:mt-40 md:flex-row ">
              <div className="m-5  pr-5 md:pr-20">
                <p className="text-3xl font-medium">No Pages Found.</p>
                <p className="text-gray-500 mt-4">
                  {" "}
                  Looks like you don’t have any pages yet. Let’s add a new page.
                  Add Page
                </p>
                <button
                  type="submit"
                  onClick={() => {
                    router.push("/editpage");
                  }}
                  className="mt-7 flex  items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  + Add Page
                </button>
              </div>

              <div className="hidden lg:block">
                {" "}
                <Image alt="map" className="" src={lodingPic}></Image>
              </div>
            </div>
          </div>
        )}

        {blogs.blog && blogs.blog.length > 0 && (
          <div className="flex flex-col w-full">
            <div className="flex p-6 w-full justify-center h-fit  border-b-2">
              <RiMenu2Fill className="text-xl me-5 mt-2" />

              <div className="flex flex-col">
                <p className="font-medium text-xl mt-1 mb-1 me-5">Pages</p>
                <span className="font-light text-xs ">
                  Creat and publish pages
                </span>
              </div>

              <ul className="flex ms-auto">
                <li>
                  <button
                    onClick={() => {
                      router.push("/editpage");
                    }}
                    className="bg-blue-600 text-white px-3 mt-2  rounded p-1 me-3"
                  >
                    + Add Page
                  </button>
                </li>
              </ul>
              <hr />
            </div>

            <div className="h-auto">
              <div className="flex flex-col md:flex-row p-8 ">
                <div className="">
                  <div className="mt-2 flex border-2 focus:ring-0  rounded-md">
                    <CiSearch className="text-2xl mt-2 text-gray-400" />
                    <input
                      id="searchInput"
                      name="searchInput"
                      type="searchInput"
                      value={data.searchInput}
                      autoComplete="searchInput"
                      placeholder="Search"
                      onChange={onChange}
                      required
                      className="block w-full  py-1.5 px-2 text-gray-900 shadow-sm  placeholder:text-gray-400   sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="mt-4 ms-4 text-gray-400 font-normal text-sm">
                  {blogs.blog && filterBlogs.length} records
                </div>

                <div className="flex md:ms-auto mt-5 justify-center items-center">
                  <div className="flex  md:me-8">
                    <label
                      htmlFor="statusInput"
                      className="block font-normal me-3 leading-6 text-gray-400"
                    >
                      Status
                    </label>

                    <select
                      id="statusInput"
                      name="statusInput"
                      value={data.statusInput}
                      onChange={onChange}
                      className="h-fit rounded-md bg-transparent  sm:text-sm"
                    >
                      <option value="">All</option>
                      <option>Draft</option>
                      <option>Scheduled</option>
                      <option>Published</option>
                    </select>
                  </div>

                  <div className="flex">
                    <label
                      htmlFor="createdBy"
                      className="block font-normal me-5 leading-6 text-gray-400"
                    >
                      Created By
                    </label>

                    <select
                      id="authorInput"
                      name="authorInput"
                      value={data.authorInput}
                      onChange={onChange}
                      className="h-fit rounded-md  bg-transparent  sm:text-sm"
                    >
                      <option value="">All</option>
                      {blogs.blog &&
                        [
                          ...new Set(blogs.blog.map((item) => item.createdBy)),
                        ].map((createdBy) => (
                          <option key={createdBy}>{createdBy}</option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-8 w-full h-screen overflow-auto">
                <table className=" w-full ">
                  <thead className="pb-2">
                    <tr className="font-normal border-b-2 h-fit">
                      <th className="px-2 text-start font-medium text-gray-500">
                        Title
                      </th>
                      <th className="px-2  text-start font-medium text-gray-500">
                        URL
                      </th>
                      <th className="text-start font-medium text-gray-500">
                        Created By
                      </th>
                      <th className="px-2  text-start font-medium text-gray-500">
                        Created At
                      </th>
                      <th className="px-2 text-start font-medium text-gray-500">
                        Modified By
                      </th>
                      <th className="px-2 text-start font-medium text-gray-500">
                        Modified At
                      </th>
                      <th className="px-2 text-start font-medium text-gray-500">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterBlogs.map((item, index) => {
                      return (
                        <tr
                          key={index}
                          className="font-normal border-b-2 h-fit"
                        >
                          <td>
                            <div className="flex">
                              <div> {item.title}</div>
                              <div className="ms-auto">
                                <Menu as="div" className="relative ml-3 ">
                                  <div>
                                    <Menu.Button
                                      onClick={() => setSelectBlogId(item._id)}
                                      className="relative flex rounded-sm   p-1 px-2 border-2 me-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-600"
                                    >
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
                                    <Menu.Items className="absolute ms-auto right-0 z-10 mt-2 w-35 origin-top-right rounded-md bg-white py-1 shadow-lg focus:outline-none">
                                      <Menu.Item>
                                        {({ active }) => (
                                          <button
                                            onClick={() => {
                                              router.push(
                                                `/editpage?id=${selectBlogId}`
                                              );
                                            }}
                                            className={classNames(
                                              active ? "bg-gray-100" : "",
                                              "block px-4 py-2  text-sm text-gray-700"
                                            )}
                                          >
                                            Edit
                                          </button>
                                        )}
                                      </Menu.Item>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <button
                                            onClick={handleDelete}
                                            className={classNames(
                                              active ? "bg-gray-100" : "",
                                              "block px-4 py-2 text-sm text-red-700"
                                            )}
                                          >
                                            Delete
                                          </button>
                                        )}
                                      </Menu.Item>
                                    </Menu.Items>
                                  </Transition>
                                </Menu>
                              </div>
                            </div>
                          </td>
                          <td>{item.url}</td>
                          <td>{item.createdBy}</td>
                          <td>{item.createdAt}</td>
                          <td>{item.modifiedBy}</td>
                          <td> {item.updatedAt}</td>
                          <td className="text-center">
                            <div
                              className={`${
                                item.status === "draft"
                                  ? "bg-yellow-100 rounded text-yellow-600"
                                  : item.status === "scheduled"
                                  ? "bg-blue-100 rounded text-blue-600"
                                  : item.status === "published"
                                  ? "bg-green-100 rounded text-green-600"
                                  : ""
                              } m-2 p-1 px-2 w-fit  text-center`}
                            >
                              {item.status}
                            </div>
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
