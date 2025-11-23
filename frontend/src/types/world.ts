/**
 * World Map and Location Types
 * Defines the structure for the overworld map system
 */

export interface WorldMap {
    id: string;
    name: string;
    locations: WorldLocation[];
    connections: LocationConnection[];
    discoveredLocations: string[]; // Location IDs discovered by player
}

export interface WorldLocation {
    id: string;
    name: string;
    type: 'town' | 'dungeon' | 'wilderness' | 'landmark';
    position: { x: number; y: number }; // Map coordinates (0-1000 range)
    description: string;
    discovered: boolean;
    accessible: boolean; // Unlocked by quest/progression
    icon: string;

    // Type-specific data
    townData?: TownData;
    dungeonData?: DungeonData;
    wildernessData?: WildernessData;
}

export interface LocationConnection {
    from: string; // Location ID
    to: string;   // Location ID
    distance: number; // In miles
    terrain: 'road' | 'path' | 'wilderness' | 'sea';
    travelTime: number; // In hours
    dangerLevel: number; // 1-5, affects encounter rate
}

export interface TownData {
    size: 'hamlet' | 'village' | 'town' | 'city';
    population: number;
    services: TownServiceType[];
    npcs: string[]; // NPC IDs
    quests: string[]; // Quest IDs
    hasTemple: boolean;
    hasInn: boolean;
    hasShop: boolean;
    hasHealer: boolean;
    hasBlacksmith: boolean;
}

export type TownServiceType = 'inn' | 'shop' | 'temple' | 'healer' | 'blacksmith';

export interface TownService {
    type: TownServiceType;
    name: string;
    available: boolean;
}

export interface DungeonData {
    floors: number;
    difficulty: number; // 1-10
    recommendedLevel: number;
    completed: boolean;
    currentFloor: number;
    bossId?: string; // Enemy ID for boss
    rewards: {
        gold: number;
        items: string[]; // Item IDs
        exp: number;
    };
}

export interface WildernessData {
    encounterRate: number; // 0-1, chance of random encounter
    resources: string[]; // Gatherable resources
    hazards: string[]; // Environmental hazards
}

export interface TravelState {
    inProgress: boolean;
    from: string; // Location ID
    to: string;   // Location ID
    progress: number; // 0-1
    timeElapsed: number; // In hours
    encountersRemaining: number;
}
