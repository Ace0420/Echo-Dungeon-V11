// Echo Dungeon V11 - Equipment Data
// All weapons, armor, shields, helmets, gloves, boots, bracelets, and shoulder items

const equipment = {
    weapons: [
        { name: 'Steel Sword', attack: 12, class: 'warrior', value: 100 },
        { name: 'Mystic Staff', attack: 8, mana: 15, class: 'mage', value: 150 },
        { name: 'Shadow Daggers', attack: 10, class: 'rogue', value: 120 },
        { name: 'Legendary Greatsword', attack: 25, class: 'warrior', value: 300 },
        { name: 'Archmage Staff', attack: 12, mana: 25, class: 'mage', value: 350 },
        { name: 'Vorpal Daggers', attack: 16, class: 'rogue', value: 320 },
        { name: 'Demon Slayer Blade', attack: 40, class: 'warrior', value: 500 },
        { name: 'Staff of the Cosmos', attack: 15, mana: 35, class: 'mage', value: 600 },
        { name: 'Ethereal Blades', attack: 22, class: 'rogue', value: 550 },
        { name: 'Godslayer Greatsword', attack: 30, class: 'warrior', value: 1000, minLevel: 6 },
        { name: 'Staff of Eternity', attack: 20, mana: 45, class: 'mage', value: 1200, minLevel: 6 },
        { name: 'Nightfall Daggers', attack: 32, class: 'rogue', value: 1100, minLevel: 6 },
        { name: 'Excalibur', attack: 50, class: 'warrior', value: 2000, minLevel: 8 },
        { name: 'Infinity Staff', attack: 25, mana: 60, class: 'mage', value: 2500, minLevel: 8 },
        { name: 'Oblivion Blades', attack: 42, class: 'rogue', value: 2200, minLevel: 8 },
        { name: 'Sword of the Ancients', attack: 100, class: 'warrior', value: 5000, minLevel: 10 },
        { name: 'Cosmic Scepter', attack: 70, mana: 80, class: 'mage', value: 6000, minLevel: 10 },
        { name: 'Void Assassin Blades', attack: 85, class: 'rogue', value: 5500, minLevel: 10 },
        { name: 'Blade of Titans', attack: 200, class: 'warrior', value: 10000, minLevel: 20 },
        { name: 'Staff of Creation', attack: 140, mana: 160, class: 'mage', value: 12000, minLevel: 20 },
        { name: 'Reality Ripper Daggers', attack: 170, class: 'rogue', value: 11000, minLevel: 20 },
        { name: 'Worldbreaker Sword', attack: 400, class: 'warrior', value: 20000, minLevel: 30 },
        { name: 'Genesis Core Staff', attack: 280, mana: 320, class: 'mage', value: 24000, minLevel: 30 },
        { name: 'Entropy Blades', attack: 340, class: 'rogue', value: 22000, minLevel: 30 }
    ],
    
    armor: [
        { name: 'Chainmail', defense: 10, class: 'warrior', value: 100 },
        { name: 'Enchanted Robes', defense: 5, class: 'mage', value: 120 },
        { name: 'Shadow Leather', defense: 6, class: 'rogue', value: 110 },
        { name: 'Dragonscale Plate', defense: 15, class: 'warrior', value: 350 },
        { name: 'Arcane Vestments', defense: 12, class: 'mage', value: 380 },
        { name: 'Phantom Suit', defense: 13, class: 'rogue', value: 360 },
        { name: 'Titanium Fortress', defense: 27, class: 'warrior', value: 550 },
        { name: 'Celestial Robes', defense: 18, mana: 25, class: 'mage', value: 600 },
        { name: 'Void Cloak', defense: 20, class: 'rogue', value: 580 },
        { name: 'Divine Plate', defense: 50, class: 'warrior', value: 1200, minLevel: 6 },
        { name: 'Robes of the Archmage', defense: 40, class: 'mage', value: 1100, minLevel: 6 },
        { name: 'Shadowweave Armor', defense: 45, class: 'rogue', value: 1150, minLevel: 6 },
        { name: 'Immortal Armor', defense: 80, class: 'warrior', value: 3000, minLevel: 8 },
        { name: 'Vestments of Infinity', defense: 65, mana: 60, class: 'mage', value: 2800, minLevel: 8 },
        { name: 'Cloak of Eternity', defense: 70, class: 'rogue', value: 2900, minLevel: 8 },
        { name: 'Armor of the Titans', defense: 150, class: 'warrior', value: 6000, minLevel: 10 },
        { name: 'Cosmic Vestments', defense: 120, mana: 90, class: 'mage', value: 7000, minLevel: 10 },
        { name: 'Void Emperor Cloak', defense: 130, class: 'rogue', value: 6500, minLevel: 10 },
        { name: 'Worldguard Plate', defense: 300, class: 'warrior', value: 12000, minLevel: 20 },
        { name: 'Reality Weave Robes', defense: 240, mana: 180, class: 'mage', value: 14000, minLevel: 20 },
        { name: 'Entropy Shroud', defense: 260, class: 'rogue', value: 13000, minLevel: 20 },
        { name: 'Godforge Armor', defense: 600, class: 'warrior', value: 24000, minLevel: 30 },
        { name: 'Genesis Vestments', defense: 480, mana: 360, class: 'mage', value: 28000, minLevel: 30 },
        { name: 'Oblivion Suit', defense: 520, class: 'rogue', value: 26000, minLevel: 30 }
    ],
    
    shields: [
        { name: 'Iron Shield', defense: 5, class: 'warrior', value: 80 },
        { name: 'Tower Shield', defense: 10, class: 'warrior', value: 250 },
        { name: 'Aegis Shield', defense: 15, class: 'warrior', value: 450 },
        { name: 'Shield of Heroes', defense: 35, class: 'warrior', value: 800, minLevel: 6 },
        { name: 'Bulwark of Ages', defense: 55, class: 'warrior', value: 1500, minLevel: 8 },
        { name: 'Titan Shield', defense: 100, class: 'warrior', value: 4000, minLevel: 10 },
        { name: 'Worldshield', defense: 200, class: 'warrior', value: 10000, minLevel: 20 },
        { name: 'Bulwark of Eternity', defense: 400, class: 'warrior', value: 20000, minLevel: 30 }
    ],
    
    helmets: [
        { name: 'Iron Helm', defense: 3, class: 'warrior', value: 50 },
        { name: 'Mage Hood', mana: 50, class: 'mage', value: 60 },
        { name: 'Shadow Mask', mana: 30, class: 'rogue', value: 55 },
        { name: 'Crown of Kings', defense: 38, class: 'warrior', value: 300, minLevel: 5 },
        { name: 'Circlet of Wisdom', mana: 120, class: 'mage', value: 350, minLevel: 5 },
        { name: 'Assassin Hood', mana: 50, class: 'rogue', value: 320, minLevel: 5 },
        { name: 'Helm of the Ancients', defense: 75, class: 'warrior', value: 3000, minLevel: 10 },
        { name: 'Crown of Cosmic Power', mana: 200, class: 'mage', value: 3500, minLevel: 10 },
        { name: 'Void Assassin Mask', mana: 150, class: 'rogue', value: 3200, minLevel: 10 },
        { name: 'Helm of Titans', defense: 150, class: 'warrior', value: 8000, minLevel: 20 },
        { name: 'Reality Crown', mana: 400, class: 'mage', value: 9000, minLevel: 20 },
        { name: 'Entropy Hood', mana: 300, class: 'rogue', value: 8500, minLevel: 20 },
        { name: 'Godhelm', defense: 300, class: 'warrior', value: 16000, minLevel: 30 },
        { name: 'Genesis Crown', mana: 800, class: 'mage', value: 18000, minLevel: 30 },
        { name: 'Oblivion Mask', mana: 600, class: 'rogue', value: 17000, minLevel: 30 }
    ],
    
    gloves: [
        { name: 'Leather Gloves', attack: 12, value: 40 },
        { name: 'Gauntlets of Strength', attack: 55, class: 'warrior', value: 200, minLevel: 4 },
        { name: 'Gloves of Casting', mana: 80, class: 'mage', value: 220, minLevel: 4 },
        { name: 'Shadow Grips', attack: 14, health: 30, class: 'rogue', value: 210, minLevel: 4 },
        { name: 'Titan Gauntlets', attack: 110, class: 'warrior', value: 2500, minLevel: 10 },
        { name: 'Cosmic Gloves', mana: 180, class: 'mage', value: 3000, minLevel: 10 },
        { name: 'Void Grips', attack: 95, health: 100, class: 'rogue', value: 2800, minLevel: 10 },
        { name: 'Worldbreaker Gauntlets', attack: 220, class: 'warrior', value: 7000, minLevel: 20 },
        { name: 'Reality Gloves', mana: 360, class: 'mage', value: 8000, minLevel: 20 },
        { name: 'Entropy Grips', attack: 190, health: 200, class: 'rogue', value: 7500, minLevel: 20 },
        { name: 'Godforged Gauntlets', attack: 440, class: 'warrior', value: 14000, minLevel: 30 },
        { name: 'Genesis Gloves', mana: 720, class: 'mage', value: 16000, minLevel: 30 },
        { name: 'Oblivion Grips', attack: 380, health: 400, class: 'rogue', value: 15000, minLevel: 30 }
    ],
    
    boots: [
        { name: 'Iron Boots', defense: 12, value: 35 },
        { name: 'Boots of Speed', mana: 15, value: 150, minLevel: 3 },
        { name: 'Greaves of the Titan', defense: 38, class: 'warrior', value: 300, minLevel: 5 },
        { name: 'Slippers of Wisdom', mana: 70, class: 'mage', value: 280, minLevel: 5 },
        { name: 'Boots of Shadow', health: 25, class: 'rogue', value: 320, minLevel: 5 },
        { name: 'Ancient Greaves', defense: 75, class: 'warrior', value: 2800, minLevel: 10 },
        { name: 'Cosmic Slippers', mana: 170, class: 'mage', value: 3200, minLevel: 10 },
        { name: 'Void Treads', health: 120, class: 'rogue', value: 3000, minLevel: 10 },
        { name: 'Titan Greaves', defense: 150, class: 'warrior', value: 7500, minLevel: 20 },
        { name: 'Reality Slippers', mana: 340, class: 'mage', value: 8500, minLevel: 20 },
        { name: 'Entropy Boots', health: 250, class: 'rogue', value: 8000, minLevel: 20 },
        { name: 'Worldstep Greaves', defense: 300, class: 'warrior', value: 15000, minLevel: 30 },
        { name: 'Genesis Slippers', mana: 680, class: 'mage', value: 17000, minLevel: 30 },
        { name: 'Oblivion Treads', health: 500, class: 'rogue', value: 16000, minLevel: 30 }
    ],
    
    bracelets: [
        { name: 'Bronze Bracelet', attack: 5, value: 100 },
        { name: 'Silver Bracelet', attack: 10, mana: 20, value: 300, minLevel: 3 },
        { name: 'Gold Bracelet', attack: 15, mana: 40, value: 800, minLevel: 5 },
        { name: 'Platinum Bracelet', attack: 25, mana: 70, value: 2000, minLevel: 8 },
        { name: 'Ancient Bracelet', attack: 50, mana: 120, value: 5000, minLevel: 10 },
        { name: 'Titan Bracelet', attack: 100, mana: 240, value: 10000, minLevel: 20 },
        { name: 'Reality Bracelet', attack: 200, mana: 480, value: 20000, minLevel: 30 }
    ],
    
    shoulderItems: [
        { name: 'Battle Banner', effect: 'warrior_damage', bonus: 0.5, class: 'warrior', value: 2000, minLevel: 5, description: '+50% attack damage' },
        { name: 'Arcane Scarf', effect: 'mage_spell', bonus: 0.5, class: 'mage', value: 2000, minLevel: 5, description: '+50% spell damage' },
        { name: 'Spelled Cat Stole', effect: 'rogue_stealth', bonus: 0.5, class: 'rogue', value: 2000, minLevel: 5, description: '+50% stealth damage' },
        { name: 'Titan War Banner', effect: 'warrior_damage', bonus: 1.0, class: 'warrior', value: 10000, minLevel: 20, description: '+100% attack damage' },
        { name: 'Cosmic Mantle', effect: 'mage_spell', bonus: 1.0, class: 'mage', value: 10000, minLevel: 20, description: '+100% spell damage' },
        { name: 'Shadow Cloak Stole', effect: 'rogue_stealth', bonus: 1.0, class: 'rogue', value: 10000, minLevel: 20, description: '+100% stealth damage' }
    ]
};
