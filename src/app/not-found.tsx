import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9] px-6 font-sans">

      <div className="text-center max-w-md">

        {/* IMAGE */}
        <div className="mb-8 flex justify-center">
          <Image
            src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
            alt="404 not found"
            width={180}
            height={180}
            className="opacity-80"
            priority
          />
        </div>

        {/* TITLE */}
        <h1 className="text-5xl font-serif font-bold text-[#1A1A1A] mb-4">
          404
        </h1>

        {/* MESSAGE */}
        <p className="text-[#1A1A1A]/70 text-lg mb-6 leading-7 font-sans">
          Trang bạn tìm không tồn tại. <br />
          Có thể nó đã được di chuyển hoặc không còn khả dụng.
        </p>

        {/* BUTTON */}
        <Link
          href="/"
          className="inline-block bg-[#1A1A1A] text-[#F9F9F9] px-8 py-3 rounded-full font-medium
                     transition-all duration-300
                     hover:bg-[#D4AF37] hover:text-[#1A1A1A]
                     hover:-translate-y-1 hover:shadow-lg
                     active:translate-y-0 active:shadow-md font-sans"
        >
          ← Quay về trang chủ
        </Link>

      </div>

    </div>
  );
}