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
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* BACK BUTTON */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 
                   bg-black text-white rounded-full 
                   shadow-md transition-all duration-300 
                   hover:bg-gray-900 hover:shadow-xl 
                   hover:-translate-y-1 active:scale-95"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        ← Quay lại
      </Link>

      {/* TITLE - FONT SANG HƠN */}
      <h1
        className="text-4xl md:text-5xl mb-6 text-[#1A1A1A]"
        style={{
          fontFamily: "Cormorant Garamond, serif",
          letterSpacing: "0.5px",
        }}
      >
        {blog.title}
      </h1>

      {/* IMAGE */}
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-auto rounded-xl mb-6 shadow-md"
        />
      )}

      {/* CONTENT - sạch + dễ đọc */}
      <p
        className="text-gray-700 leading-8 text-lg"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {blog.content}
      </p>
    </div>
  );
}