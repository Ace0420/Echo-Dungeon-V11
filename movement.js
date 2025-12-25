// Echo Dungeon V11 - Movement Commands
// Directional movement and room navigation

function move(direction) {
    const { x, y } = game.player.position;
    let newX = x, newY = y;
    
    if (direction === 'north') newY--;
    else if (direction === 'south') newY++;
    else if (direction === 'east') newX++;
    else if (direction === 'west') newX--;
    
    if (newX < 0 || newX >= game.dungeon.size || newY < 0 || newY >= game.dungeon.size) {
        speak('You cannot go that way. A solid wall blocks your path.');
        return;
    }
    
    game.player.position = { x: newX, y: newY };
    const key = `${newX},${newY}`;
    game.currentRoom = game.dungeon.grid[key];
    
    // Handle trap damage
    if (game.currentRoom.type === 'trap') {
        if (!game.currentRoom.visited) {
            const trapDamage = 15 + (game.dungeon.currentLevel * 5);
            game.player.health -= trapDamage;
            speak(`A trap springs! You take ${trapDamage} damage! Health: ${game.player.health}.`);
            if (game.player.health <= 0) {
                setTimeout(() => gameOver(), 1000);
                return;
            }
        }
    }

    game.currentRoom.visited = true;
    describeRoom();
}

function useStairs() {
    if (game.currentRoom.type !== 'stairs') {
        speak('There are no stairs here.');
        return;
    }
    
    // Check if boss is defeated
    const bossKey = `${game.dungeon.size - 1},${game.dungeon.size - 1}`;
    const bossRoom = game.dungeon.grid[bossKey];
    if (bossRoom.enemy && bossRoom.enemy.health > 0) {
        speak('You must defeat the boss in the boss room first.');
        return;
    }
    
    game.dungeon.currentLevel++;
    generateDungeon(); 

    speak(`You descend to Dungeon Level ${game.dungeon.currentLevel}. The air grows colder and more dangerous.`, () => {
        describeRoom();
    });
}

function useFountain() {
    if (game.currentRoom.type !== 'fountain') {
        speak('There is no fountain here.');
        return;
    }
    if (game.currentRoom.fountainUsed) {
        speak('The fountain has run dry. Its magic is spent.');
        return;
    }
    
    game.currentRoom.fountainUsed = true;
    game.player.health = game.player.maxHealth;
    game.player.mana = game.player.maxMana;
    
    speak('You drink from the magical fountain. You are fully healed and restored!');
}
