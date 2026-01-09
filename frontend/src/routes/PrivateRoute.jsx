import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const isAuth = true; // Tạm thời để true để test vào Dashboard
    return isAuth ? <Outlet /> : <Navigate to="/login" />;
};
export default PrivateRoute;