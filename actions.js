// Echo Dungeon V11 - Action Commands
// Searching, looting, equipping, and using items

function searchRoom() {
    const room = game.currentRoom;
    
    if (room.searched) {
        speak('You already searched this room thoroughly.');
        return;
    }
    
    room.searched = true;
    
    // Chance for secret room discovery
    if (game.dungeon.hasSecretRoom && !game.dungeon.secretRoom && Math.random() < 0.15) {
        game.dungeon.secretRoom = true;
        speakSequence([
            'You found a hidden passage behind a loose stone!',
            'Inside, ancient treasures await!'
        ]);
        game.player.inventory.push('Ring of Minor Mana', 'Large Health Potion', 'Amulet of Vitality');
        game.player.gold += 30 * game.dungeon.currentLevel;
    } else {
        const loot = determineLoot();
        if (loot.type === 'gold') {
            game.player.gold += loot.amount;
            speak(`You found ${loot.amount} gold hidden in the shadows.`);
        } else if (loot.type === 'item') {
            game.player.inventory.push(loot.item);
            autoManageInventory(loot.item);
            speak(`You found a hidden ${loot.item}!`);
        } else if (loot.type === 'ring') {
            game.player.inventory.push(loot.item);
            autoManageInventory(loot.item);
            speak(`You found a mystical ${loot.item}! Say 'wear ring' to equip it.`);
        } else if (loot.type === 'amulet') {
            game.player.inventory.push(loot.item);
            autoManageInventory(loot.item);
            speak(`You found a powerful ${loot.item}! Say 'equip amulet' to wear it.`);
        } else {
            speak('You search carefully but find nothing of value.');
        }
    }
}

function openChest() {
    const room = game.currentRoom;
    
    if (!room.hasChest) {
        speak('There is no chest here.');
        return;
    }
    
    if (room.searched) {
        speak('The chest is empty. You already looted it.');
        return;
    }
    
    room.searched = true;
    
    // Mimic chance
    if (Math.random() < 0.08) {
        const mimicDamage = 30 + (game.dungeon.currentLevel * 10);
        game.player.health -= mimicDamage;
        
        speak(`The chest springs to life! It's a mimic! You take ${mimicDamage} damage! Health: ${game.player.health}.`, () => {
            if (game.player.health <= 0) {
                setTimeout(() => gameOver(), 1000);
            } else {
                const mimic = scaleEnemyForLevel({ name: 'Mimic', health: 45, damage: 12, gold: 15, exp: 25, fleeChance: 0.5 }, game.dungeon.currentLevel);
                setTimeout(() => startCombat(mimic), 1000);
            }
        });
    } else {
        let messages = ['You open the ornate chest and discover:'];
        
        if (room.type === 'treasure') {
            const treasure1 = determineTreasure();
            const treasure2 = determineTreasure();
            game.player.gold += treasure1.value;
            game.player.gold += treasure2.value;
            game.player.inventory.push(treasure1.name, treasure2.name);
            autoManageInventory(treasure1.name);
            autoManageInventory(treasure2.name);
            messages.push(`${treasure1.name} worth ${treasure1.value} gold!`);
            messages.push(`${treasure2.name} worth ${treasure2.value} gold!`);
            
            if (Math.random() < 0.4) {
                const potion = Math.random() < 0.5 ? 'Large Health Potion' : 'Large Mana Potion';
                game.player.inventory.push(potion);
                messages.push(`A ${potion}!`);
            }
        } else {
            const loot1 = determineLoot();
            const loot2 = determineLoot();
            
            processLootItem(loot1, messages);
            processLootItem(loot2, messages);
        }
        
        // Chance for ability book
        if (Math.random() < 0.25) {
            const availableAbilities = abilities.filter(a => 
                a.class === game.player.class && 
                !game.player.learnedAbilities.includes(a.name) &&
                !game.player.inventory.includes(a.name) &&
                (!a.minLevel || a.minLevel <= game.dungeon.currentLevel)
            );
            
            if (availableAbilities.length > 0) {
                const ability = availableAbilities[Math.floor(Math.random() * availableAbilities.length)];
                game.player.inventory.push(ability.name);
                messages.push(`A ${ability.name} book! Say "read book" to learn it.`);
            }
        }
        
        if (messages.length === 1) { messages.push('Nothing of value.'); }

        speakSequence(messages);
    }
}

