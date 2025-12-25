// Echo Dungeon V11 - Dungeon Generation
// Procedural dungeon creation and room management

function generateDungeon() {
    const size = game.dungeon.size;
    const currentLevel = game.dungeon.currentLevel;
    game.dungeon.grid = {};
    
    const centerX = 6; 
    const centerY = 6;
    
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            const key = `${x},${y}`;
            const distanceX = Math.abs(x - centerX);
            const distanceY = Math.abs(y - centerY);
            const distanceFromCenter = distanceX + distanceY;
            
            let roomData = { visited: false, searched: false, hasChest: false, fountainUsed: false };

            if (x === centerX && y === centerY) {
                // Entrance at center
                game.dungeon.grid[key] = { 
                    type: 'entrance', 
                    description: getRandomDescription('entrance'),
                    ...roomData
                };
            } else if (x === size - 1 && y === size - 1) { 
                // Boss room at far corner
                let bossEnemy = null;
                
                if (currentLevel >= 30) {
                    bossEnemy = scaleEnemyForLevel(enemies.genesisLord, currentLevel);
                } else if (currentLevel >= 20) {
                    bossEnemy = scaleEnemyForLevel(enemies.apocalypseTitan, currentLevel);
                } else if (currentLevel >= 10) {
                    bossEnemy = scaleEnemyForLevel(enemies.voidEmperor, currentLevel);
                } else {
                    bossEnemy = scaleEnemyForLevel(enemies.dragon, currentLevel);
                }
                
                game.dungeon.grid[key] = {
                    type: 'boss',
                    description: getRandomDescription('boss'),
                    ...roomData,
                    hasChest: true,
                    enemy: bossEnemy
                };
            } else if (x === size - 1 && y === size - 2) { 
                // Stairs near boss
                game.dungeon.grid[key] = { 
                    type: 'stairs', 
                    description: getRandomDescription('stairs'),
                    ...roomData 
                };
            } else {
                // Generate other rooms based on distance from center
                generateRoom(key, distanceFromCenter, currentLevel, roomData);
            }
        }
    }
    
    // Chance for secret room
    if (Math.random() < 0.3) {
        game.dungeon.hasSecretRoom = true;
    }
    
    // Set player position
    game.player.position = { x: 6, y: 6 };
    const startKey = `${game.player.position.x},${game.player.position.y}`;
    game.currentRoom = game.dungeon.grid[startKey];
}

function generateRoom(key, distanceFromCenter, currentLevel, roomData) {
    // 10% chance for merchant room
    if (Math.random() < 0.1) {
        game.dungeon.grid[key] = {
            type: 'merchant',
            description: getRandomDescription('merchant'),
            ...roomData
        };
        return;
    }
    
    const roll = Math.random();
    const isElite = currentLevel >= 2 && Math.random() < 0.15;
    let roomType = null;
    let enemyType = null;
    
    // Far from center - harder content
    if (distanceFromCenter >= 7) {
        if (roll < 0.5) {
            roomType = 'enemy';
            enemyType = selectEnemyType(currentLevel, isElite, 'far');
        } else if (roll < 0.7) {
            roomType = 'treasure';
            roomData.hasChest = true;
        } else if (roll < 0.8) {
            roomType = 'fountain';
        } else {
            roomType = 'crypt';
            roomData.hasChest = Math.random() < 0.3;
        }
    }
    // Medium distance
    else if (distanceFromCenter >= 4) {
        if (roll < 0.45) {
            roomType = 'enemy';
            enemyType = selectEnemyType(currentLevel, isElite, 'mid');
        } else if (roll < 0.65) {
            roomType = 'treasure';
            roomData.hasChest = true;
        } else if (roll < 0.75) {
            roomType = 'trap';
        } else if (roll < 0.8) {
            roomType = 'fountain';
        } else {
            roomType = 'empty';
            roomData.hasChest = Math.random() < 0.2;
        }
    }
    // Near center - easier content
    else {
        if (roll < 0.35) {
            roomType = 'enemy';
            enemyType = selectEnemyType(currentLevel, isElite, 'near');
        } else if (roll < 0.55) {
            roomType = 'treasure';
            roomData.hasChest = true;
        } else if (roll < 0.6) {
            roomType = 'fountain';
        } else {
            roomType = 'empty';
            roomData.hasChest = Math.random() < 0.15;
        }
    }
    
    // Create the room
    if (roomType === 'enemy') {
        const scaledEnemy = scaleEnemyForLevel(enemies[enemyType], currentLevel);
        
        // Chance for double enemy encounter at higher levels
        if (currentLevel >= 3 && Math.random() < 0.2) {
            game.dungeon.grid[key] = {
                type: 'enemy',
                description: getRandomDescription('enemy') + ' Two creatures lurk here!',
                ...roomData,
                enemy: scaledEnemy,
                secondEnemy: scaleEnemyForLevel(enemies[enemyType], currentLevel)
            };
        } else {
            game.dungeon.grid[key] = {
                type: 'enemy',
                description: getRandomDescription('enemy'),
                ...roomData,
                enemy: scaledEnemy
            };
        }
    } else {
        game.dungeon.grid[key] = {
            type: roomType,
            description: getRandomDescription(roomType),
            ...roomData
        };
    }
}

