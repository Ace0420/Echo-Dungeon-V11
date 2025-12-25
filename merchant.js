// Echo Dungeon V11 - Merchant System
// Trading, buying, and selling items

function talkToMerchant() {
    if (game.currentRoom.type !== 'merchant') {
        speak('There is no merchant here.');
        return;
    }
    game.merchantOpen = true;
    speak('A mysterious merchant greets you. Say "what do you have" to see wares, "buy" to purchase, "sell junk" to sell marked items, or "leave" to exit.');
}

function buyFromMerchant(command) {
    let itemToBuy = null;
    
    for (let item of merchantItems) {
        if (command.includes(item.name.toLowerCase())) {
            if (item.minLevel && game.dungeon.currentLevel < item.minLevel) {
                speak(`${item.name} requires dungeon level ${item.minLevel}. Come back later.`);
                return;
            }
            if (item.type === 'weapon' || item.type === 'armor' || item.type === 'helmet' || 
                item.type === 'gloves' || item.type === 'boots' || item.type === 'shield' || item.type === 'bracelet') {
                if (item.class === game.player.class || !item.class) {
                    itemToBuy = item;
                    break;
                }
            } else {
                itemToBuy = item;
                break;
            }
        }
    }

    if (!itemToBuy) {
        speak('Item not recognized or not for your class. Say "what do you have" to see available items.');
        return;
    }

    if (game.player.gold < itemToBuy.price) {
        speak(`Not enough gold. You need ${itemToBuy.price} gold but only have ${game.player.gold}.`);
        return;
    }

    game.player.gold -= itemToBuy.price;
    game.player.inventory.push(itemToBuy.name);
    speak(`You bought ${itemToBuy.name} for ${itemToBuy.price} gold. Remaining gold: ${game.player.gold}.`);
}

function listMerchantWares() {
    const messages = ['The merchant offers:'];
    const level = game.dungeon.currentLevel;
    
    merchantItems.forEach(item => {
        if (item.minLevel && level < item.minLevel) return;
        
        if (item.type === 'weapon' && item.class === game.player.class) {
            let itemDesc = `${item.name} for ${item.price} gold. Attack ${item.attack}.`;
            if (item.description) itemDesc += ` ${item.description}.`;
            messages.push(itemDesc);
        } else if (item.type === 'armor' && item.class === game.player.class) {
            let itemDesc = `${item.name} for ${item.price} gold. Defense ${item.defense}.`;
            if (item.description) itemDesc += ` ${item.description}.`;
            messages.push(itemDesc);
        } else if (item.type === 'shield' && (!item.class || item.class === game.player.class)) {
            let itemDesc = `${item.name} for ${item.price} gold. Defense ${item.defense}.`;
            if (item.description) itemDesc += ` ${item.description}.`;
            messages.push(itemDesc);
        } else if (item.type === 'helmet' && (!item.class || item.class === game.player.class)) {
            let itemDesc = `${item.name} for ${item.price} gold.`;
            if (item.defense) itemDesc += ` Defense ${item.defense}.`;
            if (item.mana) itemDesc += ` Mana ${item.mana}.`;
            if (item.description) itemDesc += ` ${item.description}.`;
            messages.push(itemDesc);
        } else if (item.type === 'gloves' && (!item.class || item.class === game.player.class)) {
            let itemDesc = `${item.name} for ${item.price} gold.`;
            if (item.attack) itemDesc += ` Attack ${item.attack}.`;
            if (item.mana) itemDesc += ` Mana ${item.mana}.`;
            if (item.description) itemDesc += ` ${item.description}.`;
            messages.push(itemDesc);
        } else if (item.type === 'boots' && (!item.class || item.class === game.player.class)) {
            let itemDesc = `${item.name} for ${item.price} gold.`;
            if (item.defense) itemDesc += ` Defense ${item.defense}.`;
            if (item.mana) itemDesc += ` Mana ${item.mana}.`;
            if (item.health) itemDesc += ` Health ${item.health}.`;
            if (item.description) itemDesc += ` ${item.description}.`;
            messages.push(itemDesc);
        } else if (item.type === 'bracelet') {
            let itemDesc = `${item.name} for ${item.price} gold. Attack ${item.attack}, Mana ${item.mana}.`;
            if (item.description) itemDesc += ` ${item.description}.`;
            messages.push(itemDesc);
        } else if (item.type === 'potion') {
            messages.push(`${item.name} for ${item.price} gold.`);
        } else if (item.type === 'special_potion') {
            messages.push(`${item.name} for ${item.price} gold. ${item.description}.`);
        }
    });
    messages.push('Say "buy" followed by the item name to purchase.');
    speakSequence(messages);
}

function sellAllJunk() {
    if (!game.merchantOpen) {
        speak('You need to be at a merchant to sell junk.');
        return;
    }

    if (game.player.junkBag.length === 0) {
        speak('Your junk bag is empty. Say "mark junk" followed by item names to mark items for sale.');
        return;
    }

    let totalGold = 0;
    const soldItems = [];

    const uniqueJunkItems = [...new Set(game.player.junkBag)];
    
    for (let itemName of uniqueJunkItems) {
        let itemsToSell = [];
        for (let i = game.player.inventory.length - 1; i >= 0; i--) {
            if (game.player.inventory[i] === itemName) {
                itemsToSell.push(i);
            }
        }
        
        if (itemsToSell.length === 0) {
            continue;
        }
        
        let itemValue = 0;
        const weaponData = equipment.weapons.find(w => w.name === itemName);
        const armorData = equipment.armor.find(a => a.name === itemName);
        const shieldData = equipment.shields && equipment.shields.find(s => s.name === itemName);
        const helmetData = equipment.helmets.find(h => h.name === itemName);
        const glovesData = equipment.gloves.find(g => g.name === itemName);
        const bootsData = equipment.boots.find(b => b.name === itemName);
        const braceletData = equipment.bracelets.find(b => b.name === itemName);
        const shoulderData = equipment.shoulderItems && equipment.shoulderItems.find(s => s.name === itemName);
        const treasureData = treasures.find(t => t.name === itemName);

        if (weaponData) itemValue = Math.floor(weaponData.value * 0.6);
        else if (armorData) itemValue = Math.floor(armorData.value * 0.6);
        else if (shieldData) itemValue = Math.floor(shieldData.value * 0.6);
        else if (helmetData) itemValue = Math.floor(helmetData.value * 0.6);
        else if (glovesData) itemValue = Math.floor(glovesData.value * 0.6);
        else if (bootsData) itemValue = Math.floor(bootsData.value * 0.6);
        else if (braceletData) itemValue = Math.floor(braceletData.value * 0.6);
        else if (shoulderData) itemValue = Math.floor(shoulderData.value * 0.6);
        else if (treasureData) itemValue = treasureData.value;
        else itemValue = 20;
        
        for (let idx of itemsToSell) {
            game.player.inventory.splice(idx, 1);
            totalGold += itemValue;
            soldItems.push(itemName);
        }
    }

    game.player.gold += totalGold;
    game.player.junkBag = [];

    speak(`Sold ${soldItems.length} items for ${totalGold} gold! Total gold: ${game.player.gold}.`);
}
