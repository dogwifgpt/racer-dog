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
    obstacles.forEach(obstacle => gameContainer.removeChild
