import type { Position } from '../types';

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

    constructor(width: number, height: number, floor: number) {
        this.width = width;
        this.height = height;
        this.floor = floor;
        // Initialize grid properly - create each row individually
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
    } {
        // Create root partition
        const root: Partition = {
            x: 0,
            y: 0,
            width: this.width,
            height: this.height
        };

        // Split into rooms using BSP
        this.splitPartition(root, 0);

        // Create rooms in leaf partitions
        this.createRooms(root);

        // Connect rooms with corridors
        this.connectRooms(root);

        // Place stairs
        const stairsUp = this.floor > 1 ? this.placeStairsUp() : undefined;
        const stairsDown = this.placeStairsDown();

        // Place treasure
        const treasureLocations = this.placeTreasure();

        // Determine player start
        const playerStart = stairsUp || this.getRandomFloorPosition();

        // Convert grid to string array
        const layout = this.grid.map(row => row.join(''));

        return {
            layout,
            playerStart,
            stairsUp,
            stairsDown,
            treasureLocations
        };
    }

    private splitPartition(partition: Partition, depth: number): void {
        // Stop splitting if too small or max depth reached
        if (depth > 4 || partition.width < 10 || partition.height < 10) {
            return;
        }

        // Decide split direction based on aspect ratio
        const splitHorizontally = partition.height > partition.width;

        if (splitHorizontally) {
            // Split horizontally
            const splitY = partition.y + Math.floor(partition.height / 2) +
                (Math.random() * 4 - 2);

            if (splitY - partition.y < 6 || partition.y + partition.height - splitY < 6) {
                return; // Split would create too small partition
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
            // Split vertically
            const splitX = partition.x + Math.floor(partition.width / 2) +
                (Math.random() * 4 - 2);

            if (splitX - partition.x < 6 || partition.x + partition.width - splitX < 6) {
                return; // Split would create too small partition
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

        // Recursively split children
        if (partition.leftChild) this.splitPartition(partition.leftChild, depth + 1);
        if (partition.rightChild) this.splitPartition(partition.rightChild, depth + 1);
    }

    private createRooms(partition: Partition): void {
        if (partition.leftChild || partition.rightChild) {
            // Not a leaf, recurse
            if (partition.leftChild) this.createRooms(partition.leftChild);
            if (partition.rightChild) this.createRooms(partition.rightChild);
        } else {
            // Leaf partition - create a room
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

            // Carve out the room - with strict bounds checking
            for (let y = room.y; y < room.y + room.height; y++) {
                for (let x = room.x; x < room.x + room.width; x++) {
                    if (y >= 0 && y < this.height && x >= 0 && x < this.width && this.grid[y] !== undefined) {
                        this.grid[y][x] = '.';
                    }
                }
            }
        }
    }

    private connectRooms(partition: Partition): void {
        if (!partition.leftChild || !partition.rightChild) return;

        // Get rooms from each child
        const leftRoom = this.getRandomRoom(partition.leftChild);
        const rightRoom = this.getRandomRoom(partition.rightChild);

        if (leftRoom && rightRoom) {
            this.createCorridor(leftRoom, rightRoom);
        }

        // Recursively connect children
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

        // L-shaped corridor
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
            if (x >= 0 && x < this.width && y >= 0 && y < this.height && this.grid[y] !== undefined) {
                this.grid[y][x] = '.';
            }
        }
    }

    private carveVerticalCorridor(y1: number, y2: number, x: number): void {
        const start = Math.min(y1, y2);
        const end = Math.max(y1, y2);

        for (let y = start; y <= end; y++) {
            if (x >= 0 && x < this.width && y >= 0 && y < this.height && this.grid[y] !== undefined) {
                this.grid[y][x] = '.';
            }
        }
    }

    private placeStairsUp(): Position {
        const room = this.rooms[0]; // Place in first room
        const x = room.x + Math.floor(room.width / 2);
        const y = room.y + Math.floor(room.height / 2);
        if (y >= 0 && y < this.height && x >= 0 && x < this.width && this.grid[y] !== undefined) {
            this.grid[y][x] = '<';
        }
        return { x, y };
    }

    private placeStairsDown(): Position {
        const room = this.rooms[this.rooms.length - 1]; // Place in last room
        const x = room.x + Math.floor(room.width / 2);
        const y = room.y + Math.floor(room.height / 2);
        if (y >= 0 && y < this.height && x >= 0 && x < this.width && this.grid[y] !== undefined) {
            this.grid[y][x] = '>';
        }
        return { x, y };
    }

    private placeTreasure(): Position[] {
        const treasureLocations: Position[] = [];
        const treasureCount = Math.min(this.floor, 3); // More treasure on deeper floors

        for (let i = 0; i < treasureCount && i < this.rooms.length - 2; i++) {
            const room = this.rooms[i + 1]; // Skip first room (has stairs up)
            const x = room.x + 1 + Math.floor(Math.random() * (room.width - 2));
            const y = room.y + 1 + Math.floor(Math.random() * (room.height - 2));

            if (y >= 0 && y < this.height && x >= 0 && x < this.width && this.grid[y] !== undefined && this.grid[y][x] === '.') {
                this.grid[y][x] = '$';
                treasureLocations.push({ x, y });
            }
        }

        return treasureLocations;
    }

    private getRandomFloorPosition(): Position {
        const room = this.rooms[0];
        return {
            x: room.x + Math.floor(room.width / 2),
            y: room.y + Math.floor(room.height / 2)
        };
    }
}

export const generateDungeon = (width: number, height: number, floor: number) => {
    const generator = new DungeonGenerator(width, height, floor);
    return generator.generate();
};
