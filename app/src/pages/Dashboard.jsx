// src/pages/Dashboard.jsx
import AppNavbar from "@/components/AppNavbar";
import GraphRenderer from "@/components/GraphRenderer";

import {Button} from "@/components/ui/button.jsx";
import {useNavigate} from "react-router-dom";

export default function Dashboard({ user, onLogout, onRefresh }) {
    const navigate = useNavigate();
    console.log(user);

    return (
        <div className="min-h-screen flex flex-col">
            <AppNavbar
                user={user}
                onLogout={onLogout}
                onRefresh={onRefresh}
                links={[

                    { label: "Rede", to: "/rede" },
                    { label: "Dashboard", to: "/dashboard" },

                ]}
            />

            <div className="flex-1 p-4">
                <GraphRenderer />
                    <Button
                        variant="destructive"
                        className="absolute bottom-4 right-4"
                        onClick={() => {
                            localStorage.removeItem("consent_data");
                            navigate("/");
                        }}
                    >
                        Limpar Consentimento
                    </Button>

            </div>
        </div>
    );
}
