import player from "./images/player.png";
import backgroundGridSquare from "./images/background_grid_square.png";
import fireball from "./images/spells/fireball.png";
import caveExit from "./images/cave_exit.png";
import monster from "./images/monster.png";
import spawner from "./images/spawner.png";
import mapPath from "./maps/map.tmj";
import tileSetPath from "./maps/cave_tiles.tsj";
import { Animation, ImageSource, Loader, range, SpriteSheet } from "excalibur";
import { TiledResource } from "@excaliburjs/plugin-tiled";
import { exitFactory } from "./actor/CaveExit";
import { spawnerFactory } from "./actor/Spawner";

export const Resources = {
  Player: new ImageSource(player),
  GridSquare: new ImageSource(backgroundGridSquare),
  Fireball: new ImageSource(fireball),
  CaveExit: new ImageSource(caveExit),
  Monster: new ImageSource(monster),
  Spawner: new ImageSource(spawner),
  Map: new TiledResource(mapPath, {
    useMapBackgroundColor: true,
    entityClassNameFactories: {
      exit: exitFactory,
      spawner: spawnerFactory,
    },
    pathMap: [
      { path: "map.tmj", output: mapPath },
      { path: "cave_tiles.tsj", output: tileSetPath },
      {
        path: "../images/background_grid_square.png",
        output: backgroundGridSquare,
      },
    ],
  }),
};

export const Sheets = {
  FireballSheet: SpriteSheet.fromImageSource({
    image: Resources.Fireball,
    grid: {
      rows: 1,
      columns: 3,
      spriteWidth: 16,
      spriteHeight: 16,
    },
  }),
  MonsterSheet: SpriteSheet.fromImageSource({
    image: Resources.Monster,
    grid: {
      rows: 1,
      columns: 4,
      spriteWidth: 32,
      spriteHeight: 32,
    },
  }),
};

export const Animations = {
  FireballAnimation: Animation.fromSpriteSheet(
    Sheets.FireballSheet,
    range(0, 2),
    200,
  ),
  MonsterAnimation: Animation.fromSpriteSheet(
    Sheets.MonsterSheet,
    range(0, 3),
    200,
  ),
};

export const loader = new Loader([
  Resources.Player,
  Resources.GridSquare,
  Resources.Fireball,
  Resources.CaveExit,
  Resources.Monster,
  Resources.Spawner,
  Resources.Map,
]);
loader.backgroundColor = "#111";
loader.logo =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
loader.logoWidth = 0;
loader.logoHeight = 0;
