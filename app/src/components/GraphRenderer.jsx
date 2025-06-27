import React, { useEffect, useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
    Alert, AlertDescription, AlertTitle
} from "@/components/ui/alert";

const filterOptions = [
    { label: "Conexões com outros usuários", value: "connections", endpoint: "/api/graph/connections" },
    { label: "Artistas em comum", value: "artists", endpoint: "/api/graph/artists" },
    { label: "Gêneros em comum", value: "genres", endpoint: "/api/graph/genres" },
    { label: "Faixas em comum", value: "tracks", endpoint: "/api/graph/tracks" },
    { label: "Resultado de pesquisa", value: "search", endpoint: "http://localhost:3000/api/graph/search" },
];

export default function GraphRenderer() {
    const [elements, setElements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);

    useEffect(() => {
        async function fetchGraphData() {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(selectedFilter.endpoint);
                if (!response.ok) new Error("Erro ao buscar o grafo: " + response.statusText);

                const raw = await response.json();

                const nodeMap = new Map();
                const edgeMap = new Map();

                for (const entry of raw.data) {
                    const [user, rel1, track, rel2, artist] = entry._fields;

                    // User node
                    nodeMap.set(user.elementId, {
                        data: {
                            id: user.elementId,
                            label: user.properties.userDisplayName,
                            type: "User",
                            image: user.properties.profileImageUrl?.trim()
                        }
                    });

                    // Track node
                    nodeMap.set(track.elementId, {
                        data: {
                            id: track.elementId,
                            label: track.properties.trackName,
                            type: "Track",
                            image: track.properties.albumImageUrl
                        }
                    });

                    // Artist node
                    nodeMap.set(artist.elementId, {
                        data: {
                            id: artist.elementId,
                            label: artist.properties.artistName,
                            type: "Artist"
                        }
                    });

                    // Edges
                    edgeMap.set(rel1.elementId, {
                        data: {
                            id: rel1.elementId,
                            source: rel1.startNodeElementId,
                            target: rel1.endNodeElementId,
                            label: rel1.type
                        }
                    });

                    edgeMap.set(rel2.elementId, {
                        data: {
                            id: rel2.elementId,
                            source: rel2.startNodeElementId,
                            target: rel2.endNodeElementId,
                            label: rel2.type
                        }
                    });
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

        fetchGraphData();
    }, [selectedFilter]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 mb-4">
                <Label htmlFor="graph-filter">Visualizar por:</Label>
                <Select
                    value={selectedFilter.value}
                    onValueChange={value =>
                        setSelectedFilter(filterOptions.find(f => f.value === value))
                    }
                >
                    <SelectTrigger id="graph-filter" className="w-[300px]">
                        <SelectValue placeholder="Selecione o tipo de grafo" />
                    </SelectTrigger>
                    <SelectContent>
                        {filterOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
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
                    elements={elements}
                    style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}
                    layout={{ name: 'cose' }}
                    stylesheet={[
                        {
                            selector: 'node',
                            style: {
                                'background-fit': 'cover',
                                'background-image': 'data(image)',
                                'background-color': '#ccc',
                                'shape': 'ellipse',
                                'width': 60,
                                'height': 60,
                                'label': 'data(label)',
                                'text-valign': 'bottom',
                                'text-halign': 'center',
                                'font-size': '10px',
                                'color': '#333',
                                'border-width': 2,
                                'border-color': '#fff',
                                'text-outline-width': 1,
                                'text-outline-color': '#fff',
                            }
                        },
                        {
                            selector: 'node[type = "User"]',
                            style: { width: 80, height: 80 }
                        },
                        {
                            selector: 'node[type = "Artist"]',
                            style: { width: 50, height: 50 }
                        },
                        {
                            selector: 'edge',
                            style: {
                                'label': 'data(label)',
                                'width': 2,
                                'line-color': '#999',
                                'target-arrow-color': '#999',
                                'target-arrow-shape': 'triangle',
                                'curve-style': 'bezier',
                                'font-size': '8px',
                                'color': '#555'
                            }
                        }
                    ]}
                />
            )}
        </div>
    );
}
