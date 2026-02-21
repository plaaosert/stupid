import { Player } from "../actor/Player";
import { Scene } from "excalibur";

export interface Spell {
  name: string;
  manaCost: number;
  cast: (scene: Scene, caster: Player) => void;
}
