// src/lib/graphFetchers.js

export async function fetchNetworkGraphData({ setElements, setError, setLoading }) {
    const vps = "http://46.202.144.162:3051";
    const filterOptions = [
        { label: "Artists/index", value: "tracks", endpoint: `${vps}/api/artist/index` },
        { label: "Artists/:id", value: "artists/:id", endpoint: `${vps}/api/network` },
    ];

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
                    trackId: track.properties?.trackId || null,
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
        import("sonner").then(({ toast }) => toast.error("Erro ao carregar grafo", { description: err.message }));
    } finally {
        setLoading(false);
    }
}

export async function fetchDashboardGraphData({ setElements, setError, setLoading, tracksChecked, artistsChecked }) {
    const vps = "http://46.202.144.162:3051";
    setLoading(true);
    setError(null);

    try {
        let selectedEndpoint = null;
        if (tracksChecked && artistsChecked) {
            selectedEndpoint = vps + "/api/user/artistsandtracks";
        } else if (tracksChecked && !artistsChecked) {
            selectedEndpoint = vps + "/api/user/tracks";
        } else if (!tracksChecked && artistsChecked) {
            selectedEndpoint = vps + "/api/user/artists";
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

        if (!response.ok) throw new Error("Erro ao buscar o grafo: " + response.statusText);

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

            if (fields.length === 3) {
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
                        image: track.properties?.albumImageUrl || null,
                        trackId: track.properties?.trackId || null,
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
                        image: track.properties?.albumImageUrl || null,
                        trackId: track.properties?.trackId || null,
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
