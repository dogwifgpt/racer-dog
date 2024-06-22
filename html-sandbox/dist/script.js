const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const startMessage = document.getElementById('start-message');
const backgroundMusic = document.getElementById('background-music');

const obstacleImages = [
    'https://cdn.discordapp.com/attachments/895233277114351627/1253942742669594686/1.png?ex=6677b0ae&is=66765f2e&hm=1b7cdd4bfb786458497c16260eeefa12c90750ce6143b45a5ef6bd80c85f2257&',
    'https://cdn.discordapp.com/attachments/895233277114351627/1253942743051272273/2.png?ex=6677b0af&is=66765f2f&hm=b71a2b8fb2cfbdd1210d3b4d3f5353d108f99ff944e5b5a5ed40549b1d71d447&',
    'https://cdn.discordapp.com/attachments/895233277114351627/1253942743370174504/3.png?ex=6677b0af&is=66765f2f&hm=fcec6dce23e7f3952e7a6db9ee2deb741e3b4c7a68ef9bb00692120c4eb9772b&',
    'https://cdn.discordapp.com/attachments/895233277114351627/1253942743743594496/4.png?ex=6677b0af&is=66765f2f&hm=759854239ace972dff2dbf5cc190e7e0a0a1548f7f80f7de28f6d55532c7c9ec&'
];

const backgrounds = [
    'https://cdn.discordapp.com/attachments/895233277114351627/1253940698122555402/Untitled_design_38.png?ex=6677aec7&is=66765d47&hm=07f1c0401138e9b9728a10f6f1a42306a80b3927d26f9b60c78528ea98b74663&'
];

let currentBackgroundIndex = 0;
let backgroundYPosition = 0;

let playerX = 375 / 2 - 25; // Adjusted for smaller screen
let playerY = 667 / 2; // Adjusted for smaller screen
let score = 0;
let obstacles = [];
let gameInterval;
let obstacleInterval;
let gameSpeed = 5;
let isGameRunning = false;
let keys = {};
let obstacleSpawnRate = 2000;
let maxObstacles = 1;

const roadLeftBoundary = 50;
const roadRightBoundary = 375 - 100; // 375 - (roadLeftBoundary * 2)

document.addEventListener('keydown', handleKeydown);
document.addEventListener('keyup', handleKeyup);

function handleKeydown(event) {
    keys[event.key] = true;
    if (!isGameRunning) {
        startGame();
    }
}

function handleKeyup(event) {
    keys[event.key] = false;
}

function movePlayer() {
    if (keys['ArrowLeft'] || keys['a']) {
        playerX -= 10; // Increased movement speed
        if (playerX < roadLeftBoundary) playerX = roadLeftBoundary;
    }
    if (keys['ArrowRight'] || keys['d']) {
        playerX += 10; // Increased movement speed
        if (playerX > roadRightBoundary) playerX = roadRightBoundary;
    }
    player.style.left = `${playerX}px`;
}

function startGame() {
    resetGame();
    isGameRunning = true;
    startMessage.style.display = 'none';
    backgroundMusic.play(); // Play background music
    gameInterval = setInterval(updateGame, 20);
    obstacleInterval = setInterval(createObstacle, obstacleSpawnRate);
}

function resetGame() {
    playerX = 375 / 2 - 25; // Adjusted for smaller screen
    playerY = 667 / 2; // Adjusted for smaller screen
    player.style.left = `${playerX}px`;
    player.style.bottom = `50%`;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    obstacles.forEach(obstacle => gameContainer.removeChild(obstacle));
    obstacles = [];
    clearInterval(obstacleInterval);
    clearInterval(gameInterval);
    obstacleSpawnRate = 2000;
    gameSpeed = 5;
    maxObstacles = 1;
    gameContainer.style.backgroundImage = `url('${backgrounds[0]}')`;
    backgroundYPosition = 0;
    backgroundMusic.pause(); // Stop background music
    backgroundMusic.currentTime = 0; // Reset background music
}

function updateGame() {
    movePlayer();
    playerY += gameSpeed;

    // Update the position of each obstacle and remove if necessary
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        const obstacleTop = parseFloat(obstacle.style.top);
        obstacle.style.top = `${obstacleTop + gameSpeed}px`;
        if (obstacleTop > 667) { // Adjusted for smaller screen
            gameContainer.removeChild(obstacle);
            obstacles.splice(i, 1); // Remove the obstacle from the array
            i--; // Adjust the index after removal
        }
        if (checkCollision(player, obstacle)) {
            resetGame();
            isGameRunning = false;
            startMessage.style.display = 'block';
        }
    }

    score += 1;
    scoreDisplay.textContent = `Score: ${score}`;

    // Scroll background upwards
    backgroundYPosition += gameSpeed;
    if (backgroundYPosition >= 667) {
        backgroundYPosition = 0;
        currentBackgroundIndex = (currentBackgroundIndex + 1) % backgrounds.length;
        gameContainer.style.backgroundImage = `url('${backgrounds[currentBackgroundIndex]}')`;
    }
    gameContainer.style.backgroundPositionY = `-${backgroundYPosition}px`;

    // Increase difficulty as the score increases
    if (score % 1000 === 0) {
        gameSpeed += 0.5;
        if (maxObstacles < 4) {
            maxObstacles += 1;
        }
        clearInterval(obstacleInterval);
        obstacleSpawnRate -= 100;
        if (obstacleSpawnRate < 500) {
            obstacleSpawnRate = 500;
        }
        obstacleInterval = setInterval(createObstacle, obstacleSpawnRate);
    }

    console.log(`Score: ${score}, Game Speed: ${gameSpeed}, Max Obstacles: ${maxObstacles}, Obstacle Spawn Rate: ${obstacleSpawnRate}`);
}

function createObstacle() {
    const positions = generateObstaclePositions(maxObstacles);
    positions.forEach(pos => {
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        obstacle.style.backgroundImage = `url('${getRandomObstacleImage()}')`;
        obstacle.style.left = `${pos}px`;
        obstacle.style.top = `-${Math.random() * 200}px`; // Randomize starting position
        gameContainer.appendChild(obstacle);
        obstacles.push(obstacle);
    });
    console.log(`Obstacles: ${obstacles.length}`);
}

function generateObstaclePositions(numObstacles) {
    const obstacleWidth = 50;
    let positions = [];

    while (positions.length < numObstacles) {
        let pos = roadLeftBoundary + Math.random() * (roadRightBoundary - roadLeftBoundary);
        if (positions.every(p => Math.abs(p - pos) > obstacleWidth)) {
            positions.push(pos);
        }
    }

    return positions;
}

function getRandomObstacleImage() {
    return obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
}

function checkCollision(player, obstacle) {
    const playerRect = player.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    const playerCollisionRect = {
        top: playerRect.top + 10,
        bottom: playerRect.bottom - 10,
        left: playerRect.left + 10,
        right: playerRect.right - 10,
    };

    const obstacleCollisionRect = {
        top: obstacleRect.top + 10,
        bottom: obstacleRect.bottom - 10,
        left: obstacleRect.left + 10,
        right: obstacleRect.right - 10,
    };

    return !(
        playerCollisionRect.top > obstacleCollisionRect.bottom ||
        playerCollisionRect.bottom < obstacleCollisionRect.top ||
        playerCollisionRect.left > obstacleCollisionRect.right ||
        playerCollisionRect.right < obstacleCollisionRect.left
    );
}

// Display the start message initially
startMessage.style.display = 'block';
