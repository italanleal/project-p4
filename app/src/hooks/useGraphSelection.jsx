import { useState } from "react";

export function useGraphSelection(cyRef, setSelectedTrackId) {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedArtist, setSelectedArtist] = useState(null);

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
                    .filter(node => node.data("type") === "Track")
                    .map(node => node.id())
            );
        });

        // Calcula a interseção entre os conjuntos
        let commonTrackIds = [];
        if (trackSets.length > 0) {
            commonTrackIds = Array.from(trackSets.reduce((acc, set) => {
                return new Set([...acc].filter(x => set.has(x)));
            }));
        }

        // Destaca as faixas em comum e suas conexões
        commonTrackIds.forEach((trackId) => {
            const track = cy.getElementById(trackId);
            track.removeClass("faded").addClass("highlighted");

            track.connectedEdges().forEach(edge => {
                edge.removeClass("faded").addClass("highlighted");

                const source = edge.source();
                source.removeClass("faded").addClass("highlighted");
            });
        });
    };


    /* -------- Destacar todas as faixas de um artista -------- */
    const highlightArtistTracks = (artistId) => {
        const cy = cyRef.current;
        if (!cy) return;

        cy.elements().addClass("faded");

        const artistNode = cy.getElementById(artistId);
        artistNode.removeClass("faded").addClass("selected-artist");

        const tracks = artistNode
            .connectedEdges()
            .targets()
            .filter((el) => el.data("type") === "Track");

        if (tracks.length === 0) return;

        tracks.forEach((track) => {
            track.removeClass("faded").addClass("highlighted");
            track.connectedEdges().removeClass("faded").addClass("highlighted");
        });
    };

    /* -------- Lógica de clique em usuário -------- */
    const handleUserClick = (node) => {
        const id = node.id();
        const alreadySelected = selectedUsers.includes(id);

        let newSelectedUsers;

        if (alreadySelected) {
            // Remove o usuário da seleção
            newSelectedUsers = selectedUsers.filter(x => x !== id);
        } else {
            newSelectedUsers = [...selectedUsers, id];
        }

        setSelectedUsers(newSelectedUsers);

        if (newSelectedUsers.length === 0) {
            clearHighlights();
            return;
        }

        if (newSelectedUsers.length === 1) {
            // Quando só um usuário selecionado, destaca só ele sem todas as músicas
            const cy = cyRef.current;
            if (!cy) return;

            cy.elements().removeClass("selected-user highlighted").addClass("faded");

            // Destaca só o usuário
            const userNode = cy.getElementById(newSelectedUsers[0]);
            userNode.removeClass("faded").addClass("selected-user");

            // Remove destaque das músicas, ou destaca só as que quiser, aqui vou deixar sem destaque
            return;
        }

        // Se tiver mais de 1 usuário selecionado, destaca músicas em comum
        highlightCommonTracks(newSelectedUsers);
    };


    /* -------- Lógica de clique em artista -------- */
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

    /* -------- Lógica de clique em track -------- */
    const handleTrackClick = (node) => {
        // Por enquanto não faz nada
    };

    const handleTrackDoubleClick = (node) => {
        const trackId = node.data("trackId");
        if (trackId) setSelectedTrackId(trackId);
    };

    /* -------- Função despachadora para qualquer nó -------- */
    const handleNodeClick = (event) => {
        const node = event.target;
        const type = node.data("type");

        if (type === "User") return handleUserClick(node);
        if (type === "Artist") return handleArtistClick(node);
    };

    const handleNodeDoubleClick = (event) => {
        const node = event.target;
        const type = node.data("type");

        if (type === "Track") return handleTrackDoubleClick(node);
    };

    return {
        selectedUsers,
        selectedArtist,
        handleNodeClick,
        handleNodeDoubleClick,
        clearHighlights,
    };
}
