import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot } from "lucide-react";
import aiService from "../../services/aiService";

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "bot", content: "Chào bạn! Tôi là trợ lý AI (Gemini 2.0). Tôi có thể giúp gì cho ví tiền của bạn?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await aiService.chat(userMsg.content);
            setMessages(prev => [...prev, { role: "bot", content: res.data.answer }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: "bot", content: "Xin lỗi, hệ thống đang bận. Hãy thử lại sau!" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end animate-in fade-in slide-in-from-bottom-4 duration-300">
            {isOpen && (
                <div className="mb-4 w-[350px] h-[480px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white shadow-md">
                        <div className="flex items-center gap-2 font-bold">
                            <Bot size={22} /> Trợ lý Tài chính
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === "user"
                                        ? "bg-indigo-600 text-white rounded-br-none"
                                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white px-4 py-3 rounded-2xl border shadow-sm flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75" />
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-white border-t flex gap-2">
                        <input
                            className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="Hỏi: 'Tháng này tiêu bao nhiêu?'..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            disabled={isLoading}
                        />
                        <button onClick={handleSend} disabled={isLoading} className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50">
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* Button Toggle */}
            <button onClick={() => setIsOpen(!isOpen)} className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-300 flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
                {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
            </button>
        </div>
    );
};

export default ChatWidget;