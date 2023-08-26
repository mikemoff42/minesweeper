
function Winner(){
  strokeWeight(2);
  stroke(255,70);
  let c1 = random(0,255);
  let c2 = random(0,255);
  let c3 = random(0,255);
  
  // if (newRecord)
  
  if(fireworks.length<3 && pieces.length < 2000){
    fireworks.push(new Firework());
  }

  for (let i=0;i<fireworks.length;i++){
    fireworks[i].show();
  }

  for (let i=0;i<pieces.length;i++){
    pieces[i].show();    
  }
  
  for (let i=fireworks.length-1;i>=0;i--){
    if (fireworks[i].lifetime <= 0) fireworks.splice(i,1);
  }
  for (let i=pieces.length-1;i>=0;i--){
    if (pieces[i].lifetime <= 0 || pieces[i].pos.x < 0 || pieces[i].pos.x > width || pieces[i].pos.y < 0 || pieces[i].pos.y > height) pieces.splice(i,1);
  }
}



let fireworks=[];



let gravity;
let pieces=[];

function Firework(x,y,exploded,alpha) {
  this.gravity = createVector(0,0.2);
  this.c1 = random(0,255);
  this.c2 = random(0,255);
  this.c3 = random(0,255);
  this.alphacounter = 100;
  this.colorchange = 0;
  this.sweight = random(0.5,5);
  
  this.lifetime=Infinity;
  this.burst=false;
  this.exploded=exploded;
  this.acc = createVector();
  
  if (!this.exploded){
    let speedmax = sqrt(canvasSize);
    speedmax/=1.5;
    let speedmin = speedmax/2;
    speedmax*=-1;
    speedmin*=-1;
    this.pos = createVector(random(width),height);
    this.vel = createVector(0,random(speedmax,speedmin));
    this.bit = false;
    
  } else {
    this.pos = createVector(x,y);
    this.vel = p5.Vector.random2D();
    //this.vel.mult(5);
    this.vel.mult(random(0.4,2));
    this.gravity.y = random(0.01,0.02);
    //this.vel.setMag(2.1);
    this.bit = true;
    this.lifetime=250;
  }
  
  this.applyForce = function(force){
    this.acc.add(force);
  }
  
  this.update = function() {
    if (!this.burst) {
      this.applyForce(this.gravity);
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
      //console.log('hi');
    }
    
    if (this.vel.y >= 0 && !this.burst && !this.bit){
      this.burst = true;
      this.vel.mult(0);
      Explode(this.pos.x,this.pos.y,this.c1,this.c2,this.c3);
      this.lifetime = 15;
    }
    
    this.lifetime--;
    this.alphacounter-=random(0.5,2);
    this.colorchange+=random(1,4);
    if(random()<0.5) this.colorchange*=-1;
    // if (this.vel.y >= 0 && this.burst) {
    //   this.vel.mult(0);
    // }
      
  }

  
  this.show = function(){
    this.update();
    strokeWeight(this.sweight);
    stroke(this.c1+this.colorchange,this.c2+this.colorchange,this.c3+this.colorchange,this.alphacounter); 
    point(this.pos.x,this.pos.y);
    // for (let i=0;i<this.bits.length;i++)
    //   this.bits[i].showBits();
  }
  
  // this.explode = function(){
  //   for (let i=0;i<100;i++) {
  //     pieces.push(new Firework(this.pos,true));
  //   }
  // }
}

function Explode(x,y,c1,c2,c3){
  let s = random(150,400);
  for (let i=0;i<s;i++) {
    let p = new Firework(x,y,true);
    p.c1 = c1;
    p.c2 = c2;
    p.c3 = c3;
    pieces.push(p);
  }
}