function processLootItem(loot, messages) {
    if (loot.type === 'gold') {
        game.player.gold += loot.amount;
        messages.push(`${loot.amount} gold.`);
    } else if (loot.type === 'item') {
        game.player.inventory.push(loot.item);
        autoManageInventory(loot.item);
        messages.push(`A ${loot.item}.`);
    } else if (loot.type === 'ring') {
        game.player.inventory.push(loot.item);
        autoManageInventory(loot.item);
        messages.push(`A ${loot.item}.`);
    } else if (loot.type === 'amulet') {
        game.player.inventory.push(loot.item);
        autoManageInventory(loot.item);
        messages.push(`A ${loot.item}.`);
    }
}

function determineLoot() {
    const level = game.dungeon.currentLevel;
    const roll = Math.random();
    const playerClass = game.player.class;
    
    // High-tier equipment chances based on level
    if (level >= 30 && roll < 0.25) {
        const allGodly = [
            ...equipment.weapons.filter(w => w.minLevel >= 30 && w.class === playerClass),
            ...equipment.armor.filter(a => a.minLevel >= 30 && a.class === playerClass),
            ...equipment.helmets.filter(h => h.minLevel >= 30 && (!h.class || h.class === playerClass)),
            ...equipment.gloves.filter(g => g.minLevel >= 30 && (!g.class || g.class === playerClass)),
            ...equipment.boots.filter(b => b.minLevel >= 30 && (!b.class || b.class === playerClass)),
            ...equipment.bracelets.filter(br => br.minLevel >= 30)
        ];
        if (allGodly.length > 0) {
            return { type: 'item', item: allGodly[Math.floor(Math.random() * allGodly.length)].name };
        }
    }
    
    if (level >= 20 && roll < 0.2) {
        const allMythic = [
            ...equipment.weapons.filter(w => w.minLevel >= 20 && w.class === playerClass),
            ...equipment.armor.filter(a => a.minLevel >= 20 && a.class === playerClass),
            ...equipment.helmets.filter(h => h.minLevel >= 20 && (!h.class || h.class === playerClass)),
            ...equipment.gloves.filter(g => g.minLevel >= 20 && (!g.class || g.class === playerClass)),
            ...equipment.boots.filter(b => b.minLevel >= 20 && (!b.class || b.class === playerClass)),
            ...equipment.bracelets.filter(br => br.minLevel >= 20)
        ];
        if (allMythic.length > 0) {
            return { type: 'item', item: allMythic[Math.floor(Math.random() * allMythic.length)].name };
        }
    }
    
    if (level >= 10 && roll < 0.2) {
        const allLegendary = [
            ...equipment.weapons.filter(w => w.minLevel >= 10 && w.class === playerClass),
            ...equipment.armor.filter(a => a.minLevel >= 10 && a.class === playerClass),
            ...equipment.helmets.filter(h => h.minLevel >= 10 && (!h.class || h.class === playerClass)),
            ...equipment.gloves.filter(g => g.minLevel >= 10 && (!g.class || g.class === playerClass)),
            ...equipment.boots.filter(b => b.minLevel >= 10 && (!b.class || b.class === playerClass)),
            ...equipment.bracelets.filter(br => br.minLevel >= 10)
        ];
        if (allLegendary.length > 0) {
            return { type: 'item', item: allLegendary[Math.floor(Math.random() * allLegendary.length)].name };
        }
    }
    
    // Potions
    if (roll < 0.60) {
        if (level >= 30 && Math.random() < 0.5) {
            return { type: 'item', item: Math.random() < 0.5 ? 'Godly Health Elixir' : 'Godly Mana Elixir' };
        } else if (level >= 20 && Math.random() < 0.5) {
            return { type: 'item', item: Math.random() < 0.5 ? 'Ultimate Health Potion' : 'Ultimate Mana Potion' };
        } else if (level >= 10 && Math.random() < 0.5) {
            return { type: 'item', item: Math.random() < 0.5 ? 'Supreme Health Potion' : 'Supreme Mana Potion' };
        } else if (level >= 5 && Math.random() < 0.6) {
            return { type: 'item', item: Math.random() < 0.5 ? 'Greater Health Potion' : 'Greater Mana Potion' };
        } else {
            return { type: 'item', item: Math.random() < 0.5 ? 'Large Health Potion' : 'Large Mana Potion' };
        }
    }
    
    // Rings
    if (roll < 0.70) {
        const levelRings = rings.filter(r => !r.minLevel || r.minLevel <= level);
        return { type: 'ring', item: levelRings[Math.floor(Math.random() * levelRings.length)].name };
    }
    
    // Amulets
    if (roll < 0.80) {
        const levelAmulets = amulets.filter(a => !a.minLevel || a.minLevel <= level);
        return { type: 'amulet', item: levelAmulets[Math.floor(Math.random() * levelAmulets.length)].name };
    }
    
    // Gold
    return { type: 'gold', amount: Math.floor(Math.random() * 15) + (5 * level) };
}

