/**
 * Side-Scroller Game Core Logic
 */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game Constants
const GRAVITY = 0.6;
const FRICTION = 0.8;
const JUMP_FORCE = -12;
const SPEED = 5;
const TILE_SIZE = 40;

// Set canvas resolution
canvas.width = 800;
canvas.height = 600;

class Player {
    constructor() {
        this.x = 100;
        this.y = 100;
        this.width = 40;
        this.height = 40;
        this.velX = 0;
        this.velY = 0;
        this.isJumping = false;
        this.color = '#ff4757';
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 0; // Reset shadow
    }

    update() {
        // Apply Gravity
        this.velY += GRAVITY;
        
        // Apply Velocity
        this.x += this.velX;
        this.y += this.velY;

        // Ground Floor Limit (Simple placeholder before tiles)
        if (this.y + this.height > canvas.height - TILE_SIZE) {
            this.y = canvas.height - TILE_SIZE - this.height;
            this.velY = 0;
            this.isJumping = false;
        }

        // Horizontal Friction
        this.velX *= FRICTION;
    }
}

const player = new Player();
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

function handleInput() {
    if (keys['KeyA'] || keys['ArrowLeft']) {
        player.velX = -SPEED;
    }
    if (keys['KeyD'] || keys['ArrowRight']) {
        player.velX = SPEED;
    }
    if ((keys['Space'] || keys['KeyW'] || keys['ArrowUp']) && !player.isJumping) {
        player.velY = JUMP_FORCE;
        player.isJumping = true;
    }
}

function render() {
    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Background (Placeholder)
    ctx.fillStyle = '#4facfe';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Ground (Placeholder)
    ctx.fillStyle = '#2ed573';
    ctx.fillRect(0, canvas.height - TILE_SIZE, canvas.width, TILE_SIZE);

    player.draw();
}

function gameLoop() {
    handleInput();
    player.update();
    render();
    requestAnimationFrame(gameLoop);
}

// Start Game
gameLoop();
