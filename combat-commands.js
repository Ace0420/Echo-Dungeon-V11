// Echo Dungeon V11 - Combat Commands
// Spells, potions, and combat-specific actions

function castSpell(command) {
    if (!game.combat) {
        speak('You can only cast spells in combat.');
        return;
    }

    let spellToCast = null;

    for (let ability of abilities) {
        if (command.includes(ability.name.toLowerCase()) && game.player.learnedAbilities.includes(ability.name)) {
            spellToCast = ability;
            break;
        }
    }

    if (!spellToCast) {
        const learned = game.player.learnedAbilities.join(', ');
        if (learned) {
            speak(`You know: ${learned}. Say which spell to cast.`);
        } else {
            speak('You have not learned any spells yet. Find ability books in chests.');
        }
        return;
    }

    let spellCost = getScaledAbilityCost(spellToCast.cost, game.dungeon.currentLevel);
    const clarityEffect = game.player.activeEffects.find(e => e.type === 'clarity');
    
    if (clarityEffect) {
        spellCost = Math.floor(spellCost * 0.5);
    }

    if (game.player.mana < spellCost) {
        speak(`Not enough mana. You need ${spellCost} mana.`);
        return;
    }

    game.player.mana -= spellCost;

    // Handle different spell types
    switch (spellToCast.type) {
        case 'freeze':
            castFreezeSpell(spellToCast);
            break;
        case 'stun':
            castStunSpell(spellToCast);
            break;
        case 'poison':
            castPoisonSpell(spellToCast);
            break;
        case 'aoe':
            castAoeSpell(spellToCast);
            break;
        case 'sneak':
            castSneakSpell(spellToCast);
            break;
        case 'timestop':
            castTimestopSpell(spellToCast);
            break;
        case 'rage':
            castRageSpell(spellToCast);
            break;
        case 'vanish':
            castVanishSpell(spellToCast);
            break;
        case 'mark':
            castMarkSpell(spellToCast);
            break;
        case 'damage':
        default:
            castDamageSpell(spellToCast);
            break;
    }
}

function applyShoulderBonus(damage, effectType) {
    if (game.player.equippedShoulderItem) {
        const shoulderData = equipment.shoulderItems && equipment.shoulderItems.find(s => s.name === game.player.equippedShoulderItem);
        if (shoulderData && shoulderData.effect === effectType) {
            return Math.floor(damage * (1 + shoulderData.bonus));
        }
    }
    return damage;
}

function castFreezeSpell(spell) {
    let baseDamage = getScaledAbilityDamage(spell.damage, game.dungeon.currentLevel);
    const levelBonus = game.player.level * 5;
    let totalDamage = baseDamage + levelBonus;
    
    totalDamage = applyShoulderBonus(totalDamage, 'mage_spell');
    
    game.combat.enemy.health -= totalDamage;
    game.combat.enemy.frozen = true;

    speakSequence([
        `You cast ${spell.name}!`,
        `Icy shards pierce the ${game.combat.enemy.name} for ${totalDamage} damage!`,
        `The enemy is frozen solid for 1 turn!`,
        `${game.combat.enemy.name} has ${Math.max(0, game.combat.enemy.health)} health left.`
    ], () => {
        if (game.combat.enemy.health <= 0) {
            setTimeout(() => handleEnemyDefeat(), 1000);
        } else {
            setTimeout(() => enemyTurn(), 1000);
        }
    });
}

