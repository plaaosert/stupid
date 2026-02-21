import {
  Actor,
  CollisionType,
  EasingFunctions,
  Engine,
  Keys,
  RotationType,
  vec,
  Vector,
} from "excalibur";
import { Resources } from "../resources";
import { exp } from "../exp";
import { playerCollisionGroup } from "../collisionGroups";
import { TiledResource } from "@excaliburjs/plugin-tiled";
import { CaveExit } from "./CaveExit";

const HP_RESTORE_TIME = 10000;
const MP_RESTORE_TIME = 7000;

export class Player extends Actor {
  dir: Vector = Vector.Right;
  moving: boolean = false;

  health: number;
  maxHealth: number;
  magic: number;
  maxMagic: number;
  level: number;
  exp: number;

  private _hpRestoreTimer;
  private _mpRestoreTimer;

  constructor(
    public tileX: number,
    public tileY: number,
    public grid: TiledResource,
  ) {
    super({
      pos: vec(
        16 + grid.map.tilewidth * tileX,
        16 + grid.map.tileheight * tileY,
      ),
      width: 16,
      height: 16,
      collisionType: CollisionType.Passive,
      collisionGroup: playerCollisionGroup,
    });
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.maxMagic = 100;
    this.magic = this.maxMagic;
    this.level = 1;
    this.exp = 0;
    this._hpRestoreTimer = HP_RESTORE_TIME;
    this._mpRestoreTimer = MP_RESTORE_TIME;
  }

  onInitialize() {
    this.graphics.add(Resources.Player.toSprite());
    this.on("collisionstart", (event) => {
      if (event.other.owner instanceof CaveExit) {
        window.open(event.other.owner.destination, "_self");
      }
    });
  }

  moveInDirection(direction: Vector) {
    const newTileCoord = direction.add(vec(this.tileX, this.tileY));
    const futureTile = this.grid.getTileByPoint(
      "tiles",
      vec(
        newTileCoord.x * this.grid.map.tilewidth,
        newTileCoord.y * this.grid.map.tileheight,
      ),
    );

    // If the tile is off grid don't move
    if (futureTile) {
      if (!this.moving) {
        this.moving = true;
      } else {
        return;
      }
      // Tile x,y are the tile coordinates
      this.tileX = futureTile.exTile.x;
      this.tileY = futureTile.exTile.y;

      this.actions
        .rotateTo(
          Math.atan2(direction.y, direction.x),
          Math.PI * 4,
          RotationType.ShortestPath,
        )
        .moveTo({
          // Tile pos is the world pixel position of the tile
          pos: futureTile.exTile.pos.add(vec(16, 16)),
          duration: 250,
          easing: EasingFunctions.Linear,
        })
        .callMethod(() => {
          this.moving = false;
        });
    }
  }

  public update(engine: Engine, delta: number) {
    // perform movement
    if (
      engine.input.keyboard.isHeld(Keys.W) ||
      engine.input.keyboard.isHeld(Keys.Up)
    ) {
      this.dir = Vector.Up;
      this.moveInDirection(Vector.Up);
    } else if (
      engine.input.keyboard.isHeld(Keys.S) ||
      engine.input.keyboard.isHeld(Keys.Down)
    ) {
      this.dir = Vector.Down;
      this.moveInDirection(Vector.Down);
    } else if (
      engine.input.keyboard.isHeld(Keys.A) ||
      engine.input.keyboard.isHeld(Keys.Left)
    ) {
      this.dir = Vector.Left;
      this.moveInDirection(Vector.Left);
    } else if (
      engine.input.keyboard.isHeld(Keys.D) ||
      engine.input.keyboard.isHeld(Keys.Right)
    ) {
      this.dir = Vector.Right;
      this.moveInDirection(Vector.Right);
    }

    // mp regen / hp regen
    this._hpRestoreTimer -= delta;
    while (this._hpRestoreTimer < 0) {
      this.setHealth(this.health + 1);
      this._hpRestoreTimer += HP_RESTORE_TIME;
    }
    this._mpRestoreTimer -= delta;
    while (this._mpRestoreTimer < 0) {
      this.setMagic(this.magic + 1);
      this._mpRestoreTimer += MP_RESTORE_TIME;
    }
  }

  public setHealth(health: number) {
    this.health = Math.max(0, Math.min(health, this.maxHealth));
  }

  public setMagic(magic: number) {
    this.magic = Math.max(0, Math.min(magic, this.maxMagic));
  }

  public grantExp(experience: number) {
    this.exp = Math.max(
      0,
      Math.min(
        this.exp + experience,
        exp.getTotalExperienceForLevel(exp.getMaxLevel()),
      ),
    );
  }
}
