const { DAMAGE_PERCENTAGE } = require("../shared/constants");

const _private = new WeakMap();

class Player {
  constructor(userName, characterClass, level, stats) {
    _private.set(this, {
      userName,
      characterClass,
      level,
      stats,
    });
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

  get stats() {
    return _private.get(this).stats;
  }

  setLevelUp() {
    _private.get(this).level += 1;
  }

  doAttack() {
    const currentAttack = this.stats.character_attack;
    const currentLevel = this.level;
    const attackPerLevel = currentAttack * DAMAGE_PERCENTAGE;

    return currentAttack + (attackPerLevel * currentLevel)
  }
}

module.exports = { Player }
