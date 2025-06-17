import DashboardGraphs from "@/components/DashboardGraphs";
import AppNavbar from "@/components/AppNavbar";

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

            <div className="flex-1 bg-gradient-to-br from-background to-muted flex flex-col items-center justify-start px-4 py-12 space-y-8">
                <DashboardGraphs />
            </div>
        </div>
    );
}
