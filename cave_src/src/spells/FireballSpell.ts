import { Player } from "../actor/Player";
import { Spell } from "./Spell";
import { Scene } from "excalibur";
import { Fireball } from "../actor/spells/Fireball";

export class FireballSpell implements Spell {
  name: string;
  manaCost: number;
  cast: (scene: Scene, caster: Player) => void;

  constructor() {
    this.name = "Fireball";
    this.manaCost = 5;
    this.cast = (scene: Scene, caster: Player) => {
      if (caster.magic < this.manaCost) return;
      caster.setMagic(caster.magic - this.manaCost);
      scene.add(
        new Fireball(caster.tileX, caster.tileY, caster.grid, caster.dir),
      );
    };
  }
}
