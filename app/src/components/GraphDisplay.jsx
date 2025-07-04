import CytoscapeComponent from "react-cytoscapejs";
import React from "react";

export default function GraphDisplay({
                                         user,
                                         elements,
                                         cyRef,
                                         handleNodeClick,
                                         handleDoubleClick,
                                     }) {
    return (
        <CytoscapeComponent
            cy={(cy) => {
                cyRef.current = cy;

                /* ---------- DETECÇÃO DE TAP ÚNICO / DUPLO ---------- */
                const DOUBLE_TAP_DELAY = 300;          // ms
                let lastTapTime = 0;                   // timestamp do toque anterior
                let lastTapNodeId = null;              // id do nó que recebeu o toque
                let singleTapTimeout = null;           // timer para diferenciar click x dbl‑click

                cy.on("tap", "node", (e) => {
                    const now = Date.now();
                    const node = e.target;

                    const isSameNode = node.id() === lastTapNodeId;
                    const isFastEnough = now - lastTapTime < DOUBLE_TAP_DELAY;

                    if (isSameNode && isFastEnough) {
                        // É um double‑tap no MESMO nó
                        clearTimeout(singleTapTimeout);      // cancela o clique simples pendente
                        singleTapTimeout = null;

                        // reseta marcadores
                        lastTapTime = 0;
                        lastTapNodeId = null;

                        handleDoubleClick(e);               // chama o handler de duplo clique
                    } else {
                        // Trata como primeiro toque (potencial clique simples)
                        lastTapTime = now;
                        lastTapNodeId = node.id();

                        // agenda o clique simples; será cancelado se vier o 2º toque rápido
                        singleTapTimeout = setTimeout(() => {
                            handleNodeClick(e);
                            singleTapTimeout = null;
                            lastTapNodeId = null;
                        }, DOUBLE_TAP_DELAY);
                    }
                });


                /* ---------- CENTRALIZA O NÓ DO PRÓPRIO USUÁRIO AO FIM DO LAYOUT ---------- */
                cy.on("layoutstop", () => {
                    const userId = user.userId;

                    const userNode = cy
                        .nodes()
                        .filter(
                            (n) => n.data("type") === "User" && n.data("userId") === userId
                        );

                    if (userNode.nonempty()) {
                        cy.animate({
                            center: { eles: userNode },
                            zoom: 1.5,
                            duration: 600,
                            easing: "ease-in",
                        });
                    } else {
                        console.warn("Nó do usuário não encontrado.");
                    }
                });
            }}
            elements={elements}
            style={{
                width: "100%",
                height: "85vh",
                borderBottomLeftRadius: "1rem",
                borderBottomRightRadius: "1rem",
                border: "1px solid var(--color-border)",
                borderTop: "none",
                background: "var(--color-card)",
            }}
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
                    selector: ".first-selected-user",
                    style: {
                        "border-color": "gold",
                        "border-width": "4px"
                    }
                },
                {
                    selector: "node[type = 'User']",
                    style: {
                        width: 80,
                        height: 80,
                        "background-color": "oklch(0.38 0.14 140)",
                    },
                },
                {
                    selector: "node[type = 'Artist']",
                    style: {
                        width: 50,
                        height: 50,
                        "background-color": "oklch(0.72 0.17 75)",
                    },
                },
                {
                    selector: "node[type = 'Track']",
                    style: {
                        width: 60,
                        height: 60,
                        "background-color": "oklch(0.46 0.18 120)",
                    },
                },
                {
                    selector: "node",
                    style: {
                        "background-fit": "cover",
                        "background-image": "data(image)",
                        "background-color": "#ccc",
                        shape: "ellipse",
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
    );
}
