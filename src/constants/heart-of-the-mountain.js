import { stats_symbols as symbols } from "./stats.js";

function round(num, decimals = 0) {
  return Math.round(Math.pow(10, decimals) * num) / Math.pow(10, decimals);
}

function floor(num, decimals = 0) {
  return Math.floor(Math.pow(10, decimals) * num) / Math.pow(10, decimals);
}

const upgrade_types = {
  mithril_powder: {
    name: "Mithril Powder",
    color: "2",
  },
  gemstone_powder: {
    name: "Gemstone Powder",
    color: "d",
  },
  token_of_the_mountain: {
    name: "Token of the Mountain",
    color: "5",
  },
};

class Node {
  constructor(level, enabled) {
    this.level = level;
    this.enabled = enabled;
  }

  get lore() {
    let output = [];

    // Name
    const nameColor = this.level === 0 ? "c" : this.level === this.max_level ? "a" : "e";
    output.push(`§${nameColor}§l${this.name}`);

    // Level
    if (this.max_level > 1) {
      if (this.maxed) {
        output.push(`§7Level ${Math.max(1, this.level)}`);
      } else {
        output.push(`§7Level ${Math.max(1, this.level)}§8/${this.max_level}`);
      }
    }
    output.push("");

    // Perk
    output.push(...this.perk(Math.max(1, this.level)));

    // Upgradeable
    if (this.level > 0 && this.level < this.max_level) {
      // header
      output.push("", "§a=====[ §a§lUPGRADE §a] =====");

      // upgrade perk
      output.push(`§7Level ${this.level + 1}§8/${this.max_level}`, "", ...this.perk(this.level + 1));

      // upgrade cost
      output.push(
        "",
        "§7Cost",
        `§${upgrade_types[this.upgrade_type].color}${this.upgradeCost} ${upgrade_types[this.upgrade_type].name}`
      );
    }

    // Maxed perk
    if (this.maxed) {
      output.push("", "§aUNLOCKED");
    }

    // Unlock cost & requirements
    if (this.level === 0) {
      output.push(
        "",
        "§7Cost",
        `§${upgrade_types.token_of_the_mountain.color}1 ${upgrade_types.token_of_the_mountain.name}`
      );

      if (this.requires.length > 0) {
        const reqs = this.requires.map((x) => hotm.names[x]);
        output.push("", `§cRequires ${reqs.slice(0, -1).join(", ") + " or " + reqs.slice(-1)}.`);
      }
    }

    // Status
    if (this.level > 0) {
      output.push("", this.enabled ? "§aENABLED" : "§cDISABLED");
    }

    return output.map((x) => "§r" + x);
  }

  get maxed() {
    return this.level === this.max_level;
  }

  get upgradeCost() {
    return -1;
  }

  perk(level) {
    return ["Missing perk description."];
  }
}

class MiningSpeed2 extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "mining_speed_2";
    this.name = hotm.names[this.id];
    this.position = 2;
    this.max_level = 50;
    this.upgrade_type = "gemstone_powder";
    this.requires = ["lonesome_miner"];
  }

  get upgradeCost() {
    const nextLevel = this.level + 1;
    return floor(Math.pow(nextLevel + 1, 3.2));
  }

  perk(level) {
    const val = level * 40;
    return [`§7Grants §a+${val} §6${symbols.mining_speed} Mining Speed§7.`];
  }
}

class PowderBuff extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "powder_buff";
    this.name = hotm.names[this.id];
    this.position = 4;
    this.max_level = 50;
    this.upgrade_type = "gemstone_powder";
    this.requires = ["mole"];
  }

  get upgradeCost() {
    const nextLevel = this.level + 1;
    return floor(Math.pow(nextLevel + 1, 3.2));
  }

  perk(level) {
    const val = level * 1;
    return [`§7Gain §a${val}% §7more Mithril Powder and Gemstone Powder.`];
  }
}

