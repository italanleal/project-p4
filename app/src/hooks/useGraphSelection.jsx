import {useState} from "react";

export function useGraphSelection(cyRef) {
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

    /* -------- Destacar faixas em comum entre dois usuários -------- */
    const highlightCommonTracks = (user1Id, user2Id) => {
        const cy = cyRef.current;
        if (!cy) return;

        cy.elements().addClass("faded");

        [user1Id, user2Id].forEach((id) =>
            cy.getElementById(id).removeClass("faded").addClass("selected-user")
        );

        const getTracks = (userId) =>
            cy
                .getElementById(userId)
                .connectedEdges()
                .targets()
                .filter((el) => el.data("type") === "Track");

        const commonTracks = getTracks(user1Id).filter((t1) =>
            getTracks(user2Id).some((t2) => t2.id() === t1.id())
        );

        if (commonTracks.length === 0) {
            return;
        }

        commonTracks.forEach((track) => {
            track.removeClass("faded").addClass("highlighted");
            track.connectedEdges().removeClass("faded").addClass("highlighted");
            track.connectedEdges().sources().removeClass("faded").addClass("highlighted");
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

        if (tracks.length === 0) {
            return;
        }

        tracks.forEach((track) => {
            track.removeClass("faded").addClass("highlighted");
            track.connectedEdges().removeClass("faded").addClass("highlighted");
        });
    };

    /* -------- Lógica de clique em usuário -------- */
    const handleUserClick = (node) => {
        const id = node.id();

        if (selectedUsers.includes(id)) {
            clearHighlights();
            return;
        }

        if (selectedUsers.length === 0) {
            clearHighlights(true);
            node.addClass("selected-user");
            setSelectedUsers([id]);
            return;
        }

        if (selectedUsers.length === 1) {
            const [firstId] = selectedUsers;
            node.addClass("selected-user");
            setSelectedUsers([firstId, id]);
            highlightCommonTracks(firstId, id);
            return;
        }

        clearHighlights();
        node.addClass("selected-user");
        setSelectedUsers([id]);
    };

    /* -------- Lógica de clique em artista -------- */
    const handleArtistClick = (node) => {
        const id = node.id();

        if (selectedArtist === id) {
            clearHighlights(true);
            setSelectedArtist(null);
            return;
        }

        clearHighlights(true);
        node.addClass("selected-artist");
        setSelectedArtist(id);
        highlightArtistTracks(id);
    };

    /* -------- Função despachadora para qualquer nó -------- */
    const handleNodeClick = (event) => {
        const node = event.target;
        const type = node.data("type");

        if (type === "User") return handleUserClick(node);
        if (type === "Artist") return handleArtistClick(node);
    };

    return {
        selectedUsers,
        selectedArtist,
        handleNodeClick,
        clearHighlights,
    };
}