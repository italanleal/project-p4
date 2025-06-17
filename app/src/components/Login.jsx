import { redirectToSpotifyAuthorize } from "../auth/auth.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Login() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center px-4">
            <Card className="w-full max-w-xl p-8 rounded-2xl shadow-2xl text-center">
                <CardContent>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-300 inline-block text-transparent bg-clip-text">
                        Welcome to Connectify
                    </h1>

                    <Button
                        onClick={redirectToSpotifyAuthorize}
                        className="mt-6 bg-emerald-500 hover:bg-emerald-700 text-white px-6 py-3 text-lg rounded-2xl shadow-md"
                    >
                        Log in with Spotify
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
