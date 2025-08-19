class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        // Game state
        this.birds = [];
        this.pipes = [];
        this.frameCount = 0;
        this.pipeSpawnInterval = 120;
        this.score = 0;
        this.highScore = 0;
        this.paused = false;
        this.speed = 1;
        this.gameStarted = false;
        this.animationId = null;
        
        // Genetic algorithm
        this.populationSize = 50;
        this.ga = new GeneticAlgorithm(this.populationSize, 0.08);
        
        // UI elements
        this.startScreen = document.getElementById('startScreen');
        this.startBtn = document.getElementById('startBtn');
        this.generationEl = document.getElementById('generation');
        this.aliveEl = document.getElementById('alive');
        this.bestScoreEl = document.getElementById('best-score');
        this.currentScoreEl = document.getElementById('current-score');
        
        // Control buttons
        this.pauseBtn = document.getElementById('pauseBtn');
        this.speedBtn = document.getElementById('speedBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        this.setupControls();
        
        // Initially hide canvas and controls
        this.canvas.style.display = 'none';
        document.querySelector('.controls').style.display = 'none';
        document.querySelector('.stats').style.display = 'none';
    }

    initializeBirds() {
        this.birds = [];
        for (let i = 0; i < this.populationSize; i++) {
            this.birds.push(new Bird());
        }
    }

    setupControls() {
        this.startBtn.addEventListener('click', () => {
            this.startGame();
        });
        
        this.pauseBtn.addEventListener('click', () => {
            this.paused = !this.paused;
            this.pauseBtn.textContent = this.paused ? 'Resume' : 'Pause';
        });
        
        this.speedBtn.addEventListener('click', () => {
            const speeds = [1, 2, 5, 10];
            const currentIndex = speeds.indexOf(this.speed);
            this.speed = speeds[(currentIndex + 1) % speeds.length];
            this.speedBtn.textContent = `Speed: ${this.speed}x`;
        });
        
        this.resetBtn.addEventListener('click', () => {
            this.reset();
        });
        
        // Manual control for testing (spacebar)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.birds.length > 0 && this.birds[0].alive) {
                e.preventDefault();
                this.birds[0].jump();
            }
        });
    }

    startGame() {
        this.startScreen.classList.add('hidden');
        this.canvas.style.display = 'block';
        document.querySelector('.controls').style.display = 'flex';
        document.querySelector('.stats').style.display = 'block';
        
        this.initializeBirds();
        this.gameStarted = true;
        this.gameLoop();
    }
    
    reset() {
        // Cancel animation frame
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Reset game state
        this.birds = [];
        this.pipes = [];
        this.frameCount = 0;
        this.score = 0;
        this.paused = false;
        this.speed = 1;
        
        // Reset GA but keep learning progress
        this.ga.generation = 1;
        
        // Reset UI
        this.pauseBtn.textContent = 'Pause';
        this.speedBtn.textContent = 'Speed: 1x';
        
        // Reinitialize and restart
        this.initializeBirds();
        this.gameLoop();
    }

    update() {
        if (this.paused) return;
        
        for (let i = 0; i < this.speed; i++) {
            this.frameCount++;
            
            // Spawn pipes
            if (this.frameCount % this.pipeSpawnInterval === 0) {
                this.pipes.push(new Pipe(this.canvas.width, this.canvas.height));
            }
            
            // Update pipes
            for (let i = this.pipes.length - 1; i >= 0; i--) {
                this.pipes[i].update();
                
                // Remove off-screen pipes
                if (this.pipes[i].isOffScreen()) {
                    this.pipes.splice(i, 1);
                }
            }
            
            // Update birds
            let aliveCount = 0;
            for (let bird of this.birds) {
                if (bird.alive) {
                    bird.update(this.pipes, this.canvas.height);
                    
                    // Check collisions with pipes
                    for (let pipe of this.pipes) {
                        if (bird.checkCollision(pipe)) {
                            break;
                        }
                        
                        // Increase score when passing a pipe
                        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
                            pipe.passed = true;
                            bird.score++;
                            this.score = Math.max(this.score, bird.score);
                            this.highScore = Math.max(this.highScore, bird.score);
                        }
                    }
                    
                    if (bird.alive) {
                        aliveCount++;
                    }
                }
            }
            
            // Update UI
            this.updateUI(aliveCount);
            
            // Check if all birds are dead
            if (aliveCount === 0) {
                this.nextGeneration();
            }
        }
    }

    nextGeneration() {
        // Create next generation using genetic algorithm
        this.birds = this.ga.nextGeneration(this.birds);
        
        // Reset game state
        this.pipes = [];
        this.frameCount = 0;
        this.score = 0;
        
        // Update generation display
        this.generationEl.textContent = this.ga.generation;
    }

    updateUI(aliveCount) {
        this.aliveEl.textContent = aliveCount;
        this.bestScoreEl.textContent = this.highScore;
        this.currentScoreEl.textContent = this.score;
    }

    draw() {
        // Clear canvas with sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.7, '#87CEEB');
        gradient.addColorStop(0.7, '#90EE90');
        gradient.addColorStop(1, '#90EE90');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw clouds
        this.drawClouds();
        
        // Draw pipes
        for (let pipe of this.pipes) {
            pipe.draw(this.ctx, this.canvas.height);
        }
        
        // Draw birds
        for (let bird of this.birds) {
            bird.draw(this.ctx);
        }
        
        // Draw ground line
        this.ctx.strokeStyle = '#228B22';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height - 2);
        this.ctx.lineTo(this.canvas.width, this.canvas.height - 2);
        this.ctx.stroke();
    }

    drawClouds() {
        // Simple cloud effect
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        
        // Cloud 1
        this.drawCloud(100, 100, 40);
        this.drawCloud(500, 80, 50);
        this.drawCloud(700, 120, 35);
    }

    drawCloud(x, y, size) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.arc(x + size * 0.8, y, size * 0.8, 0, Math.PI * 2);
        this.ctx.arc(x - size * 0.8, y, size * 0.8, 0, Math.PI * 2);
        this.ctx.arc(x, y - size * 0.6, size * 0.7, 0, Math.PI * 2);
        this.ctx.fill();
    }

    gameLoop() {
        if (!this.gameStarted) return;
        
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
});
