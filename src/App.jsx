import { Routes, Route, Navigate } from "react-router-dom";
import './index.css';

import Auth from "./layouts/auth";
import AdminLayout from "./layouts/admin";
import RtlLayout from "./layouts/rtl";
import UserPage from "./layouts/user";
import PatientLayout from "./layouts/Patient";
import WelcomeScreen from "./components/welcomeScreen/WelcomeScreen";
import Login from "./views/auth/SignIn";
import Signup from "./views/auth/SignUpForm";
import jwtDecode from 'jwt-decode';

function App() {
    let user;

    const token = localStorage.getItem("jwt");
    if (token) {
        try {
            user = jwtDecode(token);
        } catch (error) {
            console.error("Invalid token:", error);
            // Redirect to login if the token is invalid
            return <Navigate to="/login" />;
        }
    }

    return (
        <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="auth/*" element={<Auth />} />
            <Route path="admin/*" element={user && user.userType.toLowerCase() === "medecin" ? <AdminLayout /> : <Navigate to="/login" />} />
            <Route path="rtl/*" element={<RtlLayout />} />
            <Route path="user/*" element={<UserPage />} />
            <Route path="patient/*" element={user && user.userType.toLowerCase() === "patient" ? <PatientLayout /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/patient" />} />
        </Routes>
    );
}

export default App;
