import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = sessionStorage.getItem('token'); // Use sessionStorage instead of localStorage

    if (!token) {
        // Redirect to login if no token is found
        return <Navigate to="/login" />;
    }

    return <Outlet />; // Render the child routes
};

export default ProtectedRoute;