function castStunSpell(spell) {
    let baseDamage = getScaledAbilityDamage(spell.damage, game.dungeon.currentLevel);
    const levelBonus = (game.player.class === 'warrior' || game.player.class === 'rogue') ? game.player.level * 5 : 0;
    
    let shieldBonus = 0;
    if (game.player.shield && equipment.shields) {
        const shieldData = equipment.shields.find(s => s.name === game.player.shield) ||
                           merchantItems.find(i => i.name === game.player.shield && i.type === 'shield');
        if (shieldData) {
            shieldBonus = shieldData.defense * 3;
        }
    }
    
    const totalDamage = baseDamage + levelBonus + shieldBonus;
    
    game.combat.enemy.health -= totalDamage;
    game.combat.enemy.stunned = true;

    let messages = [`You bash with your shield!`];
    if (shieldBonus > 0) {
        messages.push(`Your ${game.player.shield} adds ${shieldBonus} crushing damage!`);
    }
    messages.push(`${totalDamage} total damage!`);
    messages.push(`${game.combat.enemy.name} is stunned!`);
    messages.push(`${game.combat.enemy.name} has ${Math.max(0, game.combat.enemy.health)} health left.`);

    speakSequence(messages, () => {
        if (game.combat.enemy.health <= 0) {
            setTimeout(() => handleEnemyDefeat(), 1000);
        } else {
            setTimeout(() => enemyTurn(), 1000);
        }
    });
}

function castPoisonSpell(spell) {
    let baseDamage = getScaledAbilityDamage(spell.damage, game.dungeon.currentLevel);
    const levelBonus = (game.player.class === 'warrior' || game.player.class === 'rogue') ? game.player.level * 5 : 0;
    const totalDamage = baseDamage + levelBonus;
    const poisonDamage = 15 + Math.floor(game.player.level * 1.5);
    
    game.combat.enemy.health -= totalDamage;
    game.combat.enemy.poisoned = { damage: poisonDamage, duration: spell.duration };

    speakSequence([
        `You coat your blade in deadly poison!`,
        `${totalDamage} initial damage!`,
        `Poison will damage ${poisonDamage} per turn for ${spell.duration} turns!`,
        `${game.combat.enemy.name} has ${Math.max(0, game.combat.enemy.health)} health left.`
    ], () => {
        if (game.combat.enemy.health <= 0) {
            setTimeout(() => handleEnemyDefeat(), 1000);
        } else {
            setTimeout(() => enemyTurn(), 1000);
        }
    });
}

function castAoeSpell(spell) {
    let levelBonus = game.player.class === 'mage' ? game.player.level * 6 : game.player.level * 5;
    let totalDamage = getScaledAbilityDamage(spell.damage, game.dungeon.currentLevel) + levelBonus;
    
    totalDamage = applyShoulderBonus(totalDamage, 'mage_spell');
    
    game.combat.enemy.health -= totalDamage;
    
    let messages = [
        `You cast ${spell.name}!`,
        `${totalDamage} damage to ${game.combat.enemy.name}!`
    ];
    
    if (game.combat.secondEnemy && game.combat.secondEnemy.health > 0) {
        game.combat.secondEnemy.health -= totalDamage;
        messages.push(`${totalDamage} damage to ${game.combat.secondEnemy.name}!`);
    }
    
    messages.push(`${game.combat.enemy.name} has ${Math.max(0, game.combat.enemy.health)} health left.`);
    if (game.combat.secondEnemy && game.combat.secondEnemy.health > 0) {
        messages.push(`${game.combat.secondEnemy.name} has ${Math.max(0, game.combat.secondEnemy.health)} health left.`);
    }
    
    speakSequence(messages, () => {
        if (game.combat.enemy.health <= 0 && (!game.combat.secondEnemy || game.combat.secondEnemy.health <= 0)) {
            setTimeout(() => combatVictory(), 1000);
        } else if (game.combat.enemy.health <= 0 && game.combat.secondEnemy && game.combat.secondEnemy.health > 0) {
            game.combat.enemy = game.combat.secondEnemy;
            game.combat.secondEnemy = null;
            speak(`${game.combat.enemy.name} remains!`, () => {
                setTimeout(() => enemyTurn(), 1000);
            });
        } else {
            setTimeout(() => enemyTurn(), 1000);
        }
    });
}

