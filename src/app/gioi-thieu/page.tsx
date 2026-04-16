import Image from "next/image";
import Link from "next/link";

const members = [
  {
    name: "Nguyễn Văn A",
    mssv: "23123456",
    role: "Leader / Frontend",
    github: "https://github.com/",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Trần Thị B",
    mssv: "23123457",
    role: "UI/UX Designer",
    github: "https://github.com/",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    name: "Lê Văn C",
    mssv: "23123458",
    role: "Backend",
    github: "https://github.com/",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    name: "Phạm Thị D",
    mssv: "23123459",
    role: "Database",
    github: "https://github.com/",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    name: "Hoàng Văn E",
    mssv: "23123460",
    role: "Tester / Support",
    github: "https://github.com/",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#F9F9F9] min-h-screen py-16 px-6">

      <div className="max-w-6xl mx-auto">

        {/* TITLE */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-center text-[#1A1A1A] mb-4">
          Giới thiệu Aromis
        </h1>

        <div className="w-20 h-[2px] bg-[#D4AF37] mx-auto mb-12"></div>

        {/* STORY */}
        <div className="bg-white rounded-2xl shadow p-8 mb-12 leading-8 text-gray-700 text-[16px]">
          <p>
            Aromis được xây dựng với cảm hứng từ sự tinh tế và nghệ thuật
            mùi hương. Chúng tôi tin rằng mỗi mùi hương là một dấu ấn cá nhân,
            một câu chuyện riêng biệt được kể bằng cảm xúc.
          </p>
          <br />
          <p>
            Thương hiệu hướng đến trải nghiệm nước hoa cao cấp, hiện đại và
            tối giản nhưng vẫn giữ được sự sang trọng đặc trưng.
          </p>
        </div>

        {/* MEMBERS */}
        <h2 className="text-3xl font-serif font-bold text-center mb-10">
          Thành viên nhóm
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {members.map((m, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition p-6 text-center"
            >

              <div className="flex justify-center mb-4">
                <Image
                  src={m.avatar}
                  alt={m.name}
                  width={90}
                  height={90}
                  className="rounded-full"
                />
              </div>

              <h3 className="text-lg font-semibold text-[#1A1A1A]">
                {m.name}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                MSSV: {m.mssv}
              </p>

              <p className="text-sm text-gray-700 mt-2">
                {m.role}
              </p>

              <Link
                href={m.github}
                target="_blank"
                className="inline-block mt-4 text-sm text-black hover:text-[#D4AF37] transition"
              >
                GitHub →
              </Link>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}