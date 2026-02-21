import { Color, DisplayMode, Engine } from "excalibur";
import { loader } from "./resources";
import { MainScene } from "./scene/MainScene";

class Game extends Engine {
  constructor() {
    super({
      width: 800,
      height: 600,
      displayMode: DisplayMode.Fixed,
      viewport: {
        width: 800,
        height: 600,
      },
      resolution: {
        width: 800,
        height: 600,
      },
      pixelArt: true,
    });
  }

  initialize() {
    this.addScene("main", new MainScene());

    this.backgroundColor = Color.fromHex("#222222");
    this.start(loader).then(() => {
      this.goToScene("main");
    });
  }
}

export const game = new Game();
game.initialize();
