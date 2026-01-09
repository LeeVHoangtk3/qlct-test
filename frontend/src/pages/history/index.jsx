import { useState, useEffect } from "react";
import { Search, Filter, ArrowUpRight, ArrowDownRight, Calendar } from "lucide-react";
import transactionService from "../../services/transactionService";

const History = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Gọi API khi vào trang
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await transactionService.getAll();
                // Sắp xếp mới nhất lên đầu
                const sortedData = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setTransactions(sortedData);
            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    // Hàm format tiền tệ
    const formatMoney = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Hàm format ngày
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}`;
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Lịch sử giao dịch</h1>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
                ) : transactions.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">Chưa có giao dịch nào.</div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Giao dịch</th>
                                <th className="px-6 py-4 hidden sm:table-cell">Thời gian</th>
                                <th className="px-6 py-4 text-right">Số tiền</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${item.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {item.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{item.category}</p>
                                                <p className="text-xs text-gray-500">{item.note}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} /> {formatDate(item.date)}
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-bold text-base ${item.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {item.type === 'income' ? '+' : '-'}{formatMoney(item.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
export default History;