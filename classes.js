// Echo Dungeon V11 - Player Classes
// Each class has unique starting stats, items, and special abilities

const classes = {
    warrior: {
        name: 'Warrior',
        health: 120,
        maxHealth: 120,
        mana: 30,
        maxMana: 30,
        gold: 50,
        items: ['Steel Sword', 'Large Health Potion', 'Large Health Potion', 'Chainmail', 'Iron Shield'],
        special: { name: 'Power Strike', damage: 100, cost: 15, type: 'damage' }
    },
    mage: { 
        name: 'Mage',
        health: 80,
        maxHealth: 80,
        mana: 100,
        maxMana: 100,
        gold: 75,
        items: ['Mystic Staff', 'Large Mana Potion', 'Large Health Potion', 'Enchanted Robes'],
        special: { name: 'Fireball', damage: 100, cost: 20, type: 'damage' } 
    },
    rogue: {
        name: 'Rogue',
        health: 100,
        maxHealth: 100,
        mana: 60,
        maxMana: 60,
        gold: 100,
        items: ['Shadow Daggers', 'Lockpicks', 'Large Health Potion', 'Shadow Leather'],
        special: { name: 'Backstab', damage: 75, cost: 15, type: 'damage' }
    }
};
