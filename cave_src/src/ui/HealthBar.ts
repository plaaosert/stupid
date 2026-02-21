import {
  Color,
  EasingFunction,
  EasingFunctions,
  Engine,
  ScreenElement,
  vec,
} from "excalibur";
import { Player } from "../actor/Player";

export class HealthBar extends ScreenElement {
  private _player: Player;
  private _afterimageHealth: number;
  private _timeSinceLastDamage: number;
  private _previousPlayerHealth: number;
  private _easingFunction: EasingFunction;
  private _lerpDuration: number;
  private _lerpStart: number | null;
  private _lerpTime: number;

  constructor(player: Player) {
    super({
      x: 672,
      y: 600 - 32,
      width: 112,
      height: 8,
    });

    this._player = player;
    this._previousPlayerHealth = this._player.health;
    this._afterimageHealth = player.health;
    this._easingFunction = EasingFunctions.EaseInCubic;
    this._lerpDuration = 500;
    this._lerpStart = null;
    this._lerpTime = 0;
  }

  onInitialize(_engine: Engine) {
    this.graphics.onPostDraw = (ctx) => {
      const afterimageHealth = this._afterimageHealth / this._player.maxHealth;
      const actualHealth = this._player.health / this._player.maxHealth;
      ctx.drawRectangle(
        vec(0, 0),
        this.width,
        this.height,
        Color.fromHex("#720d0d"),
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
        (this.width - 2) * afterimageHealth,
        this.height - 2,
        Color.White,
      );
      ctx.drawRectangle(
        vec(1, 1),
        (this.width - 2) * actualHealth,
        this.height - 2,
        Color.fromHex("#da2424"),
      );
    };
  }

  update(engine: Engine, delta: number) {
    super.update(engine, delta);
    if (this._player.health < this._previousPlayerHealth) {
      this._timeSinceLastDamage = 0;
      this._previousPlayerHealth = this._player.health;
      this._lerpTime = 0;
      this._lerpStart = null;
    } else {
      this._timeSinceLastDamage += delta;
    }

    if (this._player.health > this._afterimageHealth) {
      this._afterimageHealth = this._player.health;
      this._previousPlayerHealth = this._player.health;
      this._lerpStart = null;
    }
    if (
      this._timeSinceLastDamage > 1000 &&
      this._afterimageHealth > this._player.health
    ) {
      this._lerpStart = this._afterimageHealth;
    }
    if (this._lerpStart !== null) {
      this._lerpTime += delta;
      if (this._lerpTime < this._lerpDuration) {
        this._afterimageHealth = this._easingFunction(
          this._lerpTime,
          this._lerpStart,
          this._player.health,
          this._lerpDuration,
        );
      } else {
        this._afterimageHealth = this._player.health;
        this._lerpStart = null;
      }
    }
  }
}
