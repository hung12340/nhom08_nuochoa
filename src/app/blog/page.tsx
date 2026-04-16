import Link from "next/link";
import Image from "next/image";
import { blogs } from "../../data/blogs";

export default function BlogPage() {
  return (
    <div className="bg-[#F9F9F9] min-h-screen pt-10 pb-16 px-6">
      
      <div className="max-w-6xl mx-auto">

        {/* TITLE */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1A1A1A] mb-4 text-center">
          Cẩm nang nước hoa
        </h1>

        {/* LINE */}
        <div className="w-20 h-[2px] bg-[#D4AF37] mx-auto mb-12"></div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.id}`}
              className="group block"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">

                {/* IMAGE */}
                <div className="relative w-full h-56 overflow-hidden">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-700"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-5">

                  <h2 className="text-lg font-semibold text-[#1A1A1A] mb-2 group-hover:text-[#D4AF37] transition">
                    {blog.title}
                  </h2>

                  <p className="text-gray-500 text-sm leading-6 font-normal">
                    {blog.excerpt}
                  </p>

                  {/* READ MORE */}
                  <div className="mt-4 text-sm text-black font-medium group-hover:underline">
                    Đọc thêm →
                  </div>

                </div>

              </div>
            </Link>
          ))}

        </div>
      </div>
    </div>
  );
}