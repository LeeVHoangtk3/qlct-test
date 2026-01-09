import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import ChatWidget from "../components/chatbot/ChatWidget";

const AppLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
                <Header />
                <main className="p-6 overflow-auto pb-24">
                    <Outlet />
                </main>
                <ChatWidget />
            </div>
        </div>
    );
};
export default AppLayout;