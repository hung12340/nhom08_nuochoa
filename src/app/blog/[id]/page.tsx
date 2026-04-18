import Link from "next/link";
import { blogs } from "@/data/blogs";

export async function generateStaticParams() {
  return blogs.map((blog) => ({
    id: blog.id.toString(),
  }));
}

export default async function BlogDetail({ params }) {
  const { id } = await params;

  const blog = blogs.find((b) => b.id.toString() === id);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#1A1A1A] font-sans">
        Không tìm thấy bài viết
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-16 px-4 font-sans">
      <div className="max-w-5xl mx-auto">

        {/* BACK BUTTON */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 mb-10 px-6 py-2.5
                     bg-[#1A1A1A] text-[#F9F9F9]
                     rounded-full shadow-sm
                     transition-all duration-300
                     hover:bg-[#D4AF37] hover:text-[#1A1A1A]
                     hover:shadow-lg hover:-translate-y-1 active:scale-95 font-sans"
        >
          ← Quay lại
        </Link>

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-[#1A1A1A]/5">

          {/* IMAGE */}
          {blog.image && (
            <div className="w-full h-[360px] md:h-[460px] overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          )}

          <div className="p-10 md:p-14">

            {/* TITLE */}
            <h1 className="text-4xl md:text-5xl text-[#1A1A1A] mb-6 leading-tight text-center font-serif">
              {blog.title}
            </h1>

            {/* DIVIDER */}
            <div className="w-20 h-[2px] bg-[#D4AF37] mx-auto mb-10 opacity-90"></div>

            {/* CONTENT */}
            <p className="text-[#1A1A1A]/75 text-base md:text-lg leading-8 whitespace-pre-line text-justify font-sans">
              {blog.content}
            </p>

            {/* FOOTER */}
            <div className="mt-12 border-t border-[#1A1A1A]/10 pt-6 text-sm text-[#1A1A1A]/50 text-center tracking-wide font-sans">
              ✦ Aromis Journal
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}