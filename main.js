// define variable for enemy count paragraph

var para = document.querySelector('p');
var count = 0;

// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;



// function to generate random number

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

function Circle(x, y, velX, velY, exists){
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

//Define the Circle draw method

Circle.prototype.draw = function() {
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.lineWidth = 3;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
};



// define Character constructor

function Character(x, y, velX, velY, health, exists, type) {
  Circle.call(this, x, y, velX, velY, exists)
  this.health = health;
  this.type = type;
}

Character.prototype = Object.create(Circle.prototype);
Character.prototype.constructor = Character;

Circle;


// define Enemy constructor, inheriting from Character

function Enemy(x, y, velX, velY, health, exists, color, size, type) {
  Character.call(this, x, y, velX, velY, health, exists, type);

  this.color = color;
  this.size = size;
}

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

Enemy

// define enemy draw method

Enemy.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

// define enemy update method

Enemy.prototype.update = function() {
  if(this.y <= player.y && this.x >= player.x){  //top right quadrant
    differenceBetweenX = this.x - player.x;
    differenceBetweenY = -(this.y - player.y);
    YMultiplier = 1-(differenceBetweenY/differenceBetweenX);
    XMultiplier = 1 - YMultiplier;
    this.y += this.velY * XMultiplier;
    this.x -= this.velX * YMultiplier;
  }
  if(this.y >= player.y && this.x >= player.x){ //
    differenceBetweenX = this.x - player.x;
    differenceBetweenY = this.y - player.y;
    YMultiplier = 1-(differenceBetweenY/differenceBetweenX);
    XMultiplier = 1 - YMultiplier;
    this.y -= this.velY * XMultiplier;
    this.x -= this.velX * YMultiplier;
  }
  if(this.y <= player.y && this.x <= player.x){
    differenceBetweenX = -(this.x - player.x);
    differenceBetweenY = -(this.y - player.y);
    YMultiplier = 1-(differenceBetweenY/differenceBetweenX);
    XMultiplier = 1 - YMultiplier;
    this.y += this.velY * XMultiplier;
    this.x += this.velX * YMultiplier;
  }  
  if(this.y >= player.y && this.x <= player.x){
    differenceBetweenX = -(this.x - player.x);
    differenceBetweenY = this.y - player.y;
    YMultiplier = 1-(differenceBetweenY/differenceBetweenX);
    XMultiplier = 1 - YMultiplier;
    this.y -= this.velY * XMultiplier;
    this.x += this.velX * YMultiplier;
  }    


};

// define enemy collision detection

Enemy.prototype.collisionDetect = function() {
  for(var j = 0; j < enemys.length; j++) {
    if(!(this === enemys[j])) {
      var dx = this.x - enemys[j].x;
      var dy = this.y - enemys[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + enemys[j].size && enemys[j].exists) {
        enemys[j].color = this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
      }
    }
  }
};


function Bullet(x,y, exists){
  Circle.call(this, x, y, 5, 5, exists);
}

Bullet.prototype = Object.create(Character.prototype);
Bullet.prototype.constructor = Bullet;

Bullet


Bullet.prototype.update = function() {
    this.y += this.velY;
    this.x += this.velX;
}  


// define Player constructor, inheriting from Character

function Player(x, y, exists) {
  Character.call(this, x, y, 20, 20, 10, exists, "friendly");

  this.color = 'white';
  this.size = 10;
}

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;



// define Player checkBounds method

Player.prototype.checkBounds = function() {
  if((this.x + this.size) >= width) {
    this.x -= this.size;
  }

  if((this.x - this.size) <= 0) {
    this.x += this.size;
  }

  if((this.y + this.size) >= height) {
    this.y -= this.size;
  }

  if((this.y - this.size) <= 0) {
    this.y += this.size;
  }
};

// define Player setControls method

Player.prototype.setControls = function() {
  var _this = this;
  window.onkeydown = function(e) {
    if(e.keyCode === 65) { // a
      _this.x -= _this.velX;
    } else if(e.keyCode === 68) { // d
      _this.x += _this.velX;
    } else if(e.keyCode === 87) { // w
      _this.y -= _this.velY;
    } else if(e.keyCode === 83) { // s
      _this.y += _this.velY;
    }
  };


};


// define Player collision detection

Player.prototype.collisionDetect = function() {
  for(var j = 0; j < enemys.length; j++) {
    if( enemys[j].exists ) {
      var dx = this.x - enemys[j].x;
      var dy = this.y - enemys[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + enemys[j].size) {
        enemys[j].exists = false;
        count--;
        para.textContent = 'Enemy count: ' + count;
      }
    }
  }
};



Player.prototype.shoot = function(mouseX, mouseY) {
  console.log("Evil Position" + player.x +" "+ mouseX +" "+ mouseY)
  var bullet = new Bullet(
      player.x,
      player.y,
      true
  );
  bullets.push(bullet);

};


// define array to store enemys

var enemys = [];
var bullets = [];

// define loop that keeps drawing the scene constantly

var player = new Player(random(0,width), random(0,height), true);

player.setControls();


canvas.addEventListener('click', function() { 
  var x = event.offsetX;
  var y = event.offsetY;
  mouseX = x;
  mouseY = y;
  player.shoot(mouseX, mouseY)

}, false);

function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);

  while(enemys.length < 20) {
    var size = random(10,20);
    var enemy = new Enemy(
      // enemy position always drawn at least one enemy width
      // away from the adge of the canvas, to avoid drawing errors
      random(0 + size,width - size),
      random(0 + size,height - size),
      1,
      1,
      10,
      true,
      'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
      size,
      "enemy"
    );
    enemys.push(enemy);
    count++;
    para.textContent = 'Enemy count: ' + count;
  }

  for(var i = 0; i < enemys.length; i++) {
    if(enemys[i].exists) {
      enemys[i].draw();
      enemys[i].update();
      enemys[i].collisionDetect();
    }
  }


  for(var i = 0; i < bullets.length; i++) {
    if(bullets[i].exists) {
      bullets[i].draw();
      bullets[i].update();
    }
  }


  player.draw();
  player.checkBounds();
  player.collisionDetect();

  requestAnimationFrame(loop);
}



loop();
