import { useState } from "react";
import { Plus, Wallet, Utensils, ShoppingBag, Car, Zap, Coffee, Home } from "lucide-react";
import transactionService from "../../services/transactionService";

const Manager = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [tab, setTab] = useState("expense"); // 'expense' hoặc 'income'
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");

    // Danh sách danh mục (Bạn có thể thêm tùy ý)
    const categories = tab === "expense"
        ? [
            { id: "eat", name: "Ăn uống", icon: Utensils, color: "bg-orange-100 text-orange-600" },
            { id: "shop", name: "Mua sắm", icon: ShoppingBag, color: "bg-blue-100 text-blue-600" },
            { id: "move", name: "Di chuyển", icon: Car, color: "bg-green-100 text-green-600" },
            { id: "home", name: "Nhà cửa", icon: Home, color: "bg-purple-100 text-purple-600" },
            { id: "coffee", name: "Cafe", icon: Coffee, color: "bg-brown-100 text-yellow-700" },
        ]
        : [
            { id: "salary", name: "Lương", icon: Wallet, color: "bg-green-100 text-green-600" },
            { id: "bonus", name: "Thưởng", icon: Zap, color: "bg-yellow-100 text-yellow-600" }
        ];

    const [selectedCat, setSelectedCat] = useState(categories[0].name);

    const handleSubmit = async () => {
        if (!amount || parseInt(amount) <= 0) {
            alert("Vui lòng nhập số tiền hợp lệ!");
            return;
        }

        setIsLoading(true);
        try {
            await transactionService.create({
                amount: parseFloat(amount),
                category: selectedCat,
                type: tab, // 'income' hoặc 'expense'
                date: new Date().toISOString(), // Lấy giờ hiện tại
                note: note || (tab === "expense" ? "Chi tiêu" : "Thu nhập")
            });

            alert("Đã lưu giao dịch thành công!");
            setAmount("");
            setNote("");
        } catch (error) {
            console.error(error);
            alert("Lỗi khi lưu giao dịch!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-center mb-8">
                <div className="bg-gray-100 p-1 rounded-full flex w-full max-w-md">
                    <button onClick={() => { setTab("expense"); setSelectedCat("Ăn uống") }} className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${tab === "expense" ? "bg-white text-red-600 shadow" : "text-gray-500"}`}>Khoản Chi</button>
                    <button onClick={() => { setTab("income"); setSelectedCat("Lương") }} className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${tab === "income" ? "bg-white text-green-600 shadow" : "text-gray-500"}`}>Khoản Thu</button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                {/* Nhập tiền */}
                <div className="mb-6">
                    <label className="text-xs font-bold text-gray-500 uppercase">Số tiền (VNĐ)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        className={`w-full text-4xl font-bold border-b-2 py-2 outline-none bg-transparent ${tab === 'expense' ? 'text-red-500 border-red-100' : 'text-green-500 border-green-100'}`}
                    />
                </div>

                {/* Nhập ghi chú */}
                <div className="mb-6">
                    <label className="text-xs font-bold text-gray-500 uppercase">Ghi chú</label>
                    <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Ví dụ: Ăn sáng, Tiền xăng..."
                        className="w-full text-lg py-2 border-b border-gray-100 outline-none"
                    />
                </div>

                {/* Chọn danh mục */}
                <div className="mb-8">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Danh mục</label>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                        {categories.map(c => (
                            <button
                                key={c.id}
                                onClick={() => setSelectedCat(c.name)}
                                className={`flex flex-col items-center p-3 rounded-xl border transition-all ${selectedCat === c.name ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-100 hover:bg-gray-50'}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${c.color}`}>
                                    <c.icon size={18} />
                                </div>
                                <span className="text-xs font-medium truncate w-full text-center">{c.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`w-full py-4 rounded-xl text-white font-bold flex justify-center gap-2 transition-transform active:scale-[0.98] ${tab === 'expense' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                >
                    {isLoading ? "Đang lưu..." : <><Plus /> Lưu giao dịch</>}
                </button>
            </div>
        </div>
    );
};
export default Manager;