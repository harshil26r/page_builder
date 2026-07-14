"use client";
import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { STARTER_TEMPLATES } from "@/config/templates";
import { HiSparkles, HiOutlineCheckCircle, HiX } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function TemplateLibraryModal({ isOpen, onClose, onSelectTemplate }) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCreating, setIsCreating] = useState(false);

  const categories = ["All", "SaaS & AI", "Portfolio", "Events", "Agency"];

  const filteredTemplates = selectedCategory === "All"
    ? STARTER_TEMPLATES
    : STARTER_TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleUseTemplate = async (template) => {
    setIsCreating(true);
    try {
      // Create a draft page populated with template data
      const randomSuffix = Math.floor(Math.random() * 900) + 100;
      const title = `${template.name} ${randomSuffix}`;
      const url = `/${template.id}-${randomSuffix}`;

      const res = await fetch("/api/blog/creatBlog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subText: template.description,
          url,
          status: "draft",
          blocks: template.blocks,
          theme: template.theme,
          fontFamily: template.fontFamily,
          bgColor: template.bgColor,
          textColor: template.textColor,
          metaTitle: title,
          metaDescription: template.description,
        }),
      });

      const response = await res.json();
      if (response.success && response.id) {
        toast.success(`Created page from "${template.name}" template!`, {
          position: "bottom-center",
        });
        onClose();
        router.push(`/studio?id=${response.id}`);
      } else {
        toast.error(response.error || "Failed to create page from template");
      }
    } catch (err) {
      toast.error("Network error creating template page");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 font-sans" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-3xl bg-slate-900 border border-white/15 text-left shadow-2xl transition-all w-full max-w-4xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 bg-slate-950/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      <HiSparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <Dialog.Title as="h3" className="text-lg font-bold text-white tracking-wide">
                        Starter Template Library
                      </Dialog.Title>
                      <p className="text-xs text-slate-400">
                        Choose a pre-designed layout preset to launch your page instantly
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
                  >
                    <HiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Category Filter Tabs */}
                <div className="px-6 py-3 border-b border-white/5 bg-slate-950/30 flex items-center gap-2 overflow-x-auto custom-scrollbar">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                        selectedCategory === cat
                          ? "bg-cyan-500 text-slate-950 font-extrabold shadow-md shadow-cyan-500/20"
                          : "bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Template Cards Grid */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="group relative rounded-2xl border border-white/10 bg-slate-950/60 p-5 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 hover:shadow-xl hover:shadow-cyan-500/5"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            {template.category}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                            {template.blocks.length} Blocks
                          </span>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${template.previewColor} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md`}>
                            {template.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-base text-white group-hover:text-cyan-300 transition-colors">
                              {template.name}
                            </h4>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {template.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Included blocks chips */}
                      <div className="pt-3 border-t border-white/5 flex flex-wrap gap-1.5">
                        {template.blocks.map((b) => (
                          <span key={b.id} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-white/5 font-mono capitalize">
                            {b.type}
                          </span>
                        ))}
                      </div>

                      {/* Action Button */}
                      <button
                        type="button"
                        onClick={() => handleUseTemplate(template)}
                        disabled={isCreating}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-cyan-500/15 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <HiOutlineCheckCircle className="w-4 h-4 text-slate-950" />
                        <span>{isCreating ? "Creating Page..." : "Use This Template"}</span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/10 bg-slate-950/60 text-xs text-slate-400 flex items-center justify-between">
                  <span>Templates automatically include responsive layouts, colors, and blocks.</span>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
