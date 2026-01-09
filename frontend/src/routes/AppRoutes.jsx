import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import AppLayout from "../layouts/AppLayout";
import AuthLayout from "../layouts/AuthLayout";

// Import Pages
import Dashboard from "../pages/dashboard";
import Manager from "../pages/manager";
import History from "../pages/history";
import Settings from "../pages/settings";
import Login from "../pages/login";
import Signup from "../pages/signup";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Route công khai */}
            <Route element={<PublicRoute />}>
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Route>
            </Route>

            {/* Route Nội bộ (Cần đăng nhập) */}
            <Route element={<PrivateRoute />}>
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/manager" element={<Manager />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
            </Route>

            {/* Mặc định về dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}