import type { Position, FOEInstance, InteractiveTile } from '../types';
import { getFoeDefinition, foeData } from '../data/foes';
import { gameConfig } from '../data/constants';

interface Room {
    x: number;
    y: number;
    width: number;
    height: number;
    center: Position;
}

export class DungeonGenerator {
    private width: number;
    private height: number;
    private floor: number;
    private grid: string[][];
    private rooms: Room[] = [];
    private foes: FOEInstance[] = [];
    private interactiveTiles: Record<string, InteractiveTile> = {};

    constructor(width: number, height: number, floor: number) {
        this.width = width;
        this.height = height;
        this.floor = floor;
        this.grid = [];
        for (let y = 0; y < height; y++) {
            this.grid[y] = [];
            for (let x = 0; x < width; x++) {
                this.grid[y]![x] = '#';
            }
        }
    }

    generate(): {
        layout: string[];
        playerStart: Position;
        stairsUp?: Position;
        stairsDown?: Position;
        treasureLocations: Position[];
        foes: FOEInstance[];
        interactiveTiles: Record<string, InteractiveTile>;
        roomCount: number;
    } {
        // Reset state
        this.rooms = [];
        this.foes = [];
        this.interactiveTiles = {};
        this.grid = [];
        for (let y = 0; y < this.height; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.grid[y]![x] = '#';
            }
        }

        this.placeRooms();
        this.connectRooms();

        const stairsUp = this.floor > 1 ? this.placeStairsUp() : undefined;
        const stairsDown = this.floor < gameConfig.DUNGEON.MAX_FLOORS ? this.placeStairsDown() : undefined;
        const treasureLocations = this.placeTreasure();

        this.placeDoors();
        this.placeGatheringPoints();
        this.placeFOEs();

        const playerStart = stairsUp || this.getRandomFloorPosition();
        const layout = this.grid.map(row => row.join(''));

