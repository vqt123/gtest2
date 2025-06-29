class GridGame {
    constructor() {
        this.socket = io();
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.cellSize = 30;
        this.gridSize = 20;
        this.players = new Map();
        this.moneyItems = new Map();
        this.currentPlayerId = null;
        this.username = '';
        
        this.setupEventListeners();
        this.setupSocketListeners();
    }

    setupEventListeners() {
        const joinBtn = document.getElementById('join-btn');
        const usernameInput = document.getElementById('username-input');
        
        joinBtn.addEventListener('click', () => this.joinGame());
        usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.joinGame();
        });
        
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    setupSocketListeners() {
        this.socket.on('connect', () => {
            console.log('Connected to server');
            this.currentPlayerId = this.socket.id;
        });

        this.socket.on('gameState', (state) => {
            this.players.clear();
            this.moneyItems.clear();
            
            state.players.forEach(player => {
                this.players.set(player.id, player);
            });
            
            state.moneyItems.forEach(money => {
                this.moneyItems.set(money.id, money);
            });
            
            this.updatePlayersList();
            this.render();
        });

        this.socket.on('playerJoined', (player) => {
            this.players.set(player.id, player);
            this.updatePlayersList();
            this.render();
        });

        this.socket.on('playerLeft', (playerId) => {
            this.players.delete(playerId);
            this.updatePlayersList();
            this.render();
        });

        this.socket.on('playerMoved', (playerId, position) => {
            const player = this.players.get(playerId);
            if (player) {
                player.position = position;
                this.render();
            }
        });

        this.socket.on('moneySpawned', (money) => {
            this.moneyItems.set(money.id, money);
            this.render();
        });

        this.socket.on('moneyCollected', (playerId, moneyId, newTotal) => {
            this.moneyItems.delete(moneyId);
            const player = this.players.get(playerId);
            if (player) {
                player.money = newTotal;
                if (playerId === this.currentPlayerId) {
                    document.getElementById('player-money').textContent = newTotal;
                }
            }
            this.updatePlayersList();
            this.render();
        });

        this.socket.on('error', (message) => {
            alert(`Error: ${message}`);
        });
    }

    joinGame() {
        const username = document.getElementById('username-input').value.trim();
        if (username.length < 1) {
            alert('Please enter a username');
            return;
        }
        
        this.username = username;
        this.socket.emit('join', username);
        
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        
        this.loadLeaderboard();
        setInterval(() => this.loadLeaderboard(), 30000);
    }

    handleKeyPress(e) {
        if (document.getElementById('login-screen').classList.contains('hidden')) {
            let direction = null;
            
            switch(e.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    direction = 'up';
                    break;
                case 's':
                case 'arrowdown':
                    direction = 'down';
                    break;
                case 'a':
                case 'arrowleft':
                    direction = 'left';
                    break;
                case 'd':
                case 'arrowright':
                    direction = 'right';
                    break;
            }
            
            if (direction) {
                e.preventDefault();
                this.socket.emit('move', direction);
            }
        }
    }

    render() {
        this.ctx.fillStyle = '#1a202c';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawGrid();
        this.drawMoney();
        this.drawPlayers();
    }

    drawGrid() {
        this.ctx.strokeStyle = '#2d3748';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i <= this.gridSize; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.cellSize, 0);
            this.ctx.lineTo(i * this.cellSize, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.cellSize);
            this.ctx.lineTo(this.canvas.width, i * this.cellSize);
            this.ctx.stroke();
        }
    }

    drawPlayers() {
        this.players.forEach((player, playerId) => {
            const x = player.position.x * this.cellSize;
            const y = player.position.y * this.cellSize;
            
            this.ctx.fillStyle = playerId === this.currentPlayerId ? '#3b82f6' : player.color || '#ef4444';
            this.ctx.fillRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4);
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '10px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(player.username.substring(0, 3), x + this.cellSize / 2, y + this.cellSize / 2);
        });
    }

    drawMoney() {
        this.moneyItems.forEach(money => {
            const x = money.position.x * this.cellSize;
            const y = money.position.y * this.cellSize;
            
            this.ctx.fillStyle = '#fbbf24';
            this.ctx.fillRect(x + 5, y + 5, this.cellSize - 10, this.cellSize - 10);
            
            this.ctx.fillStyle = '#000000';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(`$${money.amount}`, x + this.cellSize / 2, y + this.cellSize / 2);
        });
    }

    updatePlayersList() {
        const playersList = document.getElementById('players-list');
        playersList.innerHTML = '';
        
        const sortedPlayers = Array.from(this.players.values()).sort((a, b) => b.money - a.money);
        
        sortedPlayers.forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'player-item';
            
            const leftDiv = document.createElement('div');
            leftDiv.className = 'flex items-center';
            
            const colorIndicator = document.createElement('div');
            colorIndicator.className = 'player-color-indicator';
            colorIndicator.style.backgroundColor = player.id === this.currentPlayerId ? '#3b82f6' : player.color || '#ef4444';
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = player.username;
            if (player.id === this.currentPlayerId) {
                nameSpan.className = 'font-semibold';
            }
            
            const moneySpan = document.createElement('span');
            moneySpan.textContent = `$${player.money}`;
            moneySpan.className = 'text-green-400';
            
            leftDiv.appendChild(colorIndicator);
            leftDiv.appendChild(nameSpan);
            
            playerDiv.appendChild(leftDiv);
            playerDiv.appendChild(moneySpan);
            
            playersList.appendChild(playerDiv);
        });
    }

    async loadLeaderboard() {
        try {
            const response = await fetch('/api/leaderboard');
            const topPlayers = await response.json();
            
            const leaderboardDiv = document.getElementById('leaderboard');
            leaderboardDiv.innerHTML = '';
            
            topPlayers.forEach((player, index) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'leaderboard-item';
                
                const leftDiv = document.createElement('div');
                leftDiv.className = 'flex items-center';
                
                const rankSpan = document.createElement('span');
                rankSpan.className = 'leaderboard-rank';
                rankSpan.textContent = `#${index + 1}`;
                
                const nameSpan = document.createElement('span');
                nameSpan.textContent = player.username;
                
                const moneySpan = document.createElement('span');
                moneySpan.textContent = `$${player.total_money}`;
                moneySpan.className = 'text-yellow-400 font-semibold';
                
                leftDiv.appendChild(rankSpan);
                leftDiv.appendChild(nameSpan);
                
                itemDiv.appendChild(leftDiv);
                itemDiv.appendChild(moneySpan);
                
                leaderboardDiv.appendChild(itemDiv);
            });
        } catch (error) {
            console.error('Failed to load leaderboard:', error);
        }
    }
}

const game = new GridGame();