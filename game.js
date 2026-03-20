/**
 * Side-Scroller Game Core Logic - Enhanced with Tiles and Assets
 */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set explicit dimensions
canvas.width = 800;
canvas.height = 600;

// Game Constants
const GRAVITY = 0.6;
const FRICTION = 0.8;
const JUMP_FORCE = -14;
const SPEED = 5;
const TILE_SIZE = 40;
const LEVEL_HEIGHT = 15; // 15 tiles high (600px)

// Assets
const playerImg = new Image();
const tilesetImg = new Image();
const bgImg = new Image();


// Level Data (0: empty, 1: grass, 2: dirt, 3: brick, 4: box)
const levelMap = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,0,0,0,0,0,4,4,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
];

const levelWidth = levelMap[0].length * TILE_SIZE;

class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = canvas.width;
        this.height = canvas.height;
    }

    update(target) {
        this.x = target.x - this.width / 4; // Follow player offset
        if (this.x < 0) this.x = 0;
        if (this.x > levelWidth - this.width) this.x = levelWidth - this.width;
    }
}

class Player {
    constructor() {
        this.x = 100;
        this.y = 400;
        this.width = 32;
        this.height = 32;
        this.velX = 0;
        this.velY = 0;
        this.onGround = false;
        this.facingLeft = false;
        this.color = '#ff4757'; // Fallback color
    }

    draw(camera) {
        ctx.save();
        if (this.facingLeft) {
            ctx.scale(-1, 1);
            ctx.drawImage(playerImg, -(this.x - camera.x + this.width), this.y - camera.y, this.width, this.height);
        } else {
            ctx.drawImage(playerImg, this.x - camera.x, this.y - camera.y, this.width, this.height);
        }
        ctx.restore();
    }

    update() {
        this.velY += GRAVITY;
        this.x += this.velX;
        this.checkCollision(this.velX, 0);
        this.y += this.velY;
        this.onGround = false;
        this.checkCollision(0, this.velY);

        this.velX *= FRICTION;

        if (this.velX > 0.1) this.facingLeft = false;
        if (this.velX < -0.1) this.facingLeft = true;

        // Reset if fall out
        if (this.y > canvas.height + 100) {
            this.x = 100;
            this.y = 400;
            this.velX = 0;
            this.velY = 0;
        }
    }

    checkCollision(vx, vy) {
        for (let row = 0; row < levelMap.length; row++) {
            for (let col = 0; col < levelMap[row].length; col++) {
                const tile = levelMap[row][col];
                if (tile !== 0) {
                    const tx = col * TILE_SIZE;
                    const ty = row * TILE_SIZE;

                    if (this.x < tx + TILE_SIZE &&
                        this.x + this.width > tx &&
                        this.y < ty + TILE_SIZE &&
                        this.y + this.height > ty) {
                        
                        if (vy > 0) { // Moving down
                            this.y = ty - this.height;
                            this.velY = 0;
                            this.onGround = true;
                        } else if (vy < 0) { // Moving up
                            this.y = ty + TILE_SIZE;
                            this.velY = 0;
                        } else if (vx > 0) { // Moving right
                            this.x = tx - this.width;
                            this.velX = 0;
                        } else if (vx < 0) { // Moving left
                            this.x = tx + TILE_SIZE;
                            this.velX = 0;
                        }
                    }
                }
            }
        }
    }
}

const player = new Player();
const camera = new Camera();
const keys = {};
let score = 0;
let gameOver = false;

window.addEventListener('keydown', (e) => {
    if (gameOver && e.code === 'Enter') restartGame();
    keys[e.code] = true;
});
window.addEventListener('keyup', (e) => keys[e.code] = false);

// UI Elements
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const overlayEl = document.getElementById('ui-overlay');
const statusTitle = document.getElementById('status-title');
const restartBtn = document.getElementById('restart-btn');

restartBtn.onclick = restartGame;

function restartGame() {
    score = 0;
    scoreEl.innerText = score;
    gameOver = false;
    overlayEl.classList.add('hidden');
    player.x = 100;
    player.y = 400;
    player.velX = 0;
    player.velY = 0;
}