        return {
            layout,
            playerStart,
            stairsUp,
            stairsDown,
            treasureLocations,
            foes: this.foes,
            interactiveTiles: this.interactiveTiles,
            roomCount: this.rooms.length
        };
    }

    private placeRooms(): void {
        const {
            MIN_ROOM_SIZE: minRoomSize,
            MAX_ROOM_SIZE: maxRoomSize,
            MAX_ROOMS: maxRooms
        } = gameConfig.DUNGEON;
        const attempts = 200;

        for (let i = 0; i < attempts && this.rooms.length < maxRooms; i++) {
            const width = Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;
            const height = Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;

            // Ensure room is within bounds with 1 tile padding for walls
            const x = Math.floor(Math.random() * (this.width - width - 2)) + 1;
            const y = Math.floor(Math.random() * (this.height - height - 2)) + 1;

            const newRoom: Room = {
                x,
                y,
                width,
                height,
                center: {
                    x: Math.floor(x + width / 2),
                    y: Math.floor(y + height / 2)
                }
            };

            if (!this.doesRoomOverlap(newRoom)) {
                this.createRoom(newRoom);
                this.rooms.push(newRoom);
            }
        }
    }

    private doesRoomOverlap(room: Room): boolean {
        // Add 1 tile buffer around rooms to prevent them from touching directly
        const buffer = 1;
        for (const other of this.rooms) {
            if (
                room.x - buffer < other.x + other.width &&
                room.x + room.width + buffer > other.x &&
                room.y - buffer < other.y + other.height &&
                room.y + room.height + buffer > other.y
            ) {
                return true;
            }
        }
        return false;
    }

    private createRoom(room: Room): void {
        for (let y = room.y; y < room.y + room.height; y++) {
            for (let x = room.x; x < room.x + room.width; x++) {
                if (this.isValid(x, y)) {
                    this.grid[y]![x] = '.';
                }
            }
        }
    }

    private connectRooms(): void {
        if (this.rooms.length < 2) return;

        const connected = new Set<Room>();
        const unconnected = new Set<Room>(this.rooms);

        // Start with the first room
        const startRoom = this.rooms[0];
        connected.add(startRoom);
        unconnected.delete(startRoom);

        while (unconnected.size > 0) {
            let bestDist = Infinity;
            let bestRoomA: Room | null = null;
            let bestRoomB: Room | null = null;

            // Find the closest pair of (connected, unconnected) rooms
            for (const roomA of connected) {
                for (const roomB of unconnected) {
                    const dist = Math.pow(roomA.center.x - roomB.center.x, 2) + Math.pow(roomA.center.y - roomB.center.y, 2);
                    if (dist < bestDist) {
                        bestDist = dist;
                        bestRoomA = roomA;
                        bestRoomB = roomB;
                    }
                }
            }

            if (bestRoomA && bestRoomB) {
                this.createCorridor(bestRoomA.center, bestRoomB.center);
                connected.add(bestRoomB);
                unconnected.delete(bestRoomB);
            } else {
                break; // Should not happen if rooms exist
            }
        }

        // Add a few random connections to create loops (optional, makes dungeon less linear)
        const extraConnections = Math.floor(this.rooms.length / 3);
        for (let i = 0; i < extraConnections; i++) {
            const roomA = this.rooms[Math.floor(Math.random() * this.rooms.length)];
            const roomB = this.rooms[Math.floor(Math.random() * this.rooms.length)];
            if (roomA && roomB && roomA !== roomB) {
                this.createCorridor(roomA.center, roomB.center);
            }
        }
    }

    private createCorridor(start: Position, end: Position): void {
        // Create L-shaped corridor
        // Randomly decide whether to go horizontal first or vertical first
        const horizontalFirst = Math.random() < 0.5;

        if (horizontalFirst) {
            this.carveHorizontalTunnel(start.x, end.x, start.y);
            this.carveVerticalTunnel(start.y, end.y, end.x);
        } else {
            this.carveVerticalTunnel(start.y, end.y, start.x);
            this.carveHorizontalTunnel(start.x, end.x, end.y);
        }
    }

    private carveHorizontalTunnel(x1: number, x2: number, y: number): void {
        const start = Math.min(x1, x2);
        const end = Math.max(x1, x2);
        for (let x = start; x <= end; x++) {
            if (this.isValid(x, y)) {
                this.grid[y]![x] = '.';
            }
        }
    }

    private carveVerticalTunnel(y1: number, y2: number, x: number): void {
        const start = Math.min(y1, y2);
        const end = Math.max(y1, y2);
        for (let y = start; y <= end; y++) {
            if (this.isValid(x, y)) {
                this.grid[y]![x] = '.';
            }
        }
    }

    private placeStairsUp(): Position {
        if (this.rooms.length === 0) return { x: 1, y: 1 };
        const room = this.rooms[0];
        if (!room) return { x: 1, y: 1 };

        const x = room.center.x;
        const y = room.center.y;
        if (this.isValid(x, y)) {
            this.grid[y]![x] = '<';
        }
        return { x, y };
    }

    private placeStairsDown(): Position {
        if (this.rooms.length === 0) return { x: 1, y: 1 };
        const room = this.rooms[this.rooms.length - 1];
        if (!room) return { x: 1, y: 1 };

        const x = room.center.x;
        const y = room.center.y;
        if (this.isValid(x, y)) {
            this.grid[y]![x] = '>';
        }
        return { x, y };
    }

    private placeTreasure(): Position[] {
        const treasureLocations: Position[] = [];
        const treasureCount = Math.min(this.floor, 3);

        for (let i = 0; i < treasureCount; i++) {
            // Pick a random room that isn't the start or end room (if possible)
            let roomIndex = Math.floor(Math.random() * this.rooms.length);
            if (this.rooms.length > 2) {
                while (roomIndex === 0 || roomIndex === this.rooms.length - 1) {
                    roomIndex = Math.floor(Math.random() * this.rooms.length);
                }
            }

            const room = this.rooms[roomIndex];
            if (!room) continue;

            const x = room.x + 1 + Math.floor(Math.random() * (room.width - 2));
            const y = room.y + 1 + Math.floor(Math.random() * (room.height - 2));

            if (this.isValid(x, y) && this.grid[y]![x] === '.') {
                this.grid[y]![x] = '$';
                treasureLocations.push({ x, y });
            }
        }

        return treasureLocations;
    }

    private placeDoors(): void {
        // Place doors where corridors meet rooms
        for (const room of this.rooms) {
            // Check top edge
            for (let x = room.x; x < room.x + room.width; x++) {
                if (this.isCorridor(x, room.y - 1)) this.addDoor(x, room.y);
                if (this.isCorridor(x, room.y + room.height)) this.addDoor(x, room.y + room.height - 1);
            }
            // Check side edges
            for (let y = room.y; y < room.y + room.height; y++) {
                if (this.isCorridor(room.x - 1, y)) this.addDoor(room.x, y);
                if (this.isCorridor(room.x + room.width, y)) this.addDoor(room.x + room.width - 1, y);
            }
        }
    }

    private isCorridor(x: number, y: number): boolean {
        if (!this.isValid(x, y)) return false;
        return this.grid[y]![x] === '.';
    }

    private addDoor(x: number, y: number): void {
        if (!this.isValid(x, y) || this.grid[y]![x] !== '.') return;

        if (Math.random() > 0.4) return; // 40% chance for a door

        const id = `door_${x}_${y}`;
        this.interactiveTiles[id] = {
            id,
            type: 'door',
            x,
            y,
            state: Math.random() < 0.2 ? 'locked' : 'closed',
            metadata: {
                keyId: 'iron_key'
            }
        };
        this.grid[y]![x] = '+';
    }

    private placeGatheringPoints(): void {
        const count = 2 + Math.floor(Math.random() * 3);

        for (let i = 0; i < count; i++) {
            if (this.rooms.length === 0) continue;
            const room = this.rooms[Math.floor(Math.random() * this.rooms.length)];
            if (!room) continue;

            const x = room.x + Math.floor(Math.random() * room.width);
            const y = room.y + Math.floor(Math.random() * room.height);

            if (this.isValid(x, y) && this.grid[y]![x] === '.') {
                const id = `gather_${x}_${y}`;
                this.interactiveTiles[id] = {
                    id,
                    type: 'gathering_point',
                    x,
                    y,
                    state: 'active',
                    metadata: {
                        skillReq: 'Herbalism'
                    }
                };
            }
        }
    }

    private placeFOEs(): void {
        if (this.floor < 2) return;

        const count = 1 + Math.floor(Math.random() * 2);
        const foeKeys = Object.keys(foeData);
        if (foeKeys.length === 0) return;

        for (let i = 0; i < count; i++) {
            if (this.rooms.length === 0) continue;
            const room = this.rooms[Math.floor(Math.random() * this.rooms.length)];
            if (!room) continue;

            const x = room.center.x;
            const y = room.center.y;

            if (this.isValid(x, y) && this.grid[y]![x] === '.') {
                const key = foeKeys[Math.floor(Math.random() * foeKeys.length)];
                if (!key) continue;
                const foeDef = getFoeDefinition(key);

                if (foeDef) {
                    const foeInstance: FOEInstance = {
                        id: `foe_${key}_${x}_${y}_${Math.random().toString(36).substr(2, 5)}`,
                        defId: key,
                        x,
                        y,
                        hp: foeDef.derivedStats.HP.max,
                        maxHp: foeDef.derivedStats.HP.max,
                        facing: 0,
                        alertState: 'idle',
                        origin: { x, y },
                        currentPathIndex: 0
                    };
                    this.foes.push(foeInstance);
                }
            }
        }
    }

    private getRandomFloorPosition(): Position {
        if (this.rooms.length === 0) return { x: 1, y: 1 };
        const room = this.rooms[0];
        if (!room) return { x: 1, y: 1 };

        return {
            x: room.center.x,
            y: room.center.y
        };
    }

    private isValid(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height && this.grid[y] !== undefined;
    }
}

export const generateDungeon = (width: number, height: number, floor: number) => {
    let generator = new DungeonGenerator(width, height, floor);
    let data = generator.generate();
    let attempts = 0;

    // Retry if we don't have enough rooms (aim for at least 6)
    while (data.roomCount < 6 && attempts < 10) {
        generator = new DungeonGenerator(width, height, floor);
        data = generator.generate();
        attempts++;
    }

    return data;
};