function selectEnemyType(level, isElite, distance) {
    // Far from center - strongest enemies
    if (distance === 'far') {
        if (level >= 30) {
            return Math.random() < 0.4 ? 'genesisLord' : (Math.random() < 0.5 ? 'realityBender' : 'worldEater');
        } else if (level >= 20) {
            return Math.random() < 0.4 ? 'harbingerOfRagnarok' : (Math.random() < 0.5 ? 'voidBeast' : 'titanLord');
        } else if (level >= 10) {
            return isElite ? 'demonLord' : (Math.random() < 0.5 ? 'ancientDragon' : 'voidBeast');
        } else if (level >= 5) {
            return isElite ? 'archDemon' : (Math.random() < 0.5 ? 'demon' : 'vampire');
        } else if (isElite) {
            return level >= 3 ? 'archDemon' : 'elderTroll';
        } else {
            return Math.random() < 0.5 ? 'troll' : 'wraith';
        }
    }
    // Medium distance
    else if (distance === 'mid') {
        if (level >= 30) {
            return isElite ? 'realityBender' : (Math.random() < 0.5 ? 'harbingerOfRagnarok' : 'apocalypseTitan');
        } else if (level >= 20) {
            return isElite ? 'voidBeast' : (Math.random() < 0.5 ? 'demonLord' : 'ancientDragon');
        } else if (level >= 10) {
            return isElite ? 'ancientDragon' : (Math.random() < 0.5 ? 'demonLord' : 'lichKing');
        } else if (level >= 5) {
            return isElite ? 'elderTroll' : (Math.random() < 0.5 ? 'wraith' : 'troll');
        } else if (isElite) {
            return level >= 2 ? 'ancientWraith' : 'orcChieftain';
        } else {
            return Math.random() < 0.6 ? 'orc' : 'skeleton';
        }
    }
    // Near center - easiest enemies
    else {
        if (isElite) {
            return 'orcChieftain';
        } else if (level >= 2) {
            return Math.random() < 0.5 ? 'orc' : 'skeleton';
        } else {
            return 'goblin';
        }
    }
}

function describeRoom() {
    const room = game.currentRoom;
    const messages = [`You are on Level ${game.dungeon.currentLevel} in ${room.description}`];
    
    if (room.type === 'stairs') {
        messages.push('Dark stairs descend deeper. Say "go down stairs" to descend.');
    } else if (room.type === 'merchant') {
        messages.push('A traveling merchant is here. Say "merchant" to trade.');
    } else if (room.type === 'fountain' && !room.fountainUsed) {
        messages.push('A magical fountain bubbles here. Say "drink fountain" to be healed.');
    } else if (room.enemy && room.enemy.health > 0) {
        if (room.secondEnemy && room.secondEnemy.health > 0) {
            messages.push(`A ${room.enemy.name} and a ${room.secondEnemy.name} block your path!`);
        } else {
            messages.push(`A ${room.enemy.name} blocks your path!`);
        }
        speakSequence(messages, () => {
            setTimeout(() => startCombat(room.enemy, room.secondEnemy), 1000);
        });
        return;
    } else {
        if (room.hasChest && !room.searched) {
            messages.push('A treasure chest glimmers in the shadows. Say "open chest" to loot it.');
        }
        if (!room.searched && room.type !== 'stairs') {
            messages.push('You could search this room.');
        }
    }
    
    messages.push('Which direction will you go?');
    speakSequence(messages);
}
