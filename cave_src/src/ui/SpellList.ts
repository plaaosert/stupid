import {
  Engine,
  GraphicsGroup,
  Keys,
  Rectangle,
  ScreenElement,
  vec,
} from "excalibur";
import { Player } from "../actor/Player";
import { Spell } from "../spells/Spell";
import { SpellButton } from "./SpellButton";
import { FireballSpell } from "../spells/FireballSpell";
import { hept32 } from "../palette/hept32";

export class SpellList extends ScreenElement {
  private _player: Player;
  spells: Spell[] = [];
  private _spellKeys = [Keys.Z, Keys.X, Keys.C, Keys.V, Keys.B, Keys.N, Keys.M];
  private _spellKeysDisplay = ["Z", "X", "C", "V", "B", "N", "M"];

  constructor(player: Player) {
    super({
      x: 672,
      y: 16,
      width: 112,
      height: 520,
    });

    this._player = player;
  }

  onInitialize(_engine: Engine) {
    const border = new Rectangle({
      width: this.width,
      height: this.height,
      color: hept32[29],
    });
    const body = new Rectangle({
      width: this.width - 2,
      height: this.height - 2,
      color: hept32[30],
    });
    const graphicsGroup = new GraphicsGroup({
      useAnchor: false,
      members: [
        {
          graphic: border,
          offset: vec(0, 0),
        },
        {
          graphic: body,
          offset: vec(1, 1),
        },
      ],
    });
    this.graphics.use(graphicsGroup);
    this.z = 999;

    // Add all spells
    //this.addSpell(new TestSpell());
    this.addSpell(new FireballSpell());
  }

  addSpell(spell: Spell) {
    console.log(`adding spell: ${spell.name}`);
    this.spells.push(spell);
    this.addChild(
      new SpellButton(
        8,
        8 + (this.spells.length - 1) * 32,
        spell,
        this._player,
        this._spellKeys[this.spells.length - 1],
        this._spellKeysDisplay[this.spells.length - 1],
      ),
    );
  }
}
