const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle settings
const PADDLE_WIDTH = 16;
const PADDLE_HEIGHT = 100;
const PADDLE_MARGIN = 24;
const PADDLE_SPEED = 5;

// Ball settings
const BALL_SIZE = 16;
const BALL_SPEED = 5;

// Player paddle
const player = {
    x: PADDLE_MARGIN,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: '#0ff'
};

// AI paddle
const ai = {
    x: WIDTH - PADDLE_MARGIN - PADDLE_WIDTH,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: '#f0f'
};

// Ball
const ball = {
    x: WIDTH / 2 - BALL_SIZE / 2,
    y: HEIGHT / 2 - BALL_SIZE / 2,
    size: BALL_SIZE,
    speedX: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    speedY: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    color: '#fff'
};

// Draw everything
function draw() {
    // Background
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Net
    ctx.save();
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 16]);
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);
    ctx.stroke();
    ctx.restore();

    // Player paddle
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // AI paddle
    ctx.fillStyle = ai.color;
    ctx.fillRect(ai.x, ai.y, ai.width, ai.height);

    // Ball
    ctx.fillStyle = ball.color;
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
}

// Handle mouse movement for player paddle
canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    player.y = mouseY - player.height / 2;

    // Prevent going out of bounds
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > HEIGHT) player.y = HEIGHT - player.height;
});

// Basic AI for right paddle
function updateAI() {
    // Aim for ball center
    const aiCenter = ai.y + ai.height / 2;
    const ballCenter = ball.y + ball.size / 2;

    if (aiCenter < ballCenter - 10) {
        ai.y += PADDLE_SPEED;
    } else if (aiCenter > ballCenter + 10) {
        ai.y -= PADDLE_SPEED;
    }
    // Prevent out of bounds
    if (ai.y < 0) ai.y = 0;
    if (ai.y + ai.height > HEIGHT) ai.y = HEIGHT - ai.height;
}

// Ball movement and collision
function updateBall() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Top and bottom wall collision
    if (ball.y <= 0) {
        ball.y = 0;
        ball.speedY *= -1;
    }
    if (ball.y + ball.size >= HEIGHT) {
        ball.y = HEIGHT - ball.size;
        ball.speedY *= -1;
    }

    // Paddle collision detection
    // Left paddle
    if (
        ball.x <= player.x + player.width &&
        ball.x >= player.x &&
        ball.y + ball.size > player.y &&
        ball.y < player.y + player.height
    ) {
        ball.x = player.x + player.width;
        ball.speedX *= -1;
        // Add a bit of "spin"
        let impact = (ball.y + ball.size / 2 - (player.y + player.height / 2)) / (player.height / 2);
        ball.speedY = BALL_SPEED * impact;
    }

    // Right paddle (AI)
    if (
        ball.x + ball.size >= ai.x &&
        ball.x + ball.size <= ai.x + ai.width &&
        ball.y + ball.size > ai.y &&
        ball.y < ai.y + ai.height
    ) {
        ball.x = ai.x - ball.size;
        ball.speedX *= -1;
        // Add a bit of "spin"
        let impact = (ball.y + ball.size / 2 - (ai.y + ai.height / 2)) / (ai.height / 2);
        ball.speedY = BALL_SPEED * impact;
    }

    // Left or right wall (reset ball)
    if (ball.x < 0 || ball.x + ball.size > WIDTH) {
        resetBall();
    }
}

// Reset ball to center
function resetBall() {
    ball.x = WIDTH / 2 - BALL_SIZE / 2;
    ball.y = HEIGHT / 2 - BALL_SIZE / 2;
    // Randomize direction
    ball.speedX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ball.speedY = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
}

// Main game loop
function gameLoop() {
    updateAI();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
draw();
gameLoop();