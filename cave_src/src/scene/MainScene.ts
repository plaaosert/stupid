import { Scene } from "excalibur";
import { Player } from "../actor/Player";
import { Resources } from "../resources";
import { HealthBar } from "../ui/HealthBar";
import { ExpBar } from "../ui/ExpBar";
import { MagicBar } from "../ui/MagicBar";
import { SpellList } from "../ui/SpellList";

export class MainScene extends Scene {
  onInitialize() {
    Resources.Map.addToScene(this);

    const player = new Player(15, 15, Resources.Map);
    this.add(player);

    const expbar = new ExpBar(player);
    this.add(expbar);

    const healthbar = new HealthBar(player);
    this.add(healthbar);

    const magicbar = new MagicBar(player);
    this.add(magicbar);

    const spellList = new SpellList(player);
    this.add(spellList);

    this.camera.strategy.lockToActor(player);
  }
}
