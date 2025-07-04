import React, { useEffect, useState } from "react";

const FancyBackground = ({ children }) => {
    const emojiList = [
        "🎵", "🎶", "🎧", "🎤", "🎷", "🎸", "🥁", "🎹",
        "📻", "💿", "🎼", "🪩", "🕺", "💃", "🎉", "✨",
        "🔥", "😎", "🧠", "🌈", "👀", "👽", "🌟", "🌀",
        "🎮", "🎲", "🎯", "🍿", "🎁", "📀", "😶‍🌫️", "👌",
        "🍉", "🍓", "🍍", "🍋", "🥑", "🥥", "🧃", "🪐",
        "🤑", "🥵", "🤪", "😵‍💫", "🤡", "🥸", "🧐", "🤠", "🦆"
    ];

    const getRandomEmoji = () => {
        const index = Math.floor(Math.random() * emojiList.length);
        return emojiList[index];
    };

    // Estado para armazenar emojis flutuantes
    const [floatingEmojis, setFloatingEmojis] = useState([]);

    // Atualiza os emojis a cada 5 segundos
    useEffect(() => {
        const generateEmojis = () => {
            const emojis = Array.from({ length: 10 }).map(() => ({
                emoji: getRandomEmoji(),
                top: `${Math.random() * 90}%`,
                left: `${Math.random() * 90}%`,
                delay: `${Math.random() * 3}s`,
            }));
            setFloatingEmojis(emojis);
        };

        generateEmojis(); // inicial
        const interval = setInterval(generateEmojis, 30000); // a cada 30s

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-green-100 via-emerald-200 to-teal-400 overflow-hidden">
            {/* SVG do grafo animado */}
            <div className="absolute inset-0 pointer-events-none">
                <svg width="100%" height="100%">
                    {Array.from({ length: 15 }).map((_, clusterIndex) => {
                        const baseX = Math.random() * 80 + 10;
                        const baseY = Math.random() * 80 + 10;
                        const pointsCount = 5 + Math.floor(Math.random() * 6);
                        const points = Array.from({ length: pointsCount }).map(() => ({
                            x: baseX + (Math.random() * 8 - 4),
                            y: baseY + (Math.random() * 8 - 4),
                            r: Math.random() * 2 + 1,
                        }));
                        const duration = 8 + Math.random() * 6;
                        const delay = Math.random() * duration;
                        const animationName = `floatXY${clusterIndex}`;
                        return (
                            <g
                                key={clusterIndex}
                                style={{
                                    animationName,
                                    animationDuration: `${duration}s`,
                                    animationTimingFunction: "ease-in-out",
                                    animationIterationCount: "infinite",
                                    animationDirection: "alternate",
                                    animationDelay: `${delay}s`,
                                    transformOrigin: "center center",
                                }}
                            >
                                {points.slice(0, -1).map((point, i) => (
                                    <line
                                        key={i}
                                        x1={`${point.x}%`}
                                        y1={`${point.y}%`}
                                        x2={`${points[i + 1].x}%`}
                                        y2={`${points[i + 1].y}%`}
                                        stroke="rgba(44, 135, 64, 0.3)"
                                        strokeWidth={1}
                                    />
                                ))}
                                {points.map((point, i) => (
                                    <circle
                                        key={i}
                                        cx={`${point.x}%`}
                                        cy={`${point.y}%`}
                                        r={point.r}
                                        fill="rgba(44, 135, 64, 0.7)"
                                    />
                                ))}
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Emojis flutuando com troca automática */}
            <div className="absolute inset-0 pointer-events-none animate-pulse opacity-10">
                {floatingEmojis.map((item, i) => (
                    <div
                        key={i}
                        className="absolute text-4xl transition-opacity duration-1000"
                        style={{
                            top: item.top,
                            left: item.left,
                            animationDelay: item.delay,
                        }}
                    >
                        {item.emoji}
                    </div>
                ))}
            </div>

            {/* Conteúdo da página */}
            <div className="relative z-10">{children}</div>

            {/* Keyframes CSS dinâmicos */}
            <style>
                {Array.from({ length: 5 })
                    .map((_, i) => {
                        const amplitudeX = 5 + (i * 3) % 5;
                        const amplitudeY = 5 + (i * 2) % 5;
                        return `
                    @keyframes floatXY${i} {
                      0% { transform: translate(0, 0); }
                      25% { transform: translate(${amplitudeX}px, ${-amplitudeY}px); }
                      50% { transform: translate(${amplitudeX}px, ${amplitudeY}px); }
                      75% { transform: translate(${-amplitudeX}px, ${amplitudeY}px); }
                      100% { transform: translate(0, 0); }
                    }
                `;
                    })
                    .join("\n")}
            </style>
        </div>
    );
};

export default FancyBackground;
