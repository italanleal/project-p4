import AppNavbar from "@/components/AppNavbar.jsx";
import React, { useEffect, useState, useRef } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.jsx";
import CytoscapeComponent from "react-cytoscapejs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {useGraphSelection} from "@/hooks/useGraphSelection.jsx";

export default function Network({ user, onLogout, onRefresh, onLogoutFull }) {
    const [elements, setElements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const cyRef = useRef(null);

    const {
        selectedUsers,
        selectedArtist,
        handleNodeClick,
        clearHighlights,
    } = useGraphSelection(cyRef);

    const vps = "http://46.202.144.162:3051";
    const filterOptions = [
        { label: "Artists/index", value: "tracks", endpoint: `${vps}/api/artist/index` },
        { label: "Artists/:id", value: "artists/:id", endpoint: `${vps}/api/network` },
    ];

    useEffect(() => {
        const fetchGraphData = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("access_token");

                const artistsResponse = await fetch(filterOptions[0].endpoint, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });
                const artists = await artistsResponse.json();

                const networkResponse = await fetch(filterOptions[1].endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(artists),
                });

                if (!networkResponse.ok) {
                    throw new Error("Erro ao buscar grafo: " + networkResponse.statusText);
                }

                const { data: rawData } = await networkResponse.json();
                const nodeMap = new Map();
                const edgeMap = new Map();

                for (const entry of rawData) {
                    const [user, rel1, track, rel2, artist] = entry._fields;

                    nodeMap.set(user.elementId, {
                        data: {
                            id: user.elementId,
                            label: user.properties?.userDisplayName,
                            type: "User",
                            image: user.properties?.profileImageUrl?.trim() || null,
                        },
                    });

                    nodeMap.set(track.elementId, {
                        data: {
                            id: track.elementId,
                            label: track.properties?.trackName,
                            type: "Track",
                            image: track.properties?.albumImageUrl || null,
                        },
                    });

                    nodeMap.set(artist.elementId, {
                        data: {
                            id: artist.elementId,
                            label: artist.properties?.artistName,
                            type: "Artist",
                        },
                    });

                    edgeMap.set(rel1.elementId, {
                        data: {
                            id: rel1.elementId,
                            source: rel1.startNodeElementId,
                            target: rel1.endNodeElementId,
                            label: "",
                        },
                    });

                    edgeMap.set(rel2.elementId, {
                        data: {
                            id: rel2.elementId,
                            source: rel2.startNodeElementId,
                            target: rel2.endNodeElementId,
                            label: "",
                        },
                    });
                }

                setElements([...nodeMap.values(), ...edgeMap.values()]);
            } catch (err) {
                console.error(err);
                setError(err.message);
                setElements([]);
                toast.error("Erro ao carregar grafo", { description: err.message });
            } finally {
                setLoading(false);
            }
        };

        fetchGraphData();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <AppNavbar
                user={user}
                onLogout={onLogout}
                onRefresh={onRefresh}
                onLogoutFull={onLogoutFull}
                links={[{label: "Rede", to: "/network"}, {label: "Dashboard", to: "/dashboard"}]}
            />

            <div className="flex items-center gap-4 px-4 py-2 min-h-[48px]">
                <div className="flex flex-wrap gap-2">
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
                {(selectedUsers.length > 0 || selectedArtist) ? (
                    <Button variant="outline" onClick={() => clearHighlights(false)}>
                        Limpar seleção
                    </Button>
                ) : (
                    <div className="invisible">
                        <Button variant="outline">Limpar seleção</Button>
                    </div>
                )}
            </div>


            <div className="flex flex-col gap-4 px-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Erro</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Button onClick={onRefresh} className="w-fit">
                    Recarregar grafo
                </Button>

                {loading ? (
                    <div className="text-center text-muted-foreground">Carregando grafo...</div>
                ) : (
                    <CytoscapeComponent
                        cy={(cy) => {
                            cyRef.current = cy;
                            cy.on("tap", "node", handleNodeClick);
                        }}
                        elements={elements}
                        style={{width: "100%", height: "90vh", border: "1px solid #ccc"}}
                        layout={{
                            name: "cose",
                            padding: 100,
                            idealEdgeLength: 200,
                            nodeRepulsion: 10000,
                            edgeElasticity: 200,
                            gravity: 120,
                            numIter: 1500,
                            animate: true,
                        }}
                        stylesheet={[
                            {
                                selector: "node",
                                style: {
                                    "background-fit": "cover",
                                    "background-image": "data(image)",
                                    "background-color": "#ccc",
                                    shape: "ellipse",
                                    width: 60,
                                    height: 60,
                                    label: "data(label)",
                                    "text-valign": "bottom",
                                    "text-halign": "center",
                                    "font-size": "10px",
                                    color: "#333",
                                    "border-width": 2,
                                    "border-color": "#5a856e",
                                    "text-outline-width": 1,
                                    "text-outline-color": "#fff",
                                },
                            },
                            {
                                selector: ".selected-user",
                                style: {
                                    "border-width": 5,
                                    "border-color": "#42a5f5",
                                    opacity: 1,
                                },
                            },
                            {
                                selector: ".selected-artist",
                                style: {
                                    "border-width": 5,
                                    "border-color": "#26a69a",
                                    opacity: 1,
                                },
                            },
                            {
                                selector: ".faded",
                                style: {opacity: 0.1},
                            },
                            {
                                selector: ".highlighted",
                                style: {
                                    opacity: 1,
                                    "border-width": 4,
                                    "border-color": "#ff9800",
                                },
                            },
                            {
                                selector: "node[type = 'User']",
                                style: {width: 80, height: 80},
                            },
                            {
                                selector: "node[type = 'Artist']",
                                style: {width: 50, height: 50},
                            },
                            {
                                selector: "edge",
                                style: {
                                    label: "data(label)",
                                    width: 2,
                                    "line-color": "#999",
                                    "target-arrow-color": "#999",
                                    "target-arrow-shape": "triangle",
                                    "curve-style": "bezier",
                                    "font-size": "8px",
                                    color: "#555",
                                },
                            },
                        ]}
                        boxSelectionEnabled={true}
                        userZoomingEnabled={true}
                        userPanningEnabled={true}
                    />
                )}
            </div>
        </div>
    );
}