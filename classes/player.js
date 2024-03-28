const { DAMAGE_PERCENTAGE } = require("../shared/constants");

const _private = new WeakMap();

class Player {
  constructor(playerdata) {
    _private.set(this, playerdata);
  }

  get userName() {
    return _private.get(this).userName;
  }

  get characterClass() {
    return _private.get(this).characterClass;
  }

  get level() {
    return _private.get(this).level;
  }

  get attack() {
    return _private.get(this).attack;
  }

  get magic() {
    return _private.get(this).magic;
  }

  get hp() {
    return _private.get(this).hp;
  }

  get lastPosition() {
    return _private.get(this).lastPosition;
  }

  get lastMap() {
    return _private.get(this).lastMap;
  }

  setLevelUp() {
    _private.get(this).level += 1;
  }

  doAttack() {
    const currentAttack = this.stats.character_attack;
    const currentLevel = this.level;
    const attackPerLevel = currentAttack * DAMAGE_PERCENTAGE;

    return currentAttack + attackPerLevel * currentLevel;
  }
}

module.exports = { Player };
