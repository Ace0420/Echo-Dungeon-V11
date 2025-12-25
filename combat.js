// Echo Dungeon V11 - Combat System
// Turn-based combat mechanics

function startCombat(enemy, secondEnemy = null) {
    game.combat = { 
        enemy: { ...enemy }, 
        secondEnemy: secondEnemy ? { ...secondEnemy } : null,
        playerDefending: false,
        twoEnemyFight: secondEnemy ? true : false,
        playerShadowmelded: false
    };
    game.phase = 'combat';
    
    let messages = [`Combat begins!`, `${enemy.name} has ${enemy.health} health.`];
    
    if (secondEnemy) {
        messages.push(`${secondEnemy.name} has ${secondEnemy.health} health.`);
        messages.push(`You face two enemies!`);
    }
    
    if (enemy.regenerate) {
        messages.push(`Warning: ${enemy.name} regenerates ${enemy.regenerate} health per turn!`);
    }
    if (secondEnemy && secondEnemy.regenerate) {
        messages.push(`Warning: ${secondEnemy.name} regenerates ${secondEnemy.regenerate} health per turn!`);
    }
    
    messages.push(`What will you do? Attack, defend, special, cast spell, use potion, or flee.`);
    speakSequence(messages);
}

function playerAttack() {
    const weaponData = equipment.weapons.find(w => w.name === game.player.weapon) ||
                       merchantItems.find(i => i.name === game.player.weapon && i.type === 'weapon');
    const weaponAttack = weaponData ? weaponData.attack : 0;
    
    // Calculate all bonuses
    let amuletBonus = 0;
    if (game.player.equippedAmulet) {
        const amuletData = amulets.find(a => a.name === game.player.equippedAmulet);
        if (amuletData && amuletData.stat === 'attack') {
            amuletBonus = amuletData.value;
        }
    }
    
    let glovesBonus = 0;
    if (game.player.gloves) {
        const glovesData = equipment.gloves.find(g => g.name === game.player.gloves) ||
                           merchantItems.find(i => i.name === game.player.gloves && i.type === 'gloves');
        if (glovesData && glovesData.attack) {
            glovesBonus = glovesData.attack;
        }
    }
    
    let braceletBonus = 0;
    for (let bracelet of game.player.equippedBracelets) {
        const braceletData = equipment.bracelets.find(b => b.name === bracelet) ||
                             merchantItems.find(i => i.name === bracelet && i.type === 'bracelet');
        if (braceletData && braceletData.attack) {
            braceletBonus += braceletData.attack;
        }
    }
    
    let baseDamage = game.player.baseAttack + weaponAttack + amuletBonus + glovesBonus + braceletBonus;
    
    // Level scaling for melee classes
    if (game.player.class === 'warrior' || game.player.class === 'rogue') {
        baseDamage += (game.player.level - 1) * 5;
    }
    
    // Ring bonuses
    const ringBonus = game.player.equippedRings.reduce((total, ring) => {
        const ringData = rings.find(r => r.name === ring);
        return total + (ringData && ringData.stat === 'attack' ? ringData.value : 0);
    }, 0);
    
    let damage = baseDamage + ringBonus + Math.floor(Math.random() * 10);
    
    // Shoulder item bonus
    if (game.player.equippedShoulderItem) {
        const shoulderData = equipment.shoulderItems.find(s => s.name === game.player.equippedShoulderItem);
        if (shoulderData && shoulderData.effect === 'warrior_damage') {
            damage = Math.floor(damage * (1 + shoulderData.bonus));
        }
    }
    
    // Strength potion effect
    const strengthEffect = game.player.activeEffects.find(e => e.type === 'strength');
    if (strengthEffect) {
        damage = Math.floor(damage * 2);
    }
    
    // Shadowmeld bonus
    if (game.combat.playerShadowmelded) {
        damage = Math.floor(damage * 2);
        game.combat.playerShadowmelded = false;
    }
    
    // Death Mark bonus
    if (game.combat.enemy.deathMarked) {
        damage = Math.floor(damage * 1.5);
    }
    
    game.combat.enemy.health -= damage;
    
    let messages = [`You attack for ${damage} damage!`];
    if (strengthEffect) {
        messages.push(`Giant Strength doubles your damage!`);
    }
    if (game.combat.enemy.deathMarked) {
        messages.push(`Death Mark amplifies your strike!`);
    }
    messages.push(`${game.combat.enemy.name} has ${Math.max(0, game.combat.enemy.health)} health left.`);
    
    speakSequence(messages, () => {
        if (game.combat.enemy.health <= 0) {
            handleEnemyDefeat();
        } else {
            setTimeout(() => enemyTurn(), 1000);
        }
    });
}

function playerDefend() {
    game.combat.playerDefending = true;
    speak('You brace for impact.', () => {
        setTimeout(() => enemyTurn(), 1000);
    });
}

