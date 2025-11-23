/**
 * Centralized game configuration constants
 * All magic numbers and configuration values should be defined here
 */

export const GAME_CONFIG = {
    PARTY: {
        MAX_SIZE: 6,
        MIN_SIZE: 1,
    },

    PROGRESSION: {
        BASE_EXP_REQUIREMENT: 100,
        EXP_GROWTH_RATE: 1.2,
        MAX_LEVEL: 50,
    },

    DUNGEON: {
        MIN_ROOM_SIZE: 4,
        MAX_ROOM_SIZE: 12,
        MIN_ROOMS: 5,
        MAX_ROOMS: 10,
        CORRIDOR_WIDTH: 1,
        DEFAULT_WIDTH: 20,
        DEFAULT_HEIGHT: 20,
    },

    COMBAT: {
        TURN_DELAY_MS: 100,
        ENEMY_TURN_DELAY_MS: 1000,
        MAX_COMBAT_LOG_ENTRIES: 10,
    },

    CRAFTING: {
        MIN_LEVEL_REQUIREMENT: 1,
        MAX_LEVEL_REQUIREMENT: 50,
    },
} as const;

export const RENDER_CONFIG = {
    VIEWPORT: {
        WIDTH: 400,
        HEIGHT: 300,
    },

    GEOMETRY: {
        // 3D perspective rectangles (from player view to distance)
        R0: { x: 0, y: 0, w: 400, h: 300 }, // Screen edges (current position)
        R1: { x: 60, y: 40, w: 280, h: 220 }, // End of current tile
        R2: { x: 130, y: 100, w: 140, h: 100 }, // End of next tile
        R3: { x: 170, y: 130, w: 60, h: 40 }, // Vanishing point
    },

    COLORS: {
        WALL_FACE: '#4a5568', // Gray 600
        WALL_SIDE: '#2d3748', // Gray 700
        FLOOR: '#1a202c', // Gray 900
        CEILING: '#0f1115', // Very dark
        DOOR: '#8b5cf6', // Purple
        STAIRS_UP: '#22d3ee', // Cyan
        STAIRS_DOWN: '#f59e0b', // Amber
        TREASURE: '#eab308', // Yellow
        BACKGROUND: '#000000', // Black
    },

    STROKE: {
        COLOR: '#000000',
        WIDTH_THIN: 1,
        WIDTH_THICK: 2,
    },
} as const;

export const LOOT_CONFIG = {
    COMMON_DROP_CHANCE: 0.6,
    RARE_DROP_CHANCE: 0.3,
    EPIC_DROP_CHANCE: 0.1,
    BASE_GOLD_MIN: 10,
    BASE_GOLD_MAX: 30,
    GOLD_LEVEL_MULTIPLIER: 5,
} as const;

export const ENCOUNTER_CONFIG = {
    BASE_ENCOUNTER_CHANCE: 0.15,
    ENCOUNTER_CHANCE_PER_STEP: 0.05,
    MAX_ENCOUNTER_CHANCE: 0.5,
    STEPS_TO_GUARANTEED_ENCOUNTER: 20,
} as const;

/**
 * UI-related constants
 */
export const UI_CONFIG = {
    MINIMAP: {
        TILE_SIZE: 8,
        PADDING: 4,
    },

    ANIMATIONS: {
        FAST: 150,
        NORMAL: 300,
        SLOW: 500,
    },
} as const;
