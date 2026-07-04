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
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-slate-400">{subtitle}</p>}
        </div>

        {submitted ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <HiCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Thank you! Message Sent.</h3>
            <p className="text-xs text-slate-400 mt-1">We have received your submission and will respond shortly.</p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-5 text-xs text-indigo-400 hover:underline font-semibold"
            >
              Send another response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Jane Doe"
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/90 py-3 px-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                  Work Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jane@company.com"
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/90 py-3 px-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                Company Name
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Acme Corp"
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/90 py-3 px-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about your project or inquiry..."
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/90 py-3 px-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm active:scale-[0.96] transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <HiPaperAirplane className="rotate-90" /> {buttonText}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