function playerSpecial() {
    const classData = classes[game.player.class];
    const special = classData.special;
    
    const scaledCost = getScaledAbilityCost(special.cost, game.dungeon.currentLevel);
    
    if (game.player.mana < scaledCost) {
        speak(`Not enough mana. You need ${scaledCost}.`);
        return;
    }
    
    game.player.mana -= scaledCost;
    
    if (special.type === 'damage') {
        let damage = getScaledAbilityDamage(special.damage, game.dungeon.currentLevel);
        
        // Level scaling
        if (game.player.class === 'warrior' || game.player.class === 'rogue') {
            damage += (game.player.level - 1) * 5;
        } else if (game.player.class === 'mage') {
            damage += (game.player.level - 1) * 6;
        }
        
        game.combat.enemy.health -= damage;
        
        speakSequence([
            `You unleash ${special.name}!`,
            `${damage} damage!`,
            `${game.combat.enemy.name} has ${Math.max(0, game.combat.enemy.health)} health left.`
        ], () => {
            if (game.combat.enemy.health <= 0) {
                handleEnemyDefeat();
            } else {
                setTimeout(() => enemyTurn(), 1000);
            }
        });
    }
}

function attemptFlee() {
    const chance = game.combat.enemy.fleeChance;
    const roll = Math.random();
    
    speak(`Attempting to flee...`, () => {
        setTimeout(() => {
            if (roll < chance) {
                speak('You successfully escape!', () => {
                    game.combat = null;
                    game.phase = 'exploration';
                    setTimeout(() => {
                        const centerX = 6;
                        const centerY = 6;
                        game.player.position = { x: centerX, y: centerY };
                        const key = `${centerX},${centerY}`;
                        game.currentRoom = game.dungeon.grid[key];
                        speak('You flee back to the entrance.');
                    }, 1000);
                });
            } else {
                speak('You fail to escape!', () => {
                    setTimeout(() => enemyTurn(), 1000);
                });
            }
        }, 1000);
    });
}

function enemyTurn() {
    let messages = [];
    
    // Ring of Regeneration healing
    const regenRingCount = game.player.equippedRings.filter(r => r === 'Ring of Regeneration').length;
    if (regenRingCount > 0) {
        const regenAmount = 50 * regenRingCount;
        const oldHealth = game.player.health;
        game.player.health = Math.min(game.player.maxHealth, game.player.health + regenAmount);
        const actualHeal = game.player.health - oldHealth;
        if (actualHeal > 0) {
            messages.push(`Your Ring${regenRingCount > 1 ? 's' : ''} of Regeneration heal${regenRingCount === 1 ? 's' : ''} you for ${actualHeal} health!`);
        }
    }
    
    // Check if enemy is frozen
    if (game.combat.enemy.frozen) {
        handleFrozenEnemy(messages);
    } else if (game.combat.enemy.stunned) {
        messages.push(`${game.combat.enemy.name} is stunned and cannot act!`);
        game.combat.enemy.stunned = false;
    } else {
        // Enemy regeneration
        if (game.combat.enemy.regenerate) {
            game.combat.enemy.health += game.combat.enemy.regenerate;
            messages.push(`${game.combat.enemy.name} regenerates ${game.combat.enemy.regenerate} health!`);
        }
        
        // Poison damage
        if (game.combat.enemy.poisoned) {
            game.combat.enemy.health -= game.combat.enemy.poisoned.damage;
            messages.push(`${game.combat.enemy.name} takes ${game.combat.enemy.poisoned.damage} poison damage!`);
            game.combat.enemy.poisoned.duration--;
            if (game.combat.enemy.poisoned.duration <= 0) {
                game.combat.enemy.poisoned = null;
            }
            if (game.combat.enemy.health <= 0) {
                speakSequence(messages, () => {
                    setTimeout(() => handleEnemyDefeat(), 1000);
                });
                return;
            }
        }
        
        // Enemy attacks
        let damage = game.combat.enemy.damage;
        
        if (game.combat.playerDefending) {
            damage = Math.floor(damage * 0.5);
            game.combat.playerDefending = false;
        }
        
        const reducedDamage = Math.max(1, damage - game.player.defense);
        game.player.health -= reducedDamage;
        
        messages.push(`${game.combat.enemy.name} attacks for ${reducedDamage} damage!`);
    }
    
    // Second enemy attacks
    if (game.combat.secondEnemy && game.combat.secondEnemy.health > 0) {
        handleSecondEnemyTurn(messages);
    }
    
    messages.push(`Your health: ${Math.max(0, game.player.health)}.`);
    
    speakSequence(messages, () => {
        if (game.player.health <= 0) {
            setTimeout(() => gameOver(), 1000);
        } else {
            setTimeout(() => speak('What will you do?'), 500);
        }
    });
}

function handleFrozenEnemy(messages) {
    if (game.combat.enemy.timestopTurns) {
        game.combat.enemy.timestopTurns--;
        if (game.combat.enemy.timestopTurns <= 0) {
            game.combat.enemy.frozen = false;
            game.combat.enemy.timestopTurns = 0;
        }
    } else {
        game.combat.enemy.frozen = false;
    }
    messages.push(`${game.combat.enemy.name} is frozen and cannot act!`);
}

