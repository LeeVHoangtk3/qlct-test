import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
    const isAuth = false; // Tạm thời để false để test vào trang Login
    return isAuth ? <Navigate to="/dashboard" /> : <Outlet />;
};
export default PublicRoute;