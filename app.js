// Dungeon Crawler Game - Fixed JavaScript
class DungeonCrawler {
    constructor() {
        this.gameData = {
            "party_system": {
                "max_party_size": 5,
                "character_classes": [
                    {"name": "Fighter", "description": "Melee combat specialist with high HP and defense", "base_stats": {"hp": 100, "mp": 20, "str": 15, "def": 12, "agi": 8, "luc": 5}},
                    {"name": "Mage", "description": "Magic user with powerful spells but low defense", "base_stats": {"hp": 60, "mp": 80, "str": 6, "def": 5, "agi": 10, "luc": 12}},
                    {"name": "Cleric", "description": "Healer and support specialist", "base_stats": {"hp": 80, "mp": 60, "str": 8, "def": 8, "agi": 9, "luc": 10}},
                    {"name": "Rogue", "description": "Fast attacker with high critical hit chance", "base_stats": {"hp": 70, "mp": 40, "str": 12, "def": 7, "agi": 16, "luc": 15}},
                    {"name": "Archer", "description": "Ranged attacker effective from back row", "base_stats": {"hp": 75, "mp": 30, "str": 11, "def": 6, "agi": 14, "luc": 8}}
                ]
            }
        };
        
        this.party = [];
        this.currentSlot = -1;
        this.gameState = 'party-creation';
        
        // Dungeon system
        this.currentFloor = 1;
        this.playerPosition = { x: 1, y: 1 };
        this.playerFacing = 0; // 0=North, 1=East, 2=South, 3=West
        this.exploredMap = new Set();
        this.stepCount = 0;
        
        // Combat system
        this.inCombat = false;
        this.currentEnemy = null;
        this.combatTurnOrder = [];
        this.currentTurn = 0;
        this.combatLog = [];
        
        // Sample dungeon layout (20x20)
        this.dungeonMap = [
            "####################",
            "#..................#",
            "#.####.......####..#",
            "#.#..#.......#..#..#",
            "#.#..+.......+..#..#",
            "#.####.......####..#",
            "#..................#",
            "#.......<..........#",
            "#..................#",
            "#.####.......####..#",
            "#.#..#.......#..#..#",
            "#.#..+.......+..#..#",
            "#.####.......####..#",
            "#..................#",
            "#..................#",
            "#.####.......####..#",
            "#.#$##.......##$#..#",
            "#..................#",
            "#.........>........#",
            "####################"
        ];
        
        this.enemies = [
            {"name": "Goblin", "level": 1, "hp": 25, "maxHp": 25, "exp": 15, "str": 8, "def": 4, "agi": 12},
            {"name": "Skeleton", "level": 2, "hp": 35, "maxHp": 35, "exp": 25, "str": 10, "def": 8, "agi": 6},
            {"name": "Orc", "level": 3, "hp": 50, "maxHp": 50, "exp": 40, "str": 15, "def": 10, "agi": 8}
        ];
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.addExploredTile(1, 1); // Starting position
        // Wait for DOM to be fully ready
        setTimeout(() => {
            this.setupEventListeners();
            this.showScreen('party-creation');
        }, 100);
    }
    
    setupEventListeners() {
        // Party creation - direct button listeners
        const createButtons = document.querySelectorAll('.create-character-btn');
        createButtons.forEach((btn, index) => {
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const slot = parseInt(btn.closest('.party-slot').dataset.slot);
                this.openCharacterCreation(slot);
            };
        });
        
        // Start Adventure button
        const startBtn = document.getElementById('start-adventure');
        if (startBtn) {
            startBtn.onclick = (e) => {
                e.preventDefault();
                this.startAdventure();
            };
        }
        
        // Modal form elements
        const nameInput = document.getElementById('character-name');
        const classSelect = document.getElementById('character-class');
        const createBtn = document.getElementById('create-character');
        const cancelBtn = document.getElementById('cancel-character');
        const closeBtn = document.querySelector('.modal-close');
        
        if (nameInput) {
            nameInput.oninput = () => {
                this.validateCharacterForm();
            };
        }
        
