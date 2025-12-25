// Echo Dungeon V11 - Enemy Definitions
// All monsters with stats that scale with dungeon level

const enemies = {
    // Early dungeon enemies
    goblin: { name: 'Goblin', health: 130, damage: 18, gold: 5, exp: 25, fleeChance: 0.8 },
    skeleton: { name: 'Skeleton', health: 140, damage: 20, gold: 8, exp: 30, fleeChance: 0.7 },
    orc: { name: 'Orc', health: 160, damage: 35, gold: 12, exp: 50, fleeChance: 0.5 },
    wraith: { name: 'Wraith', health: 150, damage: 38, gold: 15, exp: 75, fleeChance: 0.6 },
    troll: { name: 'Troll', health: 180, damage: 50, gold: 20, exp: 65, fleeChance: 0.4, regenerate: 5 },
    
    // Mid-tier enemies
    dragon: { name: 'Dragon', health: 350, damage: 75, gold: 50, exp: 450, fleeChance: 0.1 },
    demon: { name: 'Demon', health: 190, damage: 58, gold: 45, exp: 80, fleeChance: 0.3 },
    vampire: { name: 'Vampire', health: 200, damage: 95, gold: 40, exp: 100, fleeChance: 0.4, regenerate: 8 },
    
    // Elite enemies
    orcChieftain: { name: 'Orc Chieftain', health: 190, damage: 72, gold: 25, exp: 65, fleeChance: 0.3 },
    ancientWraith: { name: 'Ancient Wraith', health: 190, damage: 96, gold: 30, exp: 80, fleeChance: 0.4 },
    elderTroll: { name: 'Elder Troll', health: 250, damage: 28, gold: 40, exp: 100, fleeChance: 0.2, regenerate: 10 },
    archDemon: { name: 'Arch Demon', health: 280, damage: 95, gold: 70, exp: 160, fleeChance: 0.2 },
    
    // High-tier enemies
    hydra: { name: 'Hydra', health: 240, damage: 130, gold: 55, exp: 125, fleeChance: 0.3, regenerate: 12 },
    phoenixGuardian: { name: 'Phoenix Guardian', health: 230, damage: 132, gold: 60, exp: 145, fleeChance: 0.3, regenerate: 15 },
    lichKing: { name: 'Lich King', health: 160, damage: 38, gold: 80, exp: 185, fleeChance: 0.1, regenerate: 10 },
    
    // Bosses and legendary enemies
    ancientDragon: { name: 'Ancient Dragon', health: 600, damage: 150, gold: 200, exp: 800, fleeChance: 0.05, regenerate: 20 },
    demonLord: { name: 'Demon Lord', health: 550, damage: 180, gold: 250, exp: 900, fleeChance: 0.05, regenerate: 25 },
    voidBeast: { name: 'Void Beast', health: 700, damage: 200, gold: 300, exp: 1000, fleeChance: 0.03, regenerate: 30 },
    cosmicHorror: { name: 'Cosmic Horror', health: 800, damage: 220, gold: 350, exp: 1200, fleeChance: 0.03, regenerate: 35 },
    titanLord: { name: 'Titan Lord', health: 1000, damage: 250, gold: 400, exp: 1500, fleeChance: 0.02, regenerate: 40 },
    
    // Endgame bosses
    harbingerOfRagnarok: { name: 'Harbinger of Ragnarok', health: 1500, damage: 300, gold: 600, exp: 2500, fleeChance: 0.01, regenerate: 50 },
    voidEmperor: { name: 'Void Emperor', health: 2000, damage: 350, gold: 800, exp: 3500, fleeChance: 0.01, regenerate: 60 },
    apocalypseTitan: { name: 'Apocalypse Titan', health: 2500, damage: 400, gold: 1000, exp: 5000, fleeChance: 0.01, regenerate: 75 },
    worldEater: { name: 'World Eater', health: 5000, damage: 800, gold: 2000, exp: 10000, fleeChance: 0.01, regenerate: 150 },
    realityBender: { name: 'Reality Bender', health: 8000, damage: 1200, gold: 3000, exp: 15000, fleeChance: 0.01, regenerate: 200 },
    genesisLord: { name: 'Genesis Lord', health: 10000, damage: 1600, gold: 5000, exp: 25000, fleeChance: 0.01, regenerate: 300 }
};

// Scale enemy stats based on dungeon level
function scaleEnemyForLevel(enemy, level) {
    const scaleFactor = 1 + ((level - 1) * 0.3);
    return {
        ...enemy,
        health: Math.floor(enemy.health * scaleFactor),
        damage: Math.floor(enemy.damage * scaleFactor),
        gold: Math.floor(enemy.gold * scaleFactor),
        exp: Math.floor(enemy.exp * scaleFactor),
        regenerate: enemy.regenerate
    };
}
