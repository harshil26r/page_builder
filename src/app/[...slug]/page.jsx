import { dbConnect } from "@/middleware/mongoConnect";
import Blog from "@/models/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import MarkdownRender from "@/components/MarkdownRender";
import { IoIosArrowBack } from "react-icons/io";
import { FaRegUser, FaRegEnvelope, FaRegClock } from "react-icons/fa";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  try {
    await dbConnect();
    const path = "/" + params.slug.join("/");
    const blog = await Blog.findOne({
      $or: [{ url: path }, { url: params.slug.join("/") }],
    });
    if (!blog) return {};
    return {
      title: `${blog.title} | Rapid Page Builder`,
      description: blog.subText || "Created with Rapid Page Builder",
    };
  } catch (error) {
    return {
      title: "Rapid Page Builder",
    };
  }
}

export default async function CustomPage({ params, searchParams }) {
  await dbConnect();
  const path = "/" + params.slug.join("/");
  const blog = await Blog.findOne({
    $or: [{ url: path }, { url: params.slug.join("/") }],
  });

  if (!blog) {
    notFound();
  }

  // Allow preview of draft/scheduled pages
  const isPreview = searchParams.preview === "true";
  if (blog.status !== "published" && !isPreview) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Preview Mode Banner */}
      {isPreview && (
        <div className="sticky top-0 z-50 w-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border-b border-amber-500/30 backdrop-blur-md px-4 py-2.5 text-center text-xs md:text-sm font-semibold text-amber-300 shadow-md">
          <span>⚠️ Preview Mode &mdash; Viewing page with status: </span>
          <span className="uppercase px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs ml-1">
            {blog.status}
          </span>
        </div>
      )}

      {/* Navigation Header */}
      <header className="sticky top-0 z-30 w-full border-b border-gray-800/80 bg-gray-900/40 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center justify-center h-10 w-10 rounded-xl border border-gray-800 bg-gray-900/40 text-gray-400 hover:text-white hover:bg-gray-800 transition duration-150"
            >
              <IoIosArrowBack className="text-xl" />
            </Link>
            <div>
              <p className="font-bold text-sm tracking-wide uppercase text-indigo-400">
                Rapid Page Builder
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-500 font-mono hidden sm:block">
            {blog.url}
          </div>
        </div>
      </header>

      {/* Page Content Container */}
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <article className="space-y-10">
          {/* Article Header */}
          <div className="border-b border-gray-800/60 pb-8 space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent leading-tight">
              {blog.title}
            </h1>
            {blog.subText && (
              <p className="text-lg md:text-xl text-gray-400 font-medium max-w-3xl leading-relaxed">
                {blog.subText}
              </p>
            )}
          </div>

          {/* Render Body */}
          <div className="py-2">
            <MarkdownRender source={blog.body} />
          </div>

          {/* Author / Publication Metadata Card */}
          {blog.showAuthor && (
            <div className="mt-16 border border-gray-800 bg-gray-900/30 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
              <div className="flex items-center gap-4">
                {/* Custom Gradient Avatar */}
                <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/10">
                  {blog.createdBy ? blog.createdBy.charAt(0).toUpperCase() : "?"}
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                    Author Profile
                  </span>
                  <h4 className="font-bold text-lg text-white flex items-center gap-2">
                    <FaRegUser className="text-sm text-gray-400" /> {blog.createdBy}
                  </h4>
                  {blog.authorEmail && (
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <FaRegEnvelope className="text-sm text-gray-500" /> {blog.authorEmail}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col md:items-end text-xs text-gray-500 gap-1 border-t border-gray-800/80 pt-4 md:pt-0 md:border-0 w-full md:w-auto">
                <span className="flex items-center gap-1.5">
                  <FaRegClock className="text-xs" /> Published: {blog.createdAt || "N/A"}
                </span>
                <span>
                  Last modified by: <strong className="text-gray-400">{blog.modifiedBy}</strong>
                </span>
              </div>
            </div>
          )}
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-900 bg-gray-950/20 py-8 text-center text-xs text-gray-500">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Rapid Page Builder. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Powered by</span>
            <Link
              href="/"
              className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline transition duration-150"
            >
              Rapid Page Builder
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