function determineTreasure() {
    const treasure = treasures[Math.floor(Math.random() * treasures.length)];
    const level = game.dungeon.currentLevel;
    return { ...treasure, value: treasure.value * level };
}

// Equipment functions
function equipRing(command) {
    const ringsInInventory = game.player.inventory.filter(item => rings.some(r => r.name === item));
    
    if (ringsInInventory.length === 0) {
        speak('You have no rings in your inventory.');
        return;
    }
    
    let ringToEquip = null;
    for (let ring of ringsInInventory) {
        if (command.includes(ring.toLowerCase())) {
            ringToEquip = ring;
            break;
        }
    }
    
    if (!ringToEquip) {
        speak(`Available rings: ${ringsInInventory.join(', ')}. Say which ring to equip.`);
        return;
    }
    
    const index = game.player.inventory.indexOf(ringToEquip);
    game.player.inventory.splice(index, 1);
    equipRingDirect(ringToEquip);
}

function equipRingDirect(ringName) {
    const ringData = rings.find(r => r.name === ringName);
    
    if (game.player.equippedRings.length >= 10) {
        speak('You already have 10 rings equipped. Say "remove ring" to make space.');
        game.player.inventory.push(ringName);
        return;
    }
    
    game.player.equippedRings.push(ringName);
    
    if (ringData.stat === 'maxHealth') {
        game.player.maxHealth += ringData.value;
        game.player.health += ringData.value;
        speak(`You equip ${ringName}. Max health increased by ${ringData.value}!`);
    } else if (ringData.stat === 'maxMana') {
        game.player.maxMana += ringData.value;
        game.player.mana += ringData.value;
        speak(`You equip ${ringName}. Max mana increased by ${ringData.value}!`);
    } else if (ringData.stat === 'attack') {
        speak(`You equip ${ringName}. Attack damage increased by ${ringData.value}!`);
    } else if (ringData.stat === 'regen') {
        speak(`You equip ${ringName}. You will regenerate ${ringData.value} health per turn in combat!`);
    }
    
    autoManageInventory(ringName);
}

