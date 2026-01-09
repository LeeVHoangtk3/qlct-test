import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";

const StatCard = ({ title, amount, type = "balance", trend }) => {
    const styles = {
        balance: { bg: "bg-blue-600", text: "text-white", icon: <Wallet className="text-blue-100" size={24} />, subtext: "text-blue-100" },
        income: { bg: "bg-white", text: "text-gray-900", icon: <ArrowUpRight className="text-green-500" size={24} />, subtext: "text-gray-500", border: "border border-gray-100" },
        expense: { bg: "bg-white", text: "text-gray-900", icon: <ArrowDownRight className="text-red-500" size={24} />, subtext: "text-gray-500", border: "border border-gray-100" }
    };
    const style = styles[type];
    return (
        <div className={`p-6 rounded-2xl shadow-sm ${style.bg} ${style.border || ''}`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${type === 'balance' ? 'bg-white/20' : 'bg-gray-50'}`}>{style.icon}</div>
                {trend && <span className={`text-sm font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'} bg-gray-50 px-2 py-1 rounded-full`}>{trend > 0 ? "+" : ""}{trend}%</span>}
            </div>
            <div><p className={`text-sm font-medium mb-1 ${style.subtext}`}>{title}</p><h3 className={`text-2xl font-bold ${style.text}`}>{amount.toLocaleString('vi-VN')} ₫</h3></div>
        </div>
    );
};
export default StatCard;