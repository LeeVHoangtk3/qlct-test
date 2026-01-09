import { NavLink } from "react-router-dom";
import { LayoutDashboard, Wallet, History, TrendingUp } from "lucide-react";

const Sidebar = () => {
    const menuItems = [
        { path: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
        { path: "/manager", label: "Quản lý thu chi", icon: Wallet },
        { path: "/history", label: "Lịch sử giao dịch", icon: History },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 hidden md:flex z-30">
            <div className="h-16 flex items-center px-6 border-b border-gray-100">
                <div className="flex items-center gap-2 text-blue-600">
                    <TrendingUp size={28} strokeWidth={2.5} />
                    <span className="text-xl font-bold tracking-tight">SmartFin.</span>
                </div>
            </div>
            <nav className="flex-1 py-6 px-3 space-y-1">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu chính</p>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive ? "bg-blue-50 text-blue-600 font-medium shadow-sm" : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        <item.icon size={20} className="group-hover:scale-110 transition-transform" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};
export default Sidebar;