function castSneakSpell(spell) {
    let levelBonus = game.player.level * 5;
    let totalDamage = getScaledAbilityDamage(spell.damage, game.dungeon.currentLevel) + levelBonus;
    
    totalDamage = applyShoulderBonus(totalDamage, 'rogue_stealth');
    
    game.combat.enemy.health -= totalDamage;
    
    let messages = [`You strike from the shadows!`, `${totalDamage} damage!`];
    messages.push(`The enemy doesn't see you coming!`);
    messages.push(`${game.combat.enemy.name} has ${Math.max(0, game.combat.enemy.health)} health left.`);
    messages.push(`You vanish before they can counter!`);
    
    speakSequence(messages, () => {
        if (game.combat.enemy.health <= 0) {
            if (game.combat.secondEnemy && game.combat.secondEnemy.health > 0) {
                game.combat.enemy = game.combat.secondEnemy;
                game.combat.secondEnemy = null;
                setTimeout(() => speak(`${game.combat.enemy.name} remains! Health: ${game.combat.enemy.health}. What will you do?`), 500);
            } else {
                setTimeout(() => combatVictory(), 1000);
            }
        } else {
            // Sneak attacks don't trigger enemy turn
            setTimeout(() => speak('What will you do?'), 500);
        }
    });
}

function castTimestopSpell(spell) {
    game.combat.enemy.frozen = true;
    game.combat.enemy.timestopTurns = 2;
    if (game.combat.secondEnemy && game.combat.secondEnemy.health > 0) {
        game.combat.secondEnemy.frozen = true;
        game.combat.secondEnemy.timestopTurns = 2;
    }
    speakSequence([
        `You cast Time Stop!`,
        `Time freezes around you!`,
        `All enemies are frozen for 2 turns!`
    ], () => {
        setTimeout(() => speak('What will you do?'), 500);
    });
}

function castRageSpell(spell) {
    const weaponData = equipment.weapons.find(w => w.name === game.player.weapon) ||
                       merchantItems.find(i => i.name === game.player.weapon && i.type === 'weapon');
    const weaponAttack = weaponData ? weaponData.attack : 0;
    let baseDamage = game.player.baseAttack + weaponAttack;
    baseDamage += (game.player.level - 1) * 5;
    const totalDamage = baseDamage * 3;
    
    game.combat.enemy.health -= totalDamage;
    
    speakSequence([
        `You enter a berserker rage!`,
        `You strike three times for ${totalDamage} total damage!`,
        `${game.combat.enemy.name} has ${Math.max(0, game.combat.enemy.health)} health left.`
    ], () => {
        if (game.combat.enemy.health <= 0) {
            setTimeout(() => handleEnemyDefeat(), 1000);
        } else {
            setTimeout(() => enemyTurn(), 1000);
        }
    });
}

function castVanishSpell(spell) {
    game.combat.playerShadowmelded = true;
    speakSequence([
        `You cast ${spell.name}!`,
        `You meld into the shadows!`,
        `You become invisible!`,
        `Your next attack will deal 200% damage!`
    ], () => {
        setTimeout(() => speak('What will you do?'), 500);
    });
}

function castMarkSpell(spell) {
    let baseDamage = getScaledAbilityDamage(spell.damage, game.dungeon.currentLevel);
    const levelBonus = game.player.level * 5;
    const totalDamage = baseDamage + levelBonus;
    
    game.combat.enemy.health -= totalDamage;
    game.combat.enemy.deathMarked = true;
    
    speakSequence([
        `You cast Death Mark!`,
        `${totalDamage} damage!`,
        `The enemy is marked! They take 50% more damage!`,
        `${game.combat.enemy.name} has ${Math.max(0, game.combat.enemy.health)} health left.`
    ], () => {
        if (game.combat.enemy.health <= 0) {
            setTimeout(() => handleEnemyDefeat(), 1000);
        } else {
            setTimeout(() => enemyTurn(), 1000);
        }
    });
}

function castDamageSpell(spell) {
    let levelBonus = 0;
    if (game.player.class === 'warrior' || game.player.class === 'rogue') {
        levelBonus = game.player.level * 5;
    } else if (game.player.class === 'mage') {
        levelBonus = game.player.level * 6;
    }
    
    let totalDamage = getScaledAbilityDamage(spell.damage, game.dungeon.currentLevel) + levelBonus;
    
    if (game.player.class === 'mage') {
        totalDamage = applyShoulderBonus(totalDamage, 'mage_spell');
    }
    
    game.combat.enemy.health -= totalDamage;

    speakSequence([
        `You cast ${spell.name}!`,
        `${totalDamage} damage!`,
        `${game.combat.enemy.name} has ${Math.max(0, game.combat.enemy.health)} health left.`
    ], () => {
        if (game.combat.enemy.health <= 0) {
            setTimeout(() => handleEnemyDefeat(), 1000);
        } else {
            setTimeout(() => enemyTurn(), 1000);
        }
    });
}

