"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OtpVerification from "@/components/OtpVerification";

const Signup = () => {
  const router = useRouter();

  const [step, setStep] = useState("form"); // "form" | "otp"
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    cPassword: "",
    isSubscribe: false,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const response = await res.json();
        if (response.success) {
          router.push("/");
        }
      } catch (err) {
        // Not authenticated, stay on page
      }
    };
    checkAuth();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: value,
    });

    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Username validation
    if (!data.username.trim()) {
      newErrors.username = "Name is required";
      isValid = false;
    } else if (data.username.trim().length < 5) {
      newErrors.username = "Name must be at least 5 characters";
      isValid = false;
    }

    // Email validation
    if (!data.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        data.email
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
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    // Confirm Password validation
    if (!data.cPassword.trim()) {
      newErrors.cPassword = "Confirm Password is required";
      isValid = false;
    } else if (data.cPassword.trim() !== data.password) {
      newErrors.cPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      const response = await res.json();
      if (response.success) {
        toast.success("OTP sent to your email successfully!");
        setStep("otp");
      } else {
        toast.error(response.error || "Failed to send OTP code.");
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otpCode) => {
    try {
      const res = await fetch(`/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email, otp: otpCode }),
      });

      const response = await res.json();
      if (response.success) {
        await handleCompleteSignup();
      } else {
        throw new Error(response.error || "Invalid OTP code");
      }
    } catch (err) {
      throw err;
    }
  };

  const handleResendOtp = async () => {
    const res = await fetch(`/api/auth/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: data.email }),
    });
    const response = await res.json();
    if (!response.success) {
      throw new Error(response.error || "Failed to resend OTP");
    }
  };

  const handleCompleteSignup = async () => {
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
        toast.error(response.error || "Signup failed!", {
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
        theme="dark"
      />

      <div className="relative flex min-h-screen items-center justify-center bg-gray-950 overflow-hidden px-4 py-12">
        {/* Decorative Background Blobs */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600/30 rounded-full filter blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-600/25 rounded-full filter blur-[100px]" />

        <div className="relative z-10 w-full max-w-lg">
          <div className="backdrop-blur-xl bg-gray-900/60 border border-gray-800 p-8 md:p-10 rounded-2xl shadow-2xl">
            {step === "form" ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Create Account
                  </h2>
                  <p className="text-gray-400 mt-2 text-sm">
                    Build beautiful responsive pages in seconds
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleSendOtp}>
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-300"
                    >
                      User name <span className="text-red-400">*</span>
                    </label>
                    <div className="mt-1.5">
                      <input
                        id="username"
                        value={data.username}
                        onChange={onChange}
                        name="username"
                        type="text"
                        placeholder="John Doe"
                        className="block w-full rounded-xl border border-gray-800 bg-gray-900/50 py-2.5 px-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      />
                    </div>
                    {errors.username && (
                      <span className="text-red-400 text-xs mt-1 block">
                        {errors.username}
                      </span>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Email address <span className="text-red-400">*</span>
                    </label>
                    <div className="mt-1.5">
                      <input
                        id="email"
                        value={data.email}
                        onChange={onChange}
                        name="email"
                        type="text"
                        placeholder="you@example.com"
                        className="block w-full rounded-xl border border-gray-800 bg-gray-900/50 py-2.5 px-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      />
                    </div>
                    {errors.email && (
                      <span className="text-red-400 text-xs mt-1 block">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Password <span className="text-red-400">*</span>
                    </label>
                    <div className="mt-1.5">
                      <input
                        id="password"
                        value={data.password}
                        onChange={onChange}
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="block w-full rounded-xl border border-gray-800 bg-gray-900/50 py-2.5 px-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      />
                    </div>
                    {errors.password && (
                      <span className="text-red-400 text-xs mt-1 block">
                        {errors.password}
                      </span>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="cPassword"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Confirm Password <span className="text-red-400">*</span>
                    </label>
                    <div className="mt-1.5">
                      <input
                        id="cPassword"
                        value={data.cPassword}
                        onChange={onChange}
                        name="cPassword"
                        type="password"
                        placeholder="••••••••"
                        className="block w-full rounded-xl border border-gray-800 bg-gray-900/50 py-2.5 px-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      />
                    </div>
                    {errors.cPassword && (
                      <span className="text-red-400 text-xs mt-1 block">
                        {errors.cPassword}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center mt-2">
                    <input
                      id="isSubscribe"
                      name="isSubscribe"
                      type="checkbox"
                      checked={data.isSubscribe}
                      onChange={(e) =>
                        setData({ ...data, isSubscribe: e.target.checked })
                      }
                      className="w-4.5 h-4.5 rounded border-gray-800 bg-gray-900 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-gray-900"
                    />
                    <label
                      htmlFor="isSubscribe"
                      className="ms-2.5 text-sm text-gray-400 cursor-pointer hover:text-gray-300 transition duration-150"
                    >
                      Subscribe to our newsletter
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 px-4 text-sm font-semibold text-white shadow-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transform hover:-translate-y-0.5 active:translate-y-0 transition duration-150 mt-6"
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      "Send Verification Code"
                    )}
                  </button>

                  <div className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link
                      href="/auth/login"
                      className="text-indigo-400 hover:text-indigo-300 font-semibold underline transition duration-150"
                    >
                      Sign In
                    </Link>
                  </div>
                </form>
              </>
            ) : (
              <OtpVerification
                email={data.email}
                onVerify={handleVerifyOtp}
                onBack={() => setStep("form")}
                onResend={handleResendOtp}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
