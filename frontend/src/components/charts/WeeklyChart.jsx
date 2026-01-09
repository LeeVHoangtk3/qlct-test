import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// 1. Nhận props { data } từ Dashboard truyền vào
const WeeklyChart = ({ data }) => {

    // Hàm format số tiền cho trục Y (VD: 1000000 -> 1tr)
    const formatYAxis = (value) => {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}tr`;
        if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
        return value;
    };

    // Hàm format tooltip (hiện số tiền đầy đủ khi di chuột vào)
    const formatTooltip = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px]">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Hoạt động tài chính</h3>
                    <p className="text-sm text-gray-400">Thống kê thu nhập và chi tiêu</p>
                </div>
            </div>

            <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barSize={20}> {/* Tăng barSize lên 20 cho dễ nhìn */}
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />

                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            dy={10}
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            tickFormatter={formatYAxis} // Áp dụng rút gọn số
                        />

                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            cursor={{ fill: '#f9fafb' }}
                            formatter={formatTooltip} // Format tiền tệ VNĐ
                        />

                        <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />

                        <Bar
                            dataKey="income"
                            name="Thu nhập"
                            fill="#22c55e"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="expense"
                            name="Chi tiêu"
                            fill="#ef4444"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default WeeklyChart;