import {
  Color,
  EasingFunction,
  EasingFunctions,
  Engine,
  ScreenElement,
  vec,
} from "excalibur";
import { Player } from "../actor/Player";

export class MagicBar extends ScreenElement {
  private _player: Player;
  private _afterimageMagic: number;
  private _timeSinceLastDamage: number;
  private _previousPlayerMagic: number;
  private _easingFunction: EasingFunction;
  private _lerpDuration: number;
  private _lerpStart: number | null;
  private _lerpTime: number;

  constructor(player: Player) {
    super({
      x: 672,
      y: 600 - 24,
      width: 112,
      height: 8,
    });

    this._player = player;
    this._previousPlayerMagic = this._player.magic;
    this._afterimageMagic = player.magic;
    this._easingFunction = EasingFunctions.EaseInCubic;
    this._lerpDuration = 500;
    this._lerpStart = null;
    this._lerpTime = 0;
  }

  onInitialize(_engine: Engine) {
    this.graphics.onPostDraw = (ctx) => {
      const afterimageMagic = this._afterimageMagic / this._player.maxMagic;
      const actualMagic = this._player.magic / this._player.maxMagic;
      ctx.drawRectangle(
        vec(0, 0),
        this.width,
        this.height,
        Color.fromHex("#1831a7"),
      );
      ctx.drawRectangle(
        vec(0, 0),
        this.width,
        this.height,
        Color.Transparent,
        Color.Black,
        1,
      );
      ctx.drawRectangle(
        vec(1, 1),
        (this.width - 2) * afterimageMagic,
        this.height - 2,
        Color.White,
      );
      ctx.drawRectangle(
        vec(1, 1),
        (this.width - 2) * actualMagic,
        this.height - 2,
        Color.fromHex("#2890dc"),
      );
    };
  }

  update(engine: Engine, delta: number) {
    super.update(engine, delta);
    if (this._player.magic < this._previousPlayerMagic) {
      this._timeSinceLastDamage = 0;
      this._previousPlayerMagic = this._player.magic;
      this._lerpTime = 0;
      this._lerpStart = null;
    } else {
      this._timeSinceLastDamage += delta;
    }

    if (this._player.magic > this._afterimageMagic) {
      this._afterimageMagic = this._player.magic;
      this._previousPlayerMagic = this._player.magic;
      this._lerpStart = null;
    }
    if (
      this._timeSinceLastDamage > 1000 &&
      this._afterimageMagic > this._player.magic
    ) {
      this._lerpStart = this._afterimageMagic;
    }
    if (this._lerpStart !== null) {
      this._lerpTime += delta;
      if (this._lerpTime < this._lerpDuration) {
        this._afterimageMagic = this._easingFunction(
          this._lerpTime,
          this._lerpStart,
          this._player.magic,
          this._lerpDuration,
        );
      } else {
        this._afterimageMagic = this._player.magic;
        this._lerpStart = null;
      }
    }
  }
}
