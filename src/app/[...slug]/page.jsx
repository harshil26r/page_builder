import { dbConnect } from "@/middleware/mongoConnect";
import Blog from "@/models/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import BlockRenderer from "@/components/BlockRenderer";
import AuthorFooter from "@/components/AuthorFooter";
import { IoIosArrowBack } from "react-icons/io";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const slugList = Array.isArray(resolvedParams?.slug) ? resolvedParams.slug : [];
    const rawSlug = slugList.join("/");
    const path = "/" + rawSlug;

    const blogDoc = await Blog.findOne({
      $or: [{ url: path }, { url: rawSlug }],
    }).lean();

    if (!blogDoc) return {};

    const metaTitle = blogDoc.metaTitle || blogDoc.title;
    const metaDescription = blogDoc.metaDescription || blogDoc.subText || "Created with Aura Studio";
    const ogImages = blogDoc.ogImage ? [{ url: blogDoc.ogImage }] : [];

    return {
      title: `${metaTitle} | Aura Studio`,
      description: metaDescription,
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        images: ogImages,
      },
      twitter: {
        card: blogDoc.twitterCard || "summary_large_image",
        title: metaTitle,
        description: metaDescription,
        images: blogDoc.ogImage ? [blogDoc.ogImage] : [],
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

  const slugList = Array.isArray(resolvedParams?.slug) ? resolvedParams.slug : [];
  const rawSlug = slugList.join("/");
  const path = "/" + rawSlug;

  const rawBlog = await Blog.findOne({
    $or: [{ url: path }, { url: rawSlug }],
  }).lean();

  if (!rawBlog) {
    notFound();
  }

  const blog = JSON.parse(JSON.stringify(rawBlog));

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
        </article>
      </main>

      {/* Interactive Footer with Author Badge and Floating Details Modal */}
      <AuthorFooter blog={blog} />
    </div>
  );
}
