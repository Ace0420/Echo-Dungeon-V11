// Echo Dungeon V11 - Save/Load System
// Save and load game progress using localStorage with PIN codes

function saveGame() {
    const saveData = {
        player: game.player,
        dungeon: {
            grid: game.dungeon.grid,
            currentLevel: game.dungeon.currentLevel,
            size: game.dungeon.size,
            hasSecretRoom: game.dungeon.hasSecretRoom
        }
    };
    
    const saveStr = JSON.stringify(saveData);
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    localStorage.setItem(`echoDungeon_${pin}`, saveStr);
    
    const spokenPin = pin.split('').join(' ');
    speak(`Game saved! Your save PIN is ${spokenPin}. Say "load game" then "code ${spokenPin}" to load.`);
}

function loadGame(pin) {
    try {
        const saveStr = localStorage.getItem(`echoDungeon_${pin}`);
        
        if (!saveStr) {
            speak(`No game found for PIN ${pin.split('').join(' ')}. Try another PIN or start a new game.`);
            return;
        }
        
        const saveData = JSON.parse(saveStr);
        
        // Restore player state
        game.player = saveData.player;
        
        // Restore dungeon state
        game.dungeon.grid = saveData.dungeon.grid;
        game.dungeon.currentLevel = saveData.dungeon.currentLevel;
        game.dungeon.size = saveData.dungeon.size;
        game.dungeon.hasSecretRoom = saveData.dungeon.hasSecretRoom;
        
        // Set current room
        const key = `${game.player.position.x},${game.player.position.y}`;
        game.currentRoom = game.dungeon.grid[key];
        
        // Update game state flags
        game.initialized = true;
        game.started = true;
        game.needsClass = false;
        game.phase = 'exploration';
        micButton.classList.remove('start-button');
        
        speak(`Game loaded! You are a level ${game.player.level} ${classes[game.player.class].name} on Dungeon Level ${game.dungeon.currentLevel}.`, () => {
            describeRoom();
        });
        
    } catch (e) {
        speak('Error loading game. The PIN may be incorrect.');
    }
}
