const canvasSize=600;
let squares=[];
let squareSize;
let rows=10;
let cols=10;
let gameover,winner;
let bombCount;
let firstMove;
let currentX,currentY;
let flag,bomb;
let timer;
let gameStarted;
let levelText;
let leftClick;
let rightClick;
let newRecord;


function setup() {
  let canvasHeight = canvasSize*1.1;
  initFirebase();
  createCanvas(canvasSize, canvasHeight);
  createReset();
  Easy();
}

function draw() {
  background(90,70);
  
  
  drawHeading();
  textFont('Arial');
  if (gameover) background(90,150);
  showAllSquares();
  showHighlighted();
  checkWinner();
  if (frameCount % 60 == 0 && gameStarted && !gameover) timer++;
  clearAll();
}

function clearAll(){
  let x = mouseX;
  let y = mouseY;
  if (rightClick && x > 0 && x < height && y > 0 && y < height && !squares[currentX][currentY].active){  
    let adj = squares[currentX][currentY].getAdj();
    if (adj){
      for (let i=0;i<adj.length;i+=2){
        clearSquare(adj[i],adj[i+1]);
      }
    }
    
  }  
  rightClick=false;
  
}

function drawHeading(){
  
  let ymax = height * 0.1;
  for (let i=ymax;i>0;i-=0.5){
    let m = map(i, 0, ymax, 10, 160,80);
    stroke(10,m,10);
    strokeWeight(0.5);
    line(0,i,width,i);
  }
  
  let flagCount=0;
  for (let i=0;i<rows;i++)
    for (let j=0;j<cols;j++){
      if (squares[i][j].flagged) flagCount++;
    }
  flagCount=bombCount-flagCount;
  fill(0);
  stroke(0);
  strokeWeight(1);
  line(0,height*0.1,width,height*0.1);
  
  textSize(width/22);
  noStroke();
  textFont('Tahoma');
  textAlign(CENTER,TOP);
  text(timer,width/2,height*0.02);
  
  textAlign(RIGHT,TOP);
  textFont('Arial');
  text(flagCount,width-(width*0.02),height*0.02);
  
  textFont('Ink Free');
  textAlign(LEFT,TOP);
  if (levelText=='Easy') hs=easyHS;
  else if (levelText=='Medium') hs=mediumHS;
  else hs=hardHS;
  text(levelText+' (record:'+hs+')',0,height*0.02);
  
  image(flag,width-(width*0.1),height*0.04,width/23,width/23);
}

function createReset(){
  let resetGame,easy,medium,hard;
  resetGame = createButton('Reset');
  resetGame.size(width/10);
  resetGame.position(width - width/10,height);
  resetGame.mousePressed(createSquares);
  
  easy = createButton('Easy');
  easy.size(width/8);
  easy.position(0,height);
  easy.mousePressed(Easy);
  
  medium = createButton('Medium');
  medium.size(width/8);
  medium.position(width/8,height);
  medium.mousePressed(Medium);
  
  hard = createButton('Hard');
  hard.size(width/8);
  hard.position(width/4,height);
  hard.mousePressed(Hard);
  
  
}

function Easy(){
  levelText = 'Easy';
  bombCount = 15;
  rows=10;
  cols=10;
  createSquares();
}
function Medium(){
  levelText = 'Medium';
  bombCount = 40;  
  rows=15;
  cols=15;
  createSquares();
}
function Hard(){
  levelText = 'Hard';
  bombCount = 80;
  rows=20;
  cols=20;
  createSquares();
}

function checkWinner(){
  let counter=0;
  for (let i=0;i<rows;i++)
    for (let j=0;j<cols;j++) {
      if (squares[i][j].active)
        counter++;
    }
  if (counter == bombCount){
    textSize(width/8);
    fill(250,10,10,190);
    textAlign(CENTER);
    textFont('Ink Free');
    text('Winner!',width/2,height/1.9);
    if (!gameover){
      if (levelText == 'Easy' && timer < easyHS){
        highScore(levelText,timer)
      } else if (levelText == 'Medium' && timer < mediumHS){
        highScore(levelText,timer)
      } else if (levelText == 'Hard' && timer < hardHS){
        highScore(levelText,timer)
      }
    }
    if (newRecord) {
      textSize(width/14);
      fill(0);
      text('New Record! - '+timer+' seconds!',width/2,height/1.6);
    }
    gameover=true;
    Winner();
  }
}

function showAllSquares(){
  for (let i=0;i<rows;i++)
    for (let j=0;j<cols;j++) {
      squares[i][j].show();
  }
}

