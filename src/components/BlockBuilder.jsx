"use client";
import React, { useState, useRef } from "react";
import RichTextEditor from "@/components/RichTextEditor";
import BlockStyleEditor from "@/components/BlockStyleEditor";
import {
  HiPlus,
  HiTrash,
  HiChevronUp,
  HiChevronDown,
  HiDuplicate,
  HiSparkles,
  HiOutlinePhotograph,
  HiQuestionMarkCircle,
  HiChatAlt2,
  HiLightningBolt,
  HiDocumentText,
  HiViewGrid,
  HiMenu,
  HiStar,
  HiPhotograph,
  HiCurrencyDollar,
  HiChartBar,
  HiCollection,
  HiMail,
} from "react-icons/hi";

const BLOCK_TYPES = [
  {
    type: "hero",
    label: "Hero Banner",
    badge: "Popular",
    icon: HiSparkles,
    gradient: "from-indigo-500 to-purple-600",
    description: "Header section with image, title, and primary call-to-action.",
    defaultData: {
      title: "Build Breathtaking Pages in Minutes",
      subtitle: "The ultra-fast, mobile-first page builder for modern creators.",
      ctaText: "Explore Features 🚀",
      ctaLink: "#explore",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      imageAlign: "right",
    },
  },
  {
    type: "pricing",
    label: "Pricing Table",
    badge: "Conversion",
    icon: HiCurrencyDollar,
    gradient: "from-emerald-500 to-teal-600",
    description: "Tiered pricing cards with monthly/annual billing toggle.",
    defaultData: {
      title: "Simple, Transparent Pricing",
      subtitle: "Choose the perfect plan for your team. Scale as you grow.",
      plans: [
        {
          name: "Starter",
          description: "Ideal for solo creators and small side projects.",
          monthlyPrice: 19,
          annualPrice: 15,
          popular: false,
          buttonText: "Start Free Trial",
          features: ["Up to 3 Published Pages", "Standard Analytics", "Community Support", "SSL Encryption"],
        },
        {
          name: "Pro Studio",
          description: "Best for growing businesses & design teams.",
          monthlyPrice: 49,
          annualPrice: 39,
          popular: true,
          buttonText: "Upgrade to Pro",
          features: ["Unlimited Published Pages", "Advanced Conversion Analytics", "Custom Domain Binding", "Priority 24/7 Support", "Export Clean Next.js Code"],
        },
        {
          name: "Enterprise",
          description: "For agencies and large scale operations.",
          monthlyPrice: 149,
          annualPrice: 119,
          popular: false,
          buttonText: "Contact Sales",
          features: ["Everything in Pro Studio", "Dedicated Account Manager", "99.9% Uptime SLA", "Custom Block Development", "Team Workspaces & Roles"],
        },
      ],
    },
  },
  {
    type: "stats",
    label: "Stats & Metrics",
    badge: "Social Proof",
    icon: HiChartBar,
    gradient: "from-purple-500 to-pink-600",
    description: "Highlight key metrics, achievements, and impact numbers.",
    defaultData: {
      title: "Proven Impact & Scale",
      subtitle: "Trusted by thousands of creators and organizations globally.",
      items: [
        { value: "99.9%", label: "Uptime SLA", description: "Global edge network reliability", icon: "⚡" },
        { value: "10M+", label: "Page Views", description: "Monthly requests served lightning fast", icon: "🚀" },
        { value: "50k+", label: "Active Creators", description: "Building & shipping every day", icon: "👥" },
        { value: "< 100ms", label: "Global Latency", description: "Blazing fast edge responses", icon: "🌐" },
      ],
    },
  },
  {
    type: "logocloud",
    label: "Logo Cloud",
    badge: "Trust",
    icon: HiCollection,
    gradient: "from-blue-500 to-cyan-600",
    description: "Display client, sponsor, or technology partner logos.",
    defaultData: {
      headline: "POWERING INNOVATION AT LEADING COMPANIES",
      logos: [
        { name: "Vercel", text: "VERCEL" },
        { name: "Stripe", text: "STRIPE" },
        { name: "Linear", text: "LINEAR" },
        { name: "Raycast", text: "RAYCAST" },
        { name: "Supabase", text: "SUPABASE" },
        { name: "Figma", text: "FIGMA" },
      ],
    },
  },
  {
    type: "form",
    label: "Lead Form",
    badge: "Leads",
    icon: HiMail,
    gradient: "from-rose-500 to-orange-600",
    description: "Capture user inquiries, demo requests, and newsletter signups.",
    defaultData: {
      title: "Get In Touch",
      subtitle: "Fill out the form below and our team will get back to you within 24 hours.",
      buttonText: "Send Message",
    },
  },
  {
    type: "features",
    label: "Feature Grid",
    badge: "Essential",
    icon: HiLightningBolt,
    gradient: "from-amber-500 to-orange-600",
    description: "Showcase product features in a clean multi-column grid.",
    defaultData: {
      title: "Why Creators Love Us",
      subtitle: "Engineered for speed, aesthetic perfection, and conversion.",
      items: [
        { title: "Lightning Velocity", description: "Sub-second load speeds with edge network distribution.", icon: "⚡" },
        { title: "Mobile Optimized", description: "Pixel-perfect touch experiences across all screens.", icon: "📱" },
        { title: "SEO Ready", description: "Automated OpenGraph metadata and search engine indexing.", icon: "🎯" },
      ],
    },
  },
  {
    type: "cta",
    label: "Call To Action",
    badge: "Conversion",
    icon: HiViewGrid,
    gradient: "from-emerald-500 to-teal-600",
    description: "High-impact banner to drive signups or purchases.",
    defaultData: {
      headline: "Ready to launch your vision?",
      description: "Start crafting stunning landing pages with Rapid Page Builder today.",
      buttonText: "Get Started Now",
      buttonLink: "#signup",
    },
  },
  {
    type: "testimonials",
    label: "Testimonials",
    badge: "Social Proof",
    icon: HiChatAlt2,
    gradient: "from-pink-500 to-rose-600",
    description: "Customer quotes with ratings, roles, and avatar images.",
    defaultData: {
      title: "Loved by 10,000+ Creators",
      items: [
        { quote: "This page builder transformed how fast we ship high-converting campaigns!", name: "Alex Rivera", role: "Product Lead", rating: 5, avatar: "" },
        { quote: "Sensational UI, ultra-responsive output, and zero bloat.", name: "Sophia Zhang", role: "Design Director", rating: 5, avatar: "" },
      ],
    },
  },
  {
    type: "faq",
    label: "FAQ Accordion",
    badge: "Support",
    icon: HiQuestionMarkCircle,
    gradient: "from-cyan-500 to-blue-600",
    description: "Expandable questions and answers list.",
    defaultData: {
      title: "Frequently Asked Questions",
      items: [
        { question: "Is hosting included with published pages?", answer: "Yes! Every page is deployed instantly on high-speed global infrastructure." },
        { question: "Can I export custom HTML or code?", answer: "Absolutely. You can customize, export, or connect custom domain slugs anytime." },
      ],
    },
  },
  {
    type: "gallery",
    label: "Media Gallery",
    badge: "Visuals",
    icon: HiOutlinePhotograph,
    gradient: "from-violet-500 to-indigo-600",
    description: "Grid showcase of images, portfolios, or product shots.",
    defaultData: {
      title: "Product Showcase",
      columns: 3,
      images: [
        { url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80", caption: "Analytics Dashboard" },
        { url: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=800&q=80", caption: "Mobile App Layout" },
      ],
    },
  },
  {
    type: "markdown",
    label: "Custom Markdown",
    badge: "Code",
    icon: HiDocumentText,
    gradient: "from-slate-500 to-slate-700",
    description: "Rich text block for custom markdown formatting and code snippets.",
    defaultData: {
      content: "### Custom Content Block\n\nAdd your custom text, markdown markup, or code snippets here.",
    },
  },
];

export default function BlockBuilder({ blocks = [], onChange, readOnly = false }) {
  const [activeBlockIndex, setActiveBlockIndex] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [draggedAddType, setDraggedAddType] = useState(null); // ponytail: React state fallback if browser strips dataTransfer payload

  // Tracks nested-element enter/leave counts per drop-zone index so the
  // "drop here" indicator doesn't flicker or get stuck when the pointer
  // crosses child elements inside a zone (buttons, icons, text, etc).
  const dragCounterRef = useRef({});

  const resetDragState = () => {
    dragCounterRef.current = {};
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDraggedAddType(null);
  };

  const addBlock = (blockType) => {
    const blockDef = BLOCK_TYPES.find((b) => b.type === blockType);
    if (!blockDef) return;
    const newBlock = {
      id: "block_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      type: blockType,
      data: JSON.parse(JSON.stringify(blockDef.defaultData)),
    };
    const updated = [...blocks, newBlock];
    onChange(updated);
    setActiveBlockIndex(updated.length - 1);
  };

  const removeBlock = (index) => {
    const updated = blocks.filter((_, i) => i !== index);
    onChange(updated);
    if (activeBlockIndex === index) setActiveBlockIndex(null);
  };

  const duplicateBlock = (index) => {
    const target = blocks[index];
    const newBlock = {
      ...JSON.parse(JSON.stringify(target)),
      id: "block_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
    };
    const updated = [...blocks];
    updated.splice(index + 1, 0, newBlock);
    onChange(updated);
    setActiveBlockIndex(index + 1);
  };

  const moveBlock = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const updated = [...blocks];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    onChange(updated);
    setActiveBlockIndex(targetIndex);
  };

  // Ensure every block has a stable unique ID for React keys and DnD engine
  const safeBlocks = blocks.map((b, idx) => ({
    ...b,
    id: b.id || b._id || `block_stab_${idx}_${b.type}`,
  }));

  // ---------------------------------------------------------------------
  // Drag and Drop Event Handlers
  //
  // Design notes on the fixes vs. the previous version:
  // 1. `dragOverIndex` is now updated on dragenter/dragleave (with a
  //    per-zone counter) instead of on every dragover event. dragover
  //    fires continuously (dozens of times/sec) which caused needless
  //    re-renders and made the "drop here" indicator flicker.
  // 2. Every draggable element now calls `resetDragState` on dragend as a
  //    failsafe, so a cancelled drag (dropped outside any valid zone,
  //    or Escape pressed) can't leave a stuck "drop here" indicator.
  // 3. The reorder math had a no-op ternary that always inserted at
  //    `dropIndex` regardless of direction. Once the dragged item is
  //    spliced out of the array, every index after it shifts down by
  //    one — so moving an item *forward* in the list must insert at
  //    `dropIndex - 1`, not `dropIndex`. That's the main bug that made
  //    reordering land in the wrong slot.
  // ---------------------------------------------------------------------

  const handleDragStart = (e, index, blockId) => {
    e.stopPropagation();
    dragCounterRef.current = {};
    setDraggedIndex(index);
    setDragOverIndex(null);
    setActiveBlockIndex(null); // ponytail: collapse blocks when drag starts
    e.dataTransfer.effectAllowed = "move";
    const payload = JSON.stringify({ action: "reorder_block", index, blockId });
    e.dataTransfer.setData("application/json", payload);
    e.dataTransfer.setData("text/plain", payload);
  };

  // Only handles preventDefault + cursor feedback; no state updates here
  // (dragover fires continuously, so state changes belong in enter/leave).
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = draggedAddType ? "copy" : "move";
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    const counts = dragCounterRef.current;
    counts[index] = (counts[index] || 0) + 1;
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e, index) => {
    const counts = dragCounterRef.current;
    counts[index] = (counts[index] || 1) - 1;
    if (counts[index] <= 0) {
      counts[index] = 0;
      setDragOverIndex((current) => (current === index ? null : current));
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounterRef.current = {};

    let payload = null;
    const jsonRaw = e.dataTransfer.getData("application/json") || e.dataTransfer.getData("text/plain");
    if (jsonRaw) {
      try {
        payload = JSON.parse(jsonRaw);
      } catch {
        /* ignore */
      }
    }

    if (!payload) {
      if (draggedAddType) {
        payload = { action: "add_block", type: draggedAddType };
      } else if (typeof draggedIndex === "number" && draggedIndex !== null) {
        payload = { action: "reorder_block", index: draggedIndex };
      }
    }

    setDragOverIndex(null);
    setDraggedIndex(null);
    setDraggedAddType(null);

    if (!payload) return;

    if (payload.action === "add_block" && payload.type) {
      const blockDef = BLOCK_TYPES.find((b) => b.type === payload.type);
      if (!blockDef) return;
      const newBlock = {
        id: "block_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        type: payload.type,
        data: JSON.parse(JSON.stringify(blockDef.defaultData)),
      };
      const updated = [...safeBlocks];
      const insertAt = dropIndex !== null && dropIndex !== undefined ? Math.min(dropIndex, updated.length) : updated.length;
      updated.splice(insertAt, 0, newBlock);
      onChange(updated);
      setActiveBlockIndex(null); // ponytail: keep collapsed on drop
    } else if (payload.action === "reorder_block") {
      let fromIndex = payload.index;
      if (payload.blockId) {
        const found = safeBlocks.findIndex((b) => b.id === payload.blockId);
        if (found !== -1) fromIndex = found;
      }
      if (fromIndex < 0 || fromIndex >= safeBlocks.length || dropIndex === null || dropIndex === undefined || fromIndex === dropIndex) return;
      const updated = [...safeBlocks];
      const [moved] = updated.splice(fromIndex, 1);
      // Fixed: previously `dropIndex > fromIndex ? dropIndex : dropIndex`
      // (a no-op). After removing the source item, everything after it
      // shifts down by one, so a forward move must target dropIndex - 1.
      const targetIndex = dropIndex > fromIndex ? dropIndex - 1 : dropIndex;
      updated.splice(targetIndex, 0, moved);
      onChange(updated);
      setActiveBlockIndex(null); // ponytail: keep collapsed on drop
    }
  };

  const updateBlockData = (index, field, value) => {
    const updated = [...blocks];
    const currentData = updated[index]?.data || updated[index]?.content || {};
    updated[index] = {
      ...updated[index],
      data: {
        ...currentData,
        [field]: value,
      },
      content: {
        ...currentData,
        [field]: value,
      },
    };
    onChange(updated);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Block Selector Toolbar */}
      {!readOnly && (
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                <HiPlus className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Add Section Block
                </h4>
                <p className="text-[11px] text-slate-400">Tap or drag any block card below to insert it into your layout</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              {blocks.length} Blocks
            </span>
          </div>

          {/* Scrollable Block Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {BLOCK_TYPES.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.type}
                  draggable
                  onDragStart={(e) => {
                    dragCounterRef.current = {};
                    setActiveBlockIndex(null); // ponytail: collapse blocks when dragging
                    setDraggedAddType(b.type);
                    const payload = JSON.stringify({ action: "add_block", type: b.type });
                    e.dataTransfer.setData("application/json", payload);
                    e.dataTransfer.setData("text/plain", payload);
                    e.dataTransfer.effectAllowed = "copy";
                  }}
                  onDragEnd={resetDragState}
                  onClick={() => addBlock(b.type)}
                  className="group flex items-start gap-3 p-3 rounded-xl border border-slate-800/80 bg-slate-950/60 hover:bg-slate-900 hover:border-indigo-500/40 text-left transition-all duration-200 cursor-grab active:cursor-grabbing select-none"
                >
                  <div
                    className={`p-2.5 rounded-xl bg-gradient-to-br ${b.gradient} text-white shadow-md group-hover:scale-110 transition-transform shrink-0`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                        {b.label}
                      </span>
                      <span className="text-[9px] font-semibold text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                        {b.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Added Blocks List with HTML5 Drag & Drop */}
      {blocks.length === 0 ? (
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 0)}
          className="text-center py-14 px-4 border-2 border-dashed border-slate-800/80 hover:border-indigo-500/60 rounded-2xl bg-slate-950/40 text-slate-500 space-y-3 transition"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <HiSparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-300">Your page layout is empty</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Drag & drop a block card from above here, or click any block card to add it to your page layout.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Page Section Stack ({blocks.length}) &mdash; Drag handle to reorder
            </span>
          </div>

          {safeBlocks.map((block, idx) => {
            const bData = block.data || block.content || {};
            block.data = bData;
            block.content = bData;
            const blockDef = BLOCK_TYPES.find((b) => b.type === block.type) || BLOCK_TYPES[0];
            const Icon = blockDef.icon;
            const isOpen = activeBlockIndex === idx;
            const isDragging = draggedIndex === idx;
            const isDragOver = dragOverIndex === idx;

            return (
              <React.Fragment key={block.id}>
                <div
                  onDragEnter={(e) => handleDragEnter(e, idx)}
                  onDragLeave={(e) => handleDragLeave(e, idx)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, idx)}
                  className={`group border rounded-2xl transition-all duration-200 overflow-hidden ${
                    isDragging ? "opacity-30 border-dashed border-indigo-500" : ""
                  } ${
                    isDragOver ? "border-indigo-500 scale-[1.01] bg-indigo-500/10 ring-2 ring-indigo-500/40" : ""
                  } ${
                    isOpen
                      ? "border-indigo-500/80 bg-slate-900 shadow-2xl shadow-indigo-500/10 ring-1 ring-indigo-500/30"
                      : "border-slate-800/90 bg-slate-950/80 hover:border-slate-700 hover:bg-slate-900/60"
                  }`}
                >
                  {/* Block Header Control Bar with Drag Handle */}
                  <div className="flex items-center justify-between p-3.5 gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {/* Drag Grip Handle - Dragging enabled exclusively on handle icon */}
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx, block.id)}
                        onDragEnd={resetDragState}
                        className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 bg-slate-900/80 transition"
                        title="Drag handle to reorder block"
                      >
                        <HiMenu className="w-4 h-4 text-indigo-400" />
                      </div>

                    <button
                      type="button"
                      onClick={() => setActiveBlockIndex(isOpen ? null : idx)}
                      className="flex items-center gap-3 text-left min-w-0 flex-1"
                    >
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${blockDef.gradient} text-white shadow-sm shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                            {blockDef.label}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                            #{idx + 1}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {(() => {
                            const bData = block?.data || block?.content || {};
                            return bData.title || bData.headline || bData.subTitle || (typeof bData.content === "string" ? bData.content : null) || "Click to edit block options";
                          })()}
                        </p>
                      </div>
                    </button>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); moveBlock(idx, -1); }}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 transition"
                      title="Move Up"
                    >
                      <HiChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); moveBlock(idx, 1); }}
                      disabled={idx === blocks.length - 1}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 transition"
                      title="Move Down"
                    >
                      <HiChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); duplicateBlock(idx); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition"
                      title="Duplicate Block"
                    >
                      <HiDuplicate className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeBlock(idx); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
                      title="Delete Block"
                    >
                      <HiTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Block Fields Form Drawer */}
                {isOpen && (
                  <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950/90 space-y-4 text-xs">
                    {/* HERO BLOCK EDITING */}
                    {block.type === "hero" && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-slate-400 font-semibold mb-1">Headline</label>
                          <input
                            type="text"
                            value={block.data.title || ""}
                            onChange={(e) => updateBlockData(idx, "title", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-indigo-500 outline-none text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 font-semibold mb-1">Subtitle</label>
                          <textarea
                            rows={2}
                            value={block.data.subtitle || ""}
                            onChange={(e) => updateBlockData(idx, "subtitle", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-indigo-500 outline-none text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Button Label</label>
                            <input
                              type="text"
                              value={block.data.ctaText || ""}
                              onChange={(e) => updateBlockData(idx, "ctaText", e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-indigo-500 outline-none text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Button Link</label>
                            <input
                              type="text"
                              value={block.data.ctaLink || ""}
                              onChange={(e) => updateBlockData(idx, "ctaLink", e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-indigo-500 outline-none text-xs"
                            />
                          </div>
                        </div>

                        {/* Hero Image Options */}
                        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                          <label className="block text-slate-300 font-bold flex items-center gap-1.5">
                            <HiPhotograph className="text-indigo-400" /> Hero Banner Image
                          </label>
                          <div>
                            <label className="block text-slate-400 mb-1">Image URL</label>
                            <input
                              type="text"
                              placeholder="https://images.unsplash.com/..."
                              value={block.data.imageUrl || ""}
                              onChange={(e) => updateBlockData(idx, "imageUrl", e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1">Image Alignment</label>
                            <select
                              value={block.data.imageAlign || "right"}
                              onChange={(e) => updateBlockData(idx, "imageAlign", e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs"
                            >
                              <option value="right">Right Side</option>
                              <option value="left">Left Side</option>
                              <option value="background">Background Banner Overlay</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* FEATURES BLOCK EDITING */}
                    {block.type === "features" && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-slate-400 font-semibold mb-1">Grid Title</label>
                          <input
                            type="text"
                            value={block.data.title || ""}
                            onChange={(e) => updateBlockData(idx, "title", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="block text-slate-400 font-semibold">Features Items</label>
                            <button
                              type="button"
                              onClick={() => {
                                const newItems = [...(block.data.items || []), { title: "New Feature", description: "Feature description...", icon: "✨" }];
                                updateBlockData(idx, "items", newItems);
                              }}
                              className="text-[11px] font-semibold text-indigo-400 hover:underline flex items-center gap-1"
                            >
                              <HiPlus /> Add Feature
                            </button>
                          </div>
                          {(block.data.items || []).map((item, itemIdx) => (
                            <div key={itemIdx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 relative">
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = block.data.items.filter((_, i) => i !== itemIdx);
                                  updateBlockData(idx, "items", newItems);
                                }}
                                className="absolute top-2 right-2 text-slate-500 hover:text-red-400"
                                title="Remove Item"
                              >
                                <HiTrash className="w-3.5 h-3.5" />
                              </button>
                              <div className="grid grid-cols-4 gap-2">
                                <input
                                  type="text"
                                  placeholder="Icon"
                                  value={item.icon || ""}
                                  onChange={(e) => {
                                    const newItems = [...block.data.items];
                                    newItems[itemIdx].icon = e.target.value;
                                    updateBlockData(idx, "items", newItems);
                                  }}
                                  className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-200 text-xs"
                                />
                                <input
                                  type="text"
                                  placeholder="Title"
                                  value={item.title || ""}
                                  onChange={(e) => {
                                    const newItems = [...block.data.items];
                                    newItems[itemIdx].title = e.target.value;
                                    updateBlockData(idx, "items", newItems);
                                  }}
                                  className="col-span-3 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-200 text-xs"
                                />
                              </div>
                              <input
                                type="text"
                                placeholder="Description"
                                value={item.description || ""}
                                onChange={(e) => {
                                  const newItems = [...block.data.items];
                                  newItems[itemIdx].description = e.target.value;
                                  updateBlockData(idx, "items", newItems);
                                }}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-200 text-xs"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TESTIMONIALS BLOCK EDITING (MULTIPLE TESTIMONIALS) */}
                    {block.type === "testimonials" && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-slate-400 font-semibold mb-1">Section Title</label>
                          <input
                            type="text"
                            value={block.data.title || ""}
                            onChange={(e) => updateBlockData(idx, "title", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="block text-slate-400 font-semibold">Testimonial Cards</label>
                            <button
                              type="button"
                              onClick={() => {
                                const newItems = [
                                  ...(block.data.items || []),
                                  { quote: "Outstanding platform and results!", name: "New Client", role: "CEO", rating: 5, avatar: "" },
                                ];
                                updateBlockData(idx, "items", newItems);
                              }}
                              className="text-[11px] font-semibold text-indigo-400 hover:underline flex items-center gap-1"
                            >
                              <HiPlus /> Add Testimonial
                            </button>
                          </div>

                          {(block.data.items || []).map((t, tIdx) => (
                            <div key={tIdx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 relative">
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = block.data.items.filter((_, i) => i !== tIdx);
                                  updateBlockData(idx, "items", newItems);
                                }}
                                className="absolute top-2 right-2 text-slate-500 hover:text-red-400"
                                title="Remove Testimonial"
                              >
                                <HiTrash className="w-3.5 h-3.5" />
                              </button>

                              <textarea
                                rows={2}
                                placeholder="Customer quote..."
                                value={t.quote || ""}
                                onChange={(e) => {
                                  const newItems = [...block.data.items];
                                  newItems[tIdx].quote = e.target.value;
                                  updateBlockData(idx, "items", newItems);
                                }}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs"
                              />

                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  placeholder="Author Name"
                                  value={t.name || ""}
                                  onChange={(e) => {
                                    const newItems = [...block.data.items];
                                    newItems[tIdx].name = e.target.value;
                                    updateBlockData(idx, "items", newItems);
                                  }}
                                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs"
                                />
                                <input
                                  type="text"
                                  placeholder="Role / Title"
                                  value={t.role || ""}
                                  onChange={(e) => {
                                    const newItems = [...block.data.items];
                                    newItems[tIdx].role = e.target.value;
                                    updateBlockData(idx, "items", newItems);
                                  }}
                                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs"
                                />
                              </div>

                              <input
                                type="text"
                                placeholder="Avatar Image URL (optional)"
                                value={t.avatar || ""}
                                onChange={(e) => {
                                  const newItems = [...block.data.items];
                                  newItems[tIdx].avatar = e.target.value;
                                  updateBlockData(idx, "items", newItems);
                                }}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA BLOCK EDITING */}
                    {block.type === "cta" && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Headline</label>
                            <input
                              type="text"
                              value={block.data.headline || ""}
                              onChange={(e) => updateBlockData(idx, "headline", e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Badge Tag</label>
                            <input
                              type="text"
                              placeholder="e.g. SPECIAL OFFER"
                              value={block.data.badge || ""}
                              onChange={(e) => updateBlockData(idx, "badge", e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-400 font-semibold mb-1">Description</label>
                          <textarea
                            rows={2}
                            value={block.data.description || ""}
                            onChange={(e) => updateBlockData(idx, "description", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Primary Button Label</label>
                            <input
                              type="text"
                              value={block.data.buttonText || ""}
                              onChange={(e) => updateBlockData(idx, "buttonText", e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Primary Link</label>
                            <input
                              type="text"
                              value={block.data.buttonLink || ""}
                              onChange={(e) => updateBlockData(idx, "buttonLink", e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Secondary Button Label</label>
                            <input
                              type="text"
                              placeholder="e.g. Watch Demo 🎥"
                              value={block.data.secondaryButtonText || ""}
                              onChange={(e) => updateBlockData(idx, "secondaryButtonText", e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Secondary Link</label>
                            <input
                              type="text"
                              placeholder="#demo"
                              value={block.data.secondaryButtonLink || ""}
                              onChange={(e) => updateBlockData(idx, "secondaryButtonLink", e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Theme Palette</label>
                            <select
                              value={block.data.theme || "indigo"}
                              onChange={(e) => updateBlockData(idx, "theme", e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs"
                            >
                              <option value="indigo">Indigo Gradient</option>
                              <option value="emerald">Emerald Neon</option>
                              <option value="sunset">Sunset Pink</option>
                              <option value="dark">Dark Slate</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Layout</label>
                            <select
                              value={block.data.layout || "split"}
                              onChange={(e) => updateBlockData(idx, "layout", e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs"
                            >
                              <option value="split">Split (Text left, buttons right)</option>
                              <option value="centered">Centered Stack</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* FAQ BLOCK EDITING */}
                    {block.type === "faq" && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Section Title</label>
                            <input
                              type="text"
                              value={block.data.title || ""}
                              onChange={(e) => updateBlockData(idx, "title", e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Subtitle</label>
                            <input
                              type="text"
                              value={block.data.subtitle || ""}
                              onChange={(e) => updateBlockData(idx, "subtitle", e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="block text-slate-400 font-semibold">Questions & Answers</label>
                            <button
                              type="button"
                              onClick={() => {
                                const newItems = [
                                  ...(block.data.items || []),
                                  { question: "New Question?", answer: "Answer description...", category: "General" },
                                ];
                                updateBlockData(idx, "items", newItems);
                              }}
                              className="text-[11px] font-semibold text-indigo-400 hover:underline flex items-center gap-1"
                            >
                              <HiPlus /> Add Question
                            </button>
                          </div>

                          {(block.data.items || []).map((faqItem, fIdx) => (
                            <div key={fIdx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 relative">
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = block.data.items.filter((_, i) => i !== fIdx);
                                  updateBlockData(idx, "items", newItems);
                                }}
                                className="absolute top-2 right-2 text-slate-500 hover:text-red-400"
                                title="Remove Question"
                              >
                                <HiTrash className="w-3.5 h-3.5" />
                              </button>

                              <div className="grid grid-cols-4 gap-2">
                                <input
                                  type="text"
                                  placeholder="Category"
                                  value={faqItem.category || ""}
                                  onChange={(e) => {
                                    const newItems = [...block.data.items];
                                    newItems[fIdx].category = e.target.value;
                                    updateBlockData(idx, "items", newItems);
                                  }}
                                  className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-200 text-xs"
                                />
                                <input
                                  type="text"
                                  placeholder="Question?"
                                  value={faqItem.question || ""}
                                  onChange={(e) => {
                                    const newItems = [...block.data.items];
                                    newItems[fIdx].question = e.target.value;
                                    updateBlockData(idx, "items", newItems);
                                  }}
                                  className="col-span-3 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-200 text-xs"
                                />
                              </div>

                              <textarea
                                rows={2}
                                placeholder="Detailed answer..."
                                value={faqItem.answer || ""}
                                onChange={(e) => {
                                  const newItems = [...block.data.items];
                                  newItems[fIdx].answer = e.target.value;
                                  updateBlockData(idx, "items", newItems);
                                }}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* MEDIA GALLERY BLOCK EDITING */}
                    {block.type === "gallery" && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Gallery Title</label>
                            <input
                              type="text"
                              value={block.data.title || ""}
                              onChange={(e) => updateBlockData(idx, "title", e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 font-semibold mb-1">Columns</label>
                            <select
                              value={block.data.columns || 3}
                              onChange={(e) => updateBlockData(idx, "columns", parseInt(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs"
                            >
                              <option value={2}>2 Columns</option>
                              <option value={3}>3 Columns</option>
                              <option value={4}>4 Columns</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="block text-slate-400 font-semibold">Gallery Images</label>
                            <button
                              type="button"
                              onClick={() => {
                                const currentImgs = block.data.images || [];
                                const newImgs = [...currentImgs, { url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80", caption: "New Image" }];
                                updateBlockData(idx, "images", newImgs);
                              }}
                              className="text-[11px] font-semibold text-indigo-400 hover:underline flex items-center gap-1"
                            >
                              <HiPlus /> Add Image
                            </button>
                          </div>

                          {(block.data.images || []).map((imgItem, imgIdx) => {
                            const urlVal = typeof imgItem === "string" ? imgItem : imgItem.url || "";
                            const captionVal = typeof imgItem === "object" ? imgItem.caption || "" : "";

                            return (
                              <div key={imgIdx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 relative">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newImgs = block.data.images.filter((_, i) => i !== imgIdx);
                                    updateBlockData(idx, "images", newImgs);
                                  }}
                                  className="absolute top-2 right-2 text-slate-500 hover:text-red-400"
                                  title="Remove Image"
                                >
                                  <HiTrash className="w-3.5 h-3.5" />
                                </button>
                                <input
                                  type="text"
                                  placeholder="Image URL"
                                  value={urlVal}
                                  onChange={(e) => {
                                    const newImgs = [...block.data.images];
                                    newImgs[imgIdx] = { url: e.target.value, caption: captionVal };
                                    updateBlockData(idx, "images", newImgs);
                                  }}
                                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs"
                                />
                                <input
                                  type="text"
                                  placeholder="Caption (optional)"
                                  value={captionVal}
                                  onChange={(e) => {
                                    const newImgs = [...block.data.images];
                                    newImgs[imgIdx] = { url: urlVal, caption: e.target.value };
                                    updateBlockData(idx, "images", newImgs);
                                  }}
                                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* MARKDOWN BLOCK EDITING */}
                    {block.type === "markdown" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-slate-300 font-semibold text-xs uppercase tracking-wide">
                            Markdown & Rich Text Content
                          </label>
                          <span className="text-[11px] text-slate-500 font-medium">
                            Powered by @uiw/react-md-editor
                          </span>
                        </div>
                        <RichTextEditor
                          value={block.data.content || ""}
                          onChange={(val) => updateBlockData(idx, "content", val)}
                          height={380}
                          preview="live"
                          placeholder="Type Markdown or HTML here. Supports bold/italics, headings, lists, tables, blockquotes, inline SVG, image links, code blocks..."
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}

        {/* Bottom Append Target Zone for Drag & Drop */}
        <div
          onDragEnter={(e) => handleDragEnter(e, blocks.length)}
          onDragLeave={(e) => handleDragLeave(e, blocks.length)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, blocks.length)}
          className={`py-3.5 px-4 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center text-xs font-bold gap-2 ${
            dragOverIndex === blocks.length
              ? "border-indigo-500 bg-indigo-500/20 text-indigo-300 scale-[1.01] shadow-xl animate-pulse"
              : "border-slate-800/80 bg-slate-950/40 text-slate-500 hover:border-slate-700 hover:text-slate-400"
          }`}
        >
          <span>+ Drag & Drop here to append block at end of layout</span>
        </div>
      </div>
      )}
    </div>
  );
}