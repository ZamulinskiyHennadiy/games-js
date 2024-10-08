const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Налаштування розміру полотна
canvas.width = 400;
canvas.height = 600;

// Завантажуємо зображення літака
const planeImage = new Image();
planeImage.src = './img/plane.png'; // Шлях до зображення літака

// Перешкоди
const obstacles = [];
const obstacleSpeed = 3;
const obstacleFrequency = 1000; // Чистота створення перешкод (1 секунда)
let obstacleTimer = 0;

//Лічильник очок і рівня 
let score = 0;
let gameOver = false;

// Гравець
const player = {
    width: 50,
    height: 50,
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    speed: 5,
    dx: 0
};

// Створюємо функцію для малювання гравця 
function drawPlayer() {
  ctx.drawImage(planeImage, player.x, player.y, player.width, player.height);
}

// Створення перешкод
function createObstacle() {
  const obstacleWidth = Math.random() * 50 + 30; //рандомна ширина перешкоди
  const obstacleX = Math.random () * (canvas.width - obstacleWidth);
  obstacles.push({
    x: obstacleX,
    y: -50,
    width: obstacleWidth,
    height: 20,
  });
}

//Малюємо перешкоди
function drawObstacles() {
  ctx.fillStyle = 'red';
  obstacles.forEach((obstacle) => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

// Очищення полотна
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Рух гравця
function movePlayer() {
    player.x += player.dx;

    // Перевіряємо, щоб гравець не виходив за межі полотна
    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

//Рух перешкод вниз
function moveObstacles() {
  obstacles.forEach((obstacle, index) => {
    obstacle.y += obstacleSpeed;

    //Видаляємл перешкоди,якщо вони виходять за межі полотна
    if (obstacle.y > canvas.height) {
      obstacles.splice(index, 1);
      score++;//Додаємо очко за успішне подолання перешкоди
    }
  })
}

//перевірка на зідкнення
function checkCollision() {
  obstacles.forEach((obstacle) => {
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ){
      gameOver = true;//Кінець гри при зіткнені
    }
  });
}

// Показати рахунок
function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// Обробка подій натискання клавіш
function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'd') {
        player.dx = player.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        player.dx = -player.speed;
    }
}

function keyUp(e) {
    if (
        e.key === 'ArrowRight' || e.key === 'ArrowLeft' ||
        e.key === 'd' || e.key === 'a'
    ) {
        player.dx = 0;
    }
}

// Оновлення гри
function update() {
  if (gameOver) {
      ctx.font = '40px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText('Game Over', canvas.width / 4, canvas.height / 2);
      return;
  }

  clearCanvas();
  drawPlayer();
  movePlayer();
  moveObstacles();
  drawObstacles();
  checkCollision();
  drawScore();

  // Створюємо перешкоди через певний час
  obstacleTimer++;
  if (obstacleTimer % Math.floor(obstacleFrequency / 16.6) === 0) {
      createObstacle();
  }

  requestAnimationFrame(update);
}

// Події клавіатури
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Запуск гри
update();