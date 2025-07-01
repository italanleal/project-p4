import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import AppNavbar from "@/components/AppNavbar.jsx";

function UserProfile({ user, onLogout, onRefresh }) {
    const [bio, setBio] = useState(user.biography || "");

    const [editingBio, setEditingBio] = useState(false);
    const [interests, setInterests] = useState(user.interests || []);
    const genres = ["Pop", "Rock", "Hip-Hop", "Jazz", "Indie"];

    const handleBioSave = () => {
        // TODO: Salvar bio via backend
        setEditingBio(false);
        toast.success("Biografia salva com sucesso.");
    };

    const handleInterestToggle = (genre) => {
        setInterests((prev) =>
            prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
        );
    };

    const handleDeleteAccount = () => {
        // TODO: Remoção de dados via backend
        toast.error("Solicitação de remoção de dados enviada.");
    };

    return (
        <div className="min-h-screen flex flex-col space-y-6">
            <AppNavbar
                user={user}
                onLogout={onLogout}
                onRefresh={onRefresh}
                links={[
                    {label: "Rede", to: "/rede"},
                    {label: "Dashboard", to: "/dashboard"},

                ]}
            />
            <div className={"flex justify-start space-x-10"}>
                <Card>
                    <CardHeader>

                        <CardTitle>Perfil de {user.userDisplayName}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>ID do Spotify:</strong> {user.userId}</p>

                        <p><strong>Top Artistas:</strong> {user.topArtists?.join(", ") || "Não disponível"}</p>
                        <p><strong>Top Faixas:</strong> {user.topTracks?.join(", ") || "Não disponível"}</p>
                    </CardContent>
                </Card>
                <Card className={"col-1"}>
                    <CardHeader>
                        <CardTitle>Biografia</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {editingBio ? (
                            <>
                                <Textarea value={bio} onChange={(e) => setBio(e.target.value)}/>
                                <Button onClick={handleBioSave}>Salvar</Button>
                            </>
                        ) : (
                            <>
                                <p>{bio || "Sem biografia cadastrada."}</p>
                                <Button variant="secondary" onClick={() => setEditingBio(true)}>
                                    Editar Biografia
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Interesses Musicais</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {genres.map((genre) => (
                            <Badge
                                key={genre}
                                variant={interests.includes(genre) ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => handleInterestToggle(genre)}
                            >
                                {genre}
                            </Badge>
                        ))}
                    </CardContent>
                </Card>
            </div>


            <Separator/>

            <div className="flex flex-wrap gap-2">
                <Button onClick={onRefresh}>Atualizar Dados</Button>
                <Button onClick={handleDeleteAccount} variant="destructive">
                    Deletar conta
                </Button>
                <Button onClick={onLogout} variant="outline">
                    Logout
                </Button>
            </div>
        </div>
    );
}

export default UserProfile;