class MiningFortune2 extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "mining_fortune_2";
    this.name = hotm.names[this.id];
    this.position = 6;
    this.max_level = 50;
    this.upgrade_type = "gemstone_powder";
    this.requires = ["great_explorer"];
  }

  get upgradeCost() {
    const nextLevel = this.level + 1;
    return floor(Math.pow(nextLevel + 1, 3.2));
  }

  perk(level) {
    const val = level * 5;
    return [`§7Grants §a+${val} §6${symbols.mining_fortune} Mining Fortune§7.`];
  }
}

class VeinSeeker extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "vein_seeker";
    this.name = hotm.names[this.id];
    this.position = 8;
    this.max_level = 1;
    this.upgrade_type = null;
    this.requires = ["lonesome_miner"];
  }

  get upgradeCost() {
    return 0;
  }

  perk(level) {
    return [
      "§6Pickaxe Ability: Vein Seeker",
      "§7Points in the direction of the nearest vein and grants §a+3 §6Mining Spread §7for §a14s§7.",
      "§8Cooldown: §a60s",
      "",
      "§8Pickaxe Abilities apply to all of your pickaxes. You can select a Pickaxe Ability from your Heart of the Mountain.",
      "",
      "§8Upgrade your Pickaxe Abilities by unlocking §cPeak of the Mountain §8in this menu!",
    ];
  }
}

class LonesomeMiner extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "lonesome_miner";
    this.name = hotm.names[this.id];
    this.position = 9;
    this.max_level = 45;
    this.upgrade_type = "gemstone_powder";
    this.requires = ["goblin_killer", "professional"];
  }

  get upgradeCost() {
    const nextLevel = this.level + 1;
    return floor(Math.pow(nextLevel + 1, 3.07));
  }

  perk(level) {
    const val = round(5 + (level - 1) * 0.5);
    return [
      `§7Increases §c${symbols.strength} Strength, §9${symbols.crit_chance} Crit Chance, §9${symbols.crit_damage} Crit Damage, §a${symbols.defense} Defense, and §c${symbols.health} Health §7statistics gain by §a${val}% §7while in the Crystal Hollows.`,
    ];
  }
}

class Professional extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "professional";
    this.name = hotm.names[this.id];
    this.position = 10;
    this.max_level = 140;
    this.upgrade_type = "gemstone_powder";
    this.requires = ["mole", "lonesome_miner"];
  }

  get upgradeCost() {
    const nextLevel = this.level + 1;
    return floor(Math.pow(nextLevel + 1, 2.3));
  }

  perk(level) {
    const val = 50 + level * 5;
    return [`§7Gain §a+${val}§7 §6${symbols.mining_speed} Mining Speed§7 when mining Gemstones.`];
  }
}

class Mole extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "mole";
    this.name = hotm.names[this.id];
    this.position = 11;
    this.max_level = 190;
    this.upgrade_type = "gemstone_powder";
    this.requires = ["efficient_miner"];
  }

  get upgradeCost() {
    const nextLevel = this.level + 1;
    return floor(Math.pow(nextLevel + 1, 2.2));
  }

  perk(level) {
    const chance = 50 + (level - 1) * 5;
    let blocks = 1 + floor(chance / 100);
    let percent = chance - floor(chance / 100) * 100;
    if (percent === 0) {
      blocks -= 1;
      percent = 100;
    }

    switch (blocks) {
      case 1:
        blocks = "1";
        break;
      case 2:
        blocks = "a 2nd";
        break;
      case 3:
        blocks = "a 3rd";
        break;
      default:
        blocks = `a ${blocks}th`;
        break;
    }

    return [
      `§7When mining hard stone, you have a §a${percent}%§7 chance to mine §a${blocks}§7 adjacent hard stone block.`,
    ];
  }
}

class Fortunate extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "fortunate";
    this.name = hotm.names[this.id];
    this.position = 12;
    this.max_level = 20;
    this.upgrade_type = "mithril_powder";
    this.requires = ["mole", "great_explorer"];
  }

  get upgradeCost() {
    const nextLevel = this.level + 1;
    return floor(Math.pow(nextLevel + 1, 3.05));
  }

  perk(level) {
    const val = level * 5;
    return [`§7Grants §a+${val}§7 §6${symbols.mining_fortune} Mining Fortune§7 when mining Gemstone.`];
  }
}

