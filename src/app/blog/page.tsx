import Link from "next/link";
import { blogs } from "../../data/blogs";

export default function BlogPage() {
  return (
    <div className="p-8 bg-[#F9F9F9] min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-[#1A1A1A]">
        Cẩm nang nước hoa
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Link key={blog.id} href={`/blog/${blog.id}`}>
            <div className="bg-white rounded-2xl shadow hover:shadow-2xl hover:scale-105 transition duration-300 cursor-pointer overflow-hidden">
              
              <img
                src={blog.image}
                className="w-full h-52 object-cover"
              />

              <div className="p-4">
                <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                  {blog.title}
                </h2>

                <p className="text-gray-500 text-sm">
                  {blog.excerpt}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}