// Potion usage
function processPotionCommand(command) {
    let potionType = null;
    for (let potion of potionTypes) {
        if (command.includes(potion.toLowerCase()) || 
            (potion.includes('Health') && (command.includes('health') || command.includes('heal'))) ||
            (potion.includes('Mana') && command.includes('mana'))) {
            if (game.player.inventory.includes(potion)) {
                potionType = potion;
                break;
            }
        }
    }
    
    if (!potionType) {
        const availablePotions = game.player.inventory.filter(item => potionTypes.includes(item));
        if (availablePotions.length === 0) {
            speak('You have no potions.');
        } else {
            speak(`Available potions: ${availablePotions.join(', ')}. Say which potion to use.`);
        }
        return;
    }
    
    const index = game.player.inventory.indexOf(potionType);
    game.player.inventory.splice(index, 1);
    
    // Health potions
    if (potionType === 'Large Health Potion') {
        useHealthPotion(50, 'large health potion');
    } else if (potionType === 'Greater Health Potion') {
        useHealthPotion(100, 'greater health potion');
    } else if (potionType === 'Supreme Health Potion') {
        useHealthPotion(300, 'supreme health potion');
    } else if (potionType === 'Ultimate Health Potion') {
        useHealthPotion(800, 'ultimate health potion');
    } else if (potionType === 'Godly Health Elixir') {
        useHealthPotion(2000, 'godly health elixir');
    }
    // Mana potions
    else if (potionType === 'Large Mana Potion') {
        useManaPotion(30, 'large mana potion');
    } else if (potionType === 'Greater Mana Potion') {
        useManaPotion(75, 'greater mana potion');
    } else if (potionType === 'Supreme Mana Potion') {
        useManaPotion(200, 'supreme mana potion');
    } else if (potionType === 'Ultimate Mana Potion') {
        useManaPotion(500, 'ultimate mana potion');
    } else if (potionType === 'Godly Mana Elixir') {
        useManaPotion(1500, 'godly mana elixir');
    }
    // Special potions
    else if (potionType === 'Elixir of Immortality') {
        game.player.activeEffects.push({ type: 'revive', uses: 1 });
        speak(`You drink the Elixir of Immortality! You will revive once if you die.`, () => {
            if (game.combat) setTimeout(() => enemyTurn(), 1000);
        });
    } else if (potionType === 'Potion of Giant Strength') {
        game.player.activeEffects.push({ type: 'strength', battles: 3 });
        speak(`You drink the Potion of Giant Strength! Your attacks deal double damage for 3 battles!`, () => {
            if (game.combat) setTimeout(() => enemyTurn(), 1000);
        });
    } else if (potionType === 'Elixir of Clarity') {
        game.player.activeEffects.push({ type: 'clarity', battles: 3 });
        speak(`You drink the Elixir of Clarity! All spells cost 50% less mana for 3 battles!`, () => {
            if (game.combat) setTimeout(() => enemyTurn(), 1000);
        });
    }
}

function useHealthPotion(heal, potionName) {
    const oldHealth = game.player.health;
    game.player.health = Math.min(game.player.maxHealth, game.player.health + heal);
    const actualHeal = game.player.health - oldHealth;
    speak(`You drink a ${potionName} and restore ${actualHeal} health. Health: ${game.player.health}.`, () => {
        if (game.combat) setTimeout(() => enemyTurn(), 1000);
    });
}

function useManaPotion(restore, potionName) {
    const oldMana = game.player.mana;
    game.player.mana = Math.min(game.player.maxMana, game.player.mana + restore);
    const actualRestore = game.player.mana - oldMana;
    speak(`You drink a ${potionName} and restore ${actualRestore} mana. Mana: ${game.player.mana}.`, () => {
        if (game.combat) setTimeout(() => enemyTurn(), 1000);
    });
}
