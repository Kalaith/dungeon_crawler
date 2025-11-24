import React, { useRef, useEffect } from 'react';
import { useDungeonStore } from '../../stores/useDungeonStore';
import { useAutomapStore } from '../../stores/useAutomapStore';
import { getTileColor } from '../../utils/automapRenderer';
import { Button } from '../ui/Button';

export const Automap: React.FC = () => {
    const { currentDungeonMap, exploredMap, playerPosition, interactiveTiles } = useDungeonStore();
    const { isOpen, zoom, panOffset, closeAutomap, setZoom, setPan, centerOnPlayer } = useAutomapStore();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'Escape':
                    closeAutomap();
                    break;
                case '+':
                case '=':
                    setZoom(zoom + 0.1);
                    break;
                case '-':
                case '_':
                    setZoom(zoom - 0.1);
                    break;
                case 'ArrowUp':
                    setPan(panOffset.x, panOffset.y - 5);
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    setPan(panOffset.x, panOffset.y + 5);
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                    setPan(panOffset.x - 5, panOffset.y);
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    setPan(panOffset.x + 5, panOffset.y);
                    e.preventDefault();
                    break;
                case 'c':
                case 'C':
                    centerOnPlayer();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isOpen, zoom, panOffset, closeAutomap, setZoom, setPan, centerOnPlayer]);

    // Render the map on canvas
    useEffect(() => {
        if (!isOpen || !currentDungeonMap || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const cellSize = 20 * zoom;
        const width = currentDungeonMap.width * cellSize;
        const height = currentDungeonMap.height * cellSize;

        canvas.width = Math.min(width, 1200);
        canvas.height = Math.min(height, 800);

        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate offset to center the map
        const offsetX = (canvas.width - width) / 2 + panOffset.x * zoom;
        const offsetY = (canvas.height - height) / 2 + panOffset.y * zoom;

        // Draw tiles
        for (let y = 0; y < currentDungeonMap.height; y++) {
            for (let x = 0; x < currentDungeonMap.width; x++) {
                const color = getTileColor(x, y, currentDungeonMap, exploredMap, interactiveTiles);

                ctx.fillStyle = color;
                ctx.fillRect(
                    offsetX + x * cellSize,
                    offsetY + y * cellSize,
                    cellSize,
                    cellSize
                );

                // Draw grid lines for better visibility
                if (zoom >= 0.8) {
                    ctx.strokeStyle = '#333333';
                    ctx.lineWidth = 0.5;
                    ctx.strokeRect(
                        offsetX + x * cellSize,
                        offsetY + y * cellSize,
                        cellSize,
                        cellSize
                    );
                }
            }
        }

        // Draw player position (yellow arrow)
        if (playerPosition) {
            ctx.fillStyle = '#FFFF00';
            ctx.beginPath();
            const px = offsetX + playerPosition.x * cellSize + cellSize / 2;
            const py = offsetY + playerPosition.y * cellSize + cellSize / 2;
            const size = cellSize * 0.6;

            // Draw a triangle pointing up
            ctx.moveTo(px, py - size / 2);
            ctx.lineTo(px - size / 2, py + size / 2);
            ctx.lineTo(px + size / 2, py + size / 2);
            ctx.closePath();
            ctx.fill();
        }
    }, [isOpen, currentDungeonMap, exploredMap, playerPosition, interactiveTiles, zoom, panOffset]);

    if (!isOpen || !currentDungeonMap) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
            <div className="bg-etrian-800 rounded-lg shadow-2xl p-6 max-w-[95vw] max-h-[95vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-cyan-100">Dungeon Automap - Floor {currentDungeonMap.floor}</h2>
                    <Button variant="secondary" size="sm" onClick={closeAutomap}>
                        ×
                    </Button>
                </div>

                {/* Canvas */}
                <div className="flex-1 flex items-center justify-center mb-4 overflow-hidden">
                    <canvas
                        ref={canvasRef}
                        className="border-2 border-cyan-500/30 rounded"
                    />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between gap-4">
                    {/* Pan Controls */}
                    <div className="flex gap-2">
                        <div className="grid grid-cols-3 gap-1">
                            <div></div>
                            <Button variant="secondary" size="sm" onClick={() => setPan(panOffset.x, panOffset.y - 10)}>
                                ↑
                            </Button>
                            <div></div>
                            <Button variant="secondary" size="sm" onClick={() => setPan(panOffset.x - 10, panOffset.y)}>
                                ←
                            </Button>
                            <Button variant="secondary" size="sm" onClick={centerOnPlayer} title="Center on Player (C)">
                                ⊙
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => setPan(panOffset.x + 10, panOffset.y)}>
                                →
                            </Button>
                            <div></div>
                            <Button variant="secondary" size="sm" onClick={() => setPan(panOffset.x, panOffset.y + 10)}>
                                ↓
                            </Button>
                            <div></div>
                        </div>
                    </div>

                    {/* Zoom Controls */}
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" onClick={() => setZoom(zoom - 0.2)}>
                            −
                        </Button>
                        <span className="text-cyan-100 text-sm min-w-[60px] text-center">
                            {Math.round(zoom * 100)}%
                        </span>
                        <Button variant="secondary" size="sm" onClick={() => setZoom(zoom + 0.2)}>
                            +
                        </Button>
                    </div>

                    {/* Legend */}
                    <div className="flex gap-3 text-xs">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-[#FF8C00] border border-gray-600"></div>
                            <span className="text-gray-300">Wall</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-[#8B0000] border border-gray-600"></div>
                            <span className="text-gray-300">Door</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-[#ADD8E6] border border-gray-600"></div>
                            <span className="text-gray-300">Stairs Up</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-[#0000FF] border border-gray-600"></div>
                            <span className="text-gray-300">Stairs Down</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-[#FFFF00] border border-gray-600"></div>
                            <span className="text-gray-300">You</span>
                        </div>
                    </div>
                </div>

                {/* Keyboard Shortcuts Help */}
                <div className="mt-3 text-xs text-gray-400 text-center">
                    <span>Arrows: Pan | +/-: Zoom | C: Center | ESC: Close</span>
                </div>
            </div>
        </div>
    );
};
