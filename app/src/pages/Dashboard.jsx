// src/pages/Dashboard.jsx
import AppNavbar from "@/components/AppNavbar";
import GraphRenderer from "@/components/GraphRenderer";

export default function Dashboard({ user, onLogout, onRefresh }) {
    return (
        <div className="min-h-screen flex flex-col">
            <AppNavbar
                user={user}
                onLogout={onLogout}
                onRefresh={onRefresh}
                links={[
                    { label: "Dashboard", to: "/" },
                    { label: "Grupos", to: "/groups" },
                ]}
            />

            <div className="flex-1 p-4">
                <GraphRenderer />
            </div>
        </div>
    );
}
