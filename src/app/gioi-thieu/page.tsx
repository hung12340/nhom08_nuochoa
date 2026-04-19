import Image from "next/image";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const members = [
  {
    name: "Lê Xuân Hùng",
    mssv: "24126092",
    role: "Team Lead / Frontend Developer",
    github: "https://github.com/hung12340",
    avatar: "images/hung.jpg",
  },
  {
    name: "Trần Thị Như Hậu",
    mssv: "24126071",
    role: "UI/UX Designer",
    github: "https://github.com/24126071-creator",
    avatar: "images/nhuhau.jpg",
  },
  {
    name: "Trần Phan Minh Hoài",
    mssv: "24126077",
    role: "Backend Developer",
    github: "https://github.com/shinnhehe",
    avatar: "images/minhhoai.jpg",
  },
  {
    name: "Phạm Lê Diệu Hoàng",
    mssv: "24126078",
    role: "Frontend Developer",
    github: "https://github.com/dieuhoangpham2-gif",
    avatar: "images/dieuhoang.jpg",
  },
  {
    name: "Trần Thanh Hoàng",
    mssv: "24126082",
    role: "Frontend Developer",
    github: "https://github.com/thazhhoang99",
    avatar: "images/thanhhoang.jpg",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#F9F9F9] min-h-screen py-24 px-6 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* TITLE */}
        <div className="text-center mb-16">
          <h1
            className={`${playfair.className} text-5xl md:text-6xl font-light tracking-widest text-[#1A1A1A]`}
          >
            Giới thiệu Aromis
          </h1>

          <div className="w-24 h-[2px] bg-[#D4AF37] mx-auto mt-6"></div>

          <p className="text-[#1A1A1A]/60 mt-4 text-sm tracking-widest font-sans">
            ELEGANCE • SCENT • EXPERIENCE
          </p>
        </div>

        {/* STORY */}
        <div className="bg-white/90 backdrop-blur-lg border border-[#1A1A1A]/5 shadow-xl rounded-3xl p-10 md:p-14 mb-20 leading-8 text-[#1A1A1A]/75 text-[16px] font-sans">

          <p>
            Aromis ra đời vào năm 2024, bắt nguồn từ niềm đam mê sâu sắc với
            nghệ thuật mùi hương và mong muốn tạo nên một không gian nơi cảm
            xúc được thể hiện qua từng tầng hương. Chúng tôi tin rằng nước hoa
            không chỉ đơn thuần là một sản phẩm làm đẹp, mà còn là một “dấu ấn
            vô hình” nơi ký ức, cá tính và phong cách sống được lưu giữ một
            cách tinh tế nhất.
          </p>

          <br />

          <p>
            Lấy cảm hứng từ sự tối giản hiện đại kết hợp với tinh thần sang
            trọng vượt thời gian, Aromis theo đuổi triết lý thiết kế “minimal but meaningful”
            đơn giản trong hình thức nhưng sâu sắc trong trải nghiệm. Mỗi sản
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
            Mỗi mùi hương của Aromis là một hành trình bắt đầu bằng sự nhẹ
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
          className={`${playfair.className} text-4xl md:text-5xl font-light text-center mb-14 tracking-wider text-[#1A1A1A]`}
        >
          Thành viên nhóm
        </h2>

        {/* MEMBERS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

          {members.map((m, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl border border-[#1A1A1A]/5 shadow-md hover:shadow-2xl transition-all duration-500 p-6 text-center hover:-translate-y-2"
            >

              <div className="flex justify-center mb-5">
                <div className="p-[2px] rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#1A1A1A]/10">
                  <Image
                    src={m.avatar}
                    alt={m.name}
                    width={92}
                    height={92}
                    className="rounded-full object-cover bg-white"
                    style={{ width: "92px", height: "92px" }}
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-[#1A1A1A] group-hover:text-[#D4AF37] transition font-sans">
                {m.name}
              </h3>

              <p className="text-sm text-[#1A1A1A]/60 mt-1 font-sans">
                MSSV: {m.mssv}
              </p>

              <p className="text-sm text-[#1A1A1A]/75 mt-2 font-sans">
                {m.role}
              </p>

              <Link
                href={m.github}
                target="_blank"
                className="inline-block mt-5 text-sm font-medium text-[#1A1A1A] group-hover:text-[#D4AF37] transition font-sans"
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