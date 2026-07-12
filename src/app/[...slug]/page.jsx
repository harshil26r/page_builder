import { dbConnect } from "@/middleware/mongoConnect";
import Blog from "@/models/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import MarkdownRender from "@/components/MarkdownRender";
import BlockRenderer from "@/components/BlockRenderer";
import { IoIosArrowBack } from "react-icons/io";
import { FaRegUser, FaRegEnvelope, FaRegClock } from "react-icons/fa";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const path = "/" + resolvedParams.slug.join("/");
    const blog = await Blog.findOne({
      $or: [{ url: path }, { url: resolvedParams.slug.join("/") }],
    });
    if (!blog) return {};

    const metaTitle = blog.metaTitle || blog.title;
    const metaDescription = blog.metaDescription || blog.subText || "Created with Aura Studio";
    const ogImages = blog.ogImage ? [{ url: blog.ogImage }] : [];

    return {
      title: `${metaTitle} | Aura Studio`,
      description: metaDescription,
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        images: ogImages,
      },
      twitter: {
        card: blog.twitterCard || "summary_large_image",
        title: metaTitle,
        description: metaDescription,
        images: blog.ogImage ? [blog.ogImage] : [],
      },
    };
  } catch (error) {
    return {
      title: "Aura Studio Page",
    };
  }
}

export default async function CustomPage({ params, searchParams }) {
  await dbConnect();
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const path = "/" + resolvedParams.slug.join("/");
  const blog = await Blog.findOne({
    $or: [{ url: path }, { url: resolvedParams.slug.join("/") }],
  });

  if (!blog) {
    notFound();
  }

  // Allow preview of draft/scheduled pages
  const isPreview = resolvedSearchParams?.preview === "true";
  if (blog.status !== "published" && !isPreview) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#070a12] bg-grid-pattern text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-x-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div>
        {/* Preview Mode Banner */}
        {isPreview && (
          <div className="sticky top-0 z-50 w-full bg-amber-500/15 border-b border-amber-500/30 backdrop-blur-xl px-4 py-2.5 text-center text-xs md:text-sm font-semibold text-amber-300 shadow-lg">
            <span>⚠️ Preview Mode &mdash; Viewing page with status: </span>
            <span className="uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs ml-1 font-mono">
              {blog.status}
            </span>
          </div>
        )}

        {/* Navigation Header */}
        <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-[#070a12]/80 backdrop-blur-2xl">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center justify-center h-10 w-10 rounded-2xl border border-white/10 bg-slate-900/80 text-slate-400 hover:text-white hover:border-cyan-400/30 transition-all"
              >
                <IoIosArrowBack className="text-xl text-cyan-400" />
              </Link>
              <div>
                <p className="font-extrabold text-sm tracking-wide uppercase gradient-text-aura">
                  Aura Studio Page
                </p>
              </div>
            </div>
            <div className="text-xs text-slate-400 font-mono hidden sm:block">
              {blog.url}
            </div>
          </div>
        </header>
      </div>

      {/* Page Content Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 md:py-16">
        <article className="space-y-10">
          {/* Article Header */}
          <div className="border-b border-white/10 pb-8 space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight gradient-text-aura leading-tight">
              {blog.title}
            </h1>
            {blog.subText && (
              <p className="text-lg md:text-xl text-slate-300 font-medium max-w-3xl leading-relaxed">
                {blog.subText}
              </p>
            )}
          </div>

          {/* Render Page Section Blocks */}
          <div className="py-2">
            <BlockRenderer
              blocks={blog.blocks || []}
              pageStyle={{
                bgColor: blog.bgColor,
                textColor: blog.textColor,
                fontStyle: blog.fontStyle,
                fontSize: blog.fontSize,
                spacing: blog.spacing,
                customCss: blog.customCss,
              }}
            />
          </div>

          {/* Author / Publication Metadata Card */}
          {blog.showAuthor && (
            <div className="mt-16 glass-panel-elevated rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center gap-6 justify-between border border-white/10">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20 font-mono">
                  {blog.createdBy ? blog.createdBy.charAt(0).toUpperCase() : "?"}
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono">
                    Author Profile
                  </span>
                  <h4 className="font-bold text-lg text-white flex items-center gap-2">
                    <FaRegUser className="text-sm text-cyan-400" /> {blog.createdBy}
                  </h4>
                  {blog.authorEmail && (
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                      <FaRegEnvelope className="text-sm text-slate-500" /> {blog.authorEmail}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col md:items-end text-xs text-slate-400 gap-1 border-t border-white/10 pt-4 md:pt-0 md:border-0 w-full md:w-auto">
                <span className="flex items-center gap-1.5 font-mono">
                  <FaRegClock className="text-xs text-cyan-400" /> Published: {blog.createdAt || "N/A"}
                </span>
                <span>
                  Last modified by: <strong className="text-slate-200">{blog.modifiedBy}</strong>
                </span>
              </div>
            </div>
          )}
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#070a12]/50 py-8 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Aura Studio. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Powered by</span>
            <Link
              href="/"
              className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline transition"
            >
              Aura Studio Page Builder
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