function removeRing(command) {
    if (game.player.equippedRings.length === 0) {
        speak('You have no rings equipped.');
        return;
    }
    
    let ringToRemove = null;
    for (let ring of game.player.equippedRings) {
        if (command.includes(ring.toLowerCase())) {
            ringToRemove = ring;
            break;
        }
    }
    
    if (!ringToRemove) {
        const uniqueRings = [...new Set(game.player.equippedRings)];
        speak(`Equipped rings: ${uniqueRings.join(', ')}. Say which ring to remove.`);
        return;
    }
    
    const index = game.player.equippedRings.indexOf(ringToRemove);
    game.player.equippedRings.splice(index, 1);
    
    const ringData = rings.find(r => r.name === ringToRemove);
    
    if (ringData.stat === 'maxHealth') {
        game.player.maxHealth -= ringData.value;
        game.player.health = Math.min(game.player.health, game.player.maxHealth);
    } else if (ringData.stat === 'maxMana') {
        game.player.maxMana -= ringData.value;
        game.player.mana = Math.min(game.player.mana, game.player.maxMana);
    }
    
    game.player.inventory.push(ringToRemove);
    speak(`You remove ${ringToRemove}.`);
}

function equipAmulet(command) {
    const amuletsInInventory = game.player.inventory.filter(item => amulets.some(a => a.name === item));
    
    if (amuletsInInventory.length === 0) {
        speak('You have no amulets in your inventory.');
        return;
    }
    
    let amuletToEquip = null;
    for (let amulet of amuletsInInventory) {
        if (command.includes(amulet.toLowerCase())) {
            amuletToEquip = amulet;
            break;
        }
    }
    
    if (!amuletToEquip) {
        speak(`Available amulets: ${amuletsInInventory.join(', ')}. Say which amulet to equip.`);
        return;
    }
    
    const index = game.player.inventory.indexOf(amuletToEquip);
    game.player.inventory.splice(index, 1);
    equipAmuletDirect(amuletToEquip);
}

function equipAmuletDirect(amuletName) {
    const amuletData = amulets.find(a => a.name === amuletName);
    
    // Remove old amulet effects
    if (game.player.equippedAmulet) {
        const oldAmuletData = amulets.find(a => a.name === game.player.equippedAmulet);
        if (oldAmuletData) {
            if (oldAmuletData.stat === 'maxHealth') {
                game.player.maxHealth -= oldAmuletData.value;
                game.player.health = Math.min(game.player.health, game.player.maxHealth);
            } else if (oldAmuletData.stat === 'maxMana') {
                game.player.maxMana -= oldAmuletData.value;
                game.player.mana = Math.min(game.player.mana, game.player.maxMana);
            }
        }
        game.player.inventory.push(game.player.equippedAmulet);
    }
    
    game.player.equippedAmulet = amuletName;
    
    if (amuletData.stat === 'maxHealth') {
        game.player.maxHealth += amuletData.value;
        game.player.health += amuletData.value;
        speak(`You equip ${amuletName}. Max health increased by ${amuletData.value}!`);
    } else if (amuletData.stat === 'maxMana') {
        game.player.maxMana += amuletData.value;
        game.player.mana += amuletData.value;
        speak(`You equip ${amuletName}. Max mana increased by ${amuletData.value}!`);
    } else if (amuletData.stat === 'attack') {
        speak(`You equip ${amuletName}. Attack damage increased by ${amuletData.value}!`);
    } else if (amuletData.stat === 'expGain') {
        speak(`You equip ${amuletName}. Experience gain increased by 20%!`);
    }
    
    autoManageInventory(amuletName);
}

