var hardness = Number(prompt("Виберіть рівень складності \n1  Легкий \n2 Середній\n3 Важкий", "1"));
var ball;
var me;
var ai;
var backimg;
if(hardness == 2) {
  var aispeed = 12;
  var buffer = 10;
} else {
  var aispeed = 4;
  var buffer = 20;
}
var topgoal;
var bottomgoal;
var kicksound;
var cheers;
var hitwallsound;
var footballimg;
var goaldist = 100;

function preload() {
  // https://cors-anywhere.herokuapp.com/
  scorefont = loadFont('https://dl.dropbox.com/s/6skho5htqsdvcfn/scoreboard.ttf?raw=1');
  kicksound = loadSound("https://dl.dropbox.com/s/3etf4lhvu0rosdw/FOOTBALLKICK.mp3?raw=1");
  cheers = loadSound("https://dl.dropbox.com/s/cntfvu6mtjzcptp/cheer2.mp3?raw=1");
  hitwallsound = loadSound("https://dl.dropbox.com/s/hhb1340y06tb2eu/BOUNCE%2B1.mp3?raw=1");
  footballimg = loadImage('https://dl.dropbox.com/s/hdbe2jp5frpaj34/unnamed.png?raw=1');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  ball = new SoccerBall();
  me = new Players(width / 2, height - 100, 'me', [102, 255, 255]);
  ai = new Players(width / 2, 100, 'ai', [255, 255, 51]);
  // rectMode(CENTER);
  frameRate(50);
  // background(0, 255, 0);
}

