import Image from "next/image";
import Link from "next/link";
import { blogs } from "@/data/blogs";

export async function generateStaticParams() {
  return blogs.map((blog) => ({
    id: blog.id,
  }));
}

export default async function BlogDetail({ params }) {
  const { id } = await params;

  const blog = blogs.find((b) => String(b.id) === String(id));

  if (!blog) {
    return (
      <div className="p-8 text-center text-red-500">
        Không tìm thấy bài viết 😢
      </div>
    );
  }

  return (
    <div className="bg-[#F9F9F9] min-h-screen py-16 px-4">
      
      <div className="max-w-4xl mx-auto">

        {/* BACK BUTTON */}
        <Link
          href="/blog"
          className="inline-flex items-center mb-10 text-sm font-medium text-black hover:text-white hover:bg-black px-5 py-2 rounded-full border border-black transition-all duration-300"
        >
          ← Quay lại
        </Link>

        {/* MAIN CARD */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* IMAGE */}
          <div className="relative w-full h-[420px]">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* CONTENT */}
          <div className="p-10 md:p-14">

            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1A1A1A] leading-snug mb-6">
              {blog.title}
            </h1>

            {/* GOLD LINE */}
            <div className="w-16 h-[2px] bg-[#D4AF37] mb-8"></div>

            {/* CONTENT TEXT */}
            <div className="text-gray-800 leading-8 text-[16px] whitespace-pre-line font-normal">
              {blog.content}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}