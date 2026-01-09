import { useEffect, useState } from "react";
import StatCard from "../../components/ui/StatCard";
import WeeklyChart from "../../components/charts/WeeklyChart"; // <--- Import biểu đồ
import transactionService from "../../services/transactionService";
import { format, subDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { vi } from "date-fns/locale"; // Để hiển thị ngày tiếng Việt

const Dashboard = () => {
    // State lưu tổng quan (Số dư, Thu, Chi)
    const [summary, setSummary] = useState({ balance: 0, income: 0, expense: 0 });
    // State lưu dữ liệu cho biểu đồ
    const [chartData, setChartData] = useState([]);
    // State lưu toàn bộ giao dịch lấy từ API
    const [transactions, setTransactions] = useState([]);
    // State chọn mốc thời gian: 'week' (7 ngày) hoặc 'month' (Tháng này)
    const [timeRange, setTimeRange] = useState('week');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await transactionService.getAll();
                const data = res.data;

                // Sắp xếp giao dịch mới nhất lên đầu
                const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setTransactions(sortedData);

                // 1. Tính tổng số dư, thu, chi toàn thời gian
                const income = data.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
                const expense = data.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

                setSummary({
                    income,
                    expense,
                    balance: income - expense
                });

            } catch (error) {
                console.error("Lỗi tải dữ liệu dashboard:", error);
            }
        };
        fetchData();
    }, []);

    // 2. Xử lý dữ liệu cho Biểu đồ mỗi khi 'transactions' hoặc 'timeRange' thay đổi
    useEffect(() => {
        if (!transactions) return;

        const processChartData = () => {
            let daysArray = [];
            const today = new Date();

            // A. Tạo khung thời gian (trục X)
            if (timeRange === 'week') {
                // Lấy 7 ngày gần nhất
                const start = subDays(today, 6);
                daysArray = eachDayOfInterval({ start, end: today });
            } else {
                // Lấy các ngày trong tháng hiện tại
                const start = startOfMonth(today);
                const end = endOfMonth(today);
                daysArray = eachDayOfInterval({ start, end });
            }

            // B. Đổ dữ liệu vào khung
            const processedData = daysArray.map(day => {
                // Tìm các giao dịch diễn ra trong ngày 'day'
                const dayTransactions = transactions.filter(t =>
                    isSameDay(new Date(t.date), day)
                );

                // Tính tổng thu/chi của ngày đó
                const income = dayTransactions
                    .filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0);

                const expense = dayTransactions
                    .filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0);

                // Định dạng nhãn trục X (VD: Thứ 2 hoặc 01/05)
                let label = "";
                if (timeRange === 'week') {
                    label = format(day, 'eeee', { locale: vi }); // Thứ Hai, Thứ Ba...
                    label = label.replace("Thứ ", "T"); // Rút gọn thành T2, T3...
                    if (label === "Chủ Nhật") label = "CN";
                } else {
                    label = format(day, 'dd/MM'); // 01/01
                }

                return {
                    name: label,
                    income,
                    expense,
                    fullDate: format(day, 'dd/MM/yyyy') // Lưu thêm để tooltip dùng nếu cần
                };
            });

            setChartData(processedData);
        };

        processChartData();
    }, [transactions, timeRange]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Header & Bộ lọc thời gian */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tổng quan tài chính</h1>
                    <p className="text-gray-500 text-sm">Cập nhật theo thời gian thực</p>
                </div>

                {/* Switch Tuần / Tháng */}
                <div className="bg-gray-100 p-1 rounded-xl flex w-fit">
                    <button
                        onClick={() => setTimeRange('week')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${timeRange === 'week' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        7 ngày qua
                    </button>
                    <button
                        onClick={() => setTimeRange('month')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${timeRange === 'month' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Tháng này
                    </button>
                </div>
            </div>

            {/* 3 Thẻ thống kê (Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Tổng số dư" amount={summary.balance} type="balance" />
                <StatCard title="Tổng thu nhập" amount={summary.income} type="income" trend={0} />
                <StatCard title="Tổng chi tiêu" amount={summary.expense} type="expense" trend={0} />
            </div>

            {/* Khu vực chính: Biểu đồ & Danh sách */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Cột trái (chiếm 2/3): Biểu đồ */}
                <div className="lg:col-span-2">
                    <WeeklyChart data={chartData} />
                </div>

                {/* Cột phải (chiếm 1/3): Giao dịch gần đây */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[400px] flex flex-col">
                    <h3 className="font-bold text-gray-800 mb-4">Giao dịch mới nhất</h3>

                    <div className="overflow-y-auto flex-1 pr-2 space-y-3 custom-scrollbar">
                        {transactions.length > 0 ? (
                            transactions.slice(0, 6).map((t, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition border border-transparent hover:border-gray-100 group">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                            {t.type === 'income' ? '↓' : '↑'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-gray-900 line-clamp-1">{t.category || "Khác"}</p>
                                            <p className="text-xs text-gray-400">{format(new Date(t.date), 'dd/MM/yyyy')}</p>
                                        </div>
                                    </div>
                                    <span className={`font-bold text-sm whitespace-nowrap ${t.type === 'income' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {t.type === 'income' ? '+' : '-'}{new Intl.NumberFormat('vi-VN').format(t.amount)}đ
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <p>Chưa có giao dịch nào</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

// xong rồi nhe