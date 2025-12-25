// Echo Dungeon V11 - Items Data
// Treasures, potions, and merchant inventory

const treasures = [
    { name: 'Sapphire Gem', value: 50 },
    { name: 'Ruby Gem', value: 75 },
    { name: 'Diamond', value: 100 },
    { name: 'Emerald', value: 60 },
    { name: 'Ancient Coin Collection', value: 40 },
    { name: 'Golden Chalice', value: 80 },
    { name: 'Silver Crown', value: 90 },
    { name: 'Enchanted Amulet', value: 120 }
];

const merchantItems = [
    // Basic potions
    { name: 'Large Health Potion', type: 'potion', price: 50, healing: 50 },
    { name: 'Large Mana Potion', type: 'potion', price: 40, mana: 30 },
    
    // Greater potions
    { name: 'Greater Health Potion', type: 'potion', price: 100, healing: 100 },
    { name: 'Greater Mana Potion', type: 'potion', price: 80, mana: 75 },
    
    // Supreme potions (Level 10+)
    { name: 'Supreme Health Potion', type: 'potion', price: 300, healing: 300, minLevel: 10 },
    { name: 'Supreme Mana Potion', type: 'potion', price: 250, mana: 200, minLevel: 10 },
    
    // Ultimate potions (Level 20+)
    { name: 'Ultimate Health Potion', type: 'potion', price: 800, healing: 800, minLevel: 20 },
    { name: 'Ultimate Mana Potion', type: 'potion', price: 700, mana: 500, minLevel: 20 },
    
    // Godly elixirs (Level 30+)
    { name: 'Godly Health Elixir', type: 'potion', price: 2000, healing: 2000, minLevel: 30 },
    { name: 'Godly Mana Elixir', type: 'potion', price: 1800, mana: 1500, minLevel: 30 },
    
    // Special potions
    { name: 'Elixir of Immortality', type: 'special_potion', price: 400, effect: 'revive', description: 'Auto-revive on death with 50% health' },
    { name: 'Potion of Giant Strength', type: 'special_potion', price: 300, effect: 'strength', duration: 3, description: 'Double attack damage for 3 battles' },
    { name: 'Elixir of Clarity', type: 'special_potion', price: 350, effect: 'clarity', description: 'All spells cost 50% less mana for 3 battles' },
    
    // Warrior weapons
    { name: 'Legendary Warhammer', type: 'weapon', price: 3500, attack: 65, class: 'warrior', description: 'Crushes all opposition' },
    
    // Mage weapons
    { name: 'Staff of Ultimate Power', type: 'weapon', price: 4000, attack: 40, mana: 100, class: 'mage', description: 'Limitless arcane potential' },
    
    // Rogue weapons
    { name: 'Blades of the Phantom King', type: 'weapon', price: 3800, attack: 55, class: 'rogue', description: 'Strike from any shadow' },
    
    // Armor
    { name: 'Fortress Armor', type: 'armor', price: 4500, defense: 80, class: 'warrior', description: 'Impenetrable defense' },
    { name: 'Robes of Ultimate Magic', type: 'armor', price: 5000, defense: 60, mana: 120, class: 'mage', description: 'Channel infinite power' },
    { name: 'Suit of the Shadow Emperor', type: 'armor', price: 4800, defense: 70, class: 'rogue', description: 'One with darkness' },
    
    // High-level items (Level 10+)
    { name: 'Shield of the Immortal', type: 'shield', price: 5500, defense: 90, class: 'warrior', description: 'Nothing can harm you', minLevel: 10 },
    { name: 'Crown of Absolute Power', type: 'helmet', price: 6000, defense: 100, mana: 150, description: 'Ultimate authority', minLevel: 10 },
    { name: 'Gauntlets of the God Slayer', type: 'gloves', price: 5500, attack: 100, mana: 100, description: 'Destroy the divine', minLevel: 10 },
    { name: 'Boots of Infinity', type: 'boots', price: 5000, defense: 80, mana: 120, health: 150, description: 'Walk forever', minLevel: 10 },
    { name: 'Bracelet of the Cosmos', type: 'bracelet', price: 8000, attack: 80, mana: 200, description: 'Harness cosmic power', minLevel: 10 },
    
    // Endgame items (Level 20+)
    { name: 'Bracelet of Annihilation', type: 'bracelet', price: 15000, attack: 150, mana: 350, description: 'Destroy all creation', minLevel: 20 }
];

// Potion types for easy lookup
const potionTypes = [
    'Large Health Potion', 'Greater Health Potion', 'Supreme Health Potion', 'Ultimate Health Potion', 'Godly Health Elixir',
    'Large Mana Potion', 'Greater Mana Potion', 'Supreme Mana Potion', 'Ultimate Mana Potion', 'Godly Mana Elixir',
    'Elixir of Immortality', 'Potion of Giant Strength', 'Elixir of Clarity'
];
