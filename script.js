const gameBoard = document.querySelector('#game-board');
const ctx = gameBoard.getContext('2d');
const startButton = document.querySelector('#start-button');

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;

const backgroundColor = 'white';
const textColor = 'black';

const clockTickSound = new Audio ("sounds/clock-tick-sound.mp3");
const startGameSound = new Audio ("sounds/game-start-sound.mp3");
const gameTickSound = new Audio ("./sounds/tick-sound.wav");

let running = false;
let isRook = false;
let rookX = 350, rookY = 400;
let placeOfRook = 3;

let currentRow;

let map = [];

let moveCounter = 0;
let rookSpeed = 800;

let img = new Image();
let imgX, imgY;

startButton.addEventListener('click', startGame);
window.addEventListener('keydown', moveRook);

function beforeGame () {
  ctx.textAlign = 'center';
  ctx.font = '120px Lumanosimo, cursive';
  ctx.fillStyle = textColor;
  ctx.lineWidth = 8;

  ctx.strokeText("Throw", gameWidth / 2, gameHeight - 300);
  ctx.strokeText("Game", gameWidth / 2, gameHeight - 150);

  img.src = "./img/rook-1.png";
  img.onload = () => {
  
    imgX = 60;
    imgY = 100;

    while(imgY <= 400) {
      ctx.drawImage(img, imgX, imgY);
      imgY += 50;
      if(imgX == 60)
        imgX = 100;
      else 
        imgX = 60
    }
    imgX = 700;
    imgY = 100;

    while(imgY <= 400) {
      ctx.drawImage(img, imgX, imgY);
      imgY += 50;
      if(imgX == 640)
        imgX = 700;
      else 
        imgX = 640;
    }
  }
}

function startGame () {
  if (!running) {
    isRook = false;
    running = true;
    startButton.textContent = "Reset";
    clearBoard();

    introGame().then(() => {
      nextMove();
    });
  }
  else {
    location.reload();
  }
}

async function throwingAnimation () {
    img.src = "./img/throwing-1.png";
    img.onload = () => {
      ctx.drawImage(img, (gameWidth / 2 - img.width / 2), gameHeight - 20 - img.height);
    }
    
    return new Promise(resolve => {
      setTimeout(() => {
        clearBoard();
        img.src = './img/throwing-2.png';

          setTimeout(() => {
          clearBoard();
          img.src = './img/throwing-3.png';
      
          setTimeout(() => {
            clearBoard();
            img.src = './img/throwing-4.png';
            setTimeout(() => {
              imgX = gameWidth / 2 - img.width / 2;
              imgY = gameHeight - 20 - img.height;
              resolve();
            }, 100);
          }, 300);
        }, 200);
      }, 200);
    });
}


async function mainAnimation () {
    return new Promise (resolve => {
      throwingAnimation().then(() => {
        nextTick();
      });


      function nextTick () {
        setTimeout(() => {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(imgX, imgY, img.width, img.height);
          imgY += 5;
          ctx.drawImage(img, imgX, imgY);
          if (imgY < gameHeight)
            nextTick();
          else
            resolve();
        }, 1);
      }
    });
}

async function introGame () {
  return new Promise (resolve => {
    mainAnimation().then(() => {
      ctx.textAlign = 'center';
      ctx.font = '120px Lumanosimo, cursive';
      ctx.fillStyle = textColor;
      ctx.fillText("3", gameWidth / 2, gameHeight / 2);
      clockTickSound.play();
      setTimeout (() => {
        clearBoard();
        ctx.fillStyle = textColor;
        ctx.fillText("2", gameWidth / 2, gameHeight / 2);
        clockTickSound.play();
        setTimeout (() => {
          clearBoard();
          ctx.fillStyle = textColor;
          ctx.fillText("1", gameWidth / 2, gameHeight / 2);
          clockTickSound.play();
          setTimeout (() => {
            let textX = gameWidth / 2;
            let textY = gameHeight / 2;
            clearBoard();
            ctx.fillStyle = textColor;
            ctx.fillText("Start", textX, textY);
            startGameSound.play();
            
            setTimeout(nextTick, 600);

            function nextTick () {
              setTimeout(() => {
                clearBoard();
                ctx.fillStyle = textColor;
                textY += 5;
                ctx.fillText("Start", textX, textY);
                if (textY < gameHeight + 120)
                  nextTick();
                else {
                  clearBoard();
                  drawRook(rookX, rookY);
                  isRook = true;
                  resolve();
                }
              }, 1);
            }
        }, 1200);
        }, 1000);
      }, 1000);
    });
  });
}

function clearBoard () {
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function drawRook (x, y) {
  let image = new Image();
  image.src = "./img/rook-2.png";
  image.onload = () => {
    ctx.drawImage(image, x, y);
  }
}

function drawBird (x, y) {
  let image = new Image();
  image.src = "./img/bird-1.png";
  image.onload = () => {
    ctx.drawImage(image, x, y);
  }
}

function createMap () {
  let correctWay = Math.floor(Math.random() * 5);
  let emptyWay;
  let row;

  row = [0, 0, 0, 0, 0];
  map.push(row);

  for (i = 1; i < 120; i++) {
    let numberOfBirds = Math.floor(Math.random() * 4) + 1;
    emptyWay = Math.floor(Math.random() * 3) - 1;

    if (correctWay == 0 && emptyWay == -1) {
      emptyWay = Math.floor(Math.random() * 2);
    }
    else if (correctWay == 4 && emptyWay == 1) {
      emptyWay = Math.floor(Math.random() * 2) - 1;
    }

    emptyWay = correctWay + emptyWay;

    row = [0, 0, 0, 0, 0];

    for (j = 0; j < numberOfBirds; j++) {
      let checked = false;
      let index;
      while (!checked) {
        index = Math.floor(Math.random() * 5);
        if (index != emptyWay && row[index] != 1) {
          row[index] = 1;
          checked = true;
        }
      }
    }

    map.push(row);
    correctWay = emptyWay;
  }
}

function moveRook (event) {
  if (isRook) {
    const left = (37 || 65);
    const right = (39 || 68);

    if (event.keyCode == left && rookX > 150) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(rookX, rookY, 100, 100);
      rookX -= 100;
      placeOfRook--;
      drawRook(rookX, rookY);
    }
    else if (event.keyCode == right && rookX < 550) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(rookX, rookY, 100, 100);
      rookX += 100;
      placeOfRook++;
      drawRook(rookX, rookY);
    }
  }
}

function nextMove () {
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, gameWidth, gameHeight - 100);


  if (moveCounter % 120 == 0) {
    createMap();
    rookSpeed -= 100;
  }

  for (i = 0; i < 4; i++) {
    let birdX = 150;
    let birdY = 300 - i * 100;


    currentRow = map[moveCounter + i];

    currentRow.forEach((isBird) => {
      if (isBird == 1) {
        drawBird(birdX, birdY);
      }
      birdX += 100;
    });
  }

  moveCounter++;
  gameTickSound.play();

  if (checkColission()) {
    console.log(1);
  }
  else {
    setTimeout(() => {
      nextMove();
    }, rookSpeed);
  }
}

function checkColission () {
  currentRow = map[moveCounter - 1];

  if (currentRow[placeOfRook - 1] == 1) {
    return true;
  }
}