function equipBracelet(command) {
    const braceletsInInventory = game.player.inventory.filter(item => 
        equipment.bracelets.some(b => b.name === item) ||
        merchantItems.some(m => m.name === item && m.type === 'bracelet')
    );
    
    if (braceletsInInventory.length === 0) {
        speak('You have no bracelets in your inventory.');
        return;
    }
    
    let braceletToEquip = null;
    for (let bracelet of braceletsInInventory) {
        if (command.includes(bracelet.toLowerCase())) {
            braceletToEquip = bracelet;
            break;
        }
    }
    
    if (!braceletToEquip) {
        speak(`Available bracelets: ${braceletsInInventory.join(', ')}. Say which bracelet to equip.`);
        return;
    }
    
    if (game.player.equippedBracelets.length >= 2) {
        speak('You already have 2 bracelets equipped. Say "remove bracelet" to make space.');
        return;
    }
    
    const index = game.player.inventory.indexOf(braceletToEquip);
    game.player.inventory.splice(index, 1);
    
    const braceletData = equipment.bracelets.find(b => b.name === braceletToEquip) ||
                         merchantItems.find(m => m.name === braceletToEquip && m.type === 'bracelet');
    
    game.player.equippedBracelets.push(braceletToEquip);
    
    if (braceletData.mana) {
        game.player.maxMana += braceletData.mana;
        game.player.mana += braceletData.mana;
    }
    
    speak(`You equip ${braceletToEquip}. Attack +${braceletData.attack}, Mana +${braceletData.mana}!`);
}

function removeBracelet(command) {
    if (game.player.equippedBracelets.length === 0) {
        speak('You have no bracelets equipped.');
        return;
    }
    
    let braceletToRemove = null;
    
    if (game.player.equippedBracelets.length === 1) {
        braceletToRemove = game.player.equippedBracelets[0];
    } else {
        for (let bracelet of game.player.equippedBracelets) {
            if (command.includes(bracelet.toLowerCase())) {
                braceletToRemove = bracelet;
                break;
            }
        }
        
        if (!braceletToRemove) {
            speak(`Equipped bracelets: ${game.player.equippedBracelets.join(' and ')}. Say which bracelet to remove.`);
            return;
        }
    }
    
    const index = game.player.equippedBracelets.indexOf(braceletToRemove);
    game.player.equippedBracelets.splice(index, 1);
    
    const braceletData = equipment.bracelets.find(b => b.name === braceletToRemove) ||
                         merchantItems.find(m => m.name === braceletToRemove && m.type === 'bracelet');
    
    if (braceletData && braceletData.mana) {
        game.player.maxMana -= braceletData.mana;
        game.player.mana = Math.min(game.player.mana, game.player.maxMana);
    }
    
    game.player.inventory.push(braceletToRemove);
    speak(`You remove ${braceletToRemove}.`);
}

function equipShoulderItem(command) {
    if (!equipment.shoulderItems) {
        speak('Shoulder items are not available yet.');
        return;
    }
    
    const shoulderItemsInInventory = game.player.inventory.filter(item => 
        equipment.shoulderItems.some(s => s.name === item)
    );
    
    if (shoulderItemsInInventory.length === 0) {
        speak('You have no shoulder items in your inventory.');
        return;
    }
    
    let itemToEquip = null;
    for (let item of shoulderItemsInInventory) {
        if (command.includes(item.toLowerCase())) {
            itemToEquip = item;
            break;
        }
    }
    
    if (!itemToEquip) {
        speak(`Available shoulder items: ${shoulderItemsInInventory.join(', ')}. Say which to equip.`);
        return;
    }
    
    const itemData = equipment.shoulderItems.find(s => s.name === itemToEquip);
    
    if (itemData.class && itemData.class !== game.player.class) {
        speak(`${itemToEquip} is not for your class.`);
        return;
    }
    
    if (game.player.equippedShoulderItem) {
        game.player.inventory.push(game.player.equippedShoulderItem);
    }
    
    const index = game.player.inventory.indexOf(itemToEquip);
    game.player.inventory.splice(index, 1);
    
    game.player.equippedShoulderItem = itemToEquip;
    speak(`You equip ${itemToEquip}. ${itemData.description}!`);
}

