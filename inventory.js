// Echo Dungeon V11 - Inventory System
// Item management, equipment, and junk handling

function getItemType(itemName) {
    if (treasures.some(t => t.name === itemName)) return 'treasure';
    if (rings.some(r => r.name === itemName)) return 'ring';
    if (amulets.some(a => a.name === itemName)) return 'amulet';
    if (equipment.weapons.some(w => w.name === itemName)) return 'equipment';
    if (equipment.armor.some(a => a.name === itemName)) return 'equipment';
    if (equipment.shields && equipment.shields.some(s => s.name === itemName)) return 'equipment';
    if (equipment.helmets.some(h => h.name === itemName)) return 'equipment';
    if (equipment.gloves.some(g => g.name === itemName)) return 'equipment';
    if (equipment.boots.some(b => b.name === itemName)) return 'equipment';
    if (equipment.bracelets.some(b => b.name === itemName)) return 'equipment';
    if (equipment.shoulderItems && equipment.shoulderItems.some(s => s.name === itemName)) return 'equipment';
    return 'other';
}

function getEquipmentSlot(itemName) {
    if (equipment.weapons.some(w => w.name === itemName)) return 'weapon';
    if (equipment.armor.some(a => a.name === itemName)) return 'armor';
    if (equipment.shields && equipment.shields.some(s => s.name === itemName)) return 'shield';
    if (equipment.helmets.some(h => h.name === itemName)) return 'helmet';
    if (equipment.gloves.some(g => g.name === itemName)) return 'gloves';
    if (equipment.boots.some(b => b.name === itemName)) return 'boots';
    if (equipment.shoulderItems && equipment.shoulderItems.some(s => s.name === itemName)) return 'equippedShoulderItem';
    return null;
}

function autoManageInventory(newItem) {
    const itemType = getItemType(newItem);
    
    // Treasures go directly to junk bag
    if (itemType === 'treasure') {
        if (!game.player.junkBag.includes(newItem)) {
            game.player.junkBag.push(newItem);
            const idx = game.player.inventory.indexOf(newItem);
            if (idx !== -1) {
                game.player.inventory.splice(idx, 1);
            }
        }
        return;
    }
    
    // Rings - keep max 2 of same type (except Ring of Regeneration)
    if (itemType === 'ring') {
        if (newItem === 'Ring of Regeneration') {
            return;
        }
        
        const inventoryCount = game.player.inventory.filter(i => i === newItem).length;
        const equippedCount = game.player.equippedRings.filter(i => i === newItem).length;
        const totalCount = inventoryCount + equippedCount;
        
        if (totalCount > 2) {
            const excessCount = totalCount - 2;
            for (let i = 0; i < excessCount; i++) {
                const idx = game.player.inventory.indexOf(newItem);
                if (idx !== -1) {
                    game.player.inventory.splice(idx, 1);
                    if (!game.player.junkBag.includes(newItem)) {
                        game.player.junkBag.push(newItem);
                    }
                }
            }
        }
        return;
    }
    
    // Amulets - keep max 1 of same type
    if (itemType === 'amulet') {
        const inventoryCount = game.player.inventory.filter(i => i === newItem).length;
        const isEquipped = game.player.equippedAmulet === newItem;
        const totalCount = inventoryCount + (isEquipped ? 1 : 0);
        
        if (totalCount > 1) {
            const excessCount = totalCount - 1;
            for (let i = 0; i < excessCount; i++) {
                const idx = game.player.inventory.indexOf(newItem);
                if (idx !== -1) {
                    game.player.inventory.splice(idx, 1);
                    if (!game.player.junkBag.includes(newItem)) {
                        game.player.junkBag.push(newItem);
                    }
                }
            }
        }
        return;
    }
    
    // Equipment - keep max 1 of same type
    if (itemType === 'equipment') {
        const equipmentSlot = getEquipmentSlot(newItem);
        const currentEquipped = equipmentSlot ? game.player[equipmentSlot] : null;
        const inventoryCount = game.player.inventory.filter(i => i === newItem).length;
        const isEquipped = currentEquipped === newItem;
        const totalCount = inventoryCount + (isEquipped ? 1 : 0);
        
        if (totalCount > 1) {
            const excessCount = totalCount - 1;
            for (let i = 0; i < excessCount; i++) {
                const idx = game.player.inventory.lastIndexOf(newItem);
                if (idx !== -1) {
                    game.player.inventory.splice(idx, 1);
                    if (!game.player.junkBag.includes(newItem)) {
                        game.player.junkBag.push(newItem);
                    }
                }
            }
        }
    }
}

