"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "pipaliyaharshil26@gmail.com",
    password: "12345678",
  });
  
  const [error, setError] = useState("");

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
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!data.email.trim() || !data.password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const response = await res.json();
      if (response.success) {
        toast.success("Login successful! Redirecting...", {
          position: "bottom-center",
          autoClose: 1000,
        });
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        setError(response.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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

        <div className="relative z-10 w-full max-w-md">
          <div className="glass-panel-elevated p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 text-white font-mono font-bold text-xl mb-4 shadow-lg shadow-indigo-500/20">
                A
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight gradient-text-aura">
                Welcome Back
              </h2>
              <p className="text-slate-400 mt-2 text-xs font-medium">
                Log in to access your Aura Studio pages and workspace
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit} method="POST">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                >
                  Email Address <span className="text-cyan-400">*</span>
                </label>
                <div>
                  <input
                    id="email"
                    value={data.email}
                    onChange={onChange}
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    className="block w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 px-4 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                  >
                    Password <span className="text-cyan-400">*</span>
                  </label>
                </div>
                <div>
                  <input
                    id="password"
                    value={data.password}
                    onChange={onChange}
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    required
                    className="block w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 px-4 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
                  />
                </div>
              </div>

              {error && (
                <div className="text-rose-400 text-xs font-medium text-center bg-rose-950/40 border border-rose-500/30 py-2.5 px-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 py-3 px-4 text-xs font-bold text-white shadow-xl shadow-indigo-600/25 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  "Log In to Workspace"
                )}
              </button>

              <div className="mt-6 text-center text-xs text-slate-400 font-medium">
                New creator?{" "}
                <Link
                  href="/auth/signup"
                  className="text-cyan-400 hover:text-cyan-300 font-bold underline transition"
                >
                  Create an account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
