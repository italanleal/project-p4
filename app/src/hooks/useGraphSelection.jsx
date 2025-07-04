import { useState } from "react";

export function useGraphSelection(cyRef, setSelectedTrackId) {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [userInfoModal, setUserInfoModal] = useState(null);

    /* -------- Limpa todas as marcações -------- */
    const clearHighlights = () => {
        const cy = cyRef.current;
        if (!cy) return;
        cy.elements().removeClass(
            "faded highlighted selected-user selected-artist"
        );
        setSelectedUsers([]);
        setSelectedArtist(null);
    };

    /* -------- Destacar faixas em comum entre usuários selecionados -------- */
    const highlightCommonTracks = (userIds) => {
        const cy = cyRef.current;
        if (!cy || userIds.length === 0) return;

        // Apaga tudo
        cy.elements().removeClass("selected-user highlighted").addClass("faded");

        // Destaca os usuários selecionados
        userIds.forEach((id) => {
            cy.getElementById(id).removeClass("faded").addClass("selected-user");
        });

        // Obtém todos os nós de faixa conectados a cada usuário
        const trackSets = userIds.map((userId) => {
            return new Set(
                cy.getElementById(userId)
                    .connectedEdges()
                    .targets()
                    .filter((node) => node.data("type") === "Track")
                    .map((node) => node.id())
            );
        });

        // Interseção
        let commonTrackIds = [];
        if (trackSets.length > 0) {
            commonTrackIds = Array.from(
                trackSets.reduce((acc, set) => new Set([...acc].filter((x) => set.has(x))))
            );
        }

        // Destaca faixas em comum
        commonTrackIds.forEach((trackId) => {
            const track = cy.getElementById(trackId);
            track.removeClass("faded").addClass("highlighted");

            track.connectedEdges().forEach((edge) => {
                edge.removeClass("faded").addClass("highlighted");
                edge.source().removeClass("faded").addClass("highlighted");
            });
        });
    };

    /* -------- Destacar todas as faixas de um artista -------- */
           const highlightArtistTracks = (artistId) => {
            const cy = cyRef.current;
            if (!cy) return;
        
            // Apaga tudo
            cy.elements().addClass("faded");
        
            // Destaca o artista
            const artistNode = cy.getElementById(artistId);
            artistNode.removeClass("faded").addClass("selected-artist");
        
            // Pega faixas conectadas ao artista
            const tracks = artistNode
                .connectedEdges()
                .targets()
                .filter((el) => el.data("type") === "Track");
        
            // Destaca faixas e suas conexões
            tracks.forEach((track) => {
                track.removeClass("faded").addClass("highlighted");
        
                // Destaca as arestas ligadas à faixa
                const edges = track.connectedEdges();
                edges.removeClass("faded").addClass("highlighted");
        
                // Destaca os usuários conectados à faixa
                edges.sources().forEach((sourceNode) => {
                    if (sourceNode.data("type") === "User") {
                        sourceNode.removeClass("faded").addClass("selected-user");
                    }
                });
            });
        };

    /* -------- Destacar todas as faixas de um ÚNICO usuário -------- */
    const highlightUserTracks = (userId) => {
        const cy = cyRef.current;
        if (!cy) return;

        // Apaga tudo
        cy.elements()
            .removeClass("selected-user highlighted selected-artist")
            .addClass("faded");

        // Destaca o usuário
        const userNode = cy.getElementById(userId);
        userNode.removeClass("faded").addClass("selected-user");

        // Destaca todas as faixas ligadas a ele
        const tracks = userNode
            .connectedEdges()
            .targets()
            .filter((el) => el.data("type") === "Track");

        tracks.forEach((track) => {
            track.removeClass("faded").addClass("highlighted");
            track.connectedEdges().removeClass("faded").addClass("highlighted");
        });
    };

    /* -------- Clique em usuário -------- */
    const handleUserClick = (node) => {
        const id = node.id();
        const alreadySelected = selectedUsers.includes(id);

        const newSelectedUsers = alreadySelected
            ? selectedUsers.filter((x) => x !== id)
            : [...selectedUsers, id];

        setSelectedUsers(newSelectedUsers);

        if (newSelectedUsers.length === 0) {
            clearHighlights();
            return;
        }

        if (newSelectedUsers.length === 1) {
            // Um único usuário → somente ele aparece (sem faixas)
            const cy = cyRef.current;
            if (!cy) return;

            cy.elements().removeClass("selected-user highlighted").addClass("faded");
            cy.getElementById(newSelectedUsers[0])
                .removeClass("faded")
                .addClass("selected-user");
            return;
        }

        // Vários usuários → mostrar interseção de faixas
        highlightCommonTracks(newSelectedUsers);
    };

    /* -------- Clique em artista -------- */
    const handleArtistClick = (node) => {
        const id = node.id();

        if (selectedArtist === id) {
            clearHighlights();
            return;
        }

        clearHighlights();
        node.addClass("selected-artist");
        setSelectedArtist(id);
        highlightArtistTracks(id);
    };

    /* -------- Clique em track -------- */
    const handleTrackClick = () => {
        /* opcional */
    };

    const handleTrackDoubleClick = (node) => {
        const trackId = node.data("trackId");
        if (trackId) setSelectedTrackId(trackId);
    };

    /* -------- Double‑tap em usuário -------- */
    const handleUserDoubleClick = (node) => {
        setUserInfoModal({
            userId: node.data("userId"),
            displayName: node.data("label"),
            biography: node.data("userBio"),
            image: node.data("image"),
        });
    };


    /* -------- Despachadores -------- */
    const handleNodeClick = (event) => {
        const node = event.target;
        const type = node.data("type");

        if (type === "User") return handleUserClick(node);
        if (type === "Artist") return handleArtistClick(node);
        if (type === "Track") return handleTrackClick(node);
    };

    const handleNodeDoubleClick = (event) => {
        const node = event.target;
        const type = node.data("type");

        if (type === "Track") return handleTrackDoubleClick(node);
        if (type === "User") return handleUserDoubleClick(node);
    };

    return {
        selectedUsers,
        selectedArtist,
        handleNodeClick,
        handleNodeDoubleClick,
        clearHighlights,
        userInfoModal,
        setUserInfoModal,
        highlightUserTracks,
    };
}
