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
    const token = localStorage.getItem("jwt");
    let user;

    if (token) {
        try {
            user = jwtDecode(token);
        } catch (error) {
            console.error("Invalid token:", error);
        }
    }

    return (
        <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="auth/*" element={<Auth />} />
            <Route path="admin/*" element={user && ((user.userType === "medecin") || (user.userType === "Medecin")) ? <AdminLayout /> : <Navigate to="/login" />} />
            <Route path="rtl/*" element={<RtlLayout />} />
            <Route path="user/*" element={<UserPage />} />
            <Route path="patient/*" element={user && ((user.userType === "patient") || (user.userType === "Patient")) ? <PatientLayout /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/patient" />} />
        </Routes>
    );
}

export default App;
