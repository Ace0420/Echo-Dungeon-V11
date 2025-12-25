// Echo Dungeon V11 - Player System
// Class selection, leveling, experience, and stats management

function selectClass(className) {
    const classData = classes[className];
    game.player.class = className;
    game.player.health = classData.health;
    game.player.maxHealth = classData.maxHealth;
    game.player.mana = classData.mana;
    game.player.maxMana = classData.maxMana;
    game.player.gold = classData.gold;
    game.player.inventory = [...classData.items];
    game.player.equippedRings = [];
    game.player.equippedBracelets = [];
    game.player.learnedAbilities = [];
    game.player.equippedAmulet = '';
    game.player.equippedShoulderItem = '';
    
    // Auto-equip starting gear
    game.player.weapon = classData.items.find(item => equipment.weapons.some(w => w.name === item)) || '';
    game.player.armor = classData.items.find(item => equipment.armor.some(a => a.name === item)) || '';
    game.player.shield = '';
    game.player.helmet = '';
    game.player.gloves = '';
    game.player.boots = '';
    
    if (equipment.shields) {
        const foundShield = classData.items.find(item => equipment.shields.some(s => s.name === item));
        if (foundShield) {
            game.player.shield = foundShield;
        }
    }
    
    const weaponData = equipment.weapons.find(w => w.name === game.player.weapon);
    game.player.baseAttack = weaponData ? weaponData.attack : 15;
    
    const armorData = equipment.armor.find(a => a.name === game.player.armor);
    game.player.defense = armorData ? armorData.defense : 0;
    
    if (game.player.shield && equipment.shields) {
        const shieldData = equipment.shields.find(s => s.name === game.player.shield);
        if (shieldData) {
            game.player.defense += shieldData.defense;
        }
    }
    
    game.needsClass = false;
    game.started = true;
    game.phase = 'exploration';
    
    generateDungeon();
    
    let messages = [
        `You are now a ${classData.name}.`,
        `Health: ${classData.health}.`,
        `Mana: ${classData.mana}.`,
        `Starting gold: ${classData.gold}.`
    ];

    if (game.player.weapon && game.player.armor) {
        messages.push(`Equipped: ${game.player.weapon} and ${game.player.armor}.`);
    }

    if (game.player.shield) {
        messages.push(`Shield: ${game.player.shield}.`);
    }

    messages.push(`Your adventure begins!`);
    
    speakSequence(messages, () => {
        setTimeout(() => describeRoom(), 1000);
    });
}

function gainExperience(exp) {
    let actualExp = exp;
    
    // Experience boost from amulet
    if (game.player.equippedAmulet && amulets.find(a => a.name === game.player.equippedAmulet)?.stat === 'expGain') {
        actualExp = Math.floor(exp * 1.2);
    }
    
    // Experience boost from special items
    if (game.player.specialItems.includes('Ancient Knowledge Crystal')) {
        actualExp = Math.floor(actualExp * 2);
    }
    
    game.player.experience += actualExp;
    
    if (game.player.experience >= game.player.experienceToNext) {
        levelUp();
    }
}

function levelUp() {
    game.player.level++;
    game.player.experience -= game.player.experienceToNext;
    game.player.experienceToNext = Math.floor(game.player.experienceToNext * 1.20);
    
    // Scaled stat gains based on dungeon tier
    const tier = Math.floor(game.dungeon.currentLevel / 10);
    const baseHealthGain = 20;
    const baseManaGain = 10;
    const healthGain = baseHealthGain * Math.pow(2, tier);
    const manaGain = baseManaGain * Math.pow(2, tier);
    
    game.player.maxHealth += healthGain;
    game.player.health = game.player.maxHealth;
    game.player.maxMana += manaGain;
    game.player.mana = game.player.maxMana;
    
    speakSequence([
        `Level up! You are now level ${game.player.level}!`,
        `Max health increased by ${healthGain}!`,
        `Max mana increased by ${manaGain}!`,
        `Fully healed and restored!`
    ]);
}

function characterStatus() {
    const classData = classes[game.player.class];
    const special = classData.special;
    const specialInfo = special.type === 'damage' ? `Deals ${special.damage} damage.` : `Restores ${special.heal} health.`;
    const expNeeded = game.player.experienceToNext - game.player.experience;

    let messages = [
        `Level ${game.player.level} ${classData.name}.`,
        `Health: ${game.player.health} of ${game.player.maxHealth}.`,
        `Mana: ${game.player.mana} of ${game.player.maxMana}.`,
        `Attack: ${game.player.baseAttack}. Defense: ${game.player.defense}.`
    ];

    if (game.player.weapon) messages.push(`Weapon: ${game.player.weapon}.`);
    if (game.player.armor) messages.push(`Armor: ${game.player.armor}.`);
    if (game.player.shield) messages.push(`Shield: ${game.player.shield}.`);
    if (game.player.helmet) messages.push(`Helmet: ${game.player.helmet}.`);
    if (game.player.gloves) messages.push(`Gloves: ${game.player.gloves}.`);
    if (game.player.boots) messages.push(`Boots: ${game.player.boots}.`);
    if (game.player.equippedShoulderItem) messages.push(`Shoulder: ${game.player.equippedShoulderItem}.`);
    
    if (game.player.equippedBracelets.length > 0) {
        messages.push(`Bracelets: ${game.player.equippedBracelets.join(', ')}.`);
    }

    messages.push(`Experience: ${game.player.experience}. Need ${expNeeded} for next level.`);
    messages.push(`Special ability: ${special.name}. Costs ${special.cost} mana. ${specialInfo}`);
    messages.push(`Gold: ${game.player.gold}.`);

    if (game.player.learnedAbilities.length > 0) {
        messages.push(`Learned abilities: ${game.player.learnedAbilities.join(', ')}.`);
    }

    if (game.player.equippedRings.length > 0) {
        const equippedCounts = {};
        game.player.equippedRings.forEach(ring => equippedCounts[ring] = (equippedCounts[ring] || 0) + 1);
        const equippedList = Object.entries(equippedCounts).map(([ring, count]) => 
            count > 1 ? `${ring} x${count}` : ring
        );
        messages.push(`Equipped rings: ${equippedList.join(', ')}.`);
    } else {
        messages.push(`No rings equipped.`);
    }

    if (game.player.equippedAmulet) {
        messages.push(`Equipped amulet: ${game.player.equippedAmulet}.`);
    } else {
        messages.push(`No amulet equipped.`);
    }

    speakSequence(messages);
}

function meditate() {
    if (game.combat) {
        speak('You cannot meditate during combat!');
        return;
    }
    
    if (game.player.mana === game.player.maxMana) {
        speak('You are already at full mana.');
        return;
    }
    
    const tier = Math.floor(game.dungeon.currentLevel / 10);
    const baseRestore = 25;
    const manaRestored = baseRestore * Math.pow(2, tier);
    const previousMana = game.player.mana;
    
    game.player.mana = Math.min(game.player.maxMana, game.player.mana + manaRestored);
    const actualRestored = game.player.mana - previousMana;

    speak(`You meditate and restore ${actualRestored} mana. Current mana: ${game.player.mana}.`);
}
