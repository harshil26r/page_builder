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

      <div className="relative flex min-h-screen items-center justify-center bg-[#070a12] bg-grid-pattern overflow-hidden px-4 py-12">
        {/* Decorative Background Glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 rounded-full filter blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full filter blur-[100px]" />

        <div className="relative z-10 w-full max-w-lg">
          <div className="glass-panel-elevated p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl">
            {step === "form" ? (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 text-white font-mono font-bold text-xl mb-4 shadow-lg shadow-indigo-500/20">
                    A
                  </div>
                  <h2 className="text-3xl font-extrabold tracking-tight gradient-text-aura">
                    Create Account
                  </h2>
                  <p className="text-slate-400 mt-2 text-xs font-medium">
                    Build, publish, and style high-performance glassmorphic pages
                  </p>
                </div>

                <form className="space-y-4" onSubmit={handleSendOtp}>
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1"
                    >
                      User Name <span className="text-cyan-400">*</span>
                    </label>
                    <div>
                      <input
                        id="username"
                        value={data.username}
                        onChange={onChange}
                        name="username"
                        type="text"
                        placeholder="John Doe"
                        className="block w-full rounded-2xl border border-white/10 bg-slate-950/70 py-2.5 px-4 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                      />
                    </div>
                    {errors.username && (
                      <span className="text-rose-400 text-xs mt-1 block">
                        {errors.username}
                      </span>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1"
                    >
                      Email Address <span className="text-cyan-400">*</span>
                    </label>
                    <div>
                      <input
                        id="email"
                        value={data.email}
                        onChange={onChange}
                        name="email"
                        type="text"
                        placeholder="you@example.com"
                        className="block w-full rounded-2xl border border-white/10 bg-slate-950/70 py-2.5 px-4 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                      />
                    </div>
                    {errors.email && (
                      <span className="text-rose-400 text-xs mt-1 block">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1"
                    >
                      Password <span className="text-cyan-400">*</span>
                    </label>
                    <div>
                      <input
                        id="password"
                        value={data.password}
                        onChange={onChange}
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="block w-full rounded-2xl border border-white/10 bg-slate-950/70 py-2.5 px-4 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                      />
                    </div>
                    {errors.password && (
                      <span className="text-rose-400 text-xs mt-1 block">
                        {errors.password}
                      </span>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="cPassword"
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1"
                    >
                      Confirm Password <span className="text-cyan-400">*</span>
                    </label>
                    <div>
                      <input
                        id="cPassword"
                        value={data.cPassword}
                        onChange={onChange}
                        name="cPassword"
                        type="password"
                        placeholder="••••••••"
                        className="block w-full rounded-2xl border border-white/10 bg-slate-950/70 py-2.5 px-4 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                      />
                    </div>
                    {errors.cPassword && (
                      <span className="text-rose-400 text-xs mt-1 block">
                        {errors.cPassword}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center pt-1">
                    <input
                      id="isSubscribe"
                      name="isSubscribe"
                      type="checkbox"
                      checked={data.isSubscribe}
                      onChange={(e) =>
                        setData({ ...data, isSubscribe: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-white/10 bg-slate-950 text-cyan-400 focus:ring-cyan-400/40"
                    />
                    <label
                      htmlFor="isSubscribe"
                      className="ms-2 text-xs text-slate-400 cursor-pointer hover:text-slate-200 transition"
                    >
                      Subscribe to product updates & releases
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 py-3 px-4 text-xs font-bold text-white shadow-xl shadow-indigo-600/25 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all mt-6"
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

                  <div className="mt-6 text-center text-xs text-slate-400 font-medium">
                    Already have an account?{" "}
                    <Link
                      href="/auth/login"
                      className="text-cyan-400 hover:text-cyan-300 font-bold underline transition"
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
