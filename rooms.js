// Echo Dungeon V11 - Room Types
// Descriptions and properties for each type of dungeon room

const roomTypes = {
    entrance: { 
        descriptions: [
            'the grand entrance hall. Torches flicker on ancient stone walls.',
            'the entrance chamber. A faded tapestry hangs on the north wall.',
            'the starting hall. Cobwebs drape from vaulted ceilings above.'
        ], 
        hasEnemy: false 
    },
    empty: { 
        descriptions: [
            'an abandoned barracks. Rusty weapons litter the floor.',
            'a collapsed library. Torn pages scatter at your feet.',
            'a crumbling shrine. A broken altar stands in the center.',
            'a forgotten armory. Empty weapon racks line the walls.',
            'a dusty workshop. Ancient tools hang from hooks.',
            'a meditation chamber. Stone benches circle a dry fountain.',
            'an old prison cell. Iron bars have rusted through.',
            'a guard post. A skeleton sits slumped in a chair.'
        ], 
        hasEnemy: false 
    },
    treasure: { 
        descriptions: [
            'a glittering treasure vault. Gold coins reflect torchlight.',
            'a dragon\'s hoard chamber. Piles of jewels gleam in the darkness.',
            'a royal treasury. Ancient chests overflow with riches.',
            'a pirate\'s cache. Stolen goods fill every corner.',
            'a wizard\'s vault. Magical artifacts pulse with energy.'
        ], 
        hasEnemy: false 
    },
    enemy: { 
        descriptions: [
            'a dark chamber. You sense hostile eyes watching you.',
            'a blood-stained arena. Old battle scars mark the floor.',
            'a shadowy lair. Something growls in the darkness.',
            'a monster\'s den. Bones crunch beneath your feet.',
            'a cursed chamber. An evil presence fills the air.'
        ], 
        hasEnemy: true 
    },
    boss: { 
        descriptions: [
            'the throne room of darkness. A massive beast awaits on a stone throne.',
            'the dragon\'s lair. Heat radiates from the enormous creature before you.',
            'the demon king\'s chamber. Dark energy swirls around your foe.'
        ], 
        hasEnemy: true 
    },
    trap: { 
        descriptions: [
            'a trapped corridor. Pressure plates cover the floor.',
            'a spike-filled chamber. Deadly traps line the walls.',
            'a poison gas room. Strange vapors seep from cracks.'
        ], 
        hasEnemy: false 
    },
    stairs: { 
        descriptions: [
            'a spiral stairwell. Dark stone steps descend into deeper darkness.',
            'a grand staircase. Ancient carvings decorate the descent.',
            'a hidden passage. Secret stairs lead to the next level.'
        ], 
        hasEnemy: false 
    },
    fountain: {
        descriptions: [
            'a magical fountain room. Crystal clear water bubbles from an enchanted spring.',
            'an ancient healing shrine. A mystical fountain glows with restorative power.'
        ],
        hasEnemy: false
    },
    crypt: {
        descriptions: [
            'a dusty crypt. Stone sarcophagi line the walls.',
            'an ancient burial chamber. Skeletal remains rest in alcoves.',
            'a forgotten tomb. Hieroglyphs cover every surface.'
        ],
        hasEnemy: false
    },
    merchant: {
        descriptions: [
            'a merchant\'s tent. A hooded figure tends to various wares.',
            'a traveling shop. Mysterious goods line makeshift shelves.'
        ],
        hasEnemy: false
    }
};

// Get a random description for a room type
function getRandomDescription(roomType) {
    const descriptions = roomTypes[roomType].descriptions;
    return descriptions[Math.floor(Math.random() * descriptions.length)];
}
