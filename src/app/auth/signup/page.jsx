"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const router = useRouter();

  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    cPassword: "",
    isSubscribe: false,
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/");
    }
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
    e.preventDefault();
    let isValid = true;
    const newErrors = {};

    // Username validation
    if (!data.username.trim()) {
      newErrors.username = "Name is required";
      isValid = false;
    } else if (data.username.trim().length < 5) {
      newErrors.username = "Name is minimum 4 character";
      isValid = false;
    }

    // Email validation
    if (!data.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        data.email,
      )
    ) {
      newErrors.email = "Invalid email address";
      isValid = false;
    }

    // Password validation
    if (!data.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (data.password.trim().length < 8) {
      newErrors.password = "Password is minimum 8 character";
      isValid = false;
    }
    // Password validation
    if (!data.cPassword.trim()) {
      newErrors.cPassword = "Confirm Password is required";
      isValid = false;
    } else if (data.cPassword.trim() !== data.password) {
      newErrors.cPassword = "Confirm Password must be same as Password";
      isValid = false;
    }

    if (isValid) {
      handleSubmit();
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
          isSubscribe: data.isSubscribe,
          role: "admin", // preserve the role field
        }),
      });

      const response = await res.json();
      if (response.success) {
        toast.success("Your account has been created successfully!", {
          position: "bottom-center",
          autoClose: 1000,
        });
        setTimeout(() => {
          router.push("/auth/login");
        }, 1000);
      } else {
        toast.error("User already exists!", {
          position: "bottom-center",
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error("Signup failed!", {
        position: "bottom-center",
        autoClose: 1000,
      });
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
        theme="light"
      />

      <div className="flex min-h-screen justify-center items-center flex-col w-full px-3  mb-5 lg:px-8">
        <div className="sm:mx-auto sm:max-w-sm flex">
          <h2 className="mt-2 text-center text-3xl font-semibold leading-9 tracking-tight text-gray-800">
            Rapid Page Builder
          </h2>
        </div>

        <div className="mt-16 border-2  py-10 px-10 rounded sm:mx-auto  md:w-1/2 sm:w-full ">
          <div className="font-normal text-3xl mb-6">Register</div>
          <form className="space-y-6" onSubmit={validateForm} method="POST">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                User name <span className="text-red-500">*</span>
              </label>

              <div className="mt-2">
                <input
                  id="username"
                  value={data.username}
                  onChange={onChange}
                  name="username"
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                />
              </div>
              {errors.username && (
                <span className="text-red-600">{errors.username}</span>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  value={data.email}
                  onChange={onChange}
                  name="email"
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
              {errors.email && (
                <span className="text-red-600">{errors.email}</span>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  value={data.password}
                  onChange={onChange}
                  name="password"
                  type="password"
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
              {errors.password && (
                <span className="text-red-600">{errors.password}</span>
              )}
            </div>
            <div>
              <label
                htmlFor="cPassword"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  id="cPassword"
                  value={data.cPassword}
                  onChange={onChange}
                  name="cPassword"
                  type="password"
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
              {errors.cPassword && (
                <span className="text-red-600">{errors.cPassword}</span>
              )}
            </div>

            <div className="flex items-center mt-4">
              <input
                id="isSubscribe"
                name="isSubscribe"
                type="checkbox"
                checked={data.isSubscribe}
                onChange={(e) =>
                  setData({ ...data, isSubscribe: e.target.checked })
                }
                className=" w-4 rounded border-gray-100  text-indigo-600 focus:ring-indigo-600"
              />
              <p className="ms-2 text-gray-500">Subscribe to our newsletter</p>
            </div>
            <div className="mt-2 text-gray-500">
              Your personal data will be used to support your experience
              throughout this website, to manage access to your account, and for
              other purposes described in our{" "}
              <Link
                href="/forgot"
                className=" underline text-blue-600 hover:text-blue-500"
              >
                privacy policy.
              </Link>
            </div>

            <button
              type="submit"
              className="flex justify-center rounded-md bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Register
            </button>
            <div className="mt-4 text-center text-gray-500">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className=" underline text-blue-600 hover:text-blue-500"
              >
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
