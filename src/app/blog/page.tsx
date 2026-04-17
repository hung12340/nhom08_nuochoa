import Link from "next/link";
import Image from "next/image";
import { blogs } from "../../data/blogs";

export default function BlogPage() {
  return (
    <div className="bg-[#F9F9F9] min-h-screen py-20 px-6">
      
      <div className="max-w-6xl mx-auto">

        {/* TITLE */}
        <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-wide text-[#1A1A1A] mb-4 text-center">
          Cẩm nang nước hoa
        </h1>

        {/* LINE */}
        <div className="w-16 h-[1.5px] bg-[#D4AF37] mx-auto mb-14 opacity-80"></div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.id}`}
              className="group block"
            >
              <div className="bg-white rounded-2xl overflow-hidden 
              shadow-sm hover:shadow-2xl 
              transition-all duration-500 
              hover:-translate-y-2 
              h-full flex flex-col">

                {/* IMAGE */}
                <div className="relative w-full h-56 overflow-hidden">
                  
                  {/* overlay nhẹ */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-500 z-10"></div>

                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-700 ease-out"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-6 flex flex-col flex-1">

                  <h2 className="text-lg font-semibold text-[#1A1A1A] mb-2 
                  group-hover:text-[#D4AF37] transition duration-300">
                    {blog.title}
                  </h2>

                  <p className="text-gray-500 text-sm leading-6 line-clamp-3">
                    {blog.excerpt}
                  </p>

                  {/* READ MORE */}
                  <div className="mt-auto pt-4 flex items-center gap-2 text-sm text-black font-medium tracking-wide">
                    
                    <span className="group-hover:text-[#D4AF37] transition">
                      Đọc thêm
                    </span>

                    <span className="transform group-hover:translate-x-1 transition duration-300">
                      →
                    </span>

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