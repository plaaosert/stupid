import { FactoryProps, TiledResource } from "@excaliburjs/plugin-tiled";
import { Actor, CollisionType, Engine, Timer, vec } from "excalibur";
import { monsterCollisionGroup } from "../collisionGroups";
import { Monster } from "./Monster";
import { Resources } from "../resources";
import { random } from "../random";

export class Spawner extends Actor {
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
    const sprite = Resources.Spawner.toSprite();
    this.graphics.use(sprite);
    const timer = new Timer({
      action: () => {
        const direction = random.pickOne([
          vec(1, 0),
          vec(0, 1),
          vec(-1, 0),
          vec(0, -1),
        ]);
        this.scene.add(
          new Monster(
            this.tileX + direction.x,
            this.tileY + direction.y,
            this.grid,
          ),
        );
      },
      repeats: true,
      random: random,
      randomRange: [0, 10000],
      interval: 3000,
    });
    this.scene.addTimer(timer);
    timer.start();
  }
}

export const spawnerFactory = (props: FactoryProps): Spawner => {
  return new Spawner(
    props.worldPos.x / Resources.Map.map.tilewidth,
    props.worldPos.y / Resources.Map.map.tileheight,
    Resources.Map,
  );
};
