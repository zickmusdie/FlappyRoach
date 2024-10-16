const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let bird = {
    x: 50,
    y: 150,
    width: 24,
    height: 34,
    gravity: 0.5,
    lift: -8,
    velocity: 0,
};

let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;
let gameStarted = false; // Track if the game has started
let gap = 180; // Initial pipe gap

// Load images
const backgroundImg = new Image();
backgroundImg.src = 'C:/Users/Administrator/Desktop/FLAPPY ROACH/BackGround.png';

const birdImg = new Image();
birdImg.src = 'C:/Users/Administrator/Desktop/FLAPPY ROACH/BIRD.png';

const pipeAboveImg = new Image();
pipeAboveImg.src = 'C:/Users/Administrator/Desktop/FLAPPY ROACH/PIPE ABOVE.png';

const pipeBelowImg = new Image();
pipeBelowImg.src = 'C:/Users/Administrator/Desktop/FLAPPY ROACH/PIPE BELOW.png';

// Draw gradient text
function drawGradientText(text, x, y, fontSize = 48) {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#32a852");  // Blue-green
    gradient.addColorStop(1, "#a4d63a");  // Yellow-green

    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = gradient;
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
}

// Intro screen
function showIntro() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    ctx.drawImage(birdImg, canvas.width / 2 - bird.width / 2, 100, bird.width, bird.height);
    drawGradientText("FLAPPY ROACH", canvas.width / 2, 300);
}

// Game Over screen
function showGameOver() {
    drawGradientText("TUSPOK!", canvas.width / 2, canvas.height / 2);
    ctx.font = "24px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Tap to Restart", canvas.width / 2, canvas.height / 2 + 50);
}

function createPipe() {
    const pipeHeight = Math.random() * (canvas.height / 2) + 50;
    pipes.push({
        x: canvas.width,
        top: pipeHeight,
        bottom: canvas.height - pipeHeight - gap,
    });
}

function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.drawImage(pipeAboveImg, pipe.x, 0, 50, pipe.top);
        ctx.drawImage(pipeBelowImg, pipe.x, canvas.height - pipe.bottom, 50, pipe.bottom);
    });
}

function updatePipes() {
    if (frame % 75 === 0) {
        createPipe();
    }

    pipes.forEach(pipe => {
        pipe.x -= 2.0;
    });

    if (pipes.length > 0 && pipes[0].x < -50) {
        pipes.shift();
        score++;

        // Reduce the gap by 5% every 100 points
        if (score % 100 === 0 && gap > 50) {
            gap *= 0.95;
        }
    }
}

function collisionDetection() {
    pipes.forEach(pipe => {
        if (
            bird.x + bird.width > pipe.x &&
            bird.x < pipe.x + 50 &&
            (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
        ) {
            gameOver = true;
        }
    });

    if (bird.y + bird.height >= canvas.height || bird.y < 0) {
        gameOver = true;
    }
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    frame = 0;
    score = 0;
    gap = 180;
    gameOver = false;
    gameStarted = false;
    showIntro(); // Show intro screen on reset
}

function gameLoop() {
    if (!gameStarted) return; // Wait for game start on tap

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        drawBird();
        drawPipes();
        updatePipes();
        collisionDetection();
        drawScore();
    } else {
        showGameOver();
    }

    frame++;
    requestAnimationFrame(gameLoop);
}

// Handle screen tap
canvas.addEventListener("click", () => {
    if (gameOver) {
        resetGame(); // Restart game if it's over
    } else if (!gameStarted) {
        gameStarted = true; // Start game on first tap
        gameLoop();
    } else {
        bird.velocity = bird.lift; // Flap if game is running
    }
});

// Show the intro screen initially
showIntro();
