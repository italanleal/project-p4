import { useEffect } from "react";
import { getToken, currentToken, getUserData } from "../auth/auth.js";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "./LoadingSpinner.jsx";

export default function Callback({ setUser }) {
    const navigate = useNavigate();

    useEffect(() => {
        const args = new URLSearchParams(window.location.search);
        const code = args.get("code");

        if (code) {
            getToken(code)
                .then(async (token) => {
                    if (token.error) {
                        console.error("Token error response:", token);
                        return;
                    }
                    currentToken.save(token);

                    // Pega dados do usuário e atualiza estado global no App
                    const userData = await getUserData();
                    if (userData && setUser) {
                        setUser(userData);
                    }

                    // Limpa a URL da query string
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.delete("code");
                    window.history.replaceState({}, document.title, newUrl.toString());

                    navigate("/");
                })
                .catch((err) => {
                    console.error("Token request failed:", err);
                });
        } else {
            console.warn("No authorization code found in URL.");
        }
    }, [navigate, setUser]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
            <Card className="w-full max-w-sm text-center p-6">
                <CardContent>
                    <LoadingSpinner className="mx-auto mb-6" size="md" />
                    <p className="text-lg font-medium text-gray-700">Processing login...</p>
                </CardContent>
            </Card>
        </div>
    );
}
