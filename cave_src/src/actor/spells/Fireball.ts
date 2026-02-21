import { Actor, CollisionType, EasingFunctions, vec, Vector } from "excalibur";
import { Animations } from "../../resources";
import { TiledResource } from "@excaliburjs/plugin-tiled";
import { spellCollisionGroup } from "../../collisionGroups";

const FIREBALL_LIFE = 1000;
const FIREBALL_SPEED = 160;

export class Fireball extends Actor {
  life: number;
  direction: Vector;

  constructor(
    tileX: number,
    tileY: number,
    grid: TiledResource,
    direction: Vector,
  ) {
    let rotation = 0;
    if (direction.x === Vector.Up.x && direction.y === Vector.Up.y) {
      rotation = 0;
    } else if (
      direction.x === Vector.Right.x &&
      direction.y === Vector.Right.y
    ) {
      rotation = Math.PI * 0.5;
    } else if (direction.x === Vector.Down.x && direction.y === Vector.Down.y) {
      rotation = Math.PI;
    } else if (direction.x === Vector.Left.x && direction.y === Vector.Left.y) {
      rotation = Math.PI * 1.5;
    }
    super({
      pos: vec(
        16 + grid.map.tilewidth * tileX,
        16 + grid.map.tileheight * tileY,
      ),
      rotation: rotation,
      width: 16,
      height: 16,
      collisionType: CollisionType.Passive,
      collisionGroup: spellCollisionGroup,
    });
    this.life = FIREBALL_LIFE;
    this.direction = direction;
  }

  onInitialize() {
    this.graphics.use(Animations.FireballAnimation);
    this.actions
      .moveBy({
        offset: this.direction
          .clone()
          .scaleEqual(FIREBALL_SPEED * (FIREBALL_LIFE / 1000)),
        duration: FIREBALL_LIFE,
        easing: EasingFunctions.EaseInOutCubic,
      })
      .die();
  }
}
