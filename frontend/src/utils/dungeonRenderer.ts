import { RENDER_CONFIG } from '../data/constants';

export interface DungeonSceneData {
    ahead: string;
    farAhead: string;
    left: string;
    right: string;
    leftOfAhead: string;
    rightOfAhead: string;
}

export class DungeonRenderer {
    private ctx: CanvasRenderingContext2D;
    private width: number;
    private height: number;

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
    }

    public renderScene(sceneData: DungeonSceneData): void {
        this.clearCanvas();
        this.renderBackground();
        this.renderFarWalls(sceneData.farAhead);
        this.renderMiddleSection(sceneData);
        this.renderNearSides(sceneData);
    }

    private clearCanvas(): void {
        this.ctx.fillStyle = RENDER_CONFIG.COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    private renderBackground(): void {
        // Ceiling
        this.ctx.fillStyle = RENDER_CONFIG.COLORS.CEILING;
        this.ctx.fillRect(0, 0, this.width, this.height / 2);

        // Floor
        this.ctx.fillStyle = RENDER_CONFIG.COLORS.FLOOR;
        this.ctx.fillRect(0, this.height / 2, this.width, this.height / 2);
    }

    private renderFarWalls(tileType: string): void {
        const { R3 } = RENDER_CONFIG.GEOMETRY;

        if (tileType === '#') {
            this.drawRect(R3, RENDER_CONFIG.COLORS.WALL_FACE);
        } else if (tileType === '+') {
            this.drawRect(R3, RENDER_CONFIG.COLORS.DOOR);
        } else if (tileType === '<') {
            this.drawRect(R3, RENDER_CONFIG.COLORS.STAIRS_UP);
        } else if (tileType === '>') {
            this.drawRect(R3, RENDER_CONFIG.COLORS.STAIRS_DOWN);
        } else if (tileType === '$') {
            this.drawRect(R3, RENDER_CONFIG.COLORS.TREASURE);
        }
    }

    private renderMiddleSection(data: DungeonSceneData): void {
        const { R2, R3 } = RENDER_CONFIG.GEOMETRY;
        const { COLORS } = RENDER_CONFIG;

        // Left wall of far section (if wall to left of ahead)
        if (data.leftOfAhead === '#') {
            this.drawPoly([
                [R2.x, R2.y],
                [R3.x, R3.y],
                [R3.x, R3.y + R3.h],
                [R2.x, R2.y + R2.h]
            ], COLORS.WALL_SIDE);
        }

        // Right wall of far section (if wall to right of ahead)
        if (data.rightOfAhead === '#') {
            this.drawPoly([
                [R2.x + R2.w, R2.y],
                [R3.x + R3.w, R3.y],
                [R3.x + R3.w, R3.y + R3.h],
                [R2.x + R2.w, R2.y + R2.h]
            ], COLORS.WALL_SIDE);
        }

        // Main wall ahead
        if (data.ahead === '#') {
            this.drawRect(R2, COLORS.WALL_FACE);
        } else if (data.ahead === '+') {
            this.drawRect(R2, COLORS.DOOR);
        } else if (data.ahead === '<') {
            this.drawRect(R2, COLORS.STAIRS_UP);
        } else if (data.ahead === '>') {
            this.drawRect(R2, COLORS.STAIRS_DOWN);
        } else if (data.ahead === '$') {
            this.drawRect(R2, COLORS.TREASURE);
        }
    }

    private renderNearSides(data: DungeonSceneData): void {
        const { R1, R2 } = RENDER_CONFIG.GEOMETRY;
        const { COLORS } = RENDER_CONFIG;

        // Left wall
        if (data.left === '#') {
            this.drawPoly([
                [0, 0],
                [R1.x, R1.y],
                [R1.x, R1.y + R1.h],
                [0, this.height]
            ], COLORS.WALL_SIDE);
        } else {
            // Passage to the left - show corner of next tile
            this.drawPoly([
                [R1.x, R1.y],
                [R2.x, R2.y],
                [R2.x, R2.y + R2.h],
                [R1.x, R1.y + R1.h]
            ], COLORS.WALL_SIDE);
        }

        // Right wall
        if (data.right === '#') {
            this.drawPoly([
                [this.width, 0],
                [R1.x + R1.w, R1.y],
                [R1.x + R1.w, R1.y + R1.h],
                [this.width, this.height]
            ], COLORS.WALL_SIDE);
        } else {
            // Passage to the right
            this.drawPoly([
                [R1.x + R1.w, R1.y],
                [R2.x + R2.w, R2.y],
                [R2.x + R2.w, R2.y + R2.h],
                [R1.x + R1.w, R1.y + R1.h]
            ], COLORS.WALL_SIDE);
        }
    }

    private drawPoly(points: [number, number][], color: string): void {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i][0], points[i][1]);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.strokeStyle = RENDER_CONFIG.STROKE.COLOR;
        this.ctx.lineWidth = RENDER_CONFIG.STROKE.WIDTH_THIN;
        this.ctx.stroke();
    }

    private drawRect(rect: { x: number, y: number, w: number, h: number }, color: string): void {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
        this.ctx.strokeStyle = RENDER_CONFIG.STROKE.COLOR;
        this.ctx.lineWidth = RENDER_CONFIG.STROKE.WIDTH_THICK;
        this.ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    }
}
