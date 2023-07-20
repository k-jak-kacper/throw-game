const gameBoard = document.querySelector('#game-board');
const ctx = gameBoard.getContext('2d');

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;

const backgroundColor = 'white';
const textColor = 'black';

let img = new Image();
let imgX, imgY;

function clearBoard() {
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}

const throwingAnimation = new Promise (resolve => {
  img.src = "./img/throwing-1.png";
  img.onload = () => {
    ctx.drawImage(img, (gameWidth / 2 - img.width / 2), gameHeight - 20 - img.height);
  }

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

function startGame() {

}


const mainAnimation = new Promise(resolve => {
  throwingAnimation.then(() => {
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
}) 

async function introGame () {
  mainAnimation.then(() => {
    ctx.textAlign = 'center';
    ctx.font = '120px Lumanosimo, cursive';
    ctx.fillStyle = textColor;
    ctx.fillText("3", gameWidth / 2, gameHeight / 2);
    setTimeout (() => {
      clearBoard();
      ctx.fillStyle = textColor;
      ctx.fillText("2", gameWidth / 2, gameHeight / 2);
      setTimeout (() => {
        clearBoard();
        ctx.fillStyle = textColor;
        ctx.fillText("1", gameWidth / 2, gameHeight / 2);
      }, 1000);
    }, 1000);
  });
}