function handleSecondEnemyTurn(messages) {
    if (game.combat.secondEnemy.frozen) {
        if (game.combat.secondEnemy.timestopTurns) {
            game.combat.secondEnemy.timestopTurns--;
            if (game.combat.secondEnemy.timestopTurns <= 0) {
                game.combat.secondEnemy.frozen = false;
                game.combat.secondEnemy.timestopTurns = 0;
            }
        } else {
            game.combat.secondEnemy.frozen = false;
        }
        messages.push(`${game.combat.secondEnemy.name} is frozen and cannot act!`);
    } else {
        if (game.combat.secondEnemy.regenerate) {
            game.combat.secondEnemy.health += game.combat.secondEnemy.regenerate;
            messages.push(`${game.combat.secondEnemy.name} regenerates ${game.combat.secondEnemy.regenerate} health!`);
        }
        
        let damage2 = game.combat.secondEnemy.damage;
        const reducedDamage2 = Math.max(1, damage2 - game.player.defense);
        game.player.health -= reducedDamage2;
        messages.push(`${game.combat.secondEnemy.name} attacks for ${reducedDamage2} damage!`);
    }
}

function handleEnemyDefeat() {
    if (game.combat.secondEnemy && game.combat.secondEnemy.health > 0) {
        game.combat.enemy = game.combat.secondEnemy;
        game.combat.secondEnemy = null;
        speak(`${game.combat.enemy.name} remains! Health: ${game.combat.enemy.health}.`, () => {
            setTimeout(() => enemyTurn(), 1000);
        });
    } else {
        setTimeout(() => combatVictory(), 1000);
    }
}

function combatVictory() {
    let gold = game.combat.enemy.gold;
    let exp = game.combat.enemy.exp;
    
    // Gold bonus from special items
    if (game.player.specialItems.includes('Golden Fortune Coin')) {
        gold = Math.floor(gold * 1.5);
    }
    
    const wasTwoEnemyFight = game.combat.twoEnemyFight || false;
    
    // Double exp for double fights
    if (wasTwoEnemyFight) {
        exp = exp * 2;
    }
    
    game.player.gold += gold;
    
    // Mark room enemies as defeated
    if (game.currentRoom.enemy) {
        game.currentRoom.enemy.health = 0;
    }
    if (game.currentRoom.secondEnemy) {
        game.currentRoom.secondEnemy.health = 0;
    }
    
    const messages = [
        `${game.combat.enemy.name} defeated!`,
        `You gain ${gold} gold and ${exp} experience!`
    ];
    
    if (wasTwoEnemyFight) {
        messages.push(`Double experience for defeating 2 enemies!`);
    }
    
    // Consume strength effect
    const strengthEffect = game.player.activeEffects.find(e => e.type === 'strength');
    if (strengthEffect) {
        strengthEffect.battles--;
        if (strengthEffect.battles <= 0) {
            game.player.activeEffects = game.player.activeEffects.filter(e => e.type !== 'strength');
            messages.push(`Giant Strength effect has worn off.`);
        }
    }
    
    // Consume clarity effect
    const clarityEffect = game.player.activeEffects.find(e => e.type === 'clarity');
    if (clarityEffect) {
        clarityEffect.battles--;
        if (clarityEffect.battles <= 0) {
            game.player.activeEffects = game.player.activeEffects.filter(e => e.type !== 'clarity');
            messages.push(`Clarity effect has worn off.`);
        }
    }
    
    speakSequence(messages, () => {
        game.combat = null;
        game.phase = 'exploration';
        gainExperience(exp);
        
        if (game.currentRoom.type === 'boss') {
            setTimeout(() => dungeonComplete(), 1500);
        } else {
            setTimeout(() => speak('What will you do next?'), 1000);
        }
    });
}

function dungeonComplete() {
    speakSequence([
        'You defeated the boss!',
        'The dungeon level is cleared!',
        'Seek the stairs to descend deeper!',
        `You are now level ${game.player.level} with ${game.player.gold} gold.`
    ]);
}

function gameOver() {
    // Check for revive effect
    const reviveEffect = game.player.activeEffects.find(e => e.type === 'revive');
    if (reviveEffect && reviveEffect.uses > 0) {
        reviveEffect.uses--;
        game.player.activeEffects = game.player.activeEffects.filter(e => e.type !== 'revive');
        game.player.health = Math.floor(game.player.maxHealth * 0.5);
        
        speakSequence([
            'You have fallen!',
            'But the Elixir of Immortality revives you!',
            `You return with ${game.player.health} health!`,
            'What will you do?'
        ]);
        return;
    }
    
    speakSequence([
        'You have been defeated.',
        'Your adventure ends here.',
        `You reached level ${game.player.level} and collected ${game.player.gold} gold.`,
        'Game over. Refresh to play again.'
    ]);
}
