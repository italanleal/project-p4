import AppNavbar from "@/components/AppNavbar";
import PersonalGraphRenderer from "@/components/PersonalGraphRenderer.jsx";
import React from "react";

export default function Dashboard({ user, onLogout, onLogoutFull, onRefresh }) {

    return (
        <div className="min-h-screen flex flex-col">
            <AppNavbar
                user={user}
                onLogout={onLogout}
                onRefresh={onRefresh}
                onLogoutFull={onLogoutFull}
                links={[{ label: "Rede", to: "/network" }, { label: "Dashboard", to: "/dashboard" }]}
            />

            <div className="flex-1 p-4">
                <PersonalGraphRenderer user={user} onLogout={onLogout} onRefresh={onRefresh} onLogoutFull={onLogoutFull} />
            </div>
        </div>
    );
}
