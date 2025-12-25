// Echo Dungeon V11 - Abilities and Spells
// Learnable abilities for each class

const abilities = [
    // Early game abilities
    { name: 'Icy Blast', damage: 100, cost: 20, type: 'freeze', description: 'Deals damage and freezes enemy for 1 turn', class: 'mage' },
    { name: 'Shield Bash', damage: 80, cost: 20, type: 'stun', description: 'Stun enemy for one turn', class: 'warrior' },
    { name: 'Poison Blade', damage: 40, cost: 20, type: 'poison', duration: 3, description: 'Poison damages 15 per turn for 3 turns', class: 'rogue' },
    { name: 'Chain Lightning', damage: 95, cost: 25, type: 'damage', description: 'Devastating lightning attack', class: 'mage' },
    { name: 'Arcane Missiles', damage: 105, cost: 15, type: 'aoe', description: 'Magic missiles hit all enemies', class: 'mage' },
    { name: 'Whirlwind', damage: 70, cost: 25, type: 'aoe', description: 'Spin attack hitting all enemies', class: 'warrior'},
    { name: 'Shadow Strike', damage: 40, cost: 20, type: 'sneak', description: 'Strike from shadows without enemy retaliation', class: 'rogue' },
    
    // Level 5+ abilities
    { name: 'Meteor Storm', damage: 145, cost: 40, type: 'aoe', description: 'Massive fire damage to all enemies', class: 'mage', minLevel: 5 },
    { name: 'Titan Smash', damage: 190, cost: 35, type: 'damage', description: 'Devastating single target attack', class: 'warrior', minLevel: 5 },
    { name: 'Assassinate', damage: 125, cost: 30, type: 'sneak', description: 'Massive stealth strike with no counter', class: 'rogue', minLevel: 5 },
    
    // Level 6+ abilities
    { name: 'Time Stop', damage: 0, cost: 60, type: 'timestop', description: 'Freeze all enemies for 2 turns', class: 'mage', minLevel: 6 },
    { name: 'Berserker Rage', damage: 105, cost: 30, type: 'rage', description: 'Triple attack on single target', class: 'warrior', minLevel: 6 },
    { name: 'Vanish', damage: 0, cost: 25, type: 'vanish', description: 'Become invisible, next attack deals 200% damage', class: 'rogue', minLevel: 6 },
    
    // Level 8+ abilities
    { name: 'Divine Smite', damage: 200, cost: 60, type: 'damage', description: 'Holy damage that ignores defense', class: 'warrior', minLevel: 8 },
    { name: 'Black Hole', damage: 250, cost: 55, type: 'aoe', description: 'Void magic crushes all foes', class: 'mage', minLevel: 8 },
    { name: 'Death Mark', damage: 100, cost: 35, type: 'mark', description: 'Mark enemy for 50% more damage taken', class: 'rogue', minLevel: 8 },
    
    // Level 10+ abilities
    { name: 'Cosmic Devastation', damage: 600, cost: 100, type: 'aoe', description: 'Ultimate spell destroys all enemies', class: 'mage', minLevel: 10 },
    { name: 'Annihilation', damage: 800, cost: 70, type: 'damage', description: 'Total destruction single target', class: 'warrior', minLevel: 10 },
    { name: 'Soul Reaper', damage: 500, cost: 60, type: 'sneak', description: 'Harvest souls from the shadows', class: 'rogue', minLevel: 10 },
    
    // Level 20+ abilities
    { name: 'Supernova', damage: 1200, cost: 200, type: 'aoe', description: 'Star-destroying power', class: 'mage', minLevel: 20 },
    { name: 'World Shatter', damage: 1600, cost: 140, type: 'damage', description: 'Break reality itself', class: 'warrior', minLevel: 20 },
    { name: 'Entropy Strike', damage: 1000, cost: 120, type: 'sneak', description: 'Unravel existence', class: 'rogue', minLevel: 20 },
    
    // Level 30+ abilities
    { name: 'Genesis Beam', damage: 2400, cost: 400, type: 'aoe', description: 'Create and destroy universes', class: 'mage', minLevel: 30 },
    { name: 'Oblivion Crash', damage: 3200, cost: 280, type: 'damage', description: 'The end of everything', class: 'warrior', minLevel: 30 },
    { name: 'Void Erasure', damage: 2000, cost: 240, type: 'sneak', description: 'Remove from all timelines', class: 'rogue', minLevel: 30 }
];

