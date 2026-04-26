"use client";

import { useState, useRef, useEffect } from 'react';
import products from '@/lib/data.json';
import Image from 'next/image';
import { BASE_PATH } from '@/lib/constants';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Kính chào Quý khách! Cảm ơn Quý khách đã lựa chọn Aromis. Tôi là trợ lý ảo chuyên sâu về hương thơm, rất hân hạnh được đồng hành cùng Quý khách trên hành trình tìm kiếm dấu ấn mùi hương cá nhân. Quý khách đang mong muốn tìm kiếm một hương thơm dành cho dịp đặc biệt, hay một phong cách cụ thể nào (Nam, Nữ, Unisex) không ạ?' }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY; 
      if (!GROQ_API_KEY) throw new Error("Thiếu API Key");
      const chatMemory = messages.slice(-4).map(msg => ({
        role: msg.sender === 'bot' ? 'assistant' : 'user',
        content: msg.text
      }));

      const optimizedData = products.slice(5, 20).map(p => ({
        n: p.name,
        b: p.brand,
        p: p.price,
        g: p.gender,
        s: p.stock,
        d: p.description.slice(0, 50)
      }));

      const apiMessages = [
        {
          role: "system",
          content: `Bạn là Chuyên gia tư vấn hương thơm (Fragrance Sommelier) độc quyền của thương hiệu xa xỉ Aromis.
          Dữ liệu sản phẩm nội bộ: ${JSON.stringify(optimizedData)}

          PHONG CÁCH GIAO TIẾP "TỰ NHIÊN & TINH TẾ":
          - Xưng hô: Tự xưng là "Aromis", gọi khách là "Quý khách". (Tuyệt đối không dùng "tôi", "mình", "AI", "Bot"). 
          - Mẹo để tự nhiên: Hãy linh hoạt "ẩn chủ ngữ" trong tiếng Việt để câu văn không bị lặp từ. Thay vì nói "Aromis nghĩ mùi này hợp với Quý khách", hãy nói "Đây chắc chắn là một mùi hương sinh ra dành cho Quý khách."
          - Giọng văn: Như một người bạn tâm giao có gu thẩm mỹ cao, ân cần, thanh lịch. Miêu tả mùi hương mang tính gợi hình, gợi cảm xúc thay vì chỉ đọc thành phần khô khan.

          KỊCH BẢN XỬ LÝ LINH HOẠT TỪNG TÌNH HUỐNG:
          1. Nếu khách chỉ chào hỏi hoặc cảm ơn: Đừng vội bán hàng. Hãy đáp lời lịch sự, tự nhiên và mời họ chia sẻ sở thích.
          2. Nếu khách nhờ tư vấn nước hoa: 
             - Chọn 1 hoặc tối đa 2 sản phẩm xuất sắc nhất từ dữ liệu khớp với yêu cầu (nam/nữ, phong cách, giá tiền).
             - Đưa ra lời khen nhẹ nhàng về gu của khách.
             - Cung cấp: Tên sản phẩm + Thương hiệu + Miêu tả cảm xúc + Giá bán (VNĐ).
          3. Nếu khách tìm mùi hương không có trong dữ liệu: Khéo léo xin lỗi vì hiện chưa có sẵn, và NGAY LẬP TỨC gợi ý một sản phẩm khác có "vibe" (phong cách) tương tự trong cửa hàng. TUYỆT ĐỐI KHÔNG tự bịa tên sản phẩm ngoài dữ liệu.
          4. Nếu khách hỏi chuyện ngoài lề (làm toán, thời tiết...): Từ chối một cách duyên dáng, pha chút dí dỏm và khéo léo đưa câu chuyện quay về thế giới hương thơm.
          5. Nếu khách tạm biệt hoặc muốn kết thúc trò chuyện (bye, đi ngủ, chào...): Gửi lời chúc tốt đẹp, thanh lịch và hẹn gặp lại. (Ví dụ: "Dạ, chúc Quý khách một ngày mới ngát hương. Aromis luôn mong được đón tiếp Quý khách lần sau ạ. ✨"). TUYỆT ĐỐI KHÔNG đặt thêm câu hỏi gợi mở trong trường hợp này.

          QUY TẮC TRÌNH BÀY:
          - Siêu ngắn gọn, giống như đang chat trực tiếp (tối đa 3-4 câu).
          - Ngắt dòng thoáng mắt. 
          - Luôn kết thúc bằng một câu hỏi gợi mở nhẹ nhàng, không rập khuôn (TRỪ KHI thuộc Tình huống 5 - Khách đã tạm biệt).`
        },
        ...chatMemory, 
        { role: "user", content: userMessage }
      ];

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: apiMessages, 
          temperature: 0.7, 
        }),
      });

      if (!response.ok) throw new Error("API Limit");

      const data = await response.json();
      const botReply = data.choices[0]?.message?.content || "Aromis đang bận một chút...";

      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    } catch (error) {
      console.error("Lỗi Fetch:", error);
      const fallback = products.find(p => userMessage.toLowerCase().includes(p.gender.toLowerCase())) 
                       ? `Aromis gợi ý Quý khách dòng ${products[0].name}.` 
                       : "Hệ thống đang bận, Quý khách vui lòng thử lại sau giây lát ạ.";
      setMessages(prev => [...prev, { sender: 'bot', text: fallback }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-14 h-14 bg-[#D4AF37] text-[#1A1A1A] rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(212,175,55,0.4)] hover:scale-105 transition-transform duration-300 border-2 border-transparent"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        ) : (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] md:w-[400px] bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col h-[500px] border border-gray-100">
          
          <div className="bg-[#1A1A1A] text-[#D4AF37] py-4 px-5 flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#D4AF37] bg-white flex-shrink-0">
               <Image 
                 src={`${BASE_PATH}/images/logo.png`}
                 alt="Aromis Logo" 
                 fill
                 className="object-contain p-1"
                 onError={(e) => {
                   e.currentTarget.style.display = 'none';
                   e.currentTarget.parentElement!.innerHTML = '<span class="flex items-center justify-center w-full h-full text-black font-bold">A</span>';
                 }}
               />
            </div>
            <div>
              <div className="font-bold tracking-widest text-sm uppercase">Aromis Chatbot</div>
              <div className="text-[10px] text-gray-400">Trợ lý tư vấn thông minh</div>
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-[#F9F9F9] space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start items-end gap-2'}`}>
                
                {msg.sender === 'bot' && (
                  <div className="relative w-6 h-6 rounded-full overflow-hidden border border-gray-200 bg-white flex-shrink-0 mb-1">
                    <Image 
                      src={`${BASE_PATH}/images/logo.png`}
                      alt="Aromis Bot" 
                      fill
                      className="object-contain p-0.5"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<span class="flex items-center justify-center w-full h-full text-[10px] text-black font-bold">A</span>';
                      }}
                    />
                  </div>
                )}

                <div className={`p-3 rounded-2xl text-sm max-w-[80%] leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user' 
                  ? 'bg-[#1A1A1A] text-white rounded-br-sm' 
                  : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start items-end gap-2">
                <div className="relative w-6 h-6 rounded-full overflow-hidden border border-gray-200 bg-white flex-shrink-0 mb-1">
                   <Image 
                     src={`${BASE_PATH}/images/logo.png`}
                     alt="Aromis Bot" 
                     fill
                     className="object-contain p-0.5"
                     onError={(e) => {
                       e.currentTarget.style.display = 'none';
                       e.currentTarget.parentElement!.innerHTML = '<span class="flex items-center justify-center w-full h-full text-[10px] text-black font-bold">A</span>';
                     }}
                   />
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full text-sm outline-none focus:border-[#D4AF37] disabled:bg-gray-50 transition-colors" 
              placeholder={isLoading ? "Chatbot đang trả lời..." : "Hỏi Chatbot về nước hoa..."} 
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-[#1A1A1A] text-[#D4AF37] w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#1A1A1A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}