        if (classSelect) {
            classSelect.onchange = (e) => {
                this.showClassStats(e.target.value);
            };
        }
        
        if (createBtn) {
            createBtn.onclick = (e) => {
                e.preventDefault();
                this.createCharacter();
            };
        }
        
        if (cancelBtn) {
            cancelBtn.onclick = (e) => {
                e.preventDefault();
                this.closeCharacterModal();
            };
        }
        
        if (closeBtn) {
            closeBtn.onclick = (e) => {
                e.preventDefault();
                this.closeCharacterModal();
            };
        }
        
        // Movement controls
        const moveForwardBtn = document.getElementById('move-forward');
        const moveBackwardBtn = document.getElementById('move-backward');
        const turnLeftBtn = document.getElementById('turn-left');
        const turnRightBtn = document.getElementById('turn-right');
        const restBtn = document.getElementById('rest-party');
        
        if (moveForwardBtn) moveForwardBtn.onclick = () => this.moveForward();
        if (moveBackwardBtn) moveBackwardBtn.onclick = () => this.moveBackward();
        if (turnLeftBtn) turnLeftBtn.onclick = () => this.turnLeft();
        if (turnRightBtn) turnRightBtn.onclick = () => this.turnRight();
        if (restBtn) restBtn.onclick = () => this.restParty();
        
        // Keyboard controls
        document.onkeydown = (e) => {
            if (this.gameState === 'exploring') {
                this.handleKeyboard(e);
            }
        };
        
