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
                cy.on("tap", "node", handleNodeClick);
                cy.on("dbltap", "node", handleDoubleClick);
                cy.on("layoutstop", () => {
                    const userId = user.userId;

                    const userNode = cy.nodes().filter(
                        (n) => n.data("type") === "User" && n.data("userId") === userId
                    );

                    if (userNode.nonempty()) {
                        cy.animate({
                            center: { eles: userNode },
                            zoom: 1.5,
                            duration: 600,
                            easing: "ease-in", // ou "ease-in-out", "ease-out", "linear"
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
                background: "var(--color-card)"
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
                    selector: "first-selected-user",
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
