import {Checkbox} from "@/components/ui/checkbox.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.jsx";
import GraphDisplay from "@/components/GraphDisplay.jsx";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.jsx";
import React, {useRef} from "react";
import {useGraphSelection} from "@/hooks/useGraphSelection.jsx";
import { Badge } from "@/components/ui/badge.jsx";

export default function GraphFullComponent({elements,
                                  tracksChecked, setTracksChecked,
                                  artistsChecked, setArtistsChecked,
                                  error, loading, selectedTrackId,
                                  setSelectedTrackId,
                                  showFilters
                                           }) {

    const cyRef = useRef(null);
    const {
        selectedUsers,
        selectedArtist,
        handleNodeClick,
        handleNodeDoubleClick,
        clearHighlights,
    } = useGraphSelection(cyRef, setSelectedTrackId);
    return (
        <div className="min-h-screen flex flex-col shadow-md bg-card px-4">

            <div className="flex flex-col">
                <div className="flex items-center p-2 min-h-[48px] bg-muted/30 shadow-inner border rounded-t-lg">
                    {showFilters && (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Checkbox id="chk-tracks" checked={tracksChecked}
                                          onCheckedChange={() => setTracksChecked(v => !v)}/>
                                <Label htmlFor="chk-tracks">Faixas</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="chk-artists" checked={artistsChecked}
                                          onCheckedChange={() => setArtistsChecked(v => !v)}/>
                                <Label htmlFor="chk-artists">Artistas</Label>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2 px-3">
                        {(selectedUsers.length > 0 || selectedArtist) ? (
                            <>
                                {selectedUsers.map((id) => {
                                    const label = cyRef.current?.getElementById(id).data("label");
                                    return <Badge key={id}>{label || id}</Badge>;
                                })}
                                {selectedArtist && selectedUsers.length === 0 && (
                                    <Badge>{cyRef.current?.getElementById(selectedArtist).data("label")}</Badge>
                                )}
                            </>
                        ) : (
                            <div className="invisible">
                                <Badge>placeholder</Badge>
                            </div>
                        )}
                    </div>
                    <div className="ml-auto">
                        {(selectedUsers.length > 0 || selectedArtist) ? (
                            <Button variant="outline" onClick={() => clearHighlights()}>
                                Limpar seleção
                            </Button>
                        ) : (
                            <div className="invisible">
                                <Button variant="outline">Limpar seleção</Button>
                            </div>
                        )}
                    </div>

                </div>
                {error && (
                    <Alert variant="destructive" className="shadow-lg border-destructive/50">
                        <AlertTitle>Erro</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {loading ? (
                    <div className="text-center text-muted-foreground">Carregando grafo...</div>
                ) : (
                    <GraphDisplay
                        elements={elements}
                        cyRef={cyRef}
                        handleNodeClick={handleNodeClick}
                        handleDoubleClick={handleNodeDoubleClick}
                    />
                )}
            </div>

            <Dialog open={!!selectedTrackId} onOpenChange={() => setSelectedTrackId(null)}>
                <DialogContent className="max-w-xl bg-card shadow-xl border border-border rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Reproduzindo faixa</DialogTitle>
                    </DialogHeader>
                    {selectedTrackId ? (
                        <iframe
                            title="Spotify Player"
                            className="rounded-xl w-full aspect-video"
                            style={{borderRadius: "12px"}}
                            src={`https://open.spotify.com/embed/track/${selectedTrackId}?utm_source=generator`}
                            width="100%"
                            height="352"
                            allowFullScreen
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        />
                    ) : (
                        <p>Faixa não encontrada.</p>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}