"use client";
import { useState, useEffect } from "react";

export default function OtpVerification({ email, onVerify, onBack, onResend }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState("");

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp.trim() || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await onVerify(otp);
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    if (timer > 0) return;
    setError("");
    setLoading(true);
    try {
      await onResend();
      setOtp("");
      setTimer(60);
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Verify Email
        </h2>
        <p className="text-gray-400 mt-2 text-sm">
          We have sent a verification code to
        </p>
        <p className="text-indigo-400 font-medium text-sm mt-1">{email}</p>
      </div>

      <form className="space-y-6" onSubmit={handleVerifyOtp}>
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-300">
            One-Time Password (OTP)
          </label>
          <div className="mt-2 relative">
            <input
              id="otp"
              value={otp}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                if (val.length <= 6) {
                  setOtp(val);
                }
              }}
              name="otp"
              type="text"
              placeholder="••••••"
              maxLength="6"
              className="block w-full rounded-xl border border-gray-700 bg-gray-900/60 py-3.5 px-4 text-center text-3xl font-bold tracking-[0.75em] text-white shadow-inner placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 backdrop-blur-sm"
              autoFocus
            />
          </div>
          {error && <p className="text-red-400 text-xs mt-1.5 text-center">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full flex justify-center items-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3.5 px-4 text-sm font-semibold text-white shadow-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0 transition duration-150"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            "Verify & Register"
          )}
        </button>

        <div className="flex flex-col space-y-4 text-center">
          <button
            type="button"
            onClick={onBack}
            className="text-gray-400 hover:text-white text-sm font-medium transition duration-200"
          >
            ← Back to details
          </button>

          <hr className="border-gray-800" />

          <div className="text-sm">
            <span className="text-gray-500">Didn&apos;t receive the code?</span>{" "}
            {timer > 0 ? (
              <span className="text-indigo-400 font-medium">Resend in {timer}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-indigo-400 hover:text-indigo-300 underline font-semibold transition duration-200"
              >
                Resend Code
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
