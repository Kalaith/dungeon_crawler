import type { WorldMap } from '../types/world';

/**
 * Initial World Map - Realm of Aventuria
 * Contains starting locations for the game
 */
export const startingWorldMap: WorldMap = {
    id: 'realm-of-aventuria',
    name: 'Realm of Aventuria',
    locations: [
        // Starting Town
        {
            id: 'millhaven',
            name: 'Millhaven',
            type: 'town',
            position: { x: 500, y: 500 }, // Center of map
            description: 'A peaceful village nestled in the valley. A good place to rest and resupply before venturing into the unknown.',
            discovered: true,
            accessible: true,
            icon: 'town',
            townData: {
                size: 'village',
                population: 500,
                services: ['inn', 'shop', 'temple', 'healer', 'blacksmith'],
                npcs: [],
                quests: [],
                hasTemple: true,
                hasInn: true,
                hasShop: true,
                hasHealer: true,
                hasBlacksmith: true
            }
        },

        // Tutorial Dungeon
        {
            id: 'goblin-cave',
            name: 'Goblin Cave',
            type: 'dungeon',
            position: { x: 650, y: 400 },
            description: 'A small cave system infested with goblins. Local farmers have reported missing livestock. Good for beginners.',
            discovered: true,
            accessible: true,
            icon: 'cave',
            dungeonData: {
                floors: 3,
                difficulty: 2,
                recommendedLevel: 1,
                completed: false,
                currentFloor: 1,
                rewards: {
                    gold: 100,
                    items: [],
                    exp: 150
                }
            }
        },

        // Second Town (unlocked after tutorial)
        {
            id: 'riverside',
            name: 'Riverside',
            type: 'town',
            position: { x: 750, y: 600 },
            description: 'A bustling market town by the river. Merchants from far and wide gather here to trade.',
            discovered: false,
            accessible: false,
            icon: 'town',
            townData: {
                size: 'town',
                population: 2000,
                services: ['inn', 'shop', 'temple', 'healer', 'blacksmith'],
                npcs: [],
                quests: [],
                hasTemple: true,
                hasInn: true,
                hasShop: true,
                hasHealer: true,
                hasBlacksmith: true
            }
        },

        // Main Dungeon
        {
            id: 'ancient-ruins',
            name: 'Ancient Ruins',
            type: 'dungeon',
            position: { x: 850, y: 700 },
            description: 'Crumbling stone structures from a forgotten civilization. Strange magical energies emanate from within.',
            discovered: false,
            accessible: false,
            icon: 'ruins',
            dungeonData: {
                floors: 5,
                difficulty: 5,
                recommendedLevel: 3,
                completed: false,
                currentFloor: 1,
                rewards: {
                    gold: 500,
                    items: [],
                    exp: 750
                }
            }
        },

        // Wilderness Area
        {
            id: 'dark-forest',
            name: 'Dark Forest',
            type: 'wilderness',
            position: { x: 350, y: 400 },
            description: 'A dense, foreboding forest. Strange sounds echo through the trees. Travelers are advised to stay on the path.',
            discovered: false,
            accessible: true,
            icon: 'forest',
            wildernessData: {
                encounterRate: 0.3,
                resources: ['herbs', 'wood', 'mushrooms'],
                hazards: ['wild_animals', 'poisonous_plants']
            }
        }
    ],

    connections: [
        // Millhaven to Goblin Cave
        {
            from: 'millhaven',
            to: 'goblin-cave',
            distance: 5,
            terrain: 'path',
            travelTime: 2,
            dangerLevel: 1
        },

        // Millhaven to Dark Forest
        {
            from: 'millhaven',
            to: 'dark-forest',
            distance: 8,
            terrain: 'path',
            travelTime: 3,
            dangerLevel: 2
        },

        // Goblin Cave to Riverside (unlocked after completing cave)
        {
            from: 'goblin-cave',
            to: 'riverside',
            distance: 10,
            terrain: 'road',
            travelTime: 4,
            dangerLevel: 2
        },

        // Riverside to Ancient Ruins
        {
            from: 'riverside',
            to: 'ancient-ruins',
            distance: 12,
            terrain: 'wilderness',
            travelTime: 6,
            dangerLevel: 4
        },

        // Millhaven to Riverside (direct route, unlocked later)
        {
            from: 'millhaven',
            to: 'riverside',
            distance: 15,
            terrain: 'road',
            travelTime: 5,
            dangerLevel: 2
        }
    ],

    discoveredLocations: ['millhaven', 'goblin-cave']
};
