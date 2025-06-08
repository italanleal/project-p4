import { redirectToSpotifyAuthorize } from '../auth/auth.js';

export default function Login() {
    return (
        <div className={"min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50"}>
            <div className={"container mx-auto py-12"}>
                <header className={"text-center mb-12"}>
                    <h1 className={"text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-300 inline-block text-transparent bg-clip-text"}>Welcome
                        to the Connectify</h1>
                </header>


            </div>
            <button
                className="mx-auto block mt-8 px-6 py-3 bg-emerald-500 hover:bg-emerald-800 text-white font-semibold rounded-2xl shadow-md transition duration-500"
                onClick={redirectToSpotifyAuthorize}
            >
                Log in with Spotify
            </button>
        </div>
    );
}