class GreatExplorer extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "great_explorer";
    this.name = hotm.names[this.id];
    this.position = 13;
    this.max_level = 20;
    this.upgrade_type = "gemstone_powder";
    this.requires = ["star_powder", "fortunate"];
  }

  get upgradeCost() {
    const nextLevel = this.level + 1;
    return floor(Math.pow(nextLevel + 1, 4));
  }

  perk(level) {
    const val = 20 + (level - 1) * 4;
    return [`§7Grants §a+${val}%§7 §7chance to find treasure.`];
  }
}

class ManiacMiner extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "maniac_miner";
    this.name = hotm.names[this.id];
    this.position = 14;
    this.max_level = 1;
    this.upgrade_type = null;
    this.requires = ["great_explorer"];
  }

  get upgradeCost() {
    return 0;
  }

  perk(level) {
    return [
      "§6Pickaxe Ability: Maniac Miner",
      `§7Spends all your Mana and grants §a+1 §6${symbols.mining_speed} Mining Speed §7for every 10 Mana spent, for §a15s§7.`,
      "§8Cooldown: §a110s",
      "",
      "§8Pickaxe Abilities apply to all of your pickaxes. You can select a Pickaxe Ability from your Heart of the Mountain.",
      "",
      "§8Upgrade your Pickaxe Abilities by unlocking §cPeak of the Mountain §8in this menu!",
    ];
  }
}

class GoblinKiller extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "goblin_killer";
    this.name = hotm.names[this.id];
    this.position = 16;
    this.max_level = 1;
    this.upgrade_type = null;
    this.requires = ["mining_madness", "lonesome_miner"];
  }

  get upgradeCost() {
    return 0;
  }

  perk(level) {
    return [
      `§7Killing a §6Golden Goblin §7gives §2200 §7extra §2Mithril Powder§7, while killing other Goblins gives some based on their wits.`,
    ];
  }
}

class PeakOfTheMountain extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "special_0";
    this.name = hotm.names[this.id];
    this.position = 18;
    this.max_level = 5;
    this.upgrade_type = "mithril_powder";
    this.requires = ["efficient_miner"];
  }

  get upgradeCost() {
    const nextLevel = this.level + 1;
    return floor(25000 * nextLevel);
  }

  perk(level) {
    const output = [];

    if (level >= 1) {
      output.push("§8+§c1 Pickaxe Ability Level", "§8+§51 Token of the Mountain");
    }
    if (level >= 2) {
      output.push("§8+§a1 Forge Slot");
    }
    if (level >= 3) {
      output.push("§8+§a1 Commission Slot");
    }
    if (level >= 4) {
      output.push("§8+§21 Mithril Powder §7when mining §fMithril");
    }
    if (level >= 5) {
      output.push("§8+§51 Token of the Mountain");
    }

    return output;
  }
}

class StarPowder extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "star_powder";
    this.name = hotm.names[this.id];
    this.position = 20;
    this.max_level = 1;
    this.upgrade_type = null;
    this.requires = ["front_loaded", "great_explorer"];
  }

  get upgradeCost() {
    return 0;
  }

  perk(level) {
    return [`§7Mining Mithril Ore near §5Fallen Crystals §7gives §a+3 §7extra Mithril Powder.`];
  }
}

class SkyMall extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "daily_effect";
    this.name = hotm.names[this.id];
    this.position = 22;
    this.max_level = 1;
    this.upgrade_type = null;
    this.requires = ["mining_madness"];
  }

  get upgradeCost() {
    return 0;
  }

  perk(level) {
    return [
      "§7Every SkyBlock day, you receive a random buff in the §2Dwarven Mines§7.",
      "",
      "§7Possible Buffs",
      `§8 ■ §7Gain §a+100 §6${symbols.mining_speed} Mining Speed.`,
      `§8 ■ §7Gain §a+50 §6${symbols.mining_fortune} Mining Fortune.`,
      "§8 ■ §7Gain §a+15% §7chance to gain extra Powder while mining.",
      "§8 ■ §7Reduce Pickaxe Ability cooldown by §a20%",
      "§8 ■ §7§a10x §7chance to find Goblins while mining.",
      "§8 ■ §7Gain §a5x §9Titanium §7drops.",
    ];
  }
}

