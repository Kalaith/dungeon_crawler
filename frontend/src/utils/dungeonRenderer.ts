import { renderConfig } from '../data/constants';
import type { FOEInstance, InteractiveTile } from '../types';
import { foeData } from '../data/foes';

export interface DungeonSceneData {
  ahead: string;
  farAhead: string;
  left: string;
  right: string;
  leftOfAhead: string;
  rightOfAhead: string;
  foeAhead?: FOEInstance;
  foeFarAhead?: FOEInstance;
  objectAhead?: InteractiveTile;
  objectFarAhead?: InteractiveTile;
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

    // Render Far Layer (Walls -> Objects -> FOEs)
    this.renderFarWalls(sceneData.farAhead);
    if (sceneData.objectFarAhead) {
      this.renderObject(renderConfig.GEOMETRY.R3, sceneData.objectFarAhead);
    }
    if (sceneData.foeFarAhead) {
      this.renderFOE(renderConfig.GEOMETRY.R3, sceneData.foeFarAhead);
    }

    // Render Middle Layer
    this.renderMiddleSection(sceneData);
    if (sceneData.objectAhead) {
      this.renderObject(renderConfig.GEOMETRY.R2, sceneData.objectAhead);
    }
    if (sceneData.foeAhead) {
      this.renderFOE(renderConfig.GEOMETRY.R2, sceneData.foeAhead);
    }

