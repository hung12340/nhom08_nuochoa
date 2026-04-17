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
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Không tìm thấy bài viết
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-16 px-4">

      <div className="max-w-5xl mx-auto">

        {/* BACK BUTTON */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 mb-10 px-6 py-2.5 
                     bg-black text-white rounded-full 
                     shadow-md transition-all duration-300 
                     hover:bg-gray-900 hover:shadow-xl 
                     hover:-translate-y-1 active:scale-95"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          ← Quay lại
        </Link>

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* IMAGE */}
          {blog.image && (
            <div className="w-full h-[360px] md:h-[460px] overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          )}

          <div className="p-10 md:p-14">

            {/* TITLE */}
            <h1
              className="text-4xl md:text-5xl text-[#1A1A1A] mb-6 leading-tight text-center"
              style={{
                fontFamily: "Cormorant Garamond, serif",
                letterSpacing: "0.5px",
              }}
            >
              {blog.title}
            </h1>

            {/* CONTENT */}
            <p
              className="text-gray-700 text-lg leading-8 whitespace-pre-line text-justify"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {blog.content}
            </p>

            {/* FOOTER */}
            <div className="mt-12 border-t pt-6 text-sm text-gray-400 text-center">
              ✦ Aromis Journal
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}