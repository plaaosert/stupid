import {
  Color,
  Engine,
  Font,
  FontUnit,
  ScreenElement,
  Text,
  Rectangle,
  Keys,
  vec,
  GraphicsGroup,
} from "excalibur";
import { Spell } from "../spells/Spell";
import { Player } from "../actor/Player";
import { hept32 } from "../palette/hept32";

export class SpellButton extends ScreenElement {
  private _spell: Spell;
  private readonly _player: Player;
  private readonly _keybind: Keys;
  private _text: Text;
  private _manaCostText: Text;
  private _buttonColor: Color;
  private readonly _upColor: Color;
  private readonly _overColor: Color;
  private readonly _downColor: Color;
  private _mouseIsDown: boolean;
  private _buttonBody: Rectangle;
  constructor(
    x: number,
    y: number,
    spell: Spell,
    player: Player,
    keybind: Keys,
    keybindDisplay: string,
  ) {
    super({
      x: x,
      y: y,
      width: 96,
      height: 24,
    });
    this._spell = spell;
    this._player = player;
    this._keybind = keybind;
    this._text = new Text({
      text: `${keybindDisplay} ${this._spell.name}`,
      font: new Font({
        family: "serif",
        size: 12,
        unit: FontUnit.Px,
        color: hept32[0],
      }),
    });
    this._manaCostText = new Text({
      text: this._spell.manaCost.toString(),
      font: new Font({
        family: "sans-serif",
        size: 16,
        unit: FontUnit.Px,
        color: Color.fromHex("#3877c4"),
      }),
    });
    this._upColor = hept32[28];
    this._overColor = hept32[27];
    this._downColor = hept32[31];
    this._buttonColor = this._upColor;
  }

  onInitialize(_engine: Engine) {
    const buttonBorder = new Rectangle({
      width: this.width,
      height: this.height,
      color: hept32[29],
    });
    this._buttonBody = new Rectangle({
      width: this.width - 2,
      height: this.height - 2,
      color: this._buttonColor,
    });
    const graphicsGroup = new GraphicsGroup({
      useAnchor: false,
      members: [
        {
          graphic: buttonBorder,
          offset: vec(0, 0),
        },
        {
          graphic: this._buttonBody,
          offset: vec(1, 1),
        },
        {
          graphic: this._text,
          offset: vec(8, 6),
        },
        {
          graphic: this._manaCostText,
          offset: vec(80, 4),
        },
      ],
    });
    this.graphics.use(graphicsGroup);
    this.on("pointerdown", () => {
      this._spell.cast(this.scene, this._player);
    });
    this._engine.input.pointers.on("down", () => {
      this._mouseIsDown = true;
    });
    this._engine.input.pointers.on("up", () => {
      this._mouseIsDown = false;
    });
    this._engine.input.keyboard.on("press", (evt) => {
      if (evt.key === this._keybind) {
        this._spell.cast(this.scene, this._player);
      }
    });
  }

  update(engine: Engine, delta: number) {
    const lastMousePos = engine.input.pointers.primary.lastScreenPos;
    const mouseInside = this.contains(lastMousePos.x, lastMousePos.y);
    if (
      engine.input.keyboard.isHeld(this._keybind) ||
      (mouseInside && this._mouseIsDown)
    ) {
      this._buttonColor = this._downColor;
    } else if (mouseInside) {
      this._buttonColor = this._overColor;
    } else {
      this._buttonColor = this._upColor;
    }
    this._buttonBody.color = this._buttonColor;
  }
}
