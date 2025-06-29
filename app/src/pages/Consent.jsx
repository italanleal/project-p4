import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import { redirectToSpotifyAuthorize } from "@/pages/CallbackPage.jsx";

export default function Consent() {
    const [agreed, setAgreed] = useState(false);
    const [name, setName] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    // Redireciona se já tiver consentimento salvo
    useEffect(() => {
        const consent = localStorage.getItem("consent_data");
        if (consent) {
            navigate("/callback");
        }
    }, []);

    const handleConfirmConsent = () => {
        const timestamp = new Date().toISOString();

        const consentData = {
            name,
            timestamp,
            agreed: true,
        };

        localStorage.setItem("consent_data", JSON.stringify(consentData));
        redirectToSpotifyAuthorize();
    };

    const isFormValid = agreed && name.trim().length > 1;

    return (
        <div className="min-h-screen bg-muted flex items-center justify-center px-4 py-8">
            <Card className="w-full max-w-xl shadow-2xl">
                <CardHeader className="flex flex-col items-center space-y-2">
                    <img
                        src="https://storage.googleapis.com/pr-newsroom-wp/1/2022/11/Spotify_Logo_CMYK_Green.png"
                        alt="Connectify Logo"
                        className="h-10"
                    />
                    <CardTitle className="text-xl text-emerald-700 font-bold text-center">
                        Termo de Consentimento
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    <ScrollArea className="h-64 pr-4 rounded border p-4 bg-background">
                        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                            <p>
                                Este aplicativo usa sua conta do Spotify para criar um painel interativo de conexões
                                musicais. Para isso, precisamos acessar:
                            </p>
                            <ul className="list-disc list-inside pl-4">
                                <li>Seu nome e imagem de perfil</li>
                                <li>Seu e-mail</li>
                                <li>Seus artistas e faixas mais ouvidos</li>
                            </ul>
                            <p>
                                Seus dados não serão compartilhados com terceiros, e você pode revogar o acesso a
                                qualquer momento nas configurações do Spotify.
                            </p>
                            <p>
                                O consentimento é necessário apenas uma vez e pode ser visualizado novamente no seu
                                perfil.
                            </p>
                        </div>
                    </ScrollArea>

                    <div className="space-y-3">
                        <div>
                            <Label htmlFor="name">Assinatura (seu nome completo)</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Digite seu nome"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox id="consent" checked={agreed} onCheckedChange={setAgreed} />
                            <Label htmlFor="consent" className="text-sm text-muted-foreground">
                                Li e concordo com os termos acima.
                            </Label>
                        </div>

                        <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                            <DialogTrigger asChild>
                                <Button
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                    disabled={!isFormValid}
                                >
                                    Concordar e continuar com Spotify
                                </Button>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Confirmar consentimento</DialogTitle>
                                    <DialogDescription>
                                        Tem certeza de que deseja continuar com os dados informados? Esta ação salvará
                                        sua aceitação junto com seu nome e data atual.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="p-2 text-sm text-muted-foreground">
                                    <p><strong>Nome:</strong> {name}</p>
                                    <p><strong>Data:</strong> {new Date().toLocaleString()}</p>
                                </div>

                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setShowConfirm(false)}>
                                        Cancelar
                                    </Button>
                                    <Button onClick={handleConfirmConsent} className="bg-emerald-600 text-white">
                                        Confirmar
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
