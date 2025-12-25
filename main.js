// Echo Dungeon V11 - Main Entry Point
// Initialization and command processing

function initializeGame() {
    game.initialized = true;
    micButton.classList.remove('start-button');
    speak("Welcome to Echo Dungeon V11! Say 'load game' and provide your save PIN, or choose your class: warrior, mage, or rogue."); 
}

function handleClick() {
    if (!game.initialized) {
        initializeGame();
    } else {
        startListening();
    }
}

function processCommand(command) {
    // Info commands available anytime
    if (command.includes('readme') || command.includes('read me') || command.includes('instructions') || command.includes('tips')) {
        showReadme();
        return;
    }

    if (command.includes('license') || command.includes('about')) {
        showLicense();
        return;
    }

    // Save/Load commands
    if (command.includes('save game') || command.includes('save')) { 
        saveGame(); 
        return; 
    }
    
    if (command.includes('load game') || command.includes('load')) {
        speak('Please say your save PIN after the word "code".');
        game.phase = 'loading';
        return;
    }
    
    if (command.includes('code ') && game.phase === 'loading') {
        const pin = command.split('code ')[1].trim().replace(/\s/g, '');
        loadGame(pin);
        return;
    }

    // Inspect mode handling
    if (game.inspectMode) {
        if (command.includes('equip')) {
            equipInspectedItem();
        } else if (command.includes('junk')) {
            junkInspectedItem();
        } else if (command.includes('keep')) {
            keepInspectedItem();
        } else {
            speak('Say equip, junk, or keep.');
        }
        return;
    }

    // Merchant mode handling
    if (game.merchantOpen) {
        if (command.includes('leave') || command.includes('exit') || command.includes('close')) {
            game.merchantOpen = false;
            speak('You leave the merchant.');
        } else if (command.includes('buy') || command.includes('purchase')) {
            buyFromMerchant(command);
        } else if (command.includes('sell junk') || command.includes('sell all junk')) {
            sellAllJunk();
        } else if (command.includes('what') || command.includes('wares') || command.includes('stock')) {
            listMerchantWares();
        } else {
            speak('Say buy, sell junk, what do you have, or leave.');
        }
        return;
    }

    // Class selection
    if (game.needsClass) {
        if (command.includes('warrior') || command.includes('fighter')) selectClass('warrior');
        else if (command.includes('mage') || command.includes('wizard')) selectClass('mage'); 
        else if (command.includes('rogue') || command.includes('thief')) selectClass('rogue');
        else speak('Please say warrior, mage, or rogue.');
        return;
    }

    // Combat commands
    if (game.combat) {
        if (command.includes('attack') || command.includes('fight') || command.includes('hit') || command.includes('strike')) playerAttack();
        else if (command.includes('defend') || command.includes('block') || command.includes('guard')) playerDefend();
        else if (command.includes('special') || command.includes('ability')) playerSpecial();
        else if (command.includes('cast') || command.includes('spell')) castSpell(command);
        else if (command.includes('potion') || command.includes('use') || command.includes('drink') || command.includes('heal')) processPotionCommand(command); 
        else if (command.includes('flee') || command.includes('run') || command.includes('escape')) attemptFlee();
        else speak('Say attack, defend, special, cast spell, use potion, or flee.');
        return;
    }

    // Exploration commands
    if (command.includes('status') || command.includes('stats') || command.includes('check')) characterStatus();
    else if (command.includes('inventory') || command.includes('items') || command.includes('bag')) listInventory();
    else if (command.includes('commands') || command.includes('what can i')) listCommands();
    else if (command.includes('hint') || command.includes('help me')) giveHint();
    else if (command.includes('inspect')) inspectItem(command);
    else if (command.includes('remove ring') || command.includes('unequip ring')) removeRing(command);
    else if (command.includes('remove bracelet') || command.includes('unequip bracelet')) removeBracelet(command);
    else if (command.includes('potion') || command.includes('use') || command.includes('drink') || command.includes('heal')) processPotionCommand(command); 
    else if (command.includes('north') || command.includes('forward')) move('north');
    else if (command.includes('south') || command.includes('back')) move('south');
    else if (command.includes('east') || command.includes('right')) move('east');
    else if (command.includes('west') || command.includes('left')) move('west');
    else if (command.includes('meditate') || command.includes('rest')) meditate(); 
    else if (command.includes('look') || command.includes('around') || command.includes('where')) describeRoom();
    else if (command.includes('search') || command.includes('examine')) searchRoom();
    else if (command.includes('open chest') || command.includes('chest') || command.includes('loot')) openChest();
    else if (command.includes('fountain') || command.includes('drink water')) useFountain();
    else if (command.includes('stairs') || command.includes('go down') || command.includes('descend')) useStairs();
    else if (command.includes('merchant') || command.includes('shop') || command.includes('trade')) talkToMerchant();
    else if (command.includes('wear ring') || command.includes('equip ring') || command.includes('put on ring')) equipRing(command);
    else if (command.includes('equip amulet') || command.includes('wear amulet')) equipAmulet(command);
    else if (command.includes('equip bracelet') || command.includes('wear bracelet')) equipBracelet(command);
    else if (command.includes('equip shoulder') || command.includes('wear shoulder')) equipShoulderItem(command);
    else if (command.includes('equip') || command.includes('wear')) equipItem(command);
    else if (command.includes('read book') || command.includes('read') || command.includes('learn')) readBook(command);
    else if (command.includes('unlearn') || command.includes('forget')) unlearnAbility(command);
    else if (command.includes('use lockpicks') || command.includes('lockpick')) useLockpicks();
    else if (command.includes('help')) showHelp();
    else if (command.includes('junk') && (command.includes('add') || command.includes('mark'))) addToJunk(command);
    else if (command.includes('junk') && (command.includes('remove') || command.includes('unmark'))) removeFromJunk(command);
    else if (command.includes('view junk') || command.includes('check junk') || command.includes('list junk')) viewJunk();
    else speak('Unknown command. Say help for options.');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkBrowserSupport();
    setTimeout(() => {
        speak('Echo Dungeon V11 is ready. Tap the screen to begin.');
    }, 1000);
});

// Prevent context menu on mobile
micButton.addEventListener('contextmenu', (e) => e.preventDefault());