function recalculateDefense() {
    game.player.defense = 0;
    
    if (game.player.armor) {
        const armorData = equipment.armor.find(a => a.name === game.player.armor) ||
                          merchantItems.find(i => i.name === game.player.armor && i.type === 'armor');
        if (armorData) game.player.defense += armorData.defense;
    }
    
    if (game.player.shield) {
        const shieldData = equipment.shields.find(s => s.name === game.player.shield) ||
                           merchantItems.find(i => i.name === game.player.shield && i.type === 'shield');
        if (shieldData) game.player.defense += shieldData.defense;
    }
    
    if (game.player.helmet) {
        const helmetData = equipment.helmets.find(h => h.name === game.player.helmet) ||
                           merchantItems.find(i => i.name === game.player.helmet && i.type === 'helmet');
        if (helmetData && helmetData.defense) game.player.defense += helmetData.defense;
    }
    
    if (game.player.gloves) {
        const glovesData = equipment.gloves.find(g => g.name === game.player.gloves) ||
                           merchantItems.find(i => i.name === game.player.gloves && i.type === 'gloves');
        if (glovesData && glovesData.defense) game.player.defense += glovesData.defense;
    }
    
    if (game.player.boots) {
        const bootsData = equipment.boots.find(b => b.name === game.player.boots) ||
                          merchantItems.find(i => i.name === game.player.boots && i.type === 'boots');
        if (bootsData && bootsData.defense) game.player.defense += bootsData.defense;
    }
}

// Junk bag management
function addToJunk(command) {
    const sellableItems = game.player.inventory.filter(item => {
        return equipment.weapons.some(w => w.name === item) ||
               equipment.armor.some(a => a.name === item) ||
               (equipment.shields && equipment.shields.some(s => s.name === item)) ||
               equipment.helmets.some(h => h.name === item) ||
               equipment.gloves.some(g => g.name === item) ||
               equipment.boots.some(b => b.name === item) ||
               equipment.bracelets.some(br => br.name === item) ||
               (equipment.shoulderItems && equipment.shoulderItems.some(s => s.name === item)) ||
               treasures.some(t => t.name === item);
    });

    if (sellableItems.length === 0) {
        speak('You have no equipment or treasures to mark as junk.');
        return;
    }

    let itemToAdd = null;
    for (let i = 0; i < sellableItems.length; i++) {
        const item = sellableItems[i];
        if (command.includes(item.toLowerCase())) {
            itemToAdd = item;
            break;
        }
    }

    if (!itemToAdd) {
        speak(`Available items: ${sellableItems.join(', ')}. Say which to mark as junk.`);
        return;
    }

    if (game.player.junkBag.includes(itemToAdd)) {
        speak(`${itemToAdd} is already marked as junk.`);
        return;
    }

    game.player.junkBag.push(itemToAdd);
    speak(`Marked ${itemToAdd} as junk. Say "sell junk" at a merchant to sell all junk.`);
}

function removeFromJunk(command) {
    if (game.player.junkBag.length === 0) {
        speak('Your junk bag is empty.');
        return;
    }

    let itemToRemove = null;
    for (let item of game.player.junkBag) {
        if (command.includes(item.toLowerCase())) {
            itemToRemove = item;
            break;
        }
    }

    if (!itemToRemove) {
        speak(`Junk bag: ${game.player.junkBag.join(', ')}. Say which to unmark.`);
        return;
    }

    const index = game.player.junkBag.indexOf(itemToRemove);
    game.player.junkBag.splice(index, 1);
    speak(`Unmarked ${itemToRemove} from junk.`);
}

function viewJunk() {
    if (game.player.junkBag.length === 0) {
        speak('Your junk bag is empty.');
    } else {
        speak(`Junk bag contains: ${game.player.junkBag.join(', ')}. ${game.player.junkBag.length} items marked for sale.`);
    }
}

