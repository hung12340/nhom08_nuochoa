import Image from "next/image";
import Link from "next/link";
import { blogs } from "@/data/blogs"; // 🔥 fix path

export default async function BlogDetail({ params }) {
  const { id } = await params; // 🔥 chuẩn Next 16

  const blog = blogs.find((b) => b.id === id);

  if (!blog) {
    return (
      <div className="p-8 text-center text-red-500">
        Không tìm thấy bài viết 😢
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#F9F9F9] min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">

        {/* 🔙 BACK */}
        <Link
          href="/blog"
          className="text-sm text-gray-500 hover:text-black mb-4 inline-block"
        >
          ← Quay lại
        </Link>

        {/* 📝 TITLE */}
        <h1 className="text-3xl font-bold mb-4 text-[#1A1A1A]">
          {blog.title}
        </h1>

        {/* 🖼 IMAGE */}
        <Image
          src={blog.image}
          alt={blog.title}
          width={800}
          height={400}
          className="w-full h-64 object-cover rounded mb-6"
          priority
        />

        {/* 📄 CONTENT */}
        <div className="text-gray-700 leading-8 whitespace-pre-line text-[16px]">
          {blog.content}
        </div>

      </div>
    </div>
  );
}