function equipItem(command) {
    const equipmentItems = game.player.inventory.filter(item => {
        return equipment.weapons.some(w => w.name === item) ||
               equipment.armor.some(a => a.name === item) ||
               (equipment.shields && equipment.shields.some(s => s.name === item)) ||
               equipment.helmets.some(h => h.name === item) ||
               equipment.gloves.some(g => g.name === item) ||
               equipment.boots.some(b => b.name === item) ||
               merchantItems.some(m => (m.type === 'weapon' || m.type === 'armor' || m.type === 'shield' || 
                                        m.type === 'helmet' || m.type === 'gloves' || m.type === 'boots') && m.name === item);
    });
    
    if (equipmentItems.length === 0) {
        speak('You have no equipment to equip.');
        return;
    }
    
    let itemToEquip = null;
    for (let item of equipmentItems) {
        if (command.includes(item.toLowerCase())) {
            itemToEquip = item;
            break;
        }
    }
    
    if (!itemToEquip) {
        speak(`Available equipment: ${equipmentItems.join(', ')}. Say which to equip.`);
        return;
    }
    
    equipItemDirect(itemToEquip);
}

function equipItemDirect(itemName) {
    const weaponData = equipment.weapons.find(w => w.name === itemName) ||
                      merchantItems.find(m => m.name === itemName && m.type === 'weapon');
    const armorData = equipment.armor.find(a => a.name === itemName) ||
                     merchantItems.find(m => m.name === itemName && m.type === 'armor');
    const shieldData = (equipment.shields && equipment.shields.find(s => s.name === itemName)) ||
                      merchantItems.find(m => m.name === itemName && m.type === 'shield');
    const helmetData = equipment.helmets.find(h => h.name === itemName) ||
                      merchantItems.find(m => m.name === itemName && m.type === 'helmet');
    const glovesData = equipment.gloves.find(g => g.name === itemName) ||
                      merchantItems.find(m => m.name === itemName && m.type === 'gloves');
    const bootsData = equipment.boots.find(b => b.name === itemName) ||
                     merchantItems.find(m => m.name === itemName && m.type === 'boots');
    
    if (weaponData) {
        equipWeapon(itemName, weaponData);
    } else if (armorData) {
        equipArmor(itemName, armorData);
    } else if (shieldData) {
        equipShield(itemName, shieldData);
    } else if (helmetData) {
        equipHelmet(itemName, helmetData);
    } else if (glovesData) {
        equipGloves(itemName, glovesData);
    } else if (bootsData) {
        equipBoots(itemName, bootsData);
    }
}

function equipWeapon(itemName, weaponData) {
    if (weaponData.class && weaponData.class !== game.player.class) {
        speak(`${itemName} is not for your class.`);
        return;
    }
    
    if (game.player.weapon) {
        game.player.inventory.push(game.player.weapon);
        const oldWeaponData = equipment.weapons.find(w => w.name === game.player.weapon) ||
                             merchantItems.find(m => m.name === game.player.weapon && m.type === 'weapon');
        if (oldWeaponData && oldWeaponData.mana) {
            game.player.maxMana -= oldWeaponData.mana;
            game.player.mana = Math.min(game.player.mana, game.player.maxMana);
        }
    }
    
    const index = game.player.inventory.indexOf(itemName);
    if (index !== -1) game.player.inventory.splice(index, 1);
    
    game.player.weapon = itemName;
    game.player.baseAttack = weaponData.attack;
    
    if (weaponData.mana) {
        game.player.maxMana += weaponData.mana;
        game.player.mana += weaponData.mana;
        speak(`You equip ${itemName}. Attack ${weaponData.attack}, Mana +${weaponData.mana}!`);
    } else {
        speak(`You equip ${itemName}. Attack ${weaponData.attack}!`);
    }
}

