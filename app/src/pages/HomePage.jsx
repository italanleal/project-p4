import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import FancyBackground from "@/components/FancyGround.jsx";

export default function HomePage() {
    const navigate = useNavigate();

    const handleConsentRedirect = () => {
        navigate("/consent", { replace: true });
    };

    const handleCallbackRedirect = () => {
        navigate("/callback", { replace: true });
    };

    return (
        <FancyBackground>
            <div
                className="min-h-screen py-12 flex flex-col items-center">
                <header className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-300 text-transparent bg-clip-text p-2">
                        Connectify
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Descubra como seu gosto musical conecta você a outras pessoas através de gráficos interativos. Powered by Spotify.
                    </p>
                </header>

                <section className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
                    <FeatureCard
                        title="Faça login com Spotify"
                        description="Faça login com segurança usando sua conta do Spotify para começar a mapear seu mundo musical."
                    />
                    <FeatureCard
                        title="Visualizações baseadas em gráficos"
                        description="Veja como seus principais artistas, faixas e gêneros se conectam com os de outras pessoas."
                    />
                    <FeatureCard
                        title="Encontre seus gêmeos musicais"
                        description="Descubra pessoas que compartilham seu gosto musical e explore favoritos em comum."
                    />
                </section>

                <div className="mt-12 flex flex-col sm:flex-row gap-4">
                    <Button
                        onClick={handleConsentRedirect}
                        className="px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg bg-primary hover:bg-secondary/90"
                    >
                        Faça login pela primeira vez com Spotify
                    </Button>

                    <Button
                        variant="outline"
                        onClick={handleCallbackRedirect}
                        className="px-8 py-4 text-lg font-semibold rounded-2xl shadow-md border border-primary text-primary hover:bg-secondary hover:border-secondary"
                    >
                        Já tenho uma conta
                    </Button>
                </div>
            </div>
        </FancyBackground>
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
