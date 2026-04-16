import Image from "next/image";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

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
        <h1
          className={`${playfair.className} text-4xl md:text-5xl font-light tracking-wider text-center text-[#1A1A1A] mb-4`}
        >
          Giới thiệu Aromis
        </h1>

        <div className="w-20 h-[2px] bg-[#D4AF37] mx-auto mb-12"></div>

        {/* STORY */}
        <div className="bg-white rounded-2xl shadow p-8 mb-12 leading-8 text-gray-700 text-[16px]">

          <p>
            Aromis ra đời vào năm 2024, bắt nguồn từ niềm đam mê sâu sắc với
            nghệ thuật mùi hương và mong muốn tạo nên một không gian nơi cảm
            xúc được thể hiện qua từng tầng hương. Chúng tôi tin rằng nước hoa
            không chỉ đơn thuần là một sản phẩm làm đẹp, mà còn là một “dấu ấn
            vô hình” – nơi ký ức, cá tính và phong cách sống được lưu giữ một
            cách tinh tế nhất.
          </p>

          <br />

          <p>
            Lấy cảm hứng từ sự tối giản hiện đại kết hợp với tinh thần sang
            trọng vượt thời gian, Aromis theo đuổi triết lý thiết kế “minimal but meaningful”
            – đơn giản trong hình thức, nhưng sâu sắc trong trải nghiệm. Mỗi sản
            phẩm đều được tạo nên với sự chọn lọc kỹ lưỡng, từ nguyên liệu hương
            thơm cho đến cách cân bằng các tầng hương, nhằm mang lại một hành
            trình mùi hương trọn vẹn và khác biệt.
          </p>

          <br />

          <p>
            Từ những ngày đầu thành lập, Aromis đã định hình mình là một thương
            hiệu nước hoa cao cấp mang tinh thần hiện đại. Chúng tôi không chạy
            theo sự phô trương, mà tập trung vào việc tạo ra những mùi hương có
            chiều sâu, có câu chuyện và có khả năng gợi mở cảm xúc riêng cho
            từng người sử dụng.
          </p>

          <br />

          <p>
            Mỗi mùi hương của Aromis là một hành trình – bắt đầu bằng sự nhẹ
            nhàng, dẫn dắt qua những nốt hương tinh tế và kết thúc bằng dư âm
            bền bỉ, lưu lại dấu ấn khó quên. Đó là cách chúng tôi kể câu chuyện
            của mình: âm thầm, tinh tế nhưng đầy sức mạnh.
          </p>

          <br />

          <p>
            Trong tương lai, Aromis hướng đến việc mở rộng thế giới hương thơm
            của mình, tiếp tục khám phá những cảm hứng mới và nâng cao trải
            nghiệm khách hàng, với mục tiêu trở thành một trong những thương
            hiệu nước hoa hiện đại được yêu thích và ghi nhớ lâu dài.
          </p>
        </div>

        {/* MEMBERS TITLE */}
        <h2
          className={`${playfair.className} text-3xl md:text-4xl font-light tracking-wide text-center mb-10`}
        >
          Thành viên nhóm
        </h2>

        {/* MEMBERS */}
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