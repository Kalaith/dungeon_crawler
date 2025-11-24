import type { Position, FOEInstance, InteractiveTile } from '../types';
import { getFoeDefinition, FOE_DATA } from '../data/foes';

interface Room {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Partition {
    x: number;
    y: number;
    width: number;
    height: number;
    leftChild?: Partition;
    rightChild?: Partition;
    room?: Room;
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
                this.grid[y][x] = '#';
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
    } {
        const root: Partition = {
            x: 0,
            y: 0,
            width: this.width,
            height: this.height
        };

        this.splitPartition(root, 0);
        this.createRooms(root);
        this.connectRooms(root);

        const stairsUp = this.floor > 1 ? this.placeStairsUp() : undefined;
        const stairsDown = this.placeStairsDown();
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
            interactiveTiles: this.interactiveTiles
        };
    }

    private splitPartition(partition: Partition, depth: number): void {
        if (depth > 4 || partition.width < 10 || partition.height < 10) {
            return;
        }

        const splitHorizontally = partition.height > partition.width;

        if (splitHorizontally) {
            const splitY = partition.y + Math.floor(partition.height / 2) + (Math.random() * 4 - 2);

            if (splitY - partition.y < 6 || partition.y + partition.height - splitY < 6) {
                return;
            }

            partition.leftChild = {
                x: partition.x,
                y: partition.y,
                width: partition.width,
                height: splitY - partition.y
            };

            partition.rightChild = {
                x: partition.x,
                y: splitY,
                width: partition.width,
                height: partition.y + partition.height - splitY
            };
        } else {
            const splitX = partition.x + Math.floor(partition.width / 2) + (Math.random() * 4 - 2);

            if (splitX - partition.x < 6 || partition.x + partition.width - splitX < 6) {
                return;
            }

            partition.leftChild = {
                x: partition.x,
                y: partition.y,
                width: splitX - partition.x,
                height: partition.height
            };

            partition.rightChild = {
                x: splitX,
                y: partition.y,
                width: partition.x + partition.width - splitX,
                height: partition.height
            };
        }

        if (partition.leftChild) this.splitPartition(partition.leftChild, depth + 1);
        if (partition.rightChild) this.splitPartition(partition.rightChild, depth + 1);
    }

    private createRooms(partition: Partition): void {
        if (partition.leftChild || partition.rightChild) {
            if (partition.leftChild) this.createRooms(partition.leftChild);
            if (partition.rightChild) this.createRooms(partition.rightChild);
        } else {
            const roomWidth = Math.floor(partition.width * 0.6) + Math.floor(Math.random() * (partition.width * 0.3));
            const roomHeight = Math.floor(partition.height * 0.6) + Math.floor(Math.random() * (partition.height * 0.3));

            const roomX = partition.x + Math.floor((partition.width - roomWidth) / 2);
            const roomY = partition.y + Math.floor((partition.height - roomHeight) / 2);

            const room: Room = {
                x: Math.max(1, roomX),
                y: Math.max(1, roomY),
                width: Math.min(roomWidth, this.width - Math.max(1, roomX) - 1),
                height: Math.min(roomHeight, this.height - Math.max(1, roomY) - 1)
            };

            partition.room = room;
            this.rooms.push(room);

            for (let y = room.y; y < room.y + room.height; y++) {
                for (let x = room.x; x < room.x + room.width; x++) {
                    if (this.isValid(x, y)) {
                        this.grid[y][x] = '.';
                    }
                }
            }
        }
    }

    private connectRooms(partition: Partition): void {
        if (!partition.leftChild || !partition.rightChild) return;

        const leftRoom = this.getRandomRoom(partition.leftChild);
        const rightRoom = this.getRandomRoom(partition.rightChild);

        if (leftRoom && rightRoom) {
            this.createCorridor(leftRoom, rightRoom);
        }

        this.connectRooms(partition.leftChild);
        this.connectRooms(partition.rightChild);
    }

    private getRandomRoom(partition: Partition): Room | null {
        if (partition.room) return partition.room;

        const rooms: Room[] = [];
        this.collectRooms(partition, rooms);

        return rooms.length > 0 ? rooms[Math.floor(Math.random() * rooms.length)] : null;
    }

    private collectRooms(partition: Partition, rooms: Room[]): void {
        if (partition.room) {
            rooms.push(partition.room);
        }
        if (partition.leftChild) this.collectRooms(partition.leftChild, rooms);
        if (partition.rightChild) this.collectRooms(partition.rightChild, rooms);
    }

    private createCorridor(room1: Room, room2: Room): void {
        const x1 = room1.x + Math.floor(room1.width / 2);
        const y1 = room1.y + Math.floor(room1.height / 2);
        const x2 = room2.x + Math.floor(room2.width / 2);
        const y2 = room2.y + Math.floor(room2.height / 2);

        if (Math.random() < 0.5) {
            this.carveHorizontalCorridor(x1, x2, y1);
            this.carveVerticalCorridor(y1, y2, x2);
        } else {
            this.carveVerticalCorridor(y1, y2, x1);
            this.carveHorizontalCorridor(x1, x2, y2);
        }
    }

    private carveHorizontalCorridor(x1: number, x2: number, y: number): void {
        const start = Math.min(x1, x2);
        const end = Math.max(x1, x2);

        for (let x = start; x <= end; x++) {
            if (this.isValid(x, y)) {
                this.grid[y][x] = '.';
            }
        }
    }

    private carveVerticalCorridor(y1: number, y2: number, x: number): void {
        const start = Math.min(y1, y2);
        const end = Math.max(y1, y2);

        for (let y = start; y <= end; y++) {
            if (this.isValid(x, y)) {
                this.grid[y][x] = '.';
            }
        }
    }

    private placeStairsUp(): Position {
        if (this.rooms.length === 0) return { x: 1, y: 1 };
        const room = this.rooms[0];
        const x = room.x + Math.floor(room.width / 2);
        const y = room.y + Math.floor(room.height / 2);
        if (this.isValid(x, y)) {
            this.grid[y][x] = '<';
        }
        return { x, y };
    }

    private placeStairsDown(): Position {
        if (this.rooms.length === 0) return { x: 1, y: 1 };
        const room = this.rooms[this.rooms.length - 1];
        const x = room.x + Math.floor(room.width / 2);
        const y = room.y + Math.floor(room.height / 2);
        if (this.isValid(x, y)) {
            this.grid[y][x] = '>';
        }
        return { x, y };
    }

    private placeTreasure(): Position[] {
        const treasureLocations: Position[] = [];
        const treasureCount = Math.min(this.floor, 3);

        for (let i = 0; i < treasureCount && i < this.rooms.length - 2; i++) {
            const room = this.rooms[i + 1];
            if (!room) continue;

            const x = room.x + 1 + Math.floor(Math.random() * (room.width - 2));
            const y = room.y + 1 + Math.floor(Math.random() * (room.height - 2));

            if (this.isValid(x, y) && this.grid[y][x] === '.') {
                this.grid[y][x] = '$';
                treasureLocations.push({ x, y });
            }
        }

        return treasureLocations;
    }

    private placeDoors(): void {
        this.rooms.forEach(room => {
            if (this.isCorridor(room.x + Math.floor(room.width / 2), room.y - 1)) {
                this.addDoor(room.x + Math.floor(room.width / 2), room.y);
            }
            if (this.isCorridor(room.x + Math.floor(room.width / 2), room.y + room.height)) {
                this.addDoor(room.x + Math.floor(room.width / 2), room.y + room.height - 1);
            }
            if (this.isCorridor(room.x - 1, room.y + Math.floor(room.height / 2))) {
                this.addDoor(room.x, room.y + Math.floor(room.height / 2));
            }
            if (this.isCorridor(room.x + room.width, room.y + Math.floor(room.height / 2))) {
                this.addDoor(room.x + room.width - 1, room.y + Math.floor(room.height / 2));
            }
        });
    }

    private isCorridor(x: number, y: number): boolean {
        if (!this.isValid(x, y)) return false;
        return this.grid[y][x] === '.';
    }

    private addDoor(x: number, y: number): void {
        if (!this.isValid(x, y) || this.grid[y][x] !== '.') return;

        if (Math.random() > 0.3) return;

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
        this.grid[y][x] = '+';
    }

    private placeGatheringPoints(): void {
        const count = 2 + Math.floor(Math.random() * 3);

        for (let i = 0; i < count; i++) {
            if (this.rooms.length === 0) continue;
            const room = this.rooms[Math.floor(Math.random() * this.rooms.length)];
            const x = room.x + Math.floor(Math.random() * room.width);
            const y = room.y + Math.floor(Math.random() * room.height);

            if (this.isValid(x, y) && this.grid[y][x] === '.') {
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
        const foeKeys = Object.keys(FOE_DATA);

        for (let i = 0; i < count; i++) {
            if (this.rooms.length === 0) continue;
            const room = this.rooms[Math.floor(Math.random() * this.rooms.length)];
            const x = room.x + Math.floor(room.width / 2);
            const y = room.y + Math.floor(room.height / 2);

            if (this.isValid(x, y) && this.grid[y][x] === '.') {
                const key = foeKeys[Math.floor(Math.random() * foeKeys.length)];
                const foeDef = getFoeDefinition(key);

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

    private getRandomFloorPosition(): Position {
        if (this.rooms.length === 0) return { x: 1, y: 1 };
        const room = this.rooms[0];
        return {
            x: room.x + Math.floor(room.width / 2),
            y: room.y + Math.floor(room.height / 2)
        };
    }

    private isValid(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height && this.grid[y] !== undefined;
    }
}

export const generateDungeon = (width: number, height: number, floor: number) => {
    const generator = new DungeonGenerator(width, height, floor);
    return generator.generate();
};
