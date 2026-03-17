import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AdminRoute({ children }) {
    const { user, loading } = useContext(AuthContext);

    // Wait until we know if the user is authenticated from local storage
    if (loading) return <div>Loading...</div>;

    // Check if user is logged in and if they have the admin role
    if (!user || user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}