// Amulets - equip one at a time
const amulets = [
    { name: 'Amulet of Vitality', effect: '+15 Max Health', stat: 'maxHealth', value: 15 },
    { name: 'Amulet of Mana', effect: '+15 Max Mana', stat: 'maxMana', value: 15 },
    { name: 'Amulet of Experience', effect: '+20% Experience Gain', stat: 'expGain', value: 30 },
    { name: 'Amulet of the Archmage', effect: '+30 Max Mana', stat: 'maxMana', value: 30 },
    { name: 'Amulet of the Titan', effect: '+30 Max Health', stat: 'maxHealth', value: 30 },
    { name: 'Amulet of Power', effect: '+5 Attack', stat: 'attack', value: 5 },
    { name: 'Ancient Amulet', effect: '+100 Max Health', stat: 'maxHealth', value: 100, minLevel: 10 },
    { name: 'Cosmic Amulet', effect: '+200 Max Mana', stat: 'maxMana', value: 200, minLevel: 10 },
    { name: 'Amulet of Destruction', effect: '+30 Attack', stat: 'attack', value: 30, minLevel: 10 },
    { name: 'Titan Amulet', effect: '+250 Max Health', stat: 'maxHealth', value: 250, minLevel: 20 },
    { name: 'Reality Amulet', effect: '+400 Max Mana', stat: 'maxMana', value: 400, minLevel: 20 },
    { name: 'Worldbreaker Amulet', effect: '+75 Attack', stat: 'attack', value: 75, minLevel: 20 },
    { name: 'Genesis Amulet', effect: '+500 Max Health', stat: 'maxHealth', value: 500, minLevel: 30 },
    { name: 'Oblivion Amulet', effect: '+800 Max Mana', stat: 'maxMana', value: 800, minLevel: 30 },
    { name: 'God Slayer Amulet', effect: '+150 Attack', stat: 'attack', value: 150, minLevel: 30 }
];

// Rings - can equip up to 10
const rings = [
    { name: 'Ring of Vitality', effect: '+10 Max Health', stat: 'maxHealth', value: 10 },
    { name: 'Ring of Minor Mana', effect: '+40 Max Mana', stat: 'maxMana', value: 10 },
    { name: 'Ring of Protection', effect: '+50 Max Health', stat: 'maxHealth', value: 5 },
    { name: 'Ring of Strength', effect: '+4 Attack Damage', stat: 'attack', value: 2 },
    { name: 'Ring of Wisdom', effect: '+8 Max Mana', stat: 'maxMana', value: 5 },
    { name: 'Ring of the Titan', effect: '+20 Max Health', stat: 'maxHealth', value: 20 },
    { name: 'Ring of Arcane Power', effect: '+15 Max Mana', stat: 'maxMana', value: 15 },
    { name: 'Ring of the Berserker', effect: '+6 Attack Damage', stat: 'attack', value: 4 },
    { name: 'Ring of Regeneration', effect: 'Restore 50 health per turn in combat', stat: 'regen', value: 50 },
    { name: 'Ancient Ring', effect: '+75 Max Health', stat: 'maxHealth', value: 75, minLevel: 10 },
    { name: 'Cosmic Ring', effect: '+150 Max Mana', stat: 'maxMana', value: 150, minLevel: 10 },
    { name: 'Ring of Devastation', effect: '+20 Attack Damage', stat: 'attack', value: 20, minLevel: 10 },
    { name: 'Titan Ring', effect: '+200 Max Health', stat: 'maxHealth', value: 200, minLevel: 20 },
    { name: 'Reality Ring', effect: '+300 Max Mana', stat: 'maxMana', value: 300, minLevel: 20 },
    { name: 'Worldbreaker Ring', effect: '+50 Attack Damage', stat: 'attack', value: 50, minLevel: 20 },
    { name: 'Genesis Ring', effect: '+400 Max Health', stat: 'maxHealth', value: 400, minLevel: 30 },
    { name: 'Oblivion Ring', effect: '+600 Max Mana', stat: 'maxMana', value: 600, minLevel: 30 },
    { name: 'God Ring', effect: '+100 Attack Damage', stat: 'attack', value: 100, minLevel: 30 }
];
