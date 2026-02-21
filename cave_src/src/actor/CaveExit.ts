import { Actor, CollisionType, Engine, vec } from "excalibur";
import { caveExitCollisionGroup } from "../collisionGroups";
import { FactoryProps, TiledResource } from "@excaliburjs/plugin-tiled";
import { Resources } from "../resources";

export class CaveExit extends Actor {
  constructor(
    public tileX: number,
    public tileY: number,
    public grid: TiledResource,
    public destination: string,
  ) {
    super({
      pos: vec(grid.map.tilewidth * tileX, grid.map.tileheight * tileY),
      width: 64,
      height: 64,
      anchor: vec(0, 0),
      collisionType: CollisionType.Fixed,
      collisionGroup: caveExitCollisionGroup,
    });
  }

  onInitialize(engine: Engine) {
    const sprite = Resources.CaveExit.toSprite();
    this.graphics.use(sprite);
  }
}

export const exitFactory = (props: FactoryProps): CaveExit => {
  let destination: string;
  switch (props.properties.get("destination")) {
    case 0:
      destination = "/TunnelsOfGlembo/Garbage/cookie.html";
      break;
    case 1:
      destination = "/TunnelsOfGlembo/Garbage/theTruth.html";
      break;
    case 2:
      destination = "/TunnelsOfGlembo/Garbage/damnation/";
      break;
    case 3:
      destination = "/TunnelsOfGlembo/Garbage/sludge.html";
      break;
    case 4:
      destination = "/TunnelsOfGlembo/Scrumblus";
      break;
    case 5:
      destination = "/TunnelsOfGlembo/Garbage/procrastination.html";
      break;
  }
  return new CaveExit(
    props.worldPos.x / Resources.Map.map.tilewidth,
    props.worldPos.y / Resources.Map.map.tileheight,
    Resources.Map,
    destination,
  );
};