    // Render Near Layer
    this.renderNearSides(sceneData);
  }

  private clearCanvas(): void {
    this.ctx.fillStyle = renderConfig.COLORS.BACKGROUND;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  private renderBackground(): void {
    // Ceiling
    this.ctx.fillStyle = renderConfig.COLORS.CEILING;
    this.ctx.fillRect(0, 0, this.width, this.height / 2);

    // Floor
    this.ctx.fillStyle = renderConfig.COLORS.FLOOR;
    this.ctx.fillRect(0, this.height / 2, this.width, this.height / 2);
  }

  private renderFarWalls(tileType: string): void {
    const { R3 } = renderConfig.GEOMETRY;

    if (tileType === '#') {
      this.drawRect(R3, renderConfig.COLORS.WALL_FACE);
    } else if (tileType === '<') {
      this.drawRect(R3, renderConfig.COLORS.STAIRS_UP);
    } else if (tileType === '>') {
      this.drawRect(R3, renderConfig.COLORS.STAIRS_DOWN);
    } else if (tileType === '$') {
      this.drawRect(R3, renderConfig.COLORS.TREASURE);
    }
  }

  private renderMiddleSection(data: DungeonSceneData): void {
    const { R2, R3 } = renderConfig.GEOMETRY;
    const { COLORS } = renderConfig;

    if (data.ahead === '#') {
      // Main wall ahead
      this.drawRect(R2, COLORS.WALL_FACE);

      // Left extension (if left is open and leftOfAhead is wall)
      if (data.left !== '#' && data.leftOfAhead === '#') {
        this.drawRect(
          {
            x: 0,
            y: R2.y,
            w: R2.x,
            h: R2.h,
          },
          COLORS.WALL_FACE
        );
      }

      // Right extension (if right is open and rightOfAhead is wall)
      if (data.right !== '#' && data.rightOfAhead === '#') {
        this.drawRect(
          {
            x: R2.x + R2.w,
            y: R2.y,
            w: this.width - (R2.x + R2.w),
            h: R2.h,
          },
          COLORS.WALL_FACE
        );
      }
    } else {
      // Left wall of far section (if wall to left of ahead)
      if (data.leftOfAhead === '#') {
        this.drawPoly(
          [
            [R2.x, R2.y],
            [R3.x, R3.y],
            [R3.x, R3.y + R3.h],
            [R2.x, R2.y + R2.h],
          ],
          COLORS.WALL_SIDE
        );
      }

      // Right wall of far section (if wall to right of ahead)
      if (data.rightOfAhead === '#') {
        this.drawPoly(
          [
            [R2.x + R2.w, R2.y],
            [R3.x + R3.w, R3.y],
            [R3.x + R3.w, R3.y + R3.h],
            [R2.x + R2.w, R2.y + R2.h],
          ],
          COLORS.WALL_SIDE
        );
      }

      // Draw other tile types
      if (data.ahead === '<') {
        this.drawRect(R2, COLORS.STAIRS_UP);
      } else if (data.ahead === '>') {
        this.drawRect(R2, COLORS.STAIRS_DOWN);
      } else if (data.ahead === '$') {
        this.drawRect(R2, COLORS.TREASURE);
      }
    }
  }

  private renderNearSides(data: DungeonSceneData): void {
    const { R1, R2 } = renderConfig.GEOMETRY;
    const { COLORS } = renderConfig;

    // Left wall - extend to front wall if there's a wall ahead
    if (data.left === '#') {
      if (data.ahead === '#') {
        // Wall ahead - extend left wall all the way to front wall
        this.drawPoly(
          [
            [0, 0],
            [R2.x, R2.y],
            [R2.x, R2.y + R2.h],
            [0, this.height],
          ],
          COLORS.WALL_SIDE
        );
      } else {
        // No wall ahead - normal left wall
        this.drawPoly(
          [
            [0, 0],
            [R1.x, R1.y],
            [R1.x, R1.y + R1.h],
            [0, this.height],
          ],
          COLORS.WALL_SIDE
        );
      }
    }

    // Show wall to the left of ahead (if exists and no wall directly ahead)
    // Draw as a perspective polygon from R1 to R2
    if (data.leftOfAhead === '#' && data.ahead !== '#') {
      this.drawPoly(
        [
          [R1.x, R1.y],
          [R2.x, R2.y],
          [R2.x, R2.y + R2.h],
          [R1.x, R1.y + R1.h],
        ],
        COLORS.WALL_SIDE
      );
    }

    // Right wall - extend to front wall if there's a wall ahead
    if (data.right === '#') {
      if (data.ahead === '#') {
        // Wall ahead - extend right wall all the way to front wall
        this.drawPoly(
          [
            [this.width, 0],
            [R2.x + R2.w, R2.y],
            [R2.x + R2.w, R2.y + R2.h],
            [this.width, this.height],
          ],
          COLORS.WALL_SIDE
        );
      } else {
        // No wall ahead - normal right wall
        this.drawPoly(
          [
            [this.width, 0],
            [R1.x + R1.w, R1.y],
            [R1.x + R1.w, R1.y + R1.h],
            [this.width, this.height],
          ],
          COLORS.WALL_SIDE
        );
      }
    }

    // Show wall to the right of ahead (if exists and no wall directly ahead)
    // Draw as a perspective polygon from R1 to R2
    if (data.rightOfAhead === '#' && data.ahead !== '#') {
      this.drawPoly(
        [
          [R1.x + R1.w, R1.y],
          [R2.x + R2.w, R2.y],
          [R2.x + R2.w, R2.y + R2.h],
          [R1.x + R1.w, R1.y + R1.h],
        ],
        COLORS.WALL_SIDE
      );
    }
  }

  private renderFOE(rect: { x: number; y: number; w: number; h: number }, foe: FOEInstance): void {
    const foeDef = foeData[foe.defId];
    const color = foeDef ? foeDef.color : 'red';

    // Draw FOE as a circle/blob
    const centerX = rect.x + rect.w / 2;
    const centerY = rect.y + rect.h / 2;
    const radius = Math.min(rect.w, rect.h) / 3;

    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Draw eyes (simple direction indicator)
    // Assuming facing player for now
    this.ctx.fillStyle = 'white';
    this.ctx.beginPath();
    this.ctx.arc(centerX - radius / 3, centerY - radius / 4, radius / 4, 0, Math.PI * 2);
    this.ctx.arc(centerX + radius / 3, centerY - radius / 4, radius / 4, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private renderObject(
    rect: { x: number; y: number; w: number; h: number },
    obj: InteractiveTile
  ): void {
    if (obj.type === 'door') {
      if (obj.state === 'closed' || obj.state === 'locked') {
        this.drawRect(rect, renderConfig.COLORS.DOOR);
        // Draw knob/detail
        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        this.ctx.arc(rect.x + rect.w * 0.8, rect.y + rect.h / 2, rect.w * 0.05, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        // Open door - draw frame
        this.ctx.strokeStyle = renderConfig.COLORS.DOOR;
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
      }
    } else if (obj.type === 'gathering_point') {
      if (obj.state === 'active') {
        // Draw sparkle
        this.ctx.fillStyle = 'gold';
        const centerX = rect.x + rect.w / 2;
        const centerY = rect.y + rect.h * 0.8;
        const size = rect.w / 4;

        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY - size);
        this.ctx.lineTo(centerX + size, centerY);
        this.ctx.lineTo(centerX, centerY + size);
        this.ctx.lineTo(centerX - size, centerY);
        this.ctx.closePath();
        this.ctx.fill();
      }
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
    this.ctx.strokeStyle = renderConfig.STROKE.COLOR;
    this.ctx.lineWidth = renderConfig.STROKE.WIDTH_THIN;
    this.ctx.stroke();
  }

  private drawRect(rect: { x: number; y: number; w: number; h: number }, color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    this.ctx.strokeStyle = renderConfig.STROKE.COLOR;
    this.ctx.lineWidth = renderConfig.STROKE.WIDTH_THICK;
    this.ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  }
}
