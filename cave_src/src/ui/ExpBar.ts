import {
  Color,
  EasingFunction,
  EasingFunctions,
  Engine,
  ScreenElement,
  vec,
} from "excalibur";
import { Player } from "../actor/Player";
import { exp } from "../exp";

export class ExpBar extends ScreenElement {
  private _player: Player;
  private _displayedExp: number;
  private _timeSinceLastGain: number;
  private _previousPlayerExp: number;
  private _easingFunction: EasingFunction;
  private _lerpDuration: number;
  private _lerpStart: number | null;
  private _lerpTime: number;

  constructor(player: Player) {
    super({
      x: 672,
      y: 600 - 40,
      width: 112,
      height: 8,
    });

    this._player = player;
    this._previousPlayerExp = this._player.exp;
    this._displayedExp = player.exp;
    this._easingFunction = EasingFunctions.EaseInCubic;
    this._lerpDuration = 500;
    this._lerpStart = null;
    this._lerpTime = 0;
  }

  onInitialize(_engine: Engine) {
    this.graphics.onPostDraw = (ctx) => {
      const displayedLevel = exp.getLevelAtExperience(this._displayedExp);
      const displayedExp =
        (this._displayedExp - exp.getExperienceForLevel(displayedLevel)) /
        exp.getExperienceForLevel(displayedLevel + 1);
      const actualLevel = exp.getLevelAtExperience(this._player.exp);
      const actualExp =
        actualLevel > displayedLevel
          ? 1
          : (this._player.exp - exp.getTotalExperienceForLevel(actualLevel)) /
            exp.getExperienceForLevel(actualLevel + 1);
      ctx.drawRectangle(
        vec(0, 0),
        this.width,
        this.height,
        Color.fromHex("#005f41"),
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
        (this.width - 2) * actualExp,
        this.height - 2,
        Color.White,
      );
      ctx.drawRectangle(
        vec(1, 1),
        (this.width - 2) * displayedExp,
        this.height - 2,
        Color.fromHex("#08b23b"),
      );
    };
  }

  update(engine: Engine, delta: number) {
    super.update(engine, delta);
    if (this._player.exp > this._previousPlayerExp) {
      this._timeSinceLastGain = 0;
      this._previousPlayerExp = this._player.exp;
      this._lerpTime = 0;
      this._lerpStart = null;
    } else {
      this._timeSinceLastGain += delta;
    }

    if (this._player.exp < this._displayedExp) {
      this._displayedExp = this._player.exp;
      this._previousPlayerExp = this._player.exp;
      this._lerpStart = null;
    }
    if (
      this._timeSinceLastGain > 1000 &&
      this._displayedExp < this._player.exp
    ) {
      this._lerpStart = this._displayedExp;
    }
    if (this._lerpStart !== null) {
      this._lerpTime += delta;
      if (this._lerpTime < this._lerpDuration) {
        this._displayedExp = this._easingFunction(
          this._lerpTime,
          this._lerpStart,
          this._player.exp,
          this._lerpDuration,
        );
      } else {
        this._displayedExp = this._player.exp;
        this._lerpStart = null;
      }
    }
  }
}