function equipArmor(itemName, armorData) {
    if (armorData.class && armorData.class !== game.player.class) {
        speak(`${itemName} is not for your class.`);
        return;
    }
    
    if (game.player.armor) {
        game.player.inventory.push(game.player.armor);
        const oldArmorData = equipment.armor.find(a => a.name === game.player.armor) ||
                            merchantItems.find(m => m.name === game.player.armor && m.type === 'armor');
        if (oldArmorData && oldArmorData.mana) {
            game.player.maxMana -= oldArmorData.mana;
            game.player.mana = Math.min(game.player.mana, game.player.maxMana);
        }
    }
    
    const index = game.player.inventory.indexOf(itemName);
    if (index !== -1) game.player.inventory.splice(index, 1);
    
    game.player.armor = itemName;
    recalculateDefense();
    
    if (armorData.mana) {
        game.player.maxMana += armorData.mana;
        game.player.mana += armorData.mana;
        speak(`You equip ${itemName}. Defense ${armorData.defense}, Mana +${armorData.mana}!`);
    } else {
        speak(`You equip ${itemName}. Defense ${armorData.defense}!`);
    }
}

function equipShield(itemName, shieldData) {
    if (shieldData.class && shieldData.class !== game.player.class) {
        speak(`${itemName} is not for your class.`);
        return;
    }
    
    if (game.player.shield) {
        game.player.inventory.push(game.player.shield);
    }
    
    const index = game.player.inventory.indexOf(itemName);
    if (index !== -1) game.player.inventory.splice(index, 1);
    
    game.player.shield = itemName;
    recalculateDefense();
    speak(`You equip ${itemName}. Defense ${shieldData.defense}!`);
}

function equipHelmet(itemName, helmetData) {
    if (helmetData.class && helmetData.class !== game.player.class) {
        speak(`${itemName} is not for your class.`);
        return;
    }
    
    if (game.player.helmet) {
        game.player.inventory.push(game.player.helmet);
        const oldHelmetData = equipment.helmets.find(h => h.name === game.player.helmet) ||
                             merchantItems.find(m => m.name === game.player.helmet && m.type === 'helmet');
        if (oldHelmetData && oldHelmetData.mana) {
            game.player.maxMana -= oldHelmetData.mana;
            game.player.mana = Math.min(game.player.mana, game.player.maxMana);
        }
    }
    
    const index = game.player.inventory.indexOf(itemName);
    if (index !== -1) game.player.inventory.splice(index, 1);
    
    game.player.helmet = itemName;
    
    if (helmetData.defense) {
        recalculateDefense();
        speak(`You equip ${itemName}. Defense ${helmetData.defense}!`);
    } else if (helmetData.mana) {
        game.player.maxMana += helmetData.mana;
        game.player.mana += helmetData.mana;
        speak(`You equip ${itemName}. Mana +${helmetData.mana}!`);
    }
}

function equipGloves(itemName, glovesData) {
    if (glovesData.class && glovesData.class !== game.player.class) {
        speak(`${itemName} is not for your class.`);
        return;
    }
    
    if (game.player.gloves) {
        game.player.inventory.push(game.player.gloves);
        const oldGlovesData = equipment.gloves.find(g => g.name === game.player.gloves) ||
                             merchantItems.find(m => m.name === game.player.gloves && m.type === 'gloves');
        if (oldGlovesData && oldGlovesData.mana) {
            game.player.maxMana -= oldGlovesData.mana;
            game.player.mana = Math.min(game.player.mana, game.player.maxMana);
        }
    }
    
    const index = game.player.inventory.indexOf(itemName);
    if (index !== -1) game.player.inventory.splice(index, 1);
    
    game.player.gloves = itemName;
    
    if (glovesData.mana) {
        game.player.maxMana += glovesData.mana;
        game.player.mana += glovesData.mana;
        speak(`You equip ${itemName}. Mana +${glovesData.mana}!`);
    } else {
        speak(`You equip ${itemName}. Attack +${glovesData.attack}!`);
    }
}

