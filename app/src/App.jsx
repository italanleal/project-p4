import { Routes, Route, Navigate } from "react-router-dom";
import {UserProvider, useUser} from "@/context/UserProvider";


import Consent from "@/pages/Consent";
import CallbackPage from "@/pages/CallbackPage";
import UserProfile from "@/pages/UserProfile";
import Dashboard from "@/pages/Dashboard";
import HomePage from "@/pages/HomePage";
import EditProfile from "@/pages/EditProfile.jsx";
import Network from "@/pages/Network.jsx";
import { Toaster } from "sonner";
import {LoadingSpinner} from "@/components/LoadingSpinner.jsx";

function AppRoutes() {
    const { user, loading, logout, logoutFull, refresh } = useUser();

    if (loading) {
        return <LoadingSpinner/>;
    }

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/consent" element={<Consent />} />
            <Route path="/edit" element={<EditProfile user={user} />} />
            <Route path="/network" element={<Network user={user} onLogout={logout} onLogoutFull={logoutFull} onRefresh={refresh} />} />
            <Route path="/callback" element={<CallbackPage />} />
            <Route path="/profile" element={<UserProfile user={user} onLogout={logout} onRefresh={refresh} />} />
            <Route path="/dashboard" element={<Dashboard user={user} onLogout={logout} onLogoutFull={logoutFull} onRefresh={refresh} />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}


export default function App() {
    return (
        <UserProvider>
            <AppRoutes />
            <Toaster richColors position="top-center" closeButton />
        </UserProvider>
    );
}