function createSquares(){
  gameover = false;
  newRecord=false;
  firstMove = true;
  gameStarted = false;
  timer = 0;
  squareSize = width/rows;
  squares = [];
  for (let element of document.getElementsByClassName("p5Canvas")) {
    element.addEventListener("contextmenu", (e) => e.preventDefault());
  }
  let clr=true;
  for (let i=0;i<rows;i++){
    squares[i] = [];
    if (cols%2==0) clr=!clr;
    for (let j=0;j<cols;j++){
      let posx = i*squareSize + squareSize/2;
      let posy = j*squareSize + squareSize/2 + height*0.1;
      squares[i][j] = new Square(posx,posy);
      squares[i][j].indexx = i;
      squares[i][j].indexy = j;
      
      if (clr) {
        squares[i][j].Color = [10,140,10,190];
        squares[i][j].inactiveColor = [220,220,220,190];
      }
      else {
        squares[i][j].Color = [10,160,10,190];
        squares[i][j].inactiveColor = [180,180,180,190];
      }
      clr=!clr;
    }
  }
}


let connected;
function generateBombs(x,y){
  
  for (let i=0;i<rows;i++)
    for (let j=0;j<cols;j++){
      squares[i][j].bomb = false;
      squares[i][j].count = 0
      squares[i][j].emptyAdj = [];
      squares[i][j].Nbrs = [];
      squares[i][j].calcAdjacent = false;
    }
  
  for (let i=0;i<bombCount;i++){
    let randx = floor(random(0,rows));
    let randy = floor(random(0,cols));
    while (randx == x && randy == y){
      randx = floor(random(0,rows));
      randy = floor(random(0,cols));
    }

    while (squares[randx][randy].bomb || (randx == x && randy == y)){
      randx = floor(random(0,rows));
      randy = floor(random(0,cols));
    }
    squares[randx][randy].bomb = true;
  }
  
  for (let i=0;i<rows;i++)
    for (let j=0;j<cols;j++)
      squares[i][j].countAdjacent();
  
  for (let i=0;i<rows;i++)
    for (let j=0;j<cols;j++)
      squares[i][j].emptyAdjacent();
  for (let i=0;i<rows;i++)
    for (let j=0;j<cols;j++){
      squares[i][j].getNbr();
      squares[i][j].visited = false
    }
  
  connected =true;
  checkConnected(x,y);
  for (let i=0;i<rows;i++)
    for (let j=0;j<cols;j++)
      if (!squares[i][j].bomb && !squares[i][j].visited)
        connected = false;
  if (!connected) generateBombs(x,y);
  else gameStarted = true;
  
}

function checkConnected(x,y){
  if (squares[x][y].visited == false){
    squares[x][y].visited = true;
    for (let i=0;i<squares[x][y].Nbrs.length;i+=2){
      if (squares[squares[x][y].Nbrs[i]][squares[x][y].Nbrs[i+1]].bomb == false){
        checkConnected(squares[x][y].Nbrs[i],squares[x][y].Nbrs[i+1]);
      }
    }
  }
  
  

}
function showHighlighted(){
  let x = mouseX;
  let y = mouseY;
  for (let i=0;i<rows;i++)
    for (let j=0;j<cols;j++) {
      let left = squares[i][j].posx - squareSize/2;
      let right = squares[i][j].posx + squareSize/2;
      let up = squares[i][j].posy - squareSize/2;
      let down = squares[i][j].posy + squareSize/2;
      if (x > left && x < right && y > up && y < down && !gameover){
        squares[i][j].highlighted = true;
        currentX = i;
        currentY = j;
      }
      else
        squares[i][j].highlighted = false;
  }
}

function mousePressed(){
  let x = mouseX;
  let y = mouseY;
  if (x > 0 && x < height && y > 0 && y < height && firstMove && squares[currentX][currentY].highlighted && squares[currentX][currentY].active){
    generateBombs(currentX,currentY);
    firstMove=false;
    clearSquare(currentX,currentY);
    
  } else if (x > 0 && x < height && y > 0 && y < height){  
    if (mouseButton == LEFT && !gameover){
      if (squares[currentX][currentY].highlighted && squares[currentX][currentY].active && !squares[currentX][currentY].flagged)
        clearSquare(currentX,currentY);
        
    } else if (!gameover){     
      for (let i=0;i<rows;i++)
        for (let j=0;j<cols;j++) {
          if (squares[i][j].highlighted && squares[i][j].active)
            if (squares[i][j].flagged+1 >=3) squares[i][j].flagged = 0;
            else squares[i][j].flagged++;
        }
    }
  }
  if (mouseButton == LEFT)
    leftClick=true;
  if (mouseButton == RIGHT)
    rightClick=true;
}

function clearSquare(i,j){
  //squares[i][j].active = false;
  if (squares[i][j].bomb) gameover = true;
  else checkAdjacent(i,j);
}

function GameOver(){
  for (let i=0;i<rows;i++)
    for (let j=0;j<cols;j++) {
      squares[i][j].show();
  }
}

function checkAdjacent(i,j){
  if(squares[i][j].count == 0 && squares[i][j].active){
    for (let k=0;k< squares[i][j].emptyAdj.length;k+=2){
      let x = squares[i][j].emptyAdj[k];
      let y = squares[i][j].emptyAdj[k+1];
      //squares[x][y].active = false;
      squares[i][j].active = false;
      checkAdjacent(x,y);
      
    } 
  } 
  squares[i][j].active = false;
}

function preload(){
  flag = loadImage("flag.png");
  bomb = loadImage("bomb.png");
}