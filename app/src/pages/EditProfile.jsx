import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function EditProfile({ user }) {
    const [displayName, setDisplayName] = useState(user?.display_name || "");
    const [bio, setBio] = useState("");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!user?.id) return;

        if (!displayName.trim()) {
            toast.error("Nome de exibição é obrigatório.");
            return;
        }

        try {
            setIsLoading(true); // ⬅️ Início do loading

            const response = await fetch("http://46.202.144.162:3051/api/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    displayName,
                    profileImageUrl: user.images[0].url,
                    biography: bio,
                }),
            });

            if (response.status === 409) {
                toast.error("Usuário já existe. Você não pode criar outro com o mesmo ID.");
                return;
            }

            if (!response.ok) {
                console.error("Erro desconhecido ao criar usuário.");
            }

            await fetch("http://46.202.144.162:3051/api/user/data", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            toast.success("Perfil criado com sucesso!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Erro ao criar perfil:", error);
            toast.error("Erro ao criar perfil", {
                description: "Tente novamente mais tarde.",
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-muted px-4 py-12">
            <Card className="w-full max-w-lg shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl text-emerald-700">Criar perfil</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <img
                            src={user?.images[0].url}
                            alt={user?.display_name}
                            className="w-16 h-16 rounded-full border"
                        />
                        <p className="text-muted-foreground text-sm">ID: {user?.id}</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="displayName">Nome de exibição</Label>
                        <Input
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Biografia</Label>
                        <Textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Conte um pouco sobre você..."
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="mt-4 w-full"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                                    Criando perfil...
                                </>
                            ) : (
                                "Criar Perfil"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

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
    );
}