        // Combat actions
        const combatButtons = document.querySelectorAll('.combat-action-btn');
        combatButtons.forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                const action = e.target.dataset.action;
                this.handleCombatAction(action);
            };
        });
        
        // Messages
        const messageBtn = document.getElementById('message-ok');
        if (messageBtn) {
            messageBtn.onclick = () => this.hideMessage();
        }
    }
    
    // Party Creation Methods
    openCharacterCreation(slot) {
        this.currentSlot = slot;
        const modal = document.getElementById('character-modal');
        const nameInput = document.getElementById('character-name');
        const classSelect = document.getElementById('character-class');
        const statsDiv = document.getElementById('class-stats');
        
        if (modal && nameInput && classSelect && statsDiv) {
            // Reset form
            nameInput.value = '';
            classSelect.value = '';
            statsDiv.classList.add('hidden');
            
            // Show modal
            modal.classList.remove('hidden');
            
            // Focus on name input
            setTimeout(() => nameInput.focus(), 100);
            
            this.validateCharacterForm();
        }
    }
    
    closeCharacterModal() {
        const modal = document.getElementById('character-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.currentSlot = -1;
    }
    
    showClassStats(className) {
        const classData = this.gameData.party_system.character_classes.find(c => c.name === className);
        const statsContainer = document.getElementById('class-stats');
        
        if (classData && statsContainer) {
            const stats = classData.base_stats;
            
            // Update stat values
            const statElements = {
                'stat-hp': stats.hp,
                'stat-mp': stats.mp,
                'stat-str': stats.str,
                'stat-def': stats.def,
                'stat-agi': stats.agi,
                'stat-luc': stats.luc
            };
            
            for (const [id, value] of Object.entries(statElements)) {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = value;
                }
            }
            
            statsContainer.classList.remove('hidden');
        } else if (statsContainer) {
            statsContainer.classList.add('hidden');
        }
        
        this.validateCharacterForm();
    }
    
    validateCharacterForm() {
        const nameInput = document.getElementById('character-name');
        const classSelect = document.getElementById('character-class');
        const createBtn = document.getElementById('create-character');
        
        if (nameInput && classSelect && createBtn) {
            const name = nameInput.value.trim();
            const className = classSelect.value;
            const isValid = name.length > 0 && className.length > 0;
            createBtn.disabled = !isValid;
        }
    }
    
    createCharacter() {
        const nameInput = document.getElementById('character-name');
        const classSelect = document.getElementById('character-class');
        
        if (!nameInput || !classSelect) return;
        
        const name = nameInput.value.trim();
        const className = classSelect.value;
        const classData = this.gameData.party_system.character_classes.find(c => c.name === className);
        
        if (!name || !className || !classData) return;
        
        const character = {
            name: name,
            class: className,
            level: 1,
            exp: 0,
            hp: classData.base_stats.hp,
            maxHp: classData.base_stats.hp,
            mp: classData.base_stats.mp,
            maxMp: classData.base_stats.mp,
            str: classData.base_stats.str,
            def: classData.base_stats.def,
            agi: classData.base_stats.agi,
            luc: classData.base_stats.luc,
            alive: true
        };
        
        this.party[this.currentSlot] = character;
        this.updatePartySlot(this.currentSlot);
        this.closeCharacterModal();
        this.updateStartButton();
    }
    
    updatePartySlot(slot) {
        const slotElement = document.querySelector(`[data-slot="${slot}"]`);
        const character = this.party[slot];
        
        if (character && slotElement) {
            const slotContent = slotElement.querySelector('.slot-content');
            if (slotContent) {
                slotContent.innerHTML = `
                    <div class="filled">
                        <h4>${character.name}</h4>
                        <div class="character-class">${character.class}</div>
                        <div class="character-stats">
                            HP: ${character.hp}/${character.maxHp}<br>
                            MP: ${character.mp}/${character.maxMp}<br>
                            STR: ${character.str} DEF: ${character.def}<br>
                            AGI: ${character.agi} LUC: ${character.luc}
                        </div>
                    </div>
                `;
                slotContent.classList.remove('empty');
                slotContent.classList.add('filled');
            }
        }
    }
    
    updateStartButton() {
        const hasCharacters = this.party.filter(c => c).length > 0;
        const startBtn = document.getElementById('start-adventure');
        if (startBtn) {
            startBtn.disabled = !hasCharacters;
        }
    }
    
    startAdventure() {
        this.showScreen('game-screen');
        this.gameState = 'exploring';
        setTimeout(() => {
            this.initializeGame3D();
            this.updatePartyStatus();
            this.updateUI();
        }, 200);
    }
    
    // Screen Management
    showScreen(screenId) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.add('hidden');
            screen.classList.remove('active');
        });
        
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
            targetScreen.classList.add('active');
        }
    }
    
    // 3D Dungeon Rendering
    initializeGame3D() {
        this.canvas = document.getElementById('dungeon-canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.minimapCanvas = document.getElementById('minimap-canvas');
        this.minimapCtx = this.minimapCanvas ? this.minimapCanvas.getContext('2d') : null;
        
        if (this.ctx && this.minimapCtx) {
            this.render3D();
            this.renderMinimap();
        }
    }
    
    render3D() {
        if (!this.ctx) return;
        
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Clear canvas
        ctx.fillStyle = '#1f2121';
        ctx.fillRect(0, 0, width, height);
        
        // Draw simple first-person corridor view
        const ahead = this.getTileAhead();
        const left = this.getTileLeft();
        const right = this.getTileRight();
        
        // Draw perspective corridor
        if (ahead === '.') {
            // Floor ahead - draw corridor extending forward
            ctx.fillStyle = '#2d3748';
            ctx.fillRect(width * 0.3, height * 0.4, width * 0.4, height * 0.2);
            
            // Check tiles further ahead
            const far = this.getTileFarAhead();
            if (far === '.') {
                ctx.fillRect(width * 0.35, height * 0.45, width * 0.3, height * 0.1);
            } else {
                // Wall at distance
                ctx.fillStyle = '#4a5568';
                ctx.fillRect(width * 0.35, height * 0.3, width * 0.3, height * 0.4);
            }
        } else {
            // Wall directly ahead
            ctx.fillStyle = '#4a5568';
            ctx.fillRect(width * 0.2, height * 0.2, width * 0.6, height * 0.6);
            
            // Add wall details
            ctx.fillStyle = '#2d3748';
            ctx.fillRect(width * 0.25, height * 0.25, width * 0.1, height * 0.5);
            ctx.fillRect(width * 0.65, height * 0.25, width * 0.1, height * 0.5);
        }
        
        // Draw side walls
        if (left === '#') {
            ctx.fillStyle = '#374151';
            ctx.fillRect(0, height * 0.3, width * 0.3, height * 0.4);
        }
        
        if (right === '#') {
            ctx.fillStyle = '#374151';
            ctx.fillRect(width * 0.7, height * 0.3, width * 0.3, height * 0.4);
        }
        
        // Draw floor
        ctx.fillStyle = '#1a202c';
        ctx.fillRect(0, height * 0.7, width, height * 0.3);
        
        // Draw ceiling
        ctx.fillStyle = '#0d1117';
        ctx.fillRect(0, 0, width, height * 0.3);
        
        // Special tile indicators
        if (ahead === '<') {
            this.drawSpecialTile('Stairs Up', '#22d3ee');
        } else if (ahead === '>') {
            this.drawSpecialTile('Stairs Down', '#f59e0b');
        } else if (ahead === '$') {
            this.drawSpecialTile('Treasure', '#eab308');
        } else if (ahead === '+') {
            this.drawSpecialTile('Door', '#8b5cf6');
        }
    }
    
    drawSpecialTile(text, color) {
        if (!this.ctx) return;
        
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        ctx.fillStyle = color;
        ctx.fillRect(width * 0.35, height * 0.35, width * 0.3, width * 0.3);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(text, width * 0.5, height * 0.5);
    }
    
    // Tile checking methods
    getTileAhead() {
        const [dx, dy] = this.getDirectionVector();
        return this.getTile(this.playerPosition.x + dx, this.playerPosition.y + dy);
    }
    
    getTileFarAhead() {
        const [dx, dy] = this.getDirectionVector();
        return this.getTile(this.playerPosition.x + dx * 2, this.playerPosition.y + dy * 2);
    }
    
    getTileLeft() {
        const [dx, dy] = this.getDirectionVector();
        return this.getTile(this.playerPosition.x - dy, this.playerPosition.y + dx);
    }
    
    getTileRight() {
        const [dx, dy] = this.getDirectionVector();
        return this.getTile(this.playerPosition.x + dy, this.playerPosition.y - dx);
    }
    
    getTile(x, y) {
        if (y < 0 || y >= this.dungeonMap.length || x < 0 || x >= this.dungeonMap[0].length) {
            return '#';
        }
        return this.dungeonMap[y][x];
    }
    
    getDirectionVector() {
        const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // N, E, S, W
        return directions[this.playerFacing];
    }
    
    // Movement methods
    moveForward() {
        if (this.inCombat) return;
        
        const [dx, dy] = this.getDirectionVector();
        const newX = this.playerPosition.x + dx;
        const newY = this.playerPosition.y + dy;
        const tile = this.getTile(newX, newY);
        
        if (tile !== '#') {
            this.playerPosition.x = newX;
            this.playerPosition.y = newY;
            this.addExploredTile(newX, newY);
            this.stepCount++;
            
            // Handle special tiles
            if (tile === '<') {
                this.showMessage('You found stairs going up to the previous floor!');
            } else if (tile === '>') {
                this.showMessage('You found stairs going down to the next floor!');
            } else if (tile === '$') {
                this.showMessage('You found treasure!');
            } else if (tile === '+') {
                this.showMessage('You opened a door!');
            }
            
            // Random encounter check
            if (Math.random() < 0.15 && tile === '.') {
                setTimeout(() => this.triggerRandomEncounter(), 500);
            }
            
            this.updateUI();
        }
    }
    
    moveBackward() {
        if (this.inCombat) return;
        
        const [dx, dy] = this.getDirectionVector();
        const newX = this.playerPosition.x - dx;
        const newY = this.playerPosition.y - dy;
        const tile = this.getTile(newX, newY);
        
        if (tile !== '#') {
            this.playerPosition.x = newX;
            this.playerPosition.y = newY;
            this.addExploredTile(newX, newY);
            this.stepCount++;
            this.updateUI();
        }
    }
    
    turnLeft() {
        if (this.inCombat) return;
        this.playerFacing = (this.playerFacing + 3) % 4;
        this.updateUI();
    }
    
    turnRight() {
        if (this.inCombat) return;
        this.playerFacing = (this.playerFacing + 1) % 4;
        this.updateUI();
    }
    
    handleKeyboard(e) {
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                e.preventDefault();
                this.moveForward();
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                e.preventDefault();
                this.moveBackward();
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                e.preventDefault();
                this.turnLeft();
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                e.preventDefault();
                this.turnRight();
                break;
        }
    }
    
    // Minimap methods
    addExploredTile(x, y) {
        this.exploredMap.add(`${x},${y}`);
    }
    
    renderMinimap() {
        if (!this.minimapCtx) return;
        
        const ctx = this.minimapCtx;
        const canvas = this.minimapCanvas;
        const tileSize = 8;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw explored tiles
        for (let y = 0; y < this.dungeonMap.length; y++) {
            for (let x = 0; x < this.dungeonMap[0].length; x++) {
                if (this.exploredMap.has(`${x},${y}`)) {
                    const tile = this.dungeonMap[y][x];
                    const drawX = x * tileSize;
                    const drawY = y * tileSize;
                    
                    switch (tile) {
                        case '.':
                            ctx.fillStyle = '#32b4c2';
                            break;
                        case '#':
                            ctx.fillStyle = '#626c71';
                            break;
                        case '+':
                            ctx.fillStyle = '#8b5cf6';
                            break;
                        case '<':
                            ctx.fillStyle = '#22d3ee';
                            break;
                        case '>':
                            ctx.fillStyle = '#f59e0b';
                            break;
                        case '$':
                            ctx.fillStyle = '#eab308';
                            break;
                        default:
                            ctx.fillStyle = '#32b4c2';
                    }
                    
                    ctx.fillRect(drawX, drawY, tileSize, tileSize);
                }
            }
        }
        
        // Draw player position
        ctx.fillStyle = '#ff5459';
        const playerX = this.playerPosition.x * tileSize;
        const playerY = this.playerPosition.y * tileSize;
        ctx.fillRect(playerX, playerY, tileSize, tileSize);
        
        // Draw player facing direction
        ctx.fillStyle = '#ffffff';
        const centerX = playerX + tileSize / 2;
        const centerY = playerY + tileSize / 2;
        const [dx, dy] = this.getDirectionVector();
        ctx.fillRect(centerX + dx * 2 - 1, centerY + dy * 2 - 1, 2, 2);
    }
    
    // Combat system
    triggerRandomEncounter() {
        if (this.inCombat) return;
        
        const enemy = {...this.enemies[Math.floor(Math.random() * this.enemies.length)]};
        enemy.hp = enemy.maxHp; // Ensure full HP
        
        this.currentEnemy = enemy;
        this.inCombat = true;
        this.gameState = 'combat';
        
        this.setupCombat();
        this.showCombatInterface();
    }
    
    setupCombat() {
        // Create turn order based on agility
        this.combatTurnOrder = [];
        
        // Add party members
        this.party.forEach((character, index) => {
            if (character && character.alive) {
                this.combatTurnOrder.push({
                    type: 'party',
                    character: character,
                    index: index,
                    agi: character.agi + Math.floor(Math.random() * 5)
                });
            }
        });
        
        // Add enemy
        this.combatTurnOrder.push({
            type: 'enemy',
            character: this.currentEnemy,
            agi: this.currentEnemy.agi + Math.floor(Math.random() * 5)
        });
        
        // Sort by agility (higher first)
        this.combatTurnOrder.sort((a, b) => b.agi - a.agi);
        
        this.currentTurn = 0;
        this.combatLog = [];
        this.addCombatLog(`A ${this.currentEnemy.name} appears!`);
        
        this.updateCombatDisplay();
        this.processTurn();
    }
    
    showCombatInterface() {
        const combatInterface = document.getElementById('combat-interface');
        if (combatInterface) {
            combatInterface.classList.remove('hidden');
        }
    }
    
    hideCombatInterface() {
        const combatInterface = document.getElementById('combat-interface');
        if (combatInterface) {
            combatInterface.classList.add('hidden');
        }
    }
    
    updateCombatDisplay() {
        // Update turn order display
        const turnOrderElement = document.getElementById('combat-turn-order');
        if (turnOrderElement) {
            turnOrderElement.innerHTML = '';
            
            this.combatTurnOrder.forEach((participant, index) => {
                const indicator = document.createElement('div');
                indicator.className = 'turn-indicator';
                if (index === this.currentTurn) {
                    indicator.classList.add('active');
                }
                
                indicator.textContent = participant.character.name;
                turnOrderElement.appendChild(indicator);
            });
        }
        
        // Update enemy display
        const enemyDisplay = document.getElementById('enemy-display');
        if (enemyDisplay && this.currentEnemy) {
            enemyDisplay.innerHTML = `
                <div class="enemy">
                    <div class="enemy-name">${this.currentEnemy.name}</div>
                    <div class="enemy-health">
                        <div class="enemy-health-fill" style="width: ${(this.currentEnemy.hp / this.currentEnemy.maxHp) * 100}%"></div>
                    </div>
                    <div>HP: ${this.currentEnemy.hp}/${this.currentEnemy.maxHp}</div>
                </div>
            `;
        }
        
        // Update combat log
        const logElement = document.getElementById('combat-log');
        if (logElement) {
            logElement.innerHTML = this.combatLog.map(entry => `<div class="combat-log-entry">${entry}</div>`).join('');
            logElement.scrollTop = logElement.scrollHeight;
        }
    }
    
    processTurn() {
        if (this.currentTurn >= this.combatTurnOrder.length) {
            this.currentTurn = 0;
        }
        
        const currentParticipant = this.combatTurnOrder[this.currentTurn];
        
        if (currentParticipant.type === 'party') {
            // Player turn
            this.showActionMenu(currentParticipant.character);
        } else {
            // Enemy turn
            this.enemyAction();
        }
        
        this.updateCombatDisplay();
    }
    
    showActionMenu(character) {
        const actionMenu = document.getElementById('action-menu');
        const currentCharacter = document.getElementById('current-character');
        
        if (actionMenu && currentCharacter) {
            actionMenu.classList.remove('hidden');
            currentCharacter.textContent = `${character.name}'s Turn`;
        }
    }
    
    hideActionMenu() {
        const actionMenu = document.getElementById('action-menu');
        if (actionMenu) {
            actionMenu.classList.add('hidden');
        }
    }
    
    handleCombatAction(action) {
        const currentParticipant = this.combatTurnOrder[this.currentTurn];
        const character = currentParticipant.character;
        
        switch (action) {
            case 'attack':
                this.performAttack(character, this.currentEnemy);
                break;
            case 'defend':
                this.addCombatLog(`${character.name} defends!`);
                break;
            case 'item':
                this.addCombatLog(`${character.name} uses an item! (Not implemented)`);
                break;
            case 'escape':
                if (Math.random() < 0.5) {
                    this.addCombatLog('Successfully escaped!');
                    this.endCombat(false);
                    return;
                } else {
                    this.addCombatLog('Cannot escape!');
                }
                break;
        }
        
        this.hideActionMenu();
        this.nextTurn();
    }
    
    performAttack(attacker, target) {
        const damage = Math.max(1, attacker.str - target.def + Math.floor(Math.random() * 5));
        target.hp = Math.max(0, target.hp - damage);
        
        const attackerName = attacker.name || 'Enemy';
        const targetName = target.name || 'Party member';
        
        this.addCombatLog(`${attackerName} attacks ${targetName} for ${damage} damage!`);
        
        if (target.hp <= 0) {
            if (target === this.currentEnemy) {
                this.addCombatLog(`${target.name} is defeated!`);
                this.endCombat(true);
            } else {
                this.addCombatLog(`${target.name} is knocked unconscious!`);
                target.alive = false;
            }
        }
    }
    
    enemyAction() {
        // Simple AI: Attack random alive party member
        const aliveParty = this.party.filter(c => c && c.alive);
        if (aliveParty.length > 0) {
            const target = aliveParty[Math.floor(Math.random() * aliveParty.length)];
            this.performAttack(this.currentEnemy, target);
        }
        
        setTimeout(() => this.nextTurn(), 1000);
    }
    
    nextTurn() {
        this.currentTurn++;
        
        // Check if combat should end
        const aliveParty = this.party.filter(c => c && c.alive);
        if (aliveParty.length === 0) {
            this.addCombatLog('All party members are defeated!');
            this.showMessage('Game Over! All party members have fallen.');
            return;
        }
        
        if (this.currentEnemy.hp <= 0) {
            return; // Combat already ended
        }
        
        setTimeout(() => this.processTurn(), 500);
    }
    
    endCombat(victory) {
        this.inCombat = false;
        this.gameState = 'exploring';
        
        if (victory) {
            // Award experience
            const exp = this.currentEnemy.exp;
            this.party.forEach(character => {
                if (character && character.alive) {
                    character.exp += exp;
                }
            });
            
            this.showMessage(`Victory! Each party member gains ${exp} experience.`);
        }
        
        this.hideCombatInterface();
        this.updatePartyStatus();
    }
    
    addCombatLog(message) {
        this.combatLog.push(message);
        if (this.combatLog.length > 10) {
            this.combatLog.shift();
        }
    }
    
    // UI Update methods
    updateUI() {
        this.render3D();
        this.renderMinimap();
        this.updatePositionInfo();
    }
    
    updatePositionInfo() {
        const directions = ['North', 'East', 'South', 'West'];
        const floorInfo = document.getElementById('floor-info');
        const positionInfo = document.getElementById('position-info');
        const facingInfo = document.getElementById('facing-info');
        
        if (floorInfo) floorInfo.textContent = `Floor ${this.currentFloor}`;
        if (positionInfo) positionInfo.textContent = `Position: ${this.playerPosition.x},${this.playerPosition.y}`;
        if (facingInfo) facingInfo.textContent = `Facing: ${directions[this.playerFacing]}`;
    }
    
    updatePartyStatus() {
        const partyMembersElement = document.getElementById('party-members');
        if (!partyMembersElement) return;
        
        partyMembersElement.innerHTML = '';
        
        this.party.forEach((character, index) => {
            if (character) {
                const memberElement = document.createElement('div');
                memberElement.className = 'party-member';
                
                const healthPercent = (character.hp / character.maxHp) * 100;
                const manaPercent = (character.mp / character.maxMp) * 100;
                
                memberElement.innerHTML = `
                    <div class="member-info">
                        <div class="member-name">${character.name}</div>
                        <div class="member-class">${character.class}</div>
                    </div>
                    <div class="health-bar">
                        <div class="health-fill" style="width: ${healthPercent}%"></div>
                    </div>
                    <div class="mana-bar">
                        <div class="mana-fill" style="width: ${manaPercent}%"></div>
                    </div>
                    <div class="member-stats">
                        <span>HP: ${character.hp}/${character.maxHp}</span>
                        <span>MP: ${character.mp}/${character.maxMp}</span>
                        <span>Level: ${character.level}</span>
                    </div>
                `;
                
                if (!character.alive) {
                    memberElement.style.opacity = '0.5';
                }
                
                partyMembersElement.appendChild(memberElement);
            }
        });
    }
    
    // Message system
    showMessage(text) {
        const messageText = document.getElementById('message-text');
        const messageDisplay = document.getElementById('message-display');
        
        if (messageText && messageDisplay) {
            messageText.textContent = text;
            messageDisplay.classList.remove('hidden');
        }
    }
    
    hideMessage() {
        const messageDisplay = document.getElementById('message-display');
        if (messageDisplay) {
            messageDisplay.classList.add('hidden');
        }
    }
    
    // Rest system
    restParty() {
        if (this.inCombat) return;
        
        this.party.forEach(character => {
            if (character) {
                character.hp = character.maxHp;
                character.mp = character.maxMp;
                character.alive = true;
            }
        });
        
        this.updatePartyStatus();
        this.showMessage('Your party rests and recovers all HP and MP!');
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new DungeonCrawler();
});