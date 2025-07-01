import { Routes, Route, Navigate, useNavigate} from "react-router-dom";
import { useState } from "react";
import { UserProvider } from "@/context/UserProvider";

import Consent from "@/pages/Consent";
import CallbackPage from "@/pages/CallbackPage";
import UserProfile from "@/pages/UserProfile";
import Dashboard from "@/pages/Dashboard";
import HomePage from "@/pages/HomePage";
import EditProfile from "@/pages/EditProfile.jsx";
import {Toaster} from "sonner";

export default function App() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const onLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
    };
    const onSetUser = (userData) => {
        setUser(userData);
    };

    const onRefresh = async () => {
        const res = await fetch("/api/user");
        const updated = await res.json();
        setUser(updated);
    };


    return (
        <UserProvider user={user} onLogout={onLogout} onRefresh={onRefresh}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/consent" element={<Consent />} />
                    <Route path="/edit" element={<EditProfile user={user} />} />
                    <Route path="/callback" element={<CallbackPage onSetUser={onSetUser} />} />
                    <Route path="/profile" element={<UserProfile user={user} onLogout={onLogout} />} />
                    <Route path="/dashboard" element={<Dashboard user={user} onLogout={onLogout} onRefresh={onRefresh} />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            <Toaster/>
        </UserProvider>

    );
}
