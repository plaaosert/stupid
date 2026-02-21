import { Player } from "../actor/Player";
import { Spell } from "./Spell";
import { Scene } from "excalibur";

export class TestSpell implements Spell {
  name: string;
  manaCost: number;
  cast: (scene: Scene, caster: Player) => void;

  constructor() {
    this.name = "Test Spell";
    this.manaCost = 10;
    this.cast = () => {
      console.log("Casted test spell.");
    };
  }
}
