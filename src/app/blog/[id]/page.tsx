import Image from "next/image";
import Link from "next/link";
import { blogs } from "@/data/blogs";

// Khai báo type cho params
type Props = {
  params: {
    id: string;
  };
};

export async function generateStaticParams() {
  return blogs.map((blog) => ({
    id: blog.id.toString(),
  }));
}

export default async function BlogDetail({ params }: Props) {
  const { id } = params; 

  const blog = blogs.find((b) => String(b.id) === String(id));

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Không tìm thấy bài viết</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F9F9] min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/blog" className="text-sm text-gray-500 hover:underline">
          ← Quay lại
        </Link>

        <h1 className="text-3xl font-bold mt-4 mb-6">{blog.title}</h1>

        {blog.image && (
          <Image
            src={blog.image}
            alt={blog.title}
            width={800}
            height={400}
            className="w-full h-auto rounded-xl mb-6"
          />
        )}

        <p className="text-gray-700 leading-relaxed">{blog.content}</p>
      </div>
    </div>
  );
}