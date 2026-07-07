"use client";
import React, { useState } from "react";
import { HiCheck, HiPaperAirplane } from "react-icons/hi";

export default function FormBlock({ data }) {
  const title = data?.title || "Get In Touch";
  const subtitle = data?.subtitle || "Fill out the form below and our team will get back to you within 24 hours.";
  const buttonText = data?.buttonText || "Send Message";

  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto font-sans">
      <div className="glass-panel rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs sm:text-base text-slate-300 font-normal">{subtitle}</p>}
        </div>

        {submitted ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-10 text-center animate-in fade-in zoom-in-95 duration-300 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/40 shadow-inner">
              <HiCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Thank you! Message Sent.</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              We have received your submission and will respond shortly.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="pt-2 text-xs text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
            >
              Send another response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-2 text-[11px]">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Jane Doe"
                  className="w-full glass-input rounded-2xl py-3.5 px-4 text-white placeholder:text-slate-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase tracking-wider mb-2 text-[11px]">
                  Work Email <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jane@company.com"
                  className="w-full glass-input rounded-2xl py-3.5 px-4 text-white placeholder:text-slate-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-2 text-[11px]">
                Company Name
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Acme Corp"
                className="w-full glass-input rounded-2xl py-3.5 px-4 text-white placeholder:text-slate-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider mb-2 text-[11px]">
                Message <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about your project or inquiry..."
                className="w-full glass-input rounded-2xl py-3.5 px-4 text-white placeholder:text-slate-500 font-medium resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-black text-sm active:scale-[0.97] transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <HiPaperAirplane className="rotate-90 text-base" /> {buttonText}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
