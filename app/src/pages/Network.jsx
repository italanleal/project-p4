import AppNavbar from "@/components/AppNavbar.jsx";
import React from "react";
import NetworkGraphRenderer from "@/components/NetworkGraphRenderer.jsx";

export default function Network({ user, onLogout, onLogoutFull, onRefresh }) {

    return (
        <div className="min-h-screen flex flex-col">
            <AppNavbar
                user={user}
                onLogout={onLogout}
                onRefresh={onRefresh}
                onLogoutFull={onLogoutFull}
                links={[{ label: "Rede", to: "/network" }, { label: "Dashboard", to: "/dashboard" }]}
            />

            <div className="flex-1 pt-4">
                <NetworkGraphRenderer user={user} onLogout={onLogout} onRefresh={onRefresh} onLogoutFull={onLogoutFull} />
            </div>
        </div>
    );
}