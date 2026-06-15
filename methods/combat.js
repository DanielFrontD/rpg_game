const readline = require("readline");
const { COLORS, ELF, MONSTER } = require("../shared/constants");
const { questionAsync } = require("../shared/utils");

let combatReadline = null;

function renderCombatScreen(playerData, enemyData) {
  console.clear();
  console.log(`${COLORS.RED}═══════════ COMBATE ═══════════${COLORS.RESET}`);
  console.log("");
  console.log(
    `  ${ELF}  ${COLORS.GREEN}${playerData.name}${COLORS.RESET}` +
    `          VS          ` +
    `${COLORS.RED}${enemyData.name}${COLORS.RESET}  ${MONSTER}`
  );
  console.log("");
  console.log(
    `  ${COLORS.GREEN}HP: ${playerData.hp}/${playerData.maxHp}${COLORS.RESET}` +
    `                    ` +
    `${COLORS.RED}HP: ${enemyData.hp}/${enemyData.maxHp}${COLORS.RESET}`
  );
  console.log("");
  console.log(`${COLORS.RED}═══════════════════════════════${COLORS.RESET}`);
  console.log("");
}

function showCombatMenu() {
  console.log(`${COLORS.CYAN}Que deseas hacer?${COLORS.RESET}`);
  console.log(`${COLORS.CYAN}1.${COLORS.RESET} Atacar`);
  console.log(`${COLORS.CYAN}2.${COLORS.RESET} Defender`);
}

function calculateDamage(attack, level) {
  const baseDamage = attack + (attack * 0.3 * level);
  const roll1 = Math.random();
  const roll2 = Math.random();
  const roll = Math.min(roll1, roll2);
  const damage = Math.floor(baseDamage - 10 + (roll * 12));
  return Math.max(1, damage);
}

async function combatLoop(rl, playerData, enemyData) {
  let defending = false;

  renderCombatScreen(playerData, enemyData);
  showCombatMenu();

  const option = await questionAsync(rl);

  switch (option) {
    case "1": {
      const damage = calculateDamage(playerData.attack, playerData.level);
      enemyData.hp -= damage;
      console.log("");
      console.log(`${COLORS.GREEN}Atacas al ${enemyData.name} y causas ${damage} de daño!${COLORS.RESET}`);

      if (enemyData.hp <= 0) {
        enemyData.hp = 0;
        console.log(`${COLORS.YELLOW}Has derrotado al ${enemyData.name}!${COLORS.RESET}`);
        return { result: "win" };
      }

      break;
    }

    case "2": {
      defending = true;
      console.log("");
      console.log(`${COLORS.BLUE}Te pones en posicion defensiva!${COLORS.RESET}`);
      break;
    }

    default: {
      console.log(`${COLORS.RED}Opcion invalida.${COLORS.RESET}`);
      return combatLoop(rl, playerData, enemyData);
    }
  }

  const enemyDamage = calculateDamage(enemyData.attack, enemyData.level);
  const finalDamage = defending ? Math.floor(enemyDamage / 2) : enemyDamage;

  playerData.hp -= finalDamage;

  if (defending) {
    console.log(`${COLORS.RED}${enemyData.name} ataca pero reduces el daño a ${finalDamage}!${COLORS.RESET}`);
  } else {
    console.log(`${COLORS.RED}${enemyData.name} te ataca y causa ${finalDamage} de daño!${COLORS.RESET}`);
  }

  if (playerData.hp <= 0) {
    playerData.hp = 0;
    console.log(`${COLORS.RED}Has sido derrotado...${COLORS.RESET}`);
    return { result: "lose" };
  }

  console.log("");
  console.log(`${COLORS.CYAN}Presiona enter para continuar...${COLORS.RESET}`);
  await questionAsync(rl);

  return combatLoop(rl, playerData, enemyData);
}

async function startCombat(player, enemyTile, onCombatEnd) {
  const playerData = {
    name: player.userName,
    hp: player.hp,
    maxHp: player.hp,
    attack: player.attack,
    level: player.level,
  };

  const enemyData = {
    name: "Monstruo",
    hp: 30 + (player.level * 10),
    maxHp: 30 + (player.level * 10),
    attack: 5 + (player.level * 2),
    level: player.level,
  };

  combatReadline = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const result = await combatLoop(combatReadline, playerData, enemyData);

  combatReadline.close();
  combatReadline = null;

  console.log("");

  if (result.result === "win") {
    console.log(`${COLORS.GREEN}Victoria! Ganaste la batalla!${COLORS.RESET}`);
  } else {
    console.log(`${COLORS.RED}Game Over...${COLORS.RESET}`);
  }

  console.log(`${COLORS.CYAN}Presiona enter para continuar...${COLORS.RESET}`);

  const endRl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  await questionAsync(endRl);
  endRl.close();

  onCombatEnd(result.result, enemyTile);
}

module.exports = { startCombat };
