import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useLogoutAndRedirect } from "@/hooks/useLogoutAndRedirect.js";
import AppNavbar from "@/components/AppNavbar.jsx";
import { useUser } from "@/context/UserProvider.jsx";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import FancyBackground from "@/components/FancyGround.jsx";

function UserProfile({ user, onLogout, onRefresh }) {
    const [displayName, setDisplayName] = useState(user.userDisplayName || "");
    const [bio, setBio] = useState(user.biography || "");
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [artists, setArtists] = useState([]);
    const [artistsLoading, setArtistsLoading] = useState(false);
    const vps = "https://b26cc315-7b34-4312-ae43-ac6761795181.vercel.app";

    const { login } = useUser();
    const { handleLogoutFull } = useLogoutAndRedirect();

    useEffect(() => {
        async function fetchArtists() {
            setArtistsLoading(true);
            try {
                const token = localStorage.getItem("access_token");

                const artistsResponse = await fetch(`${vps}/api/user/artists`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!artistsResponse.ok) {
                    throw new Error("Falha ao carregar artistas.");
                }

                const artistsData = await artistsResponse.json();

                const parsedArtists = artistsData.map((item) => {
                    const artistObj = item._fields[0];
                    return {
                        id: artistObj.elementId,
                        name: artistObj.properties.artistName,
                    };
                });

                setArtists(parsedArtists);
            } catch (error) {
                console.error(error);
                toast.error("Erro ao carregar artistas.");
            } finally {
                setArtistsLoading(false);
            }
        }

        fetchArtists();
    }, []);

    const handleSaveChanges = async () => {
        try {
            setLoading(true);

            const payload = {
                userDisplayName: displayName,
                biography: bio,
                userId: user.id,
                profileImageUrl: user.profileImageUrl,
            };

            const res = await fetch(vps+"/api/user/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error("Falha ao salvar alterações.");
            }

            const response = await fetch(vps+"/api/user/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Erro ao buscar dados atualizados.");
            }

            const updatedUser = await response.json();
            login(updatedUser);

            toast.success("Perfil atualizado com sucesso!");
            setIsEditingProfile(false);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao atualizar perfil.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        const res = await fetch(vps+"/api/user/", {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        if (res.status === 204) {
            toast.error("Conta removida com sucesso!.");
            handleLogoutFull();
        } else {
            toast.error("Erro ao tentar remover perfil.\nErro: " + res.statusText);
        }
    };

    return (
        <div className="min-h-screen bg-muted/50">
            <AppNavbar
                user={user}
                onLogout={onLogout}
                onRefresh={onRefresh}
                links={[
                    { label: "Rede", to: "/network" },
                    { label: "Dashboard", to: "/dashboard" },
                ]}
            />
            <FancyBackground>
                <main className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
                    {/* Sidebar lateral */}
                    <aside className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Seus artistas</h2>
                        {artistsLoading ? (
                            <p className="text-sm text-muted-foreground">Carregando artistas...</p>
                        ) : artists.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Nenhum artista encontrado.</p>
                        ) : (
                            <ul className="space-y-3 max-h-[70vh] overflow-auto pr-2">
                                {artists.map((artist) => (
                                    <li key={artist.id} className="border-b border-gray-100 pb-2">
                                        <p className="font-medium text-foreground">{artist.name}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </aside>

                    {/* Conteúdo principal */}
                    <section className="flex flex-col gap-6">
                        <Card className="border border-gray-200 shadow-lg rounded-2xl">
                            <CardHeader className="pb-0">
                                <CardTitle className="text-2xl">
                                    {isEditingProfile ? "Editar Perfil" : `Perfil de ${user.userDisplayName}`}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-4 text-base text-muted-foreground">
                                {isEditingProfile ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1">
                                                Nome de Exibição
                                            </label>
                                            <Input
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                placeholder="Seu nome"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1">
                                                Biografia
                                            </label>
                                            <Textarea
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                placeholder="Conte um pouco sobre você..."
                                                className="min-h-[120px]"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p><strong>ID do Spotify:</strong> {user.userId}</p>
                                        <p><strong>Biografia:</strong> {bio || "Sem biografia cadastrada."}</p>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex flex-wrap gap-2">
                                {!isEditingProfile ? (
                                    <Button onClick={() => setIsEditingProfile(true)}>
                                        Atualizar Dados
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            onClick={handleSaveChanges}
                                            disabled={loading || !displayName.trim()}
                                        >
                                            {loading ? "Salvando..." : "Salvar Alterações"}
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setIsEditingProfile(false);
                                                setDisplayName(user.userDisplayName || "");
                                                setBio(user.biography || "");
                                            }}
                                            variant="outline"
                                        >
                                            Cancelar
                                        </Button>
                                    </>
                                )}
                                <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive">Deletar conta</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Confirmar exclusão</DialogTitle>
                                            <DialogDescription>
                                                Tem certeza de que deseja excluir sua conta? Esta ação é irreversível e
                                                todos os seus dados serão perdidos.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
                                                Cancelar
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => {
                                                    setConfirmDeleteOpen(false);
                                                    handleDeleteAccount();
                                                }}
                                            >
                                                Confirmar exclusão
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <Button onClick={onLogout} variant="outline">
                                    Logout
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground text-center sm:text-right">
                                Seus dados podem ser atualizados a qualquer momento.
                            </p>
                        </div>
                    </section>
                </main>
            </FancyBackground>
        </div>
    );
}

export default UserProfile;