class MiningMadness extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "mining_madness";
    this.name = hotm.names[this.id];
    this.position = 23;
    this.max_level = 1;
    this.upgrade_type = null;
    this.requires = ["random_event", "mining_experience", "goblin_killer"];
  }

  get upgradeCost() {
    return 0;
  }

  perk(level) {
    return [
      `§7Grants §a+50 §6${symbols.mining_speed} Mining Speed §7and §6${symbols.mining_fortune} Mining Fortune§7.`,
    ];
  }
}

class SeasonedMineman extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "mining_experience";
    this.name = hotm.names[this.id];
    this.position = 24;
    this.max_level = 100;
    this.upgrade_type = "mithril_powder";
    this.requires = ["efficient_miner", "mining_madness"];
  }

  get upgradeCost() {
    const nextLevel = this.level + 1;
    return floor(Math.pow(nextLevel + 1, 2.3));
  }

  perk(level) {
    const val = round(5 + level * 0.1, 1);
    return [`§7Increases your Mining experience gain by §a${val}%§7.`];
  }
}

class EfficientMiner extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "efficient_miner";
    this.name = hotm.names[this.id];
    this.position = 25;
    this.max_level = 100;
    this.upgrade_type = "mithril_powder";
    this.requires = ["daily_powder", "mining_experience", "experience_orbs"];
  }

  get upgradeCost() {
    const nextLevel = this.level + 1;
    return floor(Math.pow(nextLevel + 1, 2.6));
  }

  perk(level) {
    const val1 = round(10 + level * 0.4, 1);
    const val2 = floor(level * 0.1);
    return [`§7When mining ores, you have a §a${val1}%§7 chance to mine §a${val2} §7adjacent ores.`];
  }
}

class Orbiter extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "experience_orbs";
    this.name = hotm.names[this.id];
    this.position = 26;
    this.max_level = 80;
    this.upgrade_type = "mithril_powder";
    this.requires = ["efficient_miner", "front_loaded"];
  }

  get upgradeCost() {
    const nextLevel = this.level + 1;
    return floor(70 * nextLevel);
  }

  perk(level) {
    const val = round(0.2 + level * 0.01, 2);
    return [`§7When mining ores, you have a §a${val}%§7 chance to get a random amount of experience orbs.`];
  }
}

class FrontLoaded extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "front_loaded";
    this.name = hotm.names[this.id];
    this.position = 27;
    this.max_level = 1;
    this.upgrade_type = null;
    this.requires = ["fallen_star_bonus", "experience_orbs", "star_powder"];
  }

  get upgradeCost() {
    return 0;
  }

  perk(level) {
    return [
      `§7Grants §a+100 §6${symbols.mining_speed} Mining Speed §7and §6${symbols.mining_fortune} Mining Fortune §7for the first §e2,500 §7ores you mine in a day.`,
    ];
  }
}

class PrecisionMining extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "precision_mining";
    this.name = hotm.names[this.id];
    this.position = 28;
    this.max_level = 1;
    this.upgrade_type = null;
    this.requires = [];
  }

  get upgradeCost() {
    return 0;
  }

  perk(level) {
    return [
      `§7When mining ore, a particle target appears on the block that increases your §6${symbols.mining_speed} Mining Speed §7by §a30% §7when aiming at it.`,
    ];
  }
}

