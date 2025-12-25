// Echo Dungeon V11 - Game State
// Central state management for the entire game

const game = {
    player: {
        class: '',
        level: 1,
        experience: 0,
        experienceToNext: 100,
        health: 100,
        maxHealth: 100,
        mana: 50,
        maxMana: 50,
        gold: 25,
        inventory: [],
        equippedRings: [],
        equippedBracelets: [],
        learnedAbilities: [],
        equippedAmulet: '',
        equippedShoulderItem: '',
        position: { x: 6, y: 6 },
        baseAttack: 15,
        defense: 0,
        weapon: '',
        armor: '',
        shield: '',
        helmet: '',
        gloves: '',
        boots: '',
        specialItems: [],
        activeEffects: [],
        junkBag: []
    },
    dungeon: {
        grid: {},
        size: 12,
        secretRoom: null,
        hasSecretRoom: false,
        currentLevel: 1 
    },
    currentRoom: null,
    combat: null,
    listening: false,
    started: false,
    needsClass: true,
    initialized: false,
    phase: 'init',
    merchantOpen: false,
    inspectMode: false,
    inspectItem: null
};

// Browser support detection
let browserSupport = {
    speechSynthesis: false,
    speechRecognition: false,
    https: false
};

function checkBrowserSupport() {
    browserSupport.https = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    browserSupport.speechSynthesis = !!(window.speechSynthesis && window.SpeechSynthesisUtterance);
    browserSupport.speechRecognition = !!(window.webkitSpeechRecognition || window.SpeechRecognition);
}

// Utility functions for scaling
function getScalingMultiplier(dungeonLevel) {
    return Math.pow(2, Math.floor(dungeonLevel / 10));
}

function getScaledAbilityDamage(baseDamage, dungeonLevel) {
    return Math.floor(baseDamage * getScalingMultiplier(dungeonLevel));
}

function getScaledAbilityCost(baseCost, dungeonLevel) {
    return Math.floor(baseCost * getScalingMultiplier(dungeonLevel));
}
