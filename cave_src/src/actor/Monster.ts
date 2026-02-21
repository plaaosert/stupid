import {
  Actor,
  CollisionType,
  EasingFunctions,
  Engine,
  Timer,
  vec,
  Vector,
} from "excalibur";
import { TiledResource } from "@excaliburjs/plugin-tiled";
import { monsterCollisionGroup } from "../collisionGroups";
import { Animations } from "../resources";
import { random } from "../random";
import { Fireball } from "./spells/Fireball";

export class Monster extends Actor {
  moving: boolean = false;

  constructor(
    public tileX: number,
    public tileY: number,
    public grid: TiledResource,
  ) {
    super({
      pos: vec(
        grid.map.tilewidth * (tileX + 0.5),
        grid.map.tileheight * (tileY + 0.5),
      ),
      width: 64,
      height: 64,
      collisionType: CollisionType.Passive,
      collisionGroup: monsterCollisionGroup,
    });
  }

  onInitialize(engine: Engine) {
    this.graphics.use(Animations.MonsterAnimation);

    this.on("collisionstart", (event) => {
      if (event.other.owner instanceof Fireball) {
        this.actions.die();
        event.other.owner.actions.clearActions();
        event.other.owner.actions.die();
      }
    });

    const timer = new Timer({
      action: () => {
        const direction = random.pickOne([
          vec(1, 0),
          vec(0, 1),
          vec(-1, 0),
          vec(0, -1),
        ]);
        this.moveInDirection(direction);
      },
      repeats: true,
      random: random,
      randomRange: [0, 1000],
      interval: 1000,
    });
    this.scene.addTimer(timer);
    timer.start();
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
}
