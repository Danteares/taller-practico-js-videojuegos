const canvas = document.querySelector("#game")
const game = canvas.getContext('2d')
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord=document.querySelector('#record');
const pResult=document.querySelector('#result');

let canvasSize
let elementsSize
let level = 0;
let lives = 3;
let timeStart;
let timePlayer;
let timeInterval;
const playerPosition =
{
    x: undefined,
    y: undefined
}
const giftPosition = {
    x: undefined,
    y: undefined,
};
let enemyPositions = [];
window.addEventListener('load', setCanvasSize)
window.addEventListener('resize', setCanvasSize)
function startGame() {


    enemyPositions = []
    game.font = elementsSize + 'px Verdana'
    game.textAlign = 'end'
    const map = maps[level]
    if (!map) {
        gameWin();
        return;
      }
      if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
      }
    const mapRows = map.trim().split("\n")
    const mapRowCols = mapRows.map(row => row.trim().split(''))
    showLives();
   
    //Forma alternativa
    //const map = maps[0]
    //                   .match(/[IXO\-]+]/g)
    //                    .map(a=>a.split(""))
    /*for (let i = 0; i < 10; i++) {
        for(let j=1;j<=10;j++)
        game.fillText(emojis[mapRowCols[j-1][i]], (elementsSize*(i+0.11))*1.15, elementsSize*(j-0.15)*1.17);
        
      }*/
    //Forma alternativa
    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI + 1.25) * 1.15
            const posY = elementsSize * (rowI + 0.85) * 1.17
            if (col == 'O' && !playerPosition.x && !playerPosition.y) {
                playerPosition.x = posX
                playerPosition.y = posY
            }
            else if (col == 'I') {
                giftPosition.x = posX;
                giftPosition.y = posY;
            }
            else if (col == 'X') {
                enemyPositions.push({
                    x: posX,
                    y: posY,
                })
            }
            game.fillText(emoji, posX, posY);
        })
    });
    movePlayer()


}
window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function movePlayer() {
    const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftCollision = giftCollisionX && giftCollisionY;
    const enemyCollision = enemyPositions.find(enemy => {
        const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
        return enemyCollisionX && enemyCollisionY;
    });

    if (enemyCollision) {
        levelFail();
    }
    if (giftCollision) {
        levelWin();
    }
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y)
}
function gameWin() {
    console.log('¡Terminaste el juego!');
    clearInterval(timeInterval);
    const recordTime=localStorage.getItem('record_time');
    const playerTime=Date.now()-timeStart;
    if(recordTime){
        if(recordTime>=playerTime)
        {localStorage.setItem('record_time',playerTime);
        pResult.innerHTML='SUPERASTE EL RECORD :)';}
        else{pResult.innerHTML='lo siento, no superaste el records :(';}}
        else{localStorage.setItem('record_time',playerTime);
        pResult.innerHTML='Primera vez? Muy bien, pero ahora trata de superar tu tiempo :)';}
console.log({recordTime,playerTime});
  }
function levelWin() {
    console.log('Subiste de nivel');
    //if(maps[level+1])
    level++;
    setCanvasSize();
  }
  function levelFail() {
    console.log('Chocaste contra un enemigo :(');
    lives--;
  
    console.log(lives);
    
    if (lives <= 0) {
      level = 0;
      lives = 3;
      timeStart = undefined;
    }
  
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    setCanvasSize();
  }
  function showLives() {
    spanLives.innerHTML = emojis["HEART"].repeat(lives)
  }
  function showTime() {
    spanTime.innerHTML = Date.now() - timeStart;

  }
  function showRecord(){
    spanRecord.innerHTML=localStorage.getItem('record_time');
}
function moveByKeys(event) {
    if (event.key == 'ArrowUp') moveUp();
    else if (event.key == 'ArrowLeft') moveLeft();
    else if (event.key == 'ArrowRight') moveRight();
    else if (event.key == 'ArrowDown') moveDown();
}
function moveUp() {

    if (playerPosition.y - elementsSize > elementsSize) {
        playerPosition.y -= elementsSize * 1.17
        setCanvasSize()
    }

}
function moveLeft() {

    if (playerPosition.x - elementsSize > elementsSize) {

        playerPosition.x -= elementsSize * 1.15
        setCanvasSize()
    }
}
function moveRight() {

    if (playerPosition.x + elementsSize < canvasSize) {
        playerPosition.x += elementsSize * 1.15
        setCanvasSize()
    }
}
function moveDown() {

    if (playerPosition.y + elementsSize < canvasSize) {
        playerPosition.y += elementsSize * 1.17
        setCanvasSize()
    }
}
function setCanvasSize() {
    if (window.innerHeight > window.innerWidth) {
        canvasSize = (window.innerWidth * 0.8)
    }
    else {
        canvasSize = (window.innerHeight * 0.8)
    }
    playerPosition.x = playerPosition.x / elementsSize
    playerPosition.y = playerPosition.y / elementsSize
    canvas.setAttribute('width', canvasSize)
    canvas.setAttribute('height', canvasSize)

    elementsSize = (canvasSize * 0.085)
    playerPosition.x = playerPosition.x * elementsSize
    playerPosition.y = playerPosition.y * elementsSize
    //elementsSize=(canvasSize*0.1)
    startGame()
}