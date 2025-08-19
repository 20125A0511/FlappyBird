class Pipe {
    constructor(x, canvasHeight) {
        this.x = x;
        this.width = 80;
        this.gapHeight = 180;
        this.minGapY = 80;
        this.maxGapY = canvasHeight - this.gapHeight - 80;
        this.gapY = Math.random() * (this.maxGapY - this.minGapY) + this.minGapY;
        this.speed = 3;
        this.passed = false;
        
        // Visual properties
        this.color = '#2ecc71';
        this.borderColor = '#27ae60';
        this.capHeight = 30;
        this.capExtraWidth = 10;
    }

    update() {
        this.x -= this.speed;
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    draw(ctx, canvasHeight) {
        // Draw top pipe
        this.drawPipeSection(ctx, this.x, 0, this.width, this.gapY, true);
        
        // Draw bottom pipe
        this.drawPipeSection(ctx, this.x, this.gapY + this.gapHeight, this.width, 
                           canvasHeight - (this.gapY + this.gapHeight), false);
    }

    drawPipeSection(ctx, x, y, width, height, isTop) {
        // Main pipe body gradient
        const gradient = ctx.createLinearGradient(x, 0, x + width, 0);
        gradient.addColorStop(0, this.adjustColor(this.color, 10));
        gradient.addColorStop(0.5, this.color);
        gradient.addColorStop(1, this.adjustColor(this.color, -10));
        
        // Draw main pipe body
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, width, height);
        
        // Draw pipe border
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);
        
        // Draw pipe cap
        const capY = isTop ? y + height - this.capHeight : y;
        const capWidth = width + this.capExtraWidth * 2;
        const capX = x - this.capExtraWidth;
        
        // Cap gradient
        const capGradient = ctx.createLinearGradient(capX, 0, capX + capWidth, 0);
        capGradient.addColorStop(0, this.adjustColor(this.color, 15));
        capGradient.addColorStop(0.5, this.adjustColor(this.color, 5));
        capGradient.addColorStop(1, this.adjustColor(this.color, -5));
        
        ctx.fillStyle = capGradient;
        ctx.fillRect(capX, capY, capWidth, this.capHeight);
        
        // Cap border
        ctx.strokeRect(capX, capY, capWidth, this.capHeight);
        
        // Add some highlights
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(x + 10, y + 10, 15, height - 20);
        ctx.fillRect(capX + 10, capY + 5, 15, this.capHeight - 10);
    }

    adjustColor(color, amount) {
        // Simple color adjustment
        const num = parseInt(color.slice(1), 16);
        const r = Math.max(0, Math.min(255, (num >> 16) + amount));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
        const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }
}
