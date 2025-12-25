// Echo Dungeon V11 - Info Commands
// Help, hints, readme, license, and command lists

function showReadme() {
    const readmeText = `Echo Dungeon Version 11. Tips and Instructions. 
    
Getting Started: Tap the screen to activate voice listening. Speak your command clearly. Wait for the game to respond. The screen turns green when listening.

Basic Commands: Choose your class by saying warrior, mage, or rogue. Move with north, south, east, or west. Look around to hear your current room. Search to find hidden items. Open chest for treasure. Use fountain to heal.

Combat: Attack for basic attack. Defend to reduce damage. Special for your class ability. Cast spell followed by the spell name. Use potion to heal or restore mana. Flee to try escaping.

Character Management: Say status to hear your stats. Inventory lists your items. Equip followed by item name to wear equipment. Wear ring to equip rings, up to 10. Remove ring to unequip. Equip bracelet for bracelets, up to 2. Equip amulet for one amulet. Read book to learn abilities.

Junk System: Mark junk followed by item name. View junk to see marked items. Sell junk at merchants for 60 percent of value.

Classes: Warrior has high health, low mana, Power Strike special. Mage has low health, high mana, Fireball special. Rogue has medium stats, Backstab special.

Game Mechanics: Combat is turn based. Defending reduces damage by 50 percent. Level up increases health and mana. Equipment has level requirements. Boss is in the southeast corner. Use stairs after defeating the boss.

Saving: Say save game for a 4 digit PIN. Say load game then code followed by your PIN.

For full instructions, visit the game documentation. Say license for copyright information.`;
    
    speak(readmeText);
}

function showLicense() {
    const licenseText = `Echo Dungeon Version 11 License. 
    
Copyright 2025 Asa Hartz Games. 

You are free to play and share this game for free. Modify for personal use. Use for education. Create accessibility improvements.

You are not allowed to sell this game or charge money for access. Include in paid products. Monetize through ads or subscriptions. Use commercially. Remove this license.

This game is provided free to the community, especially the blind and visually impaired, as a gift. It must remain free and accessible to all.

The software is provided as is, without warranty of any kind. For questions, contact Acejames419 at gmail dot com.`;
    
    speak(licenseText);
}

function showHelp() {
    if (game.phase === 'combat') {
        speak('Combat commands: attack, defend, special, cast spell, use potion, or flee.');
    } else {
        speak('Exploration commands: north, south, east, west, look around, search, open chest, drink fountain, merchant, meditate, wear ring, remove ring, equip bracelet, remove bracelet, equip amulet, equip shoulder, inspect item, read book, unlearn ability, use potion, status, inventory, mark junk, view junk, save game, or load game.');
    }
}

function listCommands() {
    if (game.phase === 'combat') {
        speakSequence([
            'Combat commands:',
            'Attack. Deal damage.',
            'Defend. Reduce incoming damage.',
            'Special. Use your class ability.',
            'Cast spell. Use a learned ability.',
            'Use potion. Heal or restore mana.',
            'Flee. Try to escape.'
        ]);
    } else {
        speakSequence([
            'Movement: north, south, east, west, go down stairs.',
            'Actions: look around, search, open chest, drink fountain, merchant, meditate, wear ring, remove ring, equip bracelet, remove bracelet, equip amulet, equip shoulder, inspect item, read book, unlearn ability, use potion.',
            'Junk: mark junk, view junk, sell junk at merchant.',
            'Info: status, inventory, hint.',
            'System: save game, load game, commands, help.'
        ]);
    }
}

function giveHint() {
    if (game.phase === 'combat') {
        if (game.player.health < 30) {
            speak('Your health is low. Consider using a health potion or defending.');
        } else if (game.player.mana >= classes[game.player.class].special.cost) {
            speak(`You have enough mana for ${classes[game.player.class].special.name}.`);
        } else {
            speak('Try attacking or defending based on your health.');
        }
    } else {
        const room = game.currentRoom;
        if (room.type === 'stairs') {
            speak('A staircase is here. Say "go down stairs" to descend to the next level.');
        } else if (room.type === 'merchant') {
            speak('A merchant is here. Say "merchant" to trade goods.');
        } else if (room.type === 'fountain' && !room.fountainUsed) {
            speak('There is a magical fountain here. Say "drink fountain" for full healing.');
        } else if (room.hasChest && !room.searched) {
            speak('There is a chest here. Say open chest.');
        } else if (!room.searched) {
            speak('You have not searched this room yet. Try searching.');
        } else if (game.player.mana < game.player.maxMana * 0.5) {
            speak('Your mana is low. Consider saying meditate to recover.');
        } else if (room.type === 'boss') {
            speak('This is a boss room. Be prepared for a tough fight.');
        } else {
            speak('Explore in different directions. The boss is at the far south east corner. Look for merchants to buy potions and sell loot.');
        }
    }
}