function draw() {
  // background(0, 255, 0);
  var j = 0;
  for(var i = 0; i < height; i += height / 12) {
    if(j % 2 == 0) {
      fill(76, 187, 23);
    } else {
      fill(57, 255, 20);
    }
    noStroke();
    rectMode(CORNER);
    rect(0, i, width, height / 12);
    j++;
  }
  drawbg();
  ball.show();
  ball.move();
  ball.checkCollision();
  me.show();
  me.move();
  me.hitTheBall(ball);
  ai.show();
  ai.hitTheBall(ball);
  ai.aimove(ball);
  showScores();
  ball.debugme();
  ball.fixme();
}
class SoccerBall {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.xvel = -5;
    this.yvel = -5;
    this.maxx = 20;
    this.maxy = 20;
    this.r = 30;
    this.lasthitters = [];
  }
  show() {
    // texture(footballimg);
    // fill(255);
    noStroke();
    imageMode(CENTER);
    image(footballimg, this.x, this.y, this.r, this.r);
    // ellipse(this.x, this.y, this.r, this.r);
  }
  move() {
    this.x += this.xvel;
    this.y += this.yvel;
    // this.x *= random(0.99, 1.01);
    // this.y *= random(0.99, 1.01);
    this.x = constrain(this.x, -10, width + 10);
    this.y = constrain(this.y, -10, height + 10);
  }
  checkCollision() {
    if(this.y < 0) {
      if(this.x > (width / 2 - topgoal.width / 2) && this.x < (width / 2 + topgoal.width / 2)) {
        ai.score++;
        this.reset();
        this.goaled();
      } else {
        this.yvel *= -0.95;
        hitwallsound.play();
      }
    } else if(this.y + this.r / 2 > height) {
      if(this.x > (width / 2 - bottomgoal.width / 2) && this.x < (width / 2 + bottomgoal.width / 2)) {
        me.score++;
        this.reset();
        this.goaled();
      } else {
        this.yvel *= -0.95;
        hitwallsound.play();
      }
    } else if(this.x < 0) {
      this.xvel *= -1.05;
      hitwallsound.play();
    } else if(this.x + this.r / 2 > width) {
      this.xvel *= -1.05;
      hitwallsound.play();
    }
    //fix the bug ball stuck at the top
    // if(this.xvel >= -2 && this.xvel <= 2) {
    //   this.xvel++;
    // }
  }
  reset() {
    this.x = width / 2;
    this.y = height / 2;
    var dire = floor(random(1, 5));
    switch (dire) {
      case 1:
        this.xvel = 5;
        this.yvel = 5;
        break;
      case 2:
        this.xvel = -5;
        this.yvel = 5;
        break;
      case 3:
        this.xvel = 5;
        this.yvel = -5;
        break;
      case 4:
        this.xvel = -5;
        this.yvel = -5;
        break;
      default:
        this.xvel = 5;
        this.yvel = 5;
    }
  }
  goaled() {
    noLoop();
    textFont(scorefont);
    textSize(120);
    fill(255, 255, 0);
    textAlign(CENTER, BASELINE);
    text('GOAL!', width / 2, height / 2);
    cheers.play();
    setTimeout(loop, 3000);
  }
  debugme() {
        if((this.x < 0 && this.y < 0) || (this.x < 0 && this.y + this.r > height) || (this.x > width && this.y + this.r > height) || (this.x > width && this.y < 0)) {

      this.reset();
    }
  }
  fixme() {
    var counts = {};
    this.lasthitters.forEach(function(x) {
      counts[x] = (counts[x] || 0) + 1;
    });
    if(counts.me == 20 || counts.ai == 20) {
      this.reset();
      this.lasthitters.splice(0, 20);
    }
  }
}
class Players {
  constructor(x, y, name, fillcol) {
    this.x = x;
    this.y = y;
    this.r = 50;
    this.score = 0;
    this.name = name;
    this.fillcol = fillcol;
  }
  show() {
    fill(this.fillcol[0], this.fillcol[1], this.fillcol[2]);
    noStroke();
    ellipse(this.x, this.y, this.r, this.r);
  }
  move() {
    if(hardness == 3) {
      this.x = width - mouseX;
    } else {
      this.x = mouseX;
    }
    this.x = constrain(this.x, this.r / 2, width - this.r / 2);
  }
  aimove(follow) {
    // if(follow.x > width / 2) {
    //   this.y = follow.y;
    // }
    if(follow.yvel < 0 && follow.y < height / 2) {
      if(this.x < follow.x - buffer) {
        if(this.x + this.r < height) {
          this.x += aispeed;
        }
      } else if(this.x > follow.x + buffer) {
        if(this.x + this.r > 0) {
          this.x -= aispeed;
        }
      }
    }
    this.x = constrain(this.x, this.r / 2, width - this.r / 2);
  }
  hitTheBall(whichball) {
    var distbw = dist(this.x, this.y, whichball.x, whichball.y);
    if(distbw < (this.r + whichball.r) / 2) {
      whichball.lasthitters.push(this.name);
      if(whichball.lasthitters.length > 20) {
        whichball.lasthitters.splice(0, 20);
      }
      whichball.yvel *= random(-0.8, -1.2);
      // whichball.y += whichball.yvel;
      // whichball.yvel *= random(0.8, 1.2);
      var deltaX = whichball.x - (this.x + this.r);
      whichball.xvel = deltaX * 0.1;
      whichball.xvel = constrain(whichball.xvel, -whichball.maxx, whichball.maxx);
      whichball.yvel = constrain(whichball.yvel, -whichball.maxy, whichball.maxy);
      //fix the precision
      whichball.xvel = Number(whichball.xvel.toFixed(2));
      whichball.yvel = Number(whichball.yvel.toFixed(2));
      kicksound.play();
    }
  }
}

function drawbg() {
  rectMode(CENTER);
  noFill();
  // noStroke();
  stroke(255);
  strokeWeight(5);
  //middleline and circle
  line(0, height / 2, width, height / 2);
  ellipse(width / 2, height / 2, 100, 100);
  //left player goal
  topgoal = {
    x: width / 2,
    y: 0,
    width: goaldist,
    height: goaldist
  }
  rect(topgoal.x, topgoal.y, topgoal.width, topgoal.height);
  //right player goal
  bottomgoal = {
    x: width / 2,
    y: height,
    width: goaldist,
    height: goaldist
  }
  rect(bottomgoal.x, bottomgoal.y, bottomgoal.width, bottomgoal.height);
}

function showScores() {
  fill(0);
  textFont(scorefont);
  textSize(50);
  var score = ai.score + " : " + me.score;
  textAlign(CENTER, BASELINE);
  text(score, width / 2, height / 2);
}