class LuckOfTheCave extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "random_event";
    this.name = hotm.names[this.id];
    this.position = 30;
    this.max_level = 45;
    this.upgrade_type = "mithril_powder";
    this.requires = ["mining_speed_boost", "mining_madness"];
  }

  get upgradeCost() {
    const nextLevel = this.level + 1;
    return floor(Math.pow(nextLevel + 1, 3.07));
  }

  perk(level) {
    const val = 5 + level * 1;
    return [`§7Increases the chance for you to trigger rare occurrences in §2Dwarven Mines §7by §a${val}%§7.`];
  }
}

class DailyPowder extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "daily_powder";
    this.name = hotm.names[this.id];
    this.position = 32;
    this.max_level = 100;
    this.upgrade_type = "mithril_powder";
    this.requires = ["mining_fortune"];
  }

  get upgradeCost() {
    const nextLevel = this.level + 1;
    return floor(182 + 18 * nextLevel);
  }

  perk(level) {
    const val = 400 + (level - 1) * 36;
    return [`§7Gain §a${val} Powder §7from the first ore you mine every day. Works for all Powder types.`];
  }
}

class Crystallized extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "fallen_star_bonus";
    this.name = hotm.names[this.id];
    this.position = 34;
    this.max_level = 30;
    this.upgrade_type = "mithril_powder";
    this.requires = ["pickaxe_toss", "front_loaded"];
  }

  get upgradeCost() {
    const nextLevel = this.level + 1;
    return floor(Math.pow(nextLevel + 1, 3.4));
  }

  perk(level) {
    const val = 20 + (level - 1) * 6;
    return [
      `§7Grants §a+${val} §6${symbols.mining_speed} Mining Speed §7and a §a${val}% §7chance to deal §a+1 §7extra damage near §5Fallen Stars§7.`,
    ];
  }
}

class MiningSpeedBoost extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "mining_speed_boost";
    this.name = hotm.names[this.id];
    this.position = 37;
    this.max_level = 1;
    this.upgrade_type = null;
    this.requires = ["titanium_insanium", "random_event"];
  }

  get upgradeCost() {
    return 0;
  }

  perk(level) {
    return [
      "§6Pickaxe Ability: Mining Speed Boost",
      "§7Grants §a+300% §6${symbols.mining_speed} Mining Speed §7for §a20s§7.",
      "§8Cooldown: §a120s",
      "",
      "§8Pickaxe Abilities apply to all of your pickaxes. You can select a Pickaxe Ability from your Heart of the Mountain.",
      "",
      "§8Upgrade your Pickaxe Abilities by unlocking §cPeak of the Mountain §8in this menu!",
    ];
  }
}

class TitaniumInsanium extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "titanium_insanium";
    this.name = hotm.names[this.id];
    this.position = 38;
    this.max_level = 50;
    this.upgrade_type = "mithril_powder";
    this.requires = ["mining_fortune", "mining_speed_boost"];
  }

  get upgradeCost() {
    const nextLevel = this.level + 1;
    return floor(Math.pow(nextLevel + 1, 3.1));
  }

  perk(level) {
    const val = round(2 + level * 0.1, 1);
    return [`§7When mining Mithril Ore, you have a §a${val}%§7 chance to convert the block into Titanium Ore.`];
  }
}

class MiningFortune extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "mining_fortune";
    this.name = hotm.names[this.id];
    this.position = 39;
    this.max_level = 50;
    this.upgrade_type = "mithril_powder";
    this.requires = ["mining_speed"];
  }

  get upgradeCost() {
    const nextLevel = this.level + 1;
    return floor(Math.pow(nextLevel + 1, 3.05));
  }

  perk(level) {
    const val = level * 5;
    return [`§7Grants §a+${val} §6${symbols.mining_fortune} Mining Fortune§7.`];
  }
}

class QuickForge extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "forge_time";
    this.name = hotm.names[this.id];
    this.position = 40;
    this.max_level = 20;
    this.upgrade_type = "mithril_powder";
    this.requires = ["mining_fortune", "pickaxe_toss"];
  }

  get upgradeCost() {
    const nextLevel = this.level + 1;
    return floor(Math.pow(nextLevel + 1, 4));
  }

  perk(level) {
    const val = round(10 + 0.5 * level, 1);
    return [`§7Decreases the time it takes to forge by §a${val}%§7.`];
  }
}

