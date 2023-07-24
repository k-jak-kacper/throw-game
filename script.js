const gameBoard = document.querySelector('#game-board');
const ctx = gameBoard.getContext('2d');
const startButton = document.querySelector('#start-button');

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;

const backgroundColor = 'white';
const textColor = 'black';

const clockTickSound = new Audio ("sounds/clock-tick-sound.mp3");
const startGameSound = new Audio ("sounds/game-start-sound.mp3");

let running = false;

let img = new Image();
let imgX, imgY;

startButton.addEventListener('click', startGame);

function clearBoard() {
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function beforeGame() {
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

function startGame() {
  if (!running) {
  running = true;
  startButton.textContent = "Reset";
  clearBoard();

  async function throwingAnimation() {
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
  };


  async function mainAnimation() {
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

const introGame = new Promise(resolve => {
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
                else
                  clearBoard();
              }, 1);
            }
        }, 1200);
        }, 1000);
      }, 1000);
    });
  });
  }
  else {
    location.reload();
  }
}