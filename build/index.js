(function () {
'use strict';

class Vector {
  static center(v1, v2) {
    return v1.add(v2).multiply(0.5).normalize();
  }

  static difference(v1, v2) {
    return v1.subtract(v2).normalize();
  }

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  getLength() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  add(v) {
    return new Vector(
      this.x + v.x,
      this.y + v.y
    );
  }

  subtract(v) {
    return this.add(v.invert());
  }

  multiply(scalar) {
    return new Vector(
      this.x * scalar,
      this.y * scalar
    );
  }

  invert() {
    return new Vector(
      -this.x,
      -this.y
    );
  }

  normalize() {
    return new Vector(
      Math.abs(this.x),
      Math.abs(this.y)
    );
  }

  clamp(vMin, vMax) {
    return new Vector(
      Math.max(vMin.x, Math.min(vMax.x, this.x)),
      Math.max(vMin.y, Math.min(vMax.y, this.y))
    );
  }

  clone() {
    return Object.assign({}, this);
  }
}

const DIRECTION_NONE = Symbol('none');
const DIRECTION_RIGHT = Symbol('right');
const DIRECTION_LEFT = Symbol('left');

const maxVelocity = 0.06;
const dampingGround = 0.75;
const dampingMidair = 0.98;
const runAcceleration = 0.008;

class Wheel {
  constructor() {
    this.direction = DIRECTION_NONE;
    this.runningPaused = false;
    this.blockedRight = false;
    this.blockedLeft = false;
    this.rotation = 0;
    this.velocity = 0;
    this.acceleration = 0;
  }

  runRight() {
    if (!this.blockedRight) {
      this.direction = DIRECTION_RIGHT;
      this.acceleration += runAcceleration;
      this.runningPaused = false;
    }
  }

  runLeft() {
    this.direction = DIRECTION_LEFT;
    this.acceleration -= runAcceleration;
    this.runningPaused = false;
  }

  blockRight() {
    if (this.direction === DIRECTION_RIGHT) {
      // this.direction = DIRECTION_NONE;
      // this.acceleration = 0;
      // this.velocity = 0;
      // this.runningPaused = false;
      this.blockedRight = true;
    }

    if (this.velocity > 0) {
      this.velocity = 0;
    }
  }

  blockLeft() {
    if (this.direction === DIRECTION_LEFT) {
      // this.direction = DIRECTION_NONE;
      // this.acceleration = 0;
      // this.velocity = 0;
      // this.runningPaused = false;
      this.blockedLeft = true;
    }

    if (this.velocity < 0) {
      this.velocity = 0;
    }
  }

  unblockRight() {
    this.blockedRight = false;
  }

  unblockLeft() {
    this.blockedLeft = false;
  }

  stopRunning() {
    this.direction = DIRECTION_NONE;
    this.acceleration = 0;
    this.runningPaused = false;
  }

  pauseRunning() {
    this.runningPaused = true;
    this.acceleration = 0;
  }

  continueRunning() {
    if (this.runningPaused) {
      this.runningPaused = false;

      switch (this.direction) {
        case DIRECTION_LEFT:
          this.runLeft();
          break;
        case DIRECTION_RIGHT:
          this.runRight();
          break;
      }
    }
  }

  update() {
    if (this.direction === DIRECTION_RIGHT && this.blockedRight) {
      return;
    }

    if (this.direction === DIRECTION_LEFT && this.blockedLeft) {
      return;
    }

    this.velocity += this.acceleration;

    if (this.velocity > 0 && this.velocity >= maxVelocity) {
      this.velocity = maxVelocity;
      this.acceleration = 0;
    } else if (this.velocity < 0 && this.velocity <= -maxVelocity) {
      this.velocity = -maxVelocity;
      this.acceleration = 0;
    }

    if (this.direction === DIRECTION_NONE && this.velocity) {
      this.velocity = dampingGround * this.velocity;
    }

    if (this.runningPaused && this.velocity) {
      this.velocity = dampingMidair * this.velocity;
    }

    this.rotation += this.velocity;
  }
}

const DIRECTION_RIGHT$1 = Symbol('right');
const DIRECTION_LEFT$1 = Symbol('left');

const jumpGravityAcceleration = -0.5;
const freefallGravityAcceleration = -1.2;
const jumpInitialVelocity = 9;

class Player {
  constructor() {
    this.direction = DIRECTION_RIGHT$1;
    this.jumpPosition = 0;
    this.jumpVelocity = 0;
    this.jumpAcceleration = 0;
    this.jumping = false;
    this.fallBlocked = false;
    this.jumpBlocked = false;
  }

  turnLeft() {
    this.direction = DIRECTION_LEFT$1;
  }

  turnRight() {
    this.direction = DIRECTION_RIGHT$1;
  }

  facingLeft() {
    return this.direction === DIRECTION_LEFT$1;
  }

  facingRight() {
    return this.direction === DIRECTION_RIGHT$1;
  }

  blockFall() {
    this.fallBlocked = true;

    if (this.jumpAcceleration < 0) {
      this.jumpAcceleration = 0;
    }

    if (this.jumpVelocity < 0) {
      this.jumpVelocity = 0;
    }
  }

  blockJump() {
    // this.jumpBlocked = true;

    // if (this.jumpAcceleration > 0) {
    //   this.stopJumping();
    // }
  }

  unblockFall() {
    this.fallBlocked = false;

    if (this.jumpPosition > 0) {
      if (this.jumping) {
        this.jumpAcceleration = jumpGravityAcceleration;
      } else {
        this.jumpAcceleration = freefallGravityAcceleration;
      }
    }
  }

  unblockJump() {
    this.jumpBlocked = false;
  }

  canJump() {
    return this.jumpVelocity === 0;
  }

  jump() {
    this.jumping = true;
    this.jumpVelocity = jumpInitialVelocity;
    this.jumpAcceleration = jumpGravityAcceleration;
  }

  isJumping() {
    return this.jumping;
  }

  isFalling() {
    return this.jumpAcceleration === freefallGravityAcceleration;
  }

  stopJumping() {
    this.jumping = false;
    this.jumpAcceleration = freefallGravityAcceleration;
  }

  isOnGround() {
    return this.jumpPosition === 0;
  }

  update() {
    if (this.jumpBlocked && this.fallBlocked) {
      return;
    }

    this.jumpVelocity += this.jumpAcceleration;
    this.jumpPosition += this.jumpVelocity;

    if (this.jumpPosition <= 0) {
      this.jumpPosition = 0;
      this.jumpAcceleration = 0;
      this.jumpVelocity = 0;
    }
  }
}

var loopPos = "16";
var obstacles = [{"type":"pillar","size":"s","pos":1},{"type":"pillar","size":"s","pos":1.6},{"type":"pillar","size":"s","pos":2.2},{"type":"pillar","size":"s","pos":4},{"type":"pillar","size":"s","pos":4.4},{"type":"pillar","size":"s","pos":4.8},{"type":"pillar","size":"s","pos":7},{"type":"pillar","size":"s","pos":7.5},{"type":"pillar","size":"m","pos":8},{"type":"pillar","size":"m","pos":8.5},{"type":"pillar","size":"s","pos":10.5},{"type":"pillar","size":"m","pos":10.8},{"type":"pillar","size":"l","pos":11.1},{"type":"pillar","size":"m","pos":11.2},{"type":"pillar","size":"m","pos":12.5},{"type":"pillar","size":"l","pos":12.8},{"type":"pillar","size":"m","pos":12.9},{"type":"pillar","size":"l","pos":13.5}];
var carrots = [{"pos":0.4,"height":0},{"pos":3.2,"height":0},{"pos":8.25,"height":50},{"pos":11.2,"height":80},{"pos":13.5,"height":120}];
var levelConfig = {
	loopPos: loopPos,
	obstacles: obstacles,
	carrots: carrots
};

class Carrot {
  constructor({ position = 0, height = 0}) {
    this.position = position;
    this.height = height;
    this.eaten = false;
  }

  eat() {
    this.eaten = true;
  }

  getRadianPosition() {
    return this.position * Math.PI;
  }
}

class CarrotTotal {
  constructor(goal = 1) {
    this.total = 0;
    this.goal = goal;
  }

  increment() {
    this.total++;
  }

  reachedGoal() {
    return this.total >= this.goal;
  }
}

class Obstacle {
  constructor({ type, size, position }) {
    this.type = type;
    this.size = size;
    this.position = position;
  }

  isPillar() {
    return this.type === 'pillar';
  }

  isSmall() {
    return this.size === 's';
  }

  isMedium() {
    return this.size === 'm';
  }

  isLarge() {
    return this.size === 'l';
  }

  getRadianPosition() {
    return this.position * Math.PI;
  }
}

class Level {
  constructor() {
    this.loopPosition = levelConfig.loopPos;
    this.carrotTotal = new CarrotTotal(levelConfig.carrots.length);
  }

  isLoopPosition(rotation) {
    return rotation > this.getLoopPosition();
  }

  getLoopPosition() {
    return this.loopPosition * Math.PI;
  }

  eatCarrot() {
    this.carrotTotal.increment();
  }

  isComplete() {
    return this.carrotTotal.reachedGoal();
  }

  getCarrotGoal() {
    return this.carrotTotal.goal;
  }

  getCarrotTotal() {
    return this.carrotTotal.total;
  }

  getAllCarrots() {
    return levelConfig.carrots.map((config) => {
      return new Carrot({
        height: config.height,
        position: config.pos,
      });
    });
  }

  getAllObstacles() {
    return levelConfig.obstacles.map((config) => {
      return new Obstacle({
        type: config.type,
        size: config.size,
        position: config.pos,
      });
    });
  }
}

class Timer {
  constructor() {
    this.frames = 0;
  }

  tick() {
    this.frames++;
  }

  getMinutes() {
    return Math.floor(1.0 * this.frames / (60 * 60));
  }

  getSeconds() {
    return Math.floor(1.0 * this.frames / 60) - this.getMinutes() * 60;
  }

  getMilliseconds() {
    return Math.floor(this.frames * 16.666667) - this.getSeconds() * 1000 - this.getMinutes() * 60 * 1000;
  }

  getTimerText() {
    return `${this.getMinutes().toString().padStart(2, '0')}:${this.getSeconds().toString().padStart(2, '0')}.${this.getMilliseconds().toString().padStart(3, '0')}`
  }
}

let thingsToLoad = [
  '../assets/images/wheel.png',
  '../assets/images/wheelShadow.png',
  '../assets/images/wheelAxle.png',
  '../assets/images/hamsterNeutral.png',
  '../assets/images/pillarSmall.png',
  '../assets/images/pillarMedium.png',
  '../assets/images/pillarLarge.png',
  '../assets/images/carrot2.png',
  '../assets/images/logo.png',
];

//Initialize Hexi with the `hexi` function. It has 5 arguments,
//although only the first 3 are required:
//a. Canvas width.
//b. Canvas height.
//c. The `setup` function.
//d. The `thingsToLoad` array you defined above. This is optional.
//e. The `load` function. This is also optional.
//If you skip the last two arguments, Hexi will skip the loading
//process and jump straight to the `setup` function.
let g = hexi(512, 512, setup, thingsToLoad, load);

//Optionally Set the frames per second at which the game logic loop should run.
//(Sprites will be rendered independently, with interpolation, at full 60 or 120 fps)
//If you don't set the `fps`, Hexi will default to an fps of 60
g.fps = 60;

//Optionally add a border and set the background color
//g.border = "2px red dashed";
//g.backgroundColor = 0x000000;

//Optionally scale and align the canvas inside the browser window
g.scaleToWindow();

//Start Hexi. This is important - without this line of code, Hexi
//won't run!
g.start();


/*
2. Loading Files
----------------
*/

//The `load` function will run while assets are loading. This is the
//same `load` function you assigned as Hexi's 4th initialization argument.
//Its optional. You can leave it out if you don't have any files to
//load, or you don't need to monitor their loading progress

function load() {

  //Display the file currently being loaded
  console.log(`loading: ${g.loadingFile}`);

  //Display the percentage of files currently loaded
  console.log(`progress: ${g.loadingProgress}`);

  //Add an optional loading bar.
  g.loadingBar();

  //This built-in loading bar is fine for prototyping, but I
  //encourage to to create your own custom loading bar using Hexi's
  //`loadingFile` and `loadingProgress` values. See the `loadingBar`
  //and `makeProgressBar` methods in Hexi's `core.js` file for ideas
}

let center;
let state;
let sprites;
let characterBaseY;


/*
3. Initialize and Set up your game objects
------------------------------------------
*/

//The `setup` function will run when all the assets have loaded. This
//is the `setup` function you assigned as Hexi's 3rd argument. It's
//mandatory - every Hexi application has to have a `setup` function
//(although you can give it any name you want)

function setup() {

  center = new Vector(
    g.canvas.width / 2,
    g.canvas.height / 2
  );

  state = generateInitialState();
  sprites = generateSprites(state);

  characterBaseY = sprites.character.y;





  const rightKey = g.keyboard(68);
  const leftKey = g.keyboard(65);
  const upKey = g.keyboard(87);
  const downKey = g.keyboard(88);
  const pauseKey = g.keyboard(27);
  const spaceKey = g.keyboard(32);

  rightKey.press = function() {
    if (state.player.isJumping()) {
      return;
    }

    state.player.turnRight();
    state.wheel.runRight();
  };

  rightKey.release = function() {
    if (leftKey.isUp) {
      state.wheel.stopRunning();
    } else {
      state.player.turnLeft();
      state.wheel.runLeft();
    }
  };

  leftKey.press = function() {
    if (state.player.isJumping()) {
      return;
    }

    state.player.turnLeft();
    state.wheel.runLeft();
  };

  leftKey.release = function() {
    if (rightKey.isUp) {
      state.wheel.stopRunning();
    } else {
      state.player.turnRight();
      state.wheel.runRight();
    }
  };

  upKey.press = function() {
    if (state.player.canJump()) {
      state.player.jump();
      state.wheel.pauseRunning();
    }
  };

  upKey.release = function() {
    state.player.stopJumping();
  };

  pauseKey.press = function() {
    if (g.paused) {
      g.resume();
    } else {
      g.pause();
    }
  };

  spaceKey.press = () => {
    if (sprites.introScene.visible) {
      g.state = play;
    }
  };

  g.backgroundColor = 0xf6ddc4;


  //Set the game state to play. This is very important! Whatever
  //function you assign to Hexi's `state` property will be run by
  //Hexi in a loop.
  g.state = intro;

}


/*
4. The game logic
------------------
*/

//The `play` function is called in a continuous loop, at whatever fps
//(frames per second) value you set. This is your *game logic loop*. (The
//render loop will be run by Hexi in the background at the maximum fps
//your system can handle.) You can pause Hexi's game loop at any time
//with the `pause` method, and restart it with the `resume` method

function play() {
  sprites.introScene.visible = false;
  sprites.playScene.visible = true;

  state.timer.tick();
  state.wheel.unblockRight();
  state.wheel.unblockLeft();
  state.player.unblockJump();

  if (state.player.fallBlocked) {
    state.player.unblockFall();
  }

  // Update view
  sprites.obstacles.forEach((obstacle) => {
    const rotationDelta = obstacle.parent.rotation + sprites.wheel.rotation;

    if (Math.abs(rotationDelta) > Math.PI) {
      obstacle.visible = false;
    } else {
      obstacle.visible = true;
    }

    if (Math.abs(rotationDelta) <= 0.3) {
      if (state.player.jumpPosition < obstacle.height) {
        if (Math.abs(rotationDelta) <= 0.2) {
          state.player.blockFall();
          state.wheel.continueRunning();
        }

        if (rotationDelta > 0) {
          state.wheel.blockLeft();
        } else {
          state.wheel.blockRight();
        }
      } else if (state.player.jumpPosition - sprites.character.height / 2.0 + 15 <= obstacle.height) {
        state.player.blockFall();
        state.wheel.continueRunning();
      }
    }
  });

  sprites.carrots.forEach((carrot) => {
    const rotationDelta = carrot.parent.rotation + sprites.wheel.rotation;

    if (Math.abs(rotationDelta) > Math.PI) {
      carrot.visible = false;
    } else if (!carrot.model.eaten) {
      carrot.visible = true;
    }

    if (
      !carrot.model.eaten &&
      Math.abs(rotationDelta) <= 0.3 &&
      Math.abs(state.player.jumpPosition - carrot.model.height) <= sprites.character.width * 0.4
    ) {
      state.level.eatCarrot();
      carrot.model.eat();
      carrot.visible = false;
    }
  });

  if (state.level.isComplete()) {
    g.state = win();
  }

  if (state.level.isLoopPosition(state.wheel.rotation)) {
    state.wheel.rotation = -2 * Math.PI;
  }
  else if (state.wheel.rotation < -2 * Math.PI) {
    state.wheel.rotation = state.level.getLoopPosition();
  }

  // Update state
  state.wheel.update();
  state.player.update();

  if (state.player.isOnGround()) {
    state.wheel.continueRunning();
  }

  // Update graphics
  sprites.wheel.rotation = state.wheel.rotation;

  let character;

  if (state.player.facingRight()) {
    sprites.character.children[0].visible = false;
    sprites.character.children[1].visible = true;
  } else {
    sprites.character.children[0].visible = true;
    sprites.character.children[1].visible = false;
  }

  sprites.character.y = characterBaseY - state.player.jumpPosition;

  sprites.carrotCount.text = `${state.level.getCarrotTotal()}/${state.level.getCarrotGoal()}`;
  sprites.timer.text = state.timer.getTimerText();
}

function intro() {
  sprites.winTimer.text = 'Time: ' + state.timer.getTimerText();
}

function win() {
  sprites.playScene.visible = false;
  sprites.winScene.visible = true;

  sprites.winTimer.text = 'Time: ' + state.timer.getTimerText();
}

function generateSprites(state) {
  const sprites = {
    wheel: g.group(),
    character: g.group(),
    wheelOverlays: g.group(),
    playScene: g.group(),
    introScene: g.group(),
    playUi: g.group(),
    winScene: g.group(),
  };

  const winMessage = g.text('You did it!', '30px Arial', 'orange');
  sprites.winTimer = g.text('Time: ' + state.timer.getTimerText(), '20px Arial', 'brown');

  sprites.winScene.addChild(winMessage);
  winMessage.anchor.set(0.5, 0.5);
  winMessage.x = center.x;
  winMessage.y = center.y - 20;

  sprites.winScene.addChild(sprites.winTimer);
  sprites.winTimer.anchor.set(0.5, 0.5);
  sprites.winTimer.x = center.x;
  sprites.winTimer.y = center.y + 20;

  sprites.winScene.visible = false;









  const startMessage = g.text('Press SPACE to Play', '30px Arial', 'brown');
  startMessage.anchor.set(0.5, 0.5);
  startMessage.x = center.x;
  startMessage.y = center.y + 180;
  sprites.introScene.addChild(startMessage);

  const logoRatio = 0.79382797;
  const logo = g.sprite('../assets/images/logo.png');
  logo.anchor.set(0.5, 0.5);
  logo.x = center.x;
  logo.y = center.y - 60;
  logo.width = 400;
  logo.height = 400 * logoRatio;
  sprites.introScene.addChild(logo);

  sprites.introScene.visible = true;














  const baseWheel = g.sprite('../assets/images/wheel.png');

  baseWheel.width = 480;
  baseWheel.height = 480;

  sprites.wheel.width = baseWheel.width;
  sprites.wheel.height = baseWheel.height;
  sprites.wheel.x = center.x;
  sprites.wheel.y = center.y;
  sprites.wheel.pivot.x = baseWheel.width / 2;
  sprites.wheel.pivot.y = baseWheel.height / 2;

  sprites.wheel.addChild(baseWheel);



  sprites.playScene.addChild(sprites.wheel);


  sprites.wheelOverlays.width = baseWheel.width;
  sprites.wheelOverlays.height = baseWheel.height;
  sprites.wheelOverlays.x = center.x;
  sprites.wheelOverlays.y = center.y;
  sprites.wheelOverlays.pivot.x = baseWheel.width / 2;
  sprites.wheelOverlays.pivot.y = baseWheel.height / 2;


  sprites.playScene.addChild(sprites.wheelOverlays);


  const wheelShadow = g.sprite('../assets/images/wheelShadow.png');

  sprites.wheelOverlays.addChild(wheelShadow);

  wheelShadow.width = 480;
  wheelShadow.height = 480;
  sprites.wheelOverlays.putCenter(wheelShadow);
  wheelShadow.anchor.x = 0.5;
  wheelShadow.anchor.y = 0.5;



  const wheelAxle = g.sprite('../assets/images/wheelAxle.png');

  sprites.wheelOverlays.addChild(wheelAxle);

  wheelAxle.height = 480;
  wheelAxle.width = 0.2433 * 480;
  wheelAxle.anchor.y = 0.38;
  wheelAxle.anchor.x = -1.56;


  const characterFloor = center.y + baseWheel.height / 2 - 50;




  const obstacles = state.level.getAllObstacles();
  const obstacleSprites = obstacles.map((obstacle) => {
    const container = g.group();

    let sprite;

    if (obstacle.isPillar()) {
      if (obstacle.isSmall()) {
        sprite = g.sprite('../assets/images/pillarSmall.png');
        sprite.width = 40;
        sprite.height = 25;
      } else if (obstacle.isMedium()) {
        sprite = g.sprite('../assets/images/pillarMedium.png');
        sprite.width = 40;
        sprite.height = 70;
      } else if (obstacle.isLarge()) {
        sprite = g.sprite('../assets/images/pillarLarge.png');
        sprite.width = 40;
        sprite.height = 110;
      }
      sprite.pivot.x = 20;

      sprite.x = 222.5;
      sprite.y = 480 - sprite.height - 20;
    }

    sprite.model = obstacle;

    container.height = baseWheel.height;
    container.width = baseWheel.width;

    container.pivot.x = baseWheel.halfWidth;
    container.pivot.y = baseWheel.halfHeight;

    container.x = baseWheel.halfWidth;
    container.y = baseWheel.halfHeight;

    container.rotation = -obstacle.getRadianPosition();

    container.addChild(sprite);
    sprites.wheel.addChild(container);

    return sprite;
  });

  sprites.obstacles = obstacleSprites;




  const carrots = state.level.getAllCarrots();
  const carrotSprites = carrots.map((carrot) => {
    const sprite = g.sprite('../assets/images/carrot2.png');

    sprite.width = 40;
    sprite.height = 40;

    sprite.pivot.x = 20;

    sprite.x = 225;
    sprite.y = 480 - 40 - 20 - carrot.height;

    sprite.model = carrot;

    const container = g.group();

    container.height = baseWheel.height;
    container.width = baseWheel.width;

    container.pivot.x = baseWheel.halfWidth;
    container.pivot.y = baseWheel.halfHeight;

    container.x = baseWheel.halfWidth;
    container.y = baseWheel.halfHeight;

    container.rotation = -carrot.getRadianPosition();

    container.addChild(sprite);
    sprites.wheel.addChild(container);

    return sprite;
  });

  sprites.carrots = carrotSprites;




  const characterRight = g.sprite('../assets/images/hamsterNeutral.png');
  const characterLeft = g.sprite('../assets/images/hamsterNeutral.png');

  characterLeft.scale.x *= -1;
  characterLeft.visible = false;

  sprites.character.width = 50;
  sprites.character.height = 50;
  sprites.character.pivot.x = sprites.character.halfWidth;
  sprites.character.pivot.y = sprites.character.halfHeight;

  characterLeft.width = 50;
  characterLeft.height = 50;
  characterRight.width = 50;
  characterRight.height = 50;
  characterLeft.anchor.x = 0.5;
  characterLeft.anchor.y = 0.5;
  characterRight.anchor.x = 0.5;
  characterRight.anchor.y = 0.5;

  sprites.character.addChild(characterLeft);
  sprites.character.addChild(characterRight);

  sprites.character.x = center.x;
  sprites.character.y = characterFloor;



  sprites.carrotIndicator = g.group();

  sprites.carrotIndicator.x = g.canvas.width - 50;
  sprites.carrotIndicator.y = 20;
  sprites.carrotIndicator.pivot.x = 0;
  sprites.carrotIndicator.pivot.y = 0;

  sprites.carrotIcon = g.sprite('../assets/images/carrot2.png');
  sprites.carrotIcon.width = 30;
  sprites.carrotIcon.height = 30;
  sprites.carrotIcon.x = 0;
  sprites.carrotIcon.y = -5;
  sprites.carrotIcon.anchor.x = 1;

  sprites.carrotCount = g.text(`${state.level.getCarrotTotal()}/${state.level.getCarrotGoal()}`, "20px Arial", "orange");

  sprites.carrotIndicator.addChild(sprites.carrotIcon);
  sprites.carrotIndicator.addChild(sprites.carrotCount);
  sprites.playUi.addChild(sprites.carrotIndicator);




  sprites.timer = g.text(state.timer.getTimerText(), "20px Arial", "brown");
  sprites.timer.x = 20;
  sprites.timer.y = 20;
  sprites.timer.pivot.x = 0;
  sprites.timer.pivot.y = 0;

  sprites.playUi.addChild(sprites.timer);




  sprites.playScene.addChild(sprites.character);
  sprites.playScene.addChild(sprites.playUi);

  g.stage.addChild(sprites.playScene);
  g.stage.addChild(sprites.winScene);




  sprites.playScene.visible = false;


  return sprites;
}

function generateInitialState() {
  return {
    wheel: new Wheel(),
    player: new Player(),
    level: new Level(),
    timer: new Timer(),
  };
}

}());