class Pickobulus extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "pickaxe_toss";
    this.name = hotm.names[this.id];
    this.position = 41;
    this.max_level = 1;
    this.upgrade_type = null;
    this.requires = ["forge_time", "fallen_star_bonus"];
  }

  get upgradeCost() {
    return 0;
  }

  perk(level) {
    return [
      "§6Pickaxe Ability: Pickobulus",
      "§7Throw your pickaxe to create an explosion on impact, mining all ores within a §a2§7 block radius.",
      "§8Cooldown: §a110s",
      "",
      "§8Pickaxe Abilities apply to all of your pickaxes. You can select a Pickaxe Ability from your Heart of the Mountain.",
      "",
      "§8Upgrade your Pickaxe Abilities by unlocking §cPeak of the Mountain §8in this menu!",
    ];
  }
}

class MiningSpeed extends Node {
  constructor(level, enabled) {
    super(level, enabled);
    this.id = "mining_speed";
    this.name = hotm.names[this.id];
    this.position = 46;
    this.max_level = 50;
    this.upgrade_type = "mithril_powder";
    this.requires = [];
  }

  get upgradeCost() {
    const nextLevel = this.level + 1;
    return floor(Math.pow(nextLevel + 1, 3));
  }

  perk(level) {
    const val = level * 20;
    return [`§7Grants §a+${val} §6${symbols.mining_speed} Mining Speed§7.`];
  }
}

export const hotm = {
  tree_size: {
    columns: 7,
    rows: 7,
  },
  names: {
    mining_speed_2: "Mining Speed II",
    powder_buff: "Powder Buff",
    mining_fortune_2: "Mining Fortune II",
    vein_seeker: "Vein Seeker",
    lonesome_miner: "Lonesome Miner",
    professional: "Professional",
    mole: "Mole",
    fortunate: "Fortunate",
    great_explorer: "Great Explorer",
    maniac_miner: "Maniac Miner",
    goblin_killer: "Goblin Killer",
    special_0: "Peak of the Mountain",
    star_powder: "Star Powder",
    daily_effect: "Sky Mall",
    mining_madness: "Mining Madness",
    mining_experience: "Seasoned Mineman",
    efficient_miner: "Efficient Miner",
    experience_orbs: "Orbiter",
    front_loaded: "Front Loaded",
    precision_mining: "Precision Mining",
    random_event: "Luck of the Cave",
    daily_powder: "Daily Powder",
    fallen_star_bonus: "Crystallized",
    mining_speed_boost: "Mining Speed Boost",
    titanium_insanium: "Titanium Insanium",
    mining_fortune: "Mining Fortune",
    forge_time: "Quick Forge",
    pickaxe_toss: "Pickobulus",
    mining_speed: "Mining Speed",
  },
  nodes: {
    mining_speed_2: MiningSpeed2,
    powder_buff: PowderBuff,
    mining_fortune_2: MiningFortune2,
    vein_seeker: VeinSeeker,
    lonesome_miner: LonesomeMiner,
    professional: Professional,
    mole: Mole,
    fortunate: Fortunate,
    great_explorer: GreatExplorer,
    maniac_miner: ManiacMiner,
    goblin_killer: GoblinKiller,
    special_0: PeakOfTheMountain,
    star_powder: StarPowder,
    daily_effect: SkyMall,
    mining_madness: MiningMadness,
    mining_experience: SeasonedMineman,
    efficient_miner: EfficientMiner,
    experience_orbs: Orbiter,
    front_loaded: FrontLoaded,
    precision_mining: PrecisionMining,
    random_event: LuckOfTheCave,
    daily_powder: DailyPowder,
    fallen_star_bonus: Crystallized,
    mining_speed_boost: MiningSpeedBoost,
    titanium_insanium: TitaniumInsanium,
    mining_fortune: MiningFortune,
    forge_time: QuickForge,
    pickaxe_toss: Pickobulus,
    mining_speed: MiningSpeed,
  },
};
