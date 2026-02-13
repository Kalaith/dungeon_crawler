import type { DungeonMap, InteractiveTile } from '../types';

/**
 * Get the color for a tile based on its type and explored status
 * Colors match the manual specifications
 */
export function getTileColor(
    x: number,
    y: number,
    dungeonMap: DungeonMap,
    exploredSet: Set<string>,
    interactiveTiles: Record<string, InteractiveTile | undefined>
): string {
    const key = `${x},${y}`;
    const isExplored = exploredSet.has(key);

    // Unexplored areas are black
    if (!isExplored) {
        return '#000000';
    }

    // Check for interactive tiles first (doors, stairs, chests)
    const tileKey = `${x},${y}`;
    const interactiveTile = interactiveTiles[tileKey];

    if (interactiveTile) {
        switch (interactiveTile.type) {
            case 'door':
                return '#8B0000'; // Deep Red - Doors
            default:
                break;
        }
    }

    // Check dungeon layout
    const tile = dungeonMap.layout[y]?.[x];

    if (!tile) return '#000000'; // Black - Out of bounds

    switch (tile) {
        case '#':
            return '#FF8C00'; // Bright Orange - Walls
        case '.':
            return '#1a1a1a'; // Very dark gray - Floor (explored)
        case 'S':
            return '#FFD700'; // Gold - Start position
        case 'U':
            return '#ADD8E6'; // Light Blue - Stairs Up
        case 'D':
            return '#0000FF'; // Blue - Stairs Down
        case 'T':
            return '#D2B48C'; // Light Brown - Treasure/Chest
        default:
            return '#1a1a1a'; // Default floor color
    }
}

/**
 * Get the tile type name for the legend
 */
export function getTileTypeName(color: string): string {
    const colorMap: Record<string, string> = {
        '#000000': 'Unexplored',
        '#FF8C00': 'Wall',
        '#8B0000': 'Door',
        '#ADD8E6': 'Stairs Up',
        '#0000FF': 'Stairs Down',
        '#D2B48C': 'Chest',
        '#FFD700': 'Start',
        '#1a1a1a': 'Floor'
    };

    return colorMap[color] || 'Unknown';
}

/**
 * Calculate visible bounds based on zoom and pan
 */
export function calculateVisibleBounds(
    zoom: number,
    panOffset: { x: number; y: number },
    mapWidth: number,
    mapHeight: number,
    viewportWidth: number,
    viewportHeight: number
): { minX: number; maxX: number; minY: number; maxY: number } {
    const cellSize = 20 * zoom; // Base cell size is 20px
    const visibleCols = Math.ceil(viewportWidth / cellSize);
    const visibleRows = Math.ceil(viewportHeight / cellSize);

    const centerX = mapWidth / 2 + panOffset.x;
    const centerY = mapHeight / 2 + panOffset.y;

    const minX = Math.max(0, Math.floor(centerX - visibleCols / 2));
    const maxX = Math.min(mapWidth, Math.ceil(centerX + visibleCols / 2));
    const minY = Math.max(0, Math.floor(centerY - visibleRows / 2));
    const maxY = Math.min(mapHeight, Math.ceil(centerY + visibleRows / 2));

    return { minX, maxX, minY, maxY };
}
