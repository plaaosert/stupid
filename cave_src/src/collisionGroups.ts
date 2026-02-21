import { CollisionGroup, CollisionGroupManager } from "excalibur";

export const playerCollisionGroup = CollisionGroupManager.create("player");
export const caveExitCollisionGroup = CollisionGroupManager.create("caveExit");
export const monsterCollisionGroup = CollisionGroupManager.create("monster");
export const spellCollisionGroup = CollisionGroupManager.create("spell");

export const playersCollideWith = CollisionGroup.collidesWith([
  caveExitCollisionGroup,
  monsterCollisionGroup,
  spellCollisionGroup,
]);

export const caveExitCollideWith = CollisionGroup.collidesWith([
  playerCollisionGroup,
]);

export const monstersCollideWith = CollisionGroup.collidesWith([
  playerCollisionGroup,
  monsterCollisionGroup,
  spellCollisionGroup,
]);

export const spellsCollideWith = CollisionGroup.collidesWith([
  monsterCollisionGroup,
]);