function handleInput() {
    if (gameOver) return;
    if (keys['KeyA'] || keys['ArrowLeft']) player.velX = -SPEED;
    if (keys['KeyD'] || keys['ArrowRight']) player.velX = SPEED;
    if ((keys['Space'] || keys['KeyW'] || keys['ArrowUp']) && player.onGround) {
        player.velY = JUMP_FORCE;
        player.onGround = false;
        playJumpSound();
    }
}


function drawLevel() {
    // Draw Background
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    
    // Draw tiles (only those in view)
    const startCol = Math.floor(camera.x / TILE_SIZE);
    const endCol = Math.ceil((camera.x + camera.width) / TILE_SIZE);

    for (let row = 0; row < levelMap.length; row++) {
        for (let col = startCol; col <= endCol; col++) {
            const tile = levelMap[row][col];
            if (tile !== 0 && tile !== undefined) {
                // Simplified tileset mapping (assume tiles are 32x32 in source)
                // 1: grass, 2: dirt, 3: brick, 4: box
                let sx = (tile - 1) * 32;
                let sy = 0;
                // Note: Real tileset might need better cropping logic depending on the generated image
                ctx.drawImage(tilesetImg, sx, sy, 32, 32, col * TILE_SIZE - camera.x, row * TILE_SIZE - camera.y, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}

function gameLoop() {
    if (!gameOver) {
        handleInput();
        player.update();
        camera.update(player);
        
        // Update Score (simple: distance moved)
        if (player.x > score * 10) {
            score = Math.floor(player.x / 10);
            scoreEl.innerText = score;
        }
    }
    
    drawLevel();
    player.draw(camera);
    
    requestAnimationFrame(gameLoop);
}

// Simple Web Audio Sound Effects
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playJumpSound() {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}


// Ensure images are loaded before starting
let imagesLoaded = 0;
let useFallback = false;

const assets = [
    { img: playerImg, src: 'player.png' },
    { img: tilesetImg, src: 'tileset.png' },
    { img: bgImg, src: 'background.png' }
];

assets.forEach(asset => {
    asset.img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === assets.length) gameLoop();
    };
    asset.img.onerror = () => {
        console.warn(`Failed to load ${asset.src}, using fallback.`);
        imagesLoaded++;
        useFallback = true;
        if (imagesLoaded === assets.length) gameLoop();
    };
    // Assign src AFTER listeners are set
    asset.img.src = asset.src;
});


// Update Player draw and drawLevel to use fallback
Player.prototype.draw = function(camera) {
    if (useFallback) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
        return;
    }
    ctx.save();
    if (this.facingLeft) {
        ctx.scale(-1, 1);
        ctx.drawImage(playerImg, -(this.x - camera.x + this.width), this.y - camera.y, this.width, this.height);
    } else {
        ctx.drawImage(playerImg, this.x - camera.x, this.y - camera.y, this.width, this.height);
    }
    ctx.restore();
};

function drawLevel() {
    if (useFallback) {
        ctx.fillStyle = '#4facfe'; // Sky
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    }
    
    const startCol = Math.floor(camera.x / TILE_SIZE);
    const endCol = Math.ceil((camera.x + camera.width) / TILE_SIZE);

    for (let row = 0; row < levelMap.length; row++) {
        for (let col = startCol; col <= endCol; col++) {
            const tile = levelMap[row][col];
            if (tile !== 0 && tile !== undefined) {
                if (useFallback) {
                    ctx.fillStyle = tile === 1 ? '#2ed573' : (tile === 2 ? '#8b4513' : '#ff4757');
                    ctx.fillRect(col * TILE_SIZE - camera.x, row * TILE_SIZE - camera.y, TILE_SIZE, TILE_SIZE);
                } else {
                    let sx = (tile - 1) * 32;
                    let sy = 0;
                    ctx.drawImage(tilesetImg, sx, sy, 32, 32, col * TILE_SIZE - camera.x, row * TILE_SIZE - camera.y, TILE_SIZE, TILE_SIZE);
                }
            }
        }
    }
}

