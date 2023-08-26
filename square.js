class Square{
  constructor(x,y,indexx,indexy){
    this.posx = x;
    this.posy = y;
    this.indexx = indexx;
    this.indexy = indexy;
    this.bomb = false;
    this.active = true;
    this.highlighted = false;
    this.count = 0;
    this.adjacentcies = [];
    this.emptyAdj = [];
    this.calcAdjacent = false;
    this.flagged = 0;
    this.Color = null;
    this.inactiveColor = null;
    this.textColor = 0;
    this.flagCount = 0;
    
    this.visited = false;
    this.Nbrs =[];
  }
  
  show(){
    textAlign(CENTER,CENTER);
    textSize(squareSize/1.5);
    textStyle(BOLD);
    rectMode(CENTER);
    imageMode(CENTER);
    noStroke();
    if (gameover) {
      strokeWeight(0.05);
      stroke(0,180);
    }
    if (this.flagged==1){
      fill(this.Color);
      square(this.posx,this.posy,squareSize);
      image(flag, this.posx, this.posy, squareSize/1.5,squareSize/1.5);
    }
    else if (this.flagged ==2 && !gameover){
      fill(this.Color);
      square(this.posx,this.posy,squareSize);
      fill(0);
      textSize(squareSize/1.5);
      text('?',this.posx,this.posy)
    }
    else if (this.active){
      fill(this.Color);
      square(this.posx,this.posy,squareSize);
    } else if (!gameover){
      fill(this.inactiveColor);
      square(this.posx,this.posy,squareSize);
      fill(this.textColor);
      if (this.count !=0) text(this.count,this.posx,this.posy);
    } else{
      fill(60,180);
      square(this.posx,this.posy,squareSize);
      fill(this.textColor);
      if (this.count !=0) text(this.count,this.posx,this.posy);
    }
    if (this.highlighted && this.active && !this.flagged){
      fill(110);
      square(this.posx,this.posy,squareSize);
    }
    if (gameover && this.bomb && this.flagged!=1){
      image(bomb, this.posx, this.posy, squareSize/1.5,squareSize/1.5);
    }
    if (gameover && !this.bomb && this.flagged ==1){
      fill(255,0,0);
      square(this.posx,this.posy,squareSize);
      image(flag, this.posx, this.posy, squareSize/1.5,squareSize/1.5);
    }
  }
  emptyAdjacent() {
    if (this.count == 0){
      for (let i=0; i<this.adjacentcies.length;i+=2){
        let x = this.adjacentcies[i];
        let y = this.adjacentcies[i+1];
        this.emptyAdj.push(this.adjacentcies[i]);
        this.emptyAdj.push(this.adjacentcies[i+1]);
      }
    } else {
      for (let i=0; i<this.adjacentcies.length;i+=2){
        let x = this.adjacentcies[i];
        let y = this.adjacentcies[i+1];
        if (squares[x][y].count == 0){
          this.emptyAdj.push(squares[x][y].indexx,squares[x][y].indexy);
        }
      
      }
    }    
  }
  countAdjacent() {
    if (!this.calcAdjacent){
      let x = this.indexx;
      let y = this.indexy;
      if (x -1 >=0){
        this.adjacentcies.push(x-1,y);
        if (squares[x-1][y].bomb) this.count++;
      }
      if (x +1 < rows){
        this.adjacentcies.push(x+1,y);
        if (squares[x+1][y].bomb) this.count++;
      }
      if (y -1 >=0){
        this.adjacentcies.push(x,y-1);
        if (squares[x][y-1].bomb) this.count++;
      }
      if (y +1 <cols){
        this.adjacentcies.push(x,y+1);
        if (squares[x][y+1].bomb) this.count++;
      }
      if (x -1 >=0 && y -1 >=0){
        this.adjacentcies.push(x-1,y-1);
        if (squares[x-1][y-1].bomb) this.count++;
      }
      if (x +1 <rows && y -1 >=0){
        this.adjacentcies.push(x+1,y-1);
        if (squares[x+1][y-1].bomb) this.count++;
      }
      if (x +1 <rows && y +1 <cols){
        this.adjacentcies.push(x+1,y+1);
        if (squares[x+1][y+1].bomb) this.count++;
      }
      if (x -1 >=0 && y +1 <cols){
        this.adjacentcies.push(x-1,y+1);
        if (squares[x-1][y+1].bomb) this.count++;
      }
    } 
    this.calcAdjacent = true;
    if (this.bomb) this.count = 'B';
    else {
      switch (this.count) {
        case 1:
          this.textColor = [0,0,200];
          break;
        case 2:
          this.textColor = [10,120,10];
          break;
        case 3:
          this.textColor = [200,0,0];
          break;
        case 4:
          this.textColor = [128,0,128];
          break;
        case 5:
          this.textColor = 0;
          break;
        case 6:
          this.textColor = [255,165,0];
          break;
        case 7:
          this.textColor = [0,0,128];
          break;
        case 8:
          this.textColor = 0;
          break;
        default:
          break;
      //  
      }
    }
  }
  
  getAdj(){
    let x = this.indexx;
    let y = this.indexy;
    let adj =[];
    this.flagCount=0;
    
    if (x -1 >=0){
      if (squares[x-1][y].flagged ==1)
        this.flagCount++;
      else adj.push(x-1,y);
    }
    if (x +1 < rows){      
      if (squares[x+1][y].flagged ==1)
        this.flagCount++;
      else adj.push(x+1,y);
    }
    if (y -1 >=0){      
      if (squares[x][y-1].flagged ==1)
        this.flagCount++;
      else adj.push(x,y-1);
    }
    if (y +1 <cols){      
      if (squares[x][y+1].flagged ==1)
        this.flagCount++;
      else adj.push(x,y+1);
    }
    if (x -1 >=0 && y -1 >=0){      
      if (squares[x-1][y-1].flagged ==1)
        this.flagCount++;
      else adj.push(x-1,y-1);
    }
    if (x +1 <rows && y -1 >=0){      
      if (squares[x+1][y-1].flagged ==1)
        this.flagCount++;
      else adj.push(x+1,y-1);
    }
    if (x +1 <rows && y +1 <cols){      
      if (squares[x+1][y+1].flagged ==1)
        this.flagCount++;
      else adj.push(x+1,y+1);
    }
    if (x -1 >=0 && y +1 <cols){      
      if (squares[x-1][y+1].flagged ==1)
        this.flagCount++;
      else adj.push(x-1,y+1);
    }
    
    if (this.flagCount == this.count)
      return adj;
    else return false;
  }
  
  
  
  getNbr(){
    let x = this.indexx;
    let y = this.indexy;
    let adj =[];
        
    if (x -1 >=0){
      adj.push(x-1,y);
    }
    if (x +1 < rows){      
      adj.push(x+1,y);
    }
    if (y -1 >=0){      
      adj.push(x,y-1);
    }
    if (y +1 <cols){      
      adj.push(x,y+1);
    }    
    this.Nbrs = adj;
  }
}