function equipBoots(itemName, bootsData) {
    if (bootsData.class && bootsData.class !== game.player.class) {
        speak(`${itemName} is not for your class.`);
        return;
    }
    
    if (game.player.boots) {
        game.player.inventory.push(game.player.boots);
        const oldBootsData = equipment.boots.find(b => b.name === game.player.boots) ||
                            merchantItems.find(m => m.name === game.player.boots && m.type === 'boots');
        if (oldBootsData && oldBootsData.mana) {
            game.player.maxMana -= oldBootsData.mana;
            game.player.mana = Math.min(game.player.mana, game.player.maxMana);
        }
    }
    
    const index = game.player.inventory.indexOf(itemName);
    if (index !== -1) game.player.inventory.splice(index, 1);
    
    game.player.boots = itemName;
    
    if (bootsData.defense) {
        recalculateDefense();
        speak(`You equip ${itemName}. Defense ${bootsData.defense}!`);
    } else if (bootsData.mana) {
        game.player.maxMana += bootsData.mana;
        game.player.mana += bootsData.mana;
        speak(`You equip ${itemName}. Mana +${bootsData.mana}!`);
    }
}

// Ability book reading
function readBook(command) {
    const abilityBooks = game.player.inventory.filter(item => abilities.some(a => a.name === item));
    
    if (abilityBooks.length === 0) {
        speak('You have no ability books to read.');
        return;
    }
    
    let bookToRead = null;
    for (let book of abilityBooks) {
        if (command.includes(book.toLowerCase())) {
            bookToRead = book;
            break;
        }
    }
    
    if (!bookToRead) {
        speak(`Available books: ${abilityBooks.join(', ')}. Say which book to read.`);
        return;
    }
    
    readBookDirect(bookToRead);
}

function readBookDirect(bookName) {
    const abilityData = abilities.find(a => a.name === bookName);
    
    if (!abilityData) {
        speak('This is not an ability book.');
        return;
    }
    
    if (abilityData.class !== game.player.class) {
        speak(`${bookName} is not for your class.`);
        return;
    }
    
    if (game.player.learnedAbilities.includes(bookName)) {
        speak(`You already know ${bookName}.`);
        return;
    }
    
    if (abilityData.minLevel && game.dungeon.currentLevel < abilityData.minLevel) {
        speak(`${bookName} requires dungeon level ${abilityData.minLevel}. You are on level ${game.dungeon.currentLevel}.`);
        return;
    }
    
    const index = game.player.inventory.indexOf(bookName);
    if (index !== -1) game.player.inventory.splice(index, 1);
    
    game.player.learnedAbilities.push(bookName);
    speak(`You learned ${bookName}! ${abilityData.description}. Damage: ${abilityData.damage}. Cost: ${abilityData.cost} mana.`);
}

function unlearnAbility(command) {
    if (game.player.learnedAbilities.length === 0) {
        speak('You have not learned any abilities.');
        return;
    }
    
    let abilityToUnlearn = null;
    for (let ability of game.player.learnedAbilities) {
        if (command.includes(ability.toLowerCase())) {
            abilityToUnlearn = ability;
            break;
        }
    }
    
    if (!abilityToUnlearn) {
        speak(`Learned abilities: ${game.player.learnedAbilities.join(', ')}. Say which to unlearn.`);
        return;
    }
    
    const index = game.player.learnedAbilities.indexOf(abilityToUnlearn);
    game.player.learnedAbilities.splice(index, 1);
    game.player.inventory.push(abilityToUnlearn);
    speak(`You forgot ${abilityToUnlearn}. The book has been returned to your inventory.`);
}

function useLockpicks() {
    if (!game.player.inventory.includes('Lockpicks')) {
        speak('You do not have lockpicks.');
        return;
    }
    
    if (game.currentRoom.type === 'treasure' && !game.currentRoom.searched) {
        speak('You use your lockpicks on a locked chest...');
        setTimeout(() => openChest(), 2000);
    } else {
        speak('There is nothing here to pick.');
    }
}