// Item inspection system
function inspectItem(command) {
    let itemToInspect = null;
    
    for (let item of game.player.inventory) {
        if (command.includes(item.toLowerCase())) {
            itemToInspect = item;
            break;
        }
    }
    
    if (!itemToInspect) {
        speak('Item not found in inventory. Say inspect followed by the item name.');
        return;
    }
    
    game.inspectMode = true;
    game.inspectItem = itemToInspect;
    
    let messages = [`Inspecting ${itemToInspect}.`];
    
    const weaponData = equipment.weapons.find(w => w.name === itemToInspect);
    const armorData = equipment.armor.find(a => a.name === itemToInspect);
    const shieldData = equipment.shields && equipment.shields.find(s => s.name === itemToInspect);
    const helmetData = equipment.helmets.find(h => h.name === itemToInspect);
    const glovesData = equipment.gloves.find(g => g.name === itemToInspect);
    const bootsData = equipment.boots.find(b => b.name === itemToInspect);
    const braceletData = equipment.bracelets.find(b => b.name === itemToInspect);
    const shoulderData = equipment.shoulderItems && equipment.shoulderItems.find(s => s.name === itemToInspect);
    const ringData = rings.find(r => r.name === itemToInspect);
    const amuletData = amulets.find(a => a.name === itemToInspect);
    const abilityData = abilities.find(ab => ab.name === itemToInspect);
    const potionData = merchantItems.find(p => p.name === itemToInspect);
    
    if (weaponData) {
        messages.push(`Weapon. Attack ${weaponData.attack}.`);
        if (weaponData.mana) messages.push(`Mana bonus ${weaponData.mana}.`);
        if (weaponData.class) messages.push(`Class: ${weaponData.class}.`);
        messages.push(`Value: ${weaponData.value} gold.`);
    } else if (armorData) {
        messages.push(`Armor. Defense ${armorData.defense}.`);
        if (armorData.mana) messages.push(`Mana bonus ${armorData.mana}.`);
        if (armorData.class) messages.push(`Class: ${armorData.class}.`);
        messages.push(`Value: ${armorData.value} gold.`);
    } else if (shieldData) {
        messages.push(`Shield. Defense ${shieldData.defense}.`);
        messages.push(`Value: ${shieldData.value} gold.`);
    } else if (helmetData) {
        messages.push(`Helmet.`);
        if (helmetData.defense) messages.push(`Defense ${helmetData.defense}.`);
        if (helmetData.mana) messages.push(`Mana bonus ${helmetData.mana}.`);
        messages.push(`Value: ${helmetData.value} gold.`);
    } else if (glovesData) {
        messages.push(`Gloves.`);
        if (glovesData.attack) messages.push(`Attack ${glovesData.attack}.`);
        if (glovesData.mana) messages.push(`Mana bonus ${glovesData.mana}.`);
        if (glovesData.health) messages.push(`Health bonus ${glovesData.health}.`);
        messages.push(`Value: ${glovesData.value} gold.`);
    } else if (bootsData) {
        messages.push(`Boots.`);
        if (bootsData.defense) messages.push(`Defense ${bootsData.defense}.`);
        if (bootsData.mana) messages.push(`Mana bonus ${bootsData.mana}.`);
        if (bootsData.health) messages.push(`Health bonus ${bootsData.health}.`);
        messages.push(`Value: ${bootsData.value} gold.`);
    } else if (braceletData) {
        messages.push(`Bracelet. Attack ${braceletData.attack}. Mana ${braceletData.mana}.`);
        messages.push(`Value: ${braceletData.value} gold.`);
    } else if (shoulderData) {
        messages.push(`Shoulder item. ${shoulderData.description}.`);
        messages.push(`Value: ${shoulderData.value} gold.`);
    } else if (ringData) {
        messages.push(`Ring. ${ringData.effect}.`);
    } else if (amuletData) {
        messages.push(`Amulet. ${amuletData.effect}.`);
    } else if (abilityData) {
        messages.push(`Ability book. ${abilityData.description}.`);
        messages.push(`Damage: ${abilityData.damage}. Cost: ${abilityData.cost} mana.`);
    } else if (potionData) {
        messages.push(`Potion.`);
        if (potionData.healing) messages.push(`Restores ${potionData.healing} health.`);
        if (potionData.mana) messages.push(`Restores ${potionData.mana} mana.`);
        if (potionData.description) messages.push(potionData.description);
    }
    
    messages.push('Say equip to use it, junk to mark for sale, or keep to leave in inventory.');
    speakSequence(messages);
}

