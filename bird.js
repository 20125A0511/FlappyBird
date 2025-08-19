class Bird {
    constructor() {
        this.x = 100;
        this.y = 300;
        this.radius = 18;
        this.velocity = 0;
        this.gravity = 0.5;
        this.jumpStrength = -9;
        this.maxVelocity = 12;
        
        this.score = 0;
        this.fitness = 0;
        this.alive = true;
        this.distance = 0;
        
        // Neural network with 7 inputs, 16 hidden nodes, 1 output
        this.brain = new NeuralNetwork(7, 16, 1);
        
        // Visual properties
        this.color = this.generateRandomColor();
        this.opacity = 0.7;
    }

    generateRandomColor() {
        const hue = Math.random() * 360;
        return `hsl(${hue}, 70%, 60%)`;
    }

    jump() {
        this.velocity = this.jumpStrength;
    }

    update(pipes, canvasHeight) {
        if (!this.alive) return;

        // Apply physics
        this.velocity += this.gravity;
        this.velocity = Math.min(this.velocity, this.maxVelocity);
        this.y += this.velocity;
        
        this.distance++;

        // Check boundaries
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvasHeight) {
            this.alive = false;
        }

        // Make decision using neural network
        this.think(pipes);
    }

    think(pipes) {
        // Find the closest pipe
        let closestPipe = null;
        let closestDistance = Infinity;
        let secondClosestPipe = null;

        for (let pipe of pipes) {
            let distance = pipe.x - this.x;
            if (distance > -pipe.width && distance < closestDistance) {
                secondClosestPipe = closestPipe;
                closestDistance = distance;
                closestPipe = pipe;
            }
        }

        let inputs = [];
        
        if (closestPipe) {
            // Improved normalization with more relevant inputs
            inputs[0] = Math.max(0, Math.min(1, this.y / 600)); // Bird's y position
            inputs[1] = (this.velocity + this.maxVelocity) / (2 * this.maxVelocity); // Bird's velocity normalized
            inputs[2] = Math.max(0, Math.min(1, closestDistance / 400)); // Distance to next pipe
            inputs[3] = Math.max(0, Math.min(1, closestPipe.gapY / 600)); // Top of gap position
            inputs[4] = Math.max(0, Math.min(1, (closestPipe.gapY + closestPipe.gapHeight) / 600)); // Bottom of gap position
            inputs[5] = Math.max(0, Math.min(1, (this.y - closestPipe.gapY) / closestPipe.gapHeight + 0.5)); // Bird position relative to gap center
            
            // Add second pipe info if available
            if (secondClosestPipe) {
                inputs[6] = Math.max(0, Math.min(1, secondClosestPipe.gapY / 600));
            } else {
                inputs[6] = 0.5;
            }
        } else {
            // Default inputs if no pipe is found
            inputs = [this.y / 600, 0.5, 1, 0.5, 0.5, 0.5, 0.5];
        }

        // Get output from neural network
        let output = this.brain.feedForward(inputs);
        
        // Jump if output is greater than 0.5
        if (output[0] > 0.5) {
            this.jump();
        }
    }

    checkCollision(pipe) {
        if (!this.alive) return false;

        // Check if bird is within pipe's x range
        if (this.x + this.radius > pipe.x && this.x - this.radius < pipe.x + pipe.width) {
            // Check if bird hits top or bottom pipe
            if (this.y - this.radius < pipe.gapY || this.y + this.radius > pipe.gapY + pipe.gapHeight) {
                this.alive = false;
                return true;
            }
        }
        return false;
    }

    draw(ctx) {
        ctx.save();
        
        // Set opacity based on alive status
        ctx.globalAlpha = this.alive ? this.opacity : 0.3;
        
        // Draw bird as a circle with gradient
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, this.adjustColor(this.color, -20));
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw eye
        if (this.alive) {
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(this.x + 8, this.y - 5, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw beak
            ctx.fillStyle = '#ff6b35';
            ctx.beginPath();
            ctx.moveTo(this.x + this.radius - 2, this.y);
            ctx.lineTo(this.x + this.radius + 8, this.y);
            ctx.lineTo(this.x + this.radius - 2, this.y + 5);
            ctx.closePath();
            ctx.fill();
        }
        
        ctx.restore();
    }

    adjustColor(color, amount) {
        const match = color.match(/hsl\((\d+), (\d+)%, (\d+)%\)/);
        if (match) {
            const h = parseInt(match[1]);
            const s = parseInt(match[2]);
            const l = Math.max(0, Math.min(100, parseInt(match[3]) + amount));
            return `hsl(${h}, ${s}%, ${l}%)`;
        }
        return color;
    }
}
