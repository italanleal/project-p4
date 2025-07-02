import React, { useEffect, useRef, useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import {
    Alert, AlertDescription, AlertTitle
} from "@/components/ui/alert";
import { useGraphSelection } from "@/hooks/useGraphSelection.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function GraphRenderer() {
    const [elements, setElements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tracksChecked, setTracksChecked] = useState(true);
    const [artistsChecked, setArtistsChecked] = useState(false);
    const cyRef = useRef(null);

    const {
        selectedUsers,
        selectedArtist,
        handleNodeClick,
        clearHighlights,
    } = useGraphSelection(cyRef);

    const vps = "http://46.202.144.162:3051"
    async function fetchGraphData() {
        setLoading(true);
        setError(null);
        try {
            let selectedEndpoint = null;
            if (tracksChecked && artistsChecked) {
                selectedEndpoint = vps+"/api/user/artistsandtracks"
            } else if (tracksChecked && !artistsChecked) {
                selectedEndpoint = vps+"/api/user/tracks"
            } else if (!tracksChecked && artistsChecked) {
                selectedEndpoint = vps+"/api/user/artists"
            } else {
                setElements([]);
                return;
            }

            const response = await fetch(selectedEndpoint, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            if (!response.ok) console.error("Erro ao buscar o grafo: " + response.statusText);

            const raw = await response.json();

            const nodeMap = new Map();
            const edgeMap = new Map();

            for (const entry of raw) {
                const fields = entry._fields;

                if (fields.length === 1) {
                    const user = JSON.parse(localStorage.getItem("user") || "{}");
                    const userId = "user:central";

                    nodeMap.set(userId, {
                        data: {
                            id: userId,
                            label: user.displayName || "Você",
                            type: "User",
                            image: user.profileImageUrl || null,
                        }
                    });

                    for (const entry of raw) {
                        const artist = entry._fields[0];

                        nodeMap.set(artist.elementId, {
                            data: {
                                id: artist.elementId,
                                label: artist.properties.artistName,
                                type: "Artist"
                            }
                        });

                        edgeMap.set(`${userId}->${artist.elementId}`, {
                            data: {
                                id: `${userId}->${artist.elementId}`,
                                source: userId,
                                target: artist.elementId,
                                label: ""
                            }
                        });
                    }
                }

                if(fields.length === 3){
                    const [user, rel1, track] = fields;
                    nodeMap.set(user.elementId, {
                        data: {
                            id: user.elementId,
                            label: user.properties?.userDisplayName,
                            type: "User",
                            image: user.properties?.profileImageUrl?.trim() || null
                        }
                    });

                    nodeMap.set(track.elementId, {
                        data: {
                            id: track.elementId,
                            label: track.properties?.trackName,
                            type: "Track",
                            image: track.properties?.albumImageUrl || null
                        }
                    });

                    edgeMap.set(rel1.elementId, {
                        data: {
                            id: rel1.elementId,
                            source: rel1.startNodeElementId,
                            target: rel1.endNodeElementId,
                            label: ""
                        }
                    });
                }

                if (fields.length === 5) {
                    const [user, rel1, track, rel2, artist] = fields;

                    nodeMap.set(user.elementId, {
                        data: {
                            id: user.elementId,
                            label: user.properties?.userDisplayName,
                            type: "User",
                            image: user.properties?.profileImageUrl?.trim() || null
                        }
                    });

                    nodeMap.set(track.elementId, {
                        data: {
                            id: track.elementId,
                            label: track.properties?.trackName,
                            type: "Track",
                            image: track.properties?.albumImageUrl || null
                        }
                    });

                    nodeMap.set(artist.elementId, {
                        data: {
                            id: artist.elementId,
                            label: artist.properties?.artistName,
                            type: "Artist"
                        }
                    });

                    edgeMap.set(rel1.elementId, {
                        data: {
                            id: rel1.elementId,
                            source: rel1.startNodeElementId,
                            target: rel1.endNodeElementId,
                            label: ""
                        }
                    });

                    edgeMap.set(rel2.elementId, {
                        data: {
                            id: rel2.elementId,
                            source: rel2.startNodeElementId,
                            target: rel2.endNodeElementId,
                            label: ""
                        }
                    });
                }
            }

            setElements([...nodeMap.values(), ...edgeMap.values()]);
        } catch (err) {
            console.error(err);
            setError(err.message);
            setElements([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchGraphData();
    }, [tracksChecked, artistsChecked]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <Checkbox id="chk-tracks" checked={tracksChecked} onCheckedChange={() => setTracksChecked(v => !v)} />
                    <Label htmlFor="chk-tracks">Faixas</Label>
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox id="chk-artists" checked={artistsChecked} onCheckedChange={() => setArtistsChecked(v => !v)} />
                    <Label htmlFor="chk-artists">Artistas</Label>
                </div>
                <Button variant="outline" onClick={() => clearHighlights()}>
                    Limpar seleção
                </Button>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {loading ? (
                <div className="text-center text-muted-foreground">Carregando grafo...</div>
            ) : (
                <CytoscapeComponent
                    cy={(cy) => {
                        cyRef.current = cy;
                        cy.on("tap", "node", handleNodeClick);
                    }}
                    elements={elements}
                    style={{ width: "100%", height: "90vh", border: "1px solid #ccc" }}
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
                            style: { opacity: 0.1 },
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
                            style: { width: 80, height: 80 },
                        },
                        {
                            selector: "node[type = 'Artist']",
                            style: { width: 50, height: 50 },
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
    );
}