function equipInspectedItem() {
    const item = game.inspectItem;
    game.inspectMode = false;
    game.inspectItem = null;
    
    const itemType = getItemType(item);
    
    if (itemType === 'ring') {
        const index = game.player.inventory.indexOf(item);
        if (index !== -1) {
            game.player.inventory.splice(index, 1);
            equipRingDirect(item);
        }
    } else if (itemType === 'amulet') {
        const index = game.player.inventory.indexOf(item);
        if (index !== -1) {
            game.player.inventory.splice(index, 1);
            equipAmuletDirect(item);
        }
    } else if (itemType === 'equipment') {
        equipItemDirect(item);
    } else if (abilities.some(a => a.name === item)) {
        readBookDirect(item);
    } else {
        speak('This item cannot be equipped.');
    }
}

function junkInspectedItem() {
    const item = game.inspectItem;
    game.inspectMode = false;
    game.inspectItem = null;
    
    if (!game.player.junkBag.includes(item)) {
        game.player.junkBag.push(item);
    }
    speak(`${item} marked as junk.`);
}

function keepInspectedItem() {
    game.inspectMode = false;
    game.inspectItem = null;
    speak('Item kept in inventory.');
}

function listInventory() {
    if (game.player.inventory.length === 0 && game.player.equippedRings.length === 0) {
        speak(`Empty inventory. Gold: ${game.player.gold}.`);
    } else {
        const itemCounts = {};
        game.player.inventory.forEach(item => {
            itemCounts[item] = (itemCounts[item] || 0) + 1;
        });
        
        const ringsList = game.player.inventory.filter(i => rings.some(r => r.name === i));
        const amuletsList = game.player.inventory.filter(i => amulets.some(a => a.name === i));
        const abilityBooks = game.player.inventory.filter(i => abilities.some(a => a.name === i));
        
        const messages = ['Inventory:'];
        
        // List potions
        potionTypes.forEach(potion => {
            if (itemCounts[potion]) {
                messages.push(`${itemCounts[potion]} ${potion}${itemCounts[potion] > 1 ? 's' : ''}.`);
            }
        });
        
        // List ability books
        if (abilityBooks.length > 0) {
            const bookCounts = {};
            abilityBooks.forEach(book => bookCounts[book] = (bookCounts[book] || 0) + 1);
            const bookList = Object.entries(bookCounts).map(([book, count]) => 
                count > 1 ? `${book} x${count}` : book
            );
            messages.push(`Books: ${bookList.join(', ')}.`);
        }
        
        // List unequipped rings
        if (ringsList.length > 0) {
            const ringCounts = {};
            ringsList.forEach(ring => ringCounts[ring] = (ringCounts[ring] || 0) + 1);
            const ringList = Object.entries(ringCounts).map(([ring, count]) => 
                count > 1 ? `${ring} x${count}` : ring
            );
            messages.push(`Unequipped rings: ${ringList.join(', ')}.`);
        }
        
        // List equipped rings
        if (game.player.equippedRings.length > 0) {
            const equippedCounts = {};
            game.player.equippedRings.forEach(ring => equippedCounts[ring] = (equippedCounts[ring] || 0) + 1);
            const equippedList = Object.entries(equippedCounts).map(([ring, count]) => 
                count > 1 ? `${ring} x${count}` : ring
            );
            messages.push(`Equipped rings: ${equippedList.join(', ')}.`);
        }
        
        // List unequipped amulets
        if (amuletsList.length > 0) {
            const amuletCounts = {};
            amuletsList.forEach(amulet => amuletCounts[amulet] = (amuletCounts[amulet] || 0) + 1);
            const amuletList = Object.entries(amuletCounts).map(([amulet, count]) => 
                count > 1 ? `${amulet} x${count}` : amulet
            );
            messages.push(`Unequipped amulets: ${amuletList.join(', ')}.`);
        }
        
        if (game.player.equippedAmulet) messages.push(`Equipped amulet: ${game.player.equippedAmulet}.`);
        
        // List other equipment
        const otherItems = game.player.inventory.filter(i => 
            !potionTypes.includes(i) &&
            !ringsList.includes(i) && 
            !amuletsList.includes(i) &&
            !abilityBooks.includes(i)
        );
        if (otherItems.length > 0) {
            const equipCounts = {};
            otherItems.forEach(item => equipCounts[item] = (equipCounts[item] || 0) + 1);
            const equipList = Object.entries(equipCounts).map(([item, count]) => 
                count > 1 ? `${item} x${count}` : item
            );
            messages.push(`Equipment: ${equipList.join(', ')}.`);
        }
        
        messages.push(`Gold: ${game.player.gold}.`);
        
        speakSequence(messages);
    }
}
