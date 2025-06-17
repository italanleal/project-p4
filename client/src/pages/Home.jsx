import { redirectToSpotifyAuthorize } from "@/auth/auth.js";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 px-6 py-12 flex flex-col items-center">
            <header className="text-center mb-16">
                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-300 text-transparent bg-clip-text">
                    Connectify
                </h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Discover how your music taste connects with others through interactive graphs. Powered by Spotify.
                </p>
            </header>

            <section className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
                <FeatureCard
                    title="Log in with Spotify"
                    description="Securely log in using your Spotify account to begin mapping your music world."
                />
                <FeatureCard
                    title="Graph-Based Visualizations"
                    description="See how your top artists, tracks, and genres connect to others."
                />
                <FeatureCard
                    title="Find Your Music Twins"
                    description="Discover people who share your taste in music and explore shared favorites."
                />
            </section>

            <Button
                onClick={redirectToSpotifyAuthorize}
                className="mt-12 px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg bg-primary hover:bg-primary/90"
            >
                Log in with Spotify
            </Button>
        </div>
    );
}

function FeatureCard({ title, description }) {
    return (
        <Card className="text-center min-w-[240px]">
            <CardHeader>
                <CardTitle className="text-emerald-600">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}

