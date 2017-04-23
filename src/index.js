import Wheel from './models/Wheel';
import Player from './models/Player';
import Vector from './models/Vector';
import Level from './models/Level';


/*
Hexi Quick Start
================

This is a quick tour of all the most important things you need to
know to set up and start using Hexi. Use this same model
for structuring your own applications and games. Thanks
to Hexi's streamlined, modular design, you can create a complex interactive
application like this in less than 50 lines of compact and readable code.

Hexi's Application Architecture is made up of four main parts:

1. Setting up and starting Hexi.
2. The `load` function, that will run while your files are loading.
3. The `setup` function, which initializes your game objects, variables and sprites.
4. The `play` function, which is your game or application logic that runs in a loop.

This simple model is all you need to create any kind of game or application.
You can use it as the starting template for your own projects, and this same
basic model can scale to any size.
Take a look at the code ahead to see how it all works.
*/

/*
1. Setting up and starting Hexi
-------------------------------
*/

//Create an array of files you want to load. If you don't need to load
//any files, you can leave this out. Hexi lets you load a wide variety
//of files: images, texture atlases, bitmap fonts, ordinary font files, and
//sounds
let thingsToLoad = [
  '../assets/images/wheel.jpg',
  '../assets/images/characterRight.png',
  '../assets/images/characterLeft.png',
  '../assets/images/obstacleTemp.jpg',
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

  downKey.press = function() {
  };

  downKey.release = function() {
  };


  //Set the game state to play. This is very important! Whatever
  //function you assign to Hexi's `state` property will be run by
  //Hexi in a loop.
  g.state = play;

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
  state.wheel.unblockRight();
  state.wheel.unblockLeft();
  state.player.unblockJump();

  if (state.player.fallBlocked) {
    state.player.unblockFall();
  }

  // Update view
  // console.log(Math.abs(state.wheel.rotation + sprites.obstacles[0].rotation));
  sprites.obstacles.forEach((obstacle) => {
    const rotationDelta = Math.abs(obstacle.rotation + sprites.wheel.rotation);

    if (rotationDelta > Math.PI) {
      obstacle.visible = false;
    } else {
      obstacle.visible = true;
    }

    const rotationDifference = state.wheel.rotation + obstacle.rotation;

    if (Math.abs(rotationDifference) <= 0.3) {
      if (state.player.jumpPosition < obstacle.height) {
        if (rotationDifference > 0) {
          state.wheel.blockLeft();
        } else {
          state.wheel.blockRight();
        }
      } else if (state.player.jumpPosition - sprites.character.height / 2.0 + 20 <= obstacle.height) {
        state.player.blockFall();
        state.wheel.continueRunning();
      }
    }
  });

  // Update state
  state.wheel.update();
  state.player.update();

  if (state.player.isOnGround()) {
    state.wheel.continueRunning();
  }

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
}

function generateSprites(state) {
  const sprites = {
    wheel: g.group(),
    character: g.group(),
  };



  const baseWheel = g.sprite('../assets/images/wheel.jpg');

  baseWheel.width = 480;
  baseWheel.height = 480;

  sprites.wheel.width = baseWheel.width;
  sprites.wheel.height = baseWheel.height;
  sprites.wheel.x = center.x;
  sprites.wheel.y = center.y;
  sprites.wheel.pivot.x = baseWheel.width / 2;
  sprites.wheel.pivot.y = baseWheel.height / 2;

  sprites.wheel.addChild(baseWheel);



  const characterFloor = center.y + baseWheel.height / 2 - 50;




  const obstacles = state.level.getAllObstacles();
  const obstacleSprites = obstacles.map((obstacle) => {
    const sprite = g.sprite('../assets/images/ObstacleTemp.jpg');

    if (obstacle.isPillar()) {
      sprite.x = baseWheel.width / 2;
      sprite.y = baseWheel.height / 2;

      if (obstacle.isSmall()) {
        sprite.width = 40;
        sprite.height = 30;
      } else if (obstacle.isMedium()) {
        sprite.width = 40;
        sprite.height = 80;
      } else if (obstacle.isLarge()) {
        sprite.width = 40;
        sprite.height = 130;
      }
      sprite.pivot.x = 100; // TODO: What the heck?
      sprite.pivot.y = -100 * (baseWheel.height - sprite.height * 2 - 50) / sprite.height;
      sprite.rotation = -obstacle.getRadianPosition();
    }

    return sprite;
  });

  sprites.obstacles = obstacleSprites;

  obstacleSprites.forEach((obstacle) => {
    sprites.wheel.addChild(obstacle);
  });




  const characterRight = g.sprite('../assets/images/characterRight.png');
  const characterLeft = g.sprite('../assets/images/characterLeft.png');

  characterLeft.visible = false;

  sprites.character.addChild(characterLeft);
  sprites.character.addChild(characterRight);

  sprites.character.x = center.x;
  sprites.character.y = characterFloor;

  sprites.character.pivot.x = characterRight.width / 2;
  sprites.character.pivot.y = characterRight.height / 2;



  g.stage.addChild(sprites.wheel);
  g.stage.addChild(sprites.character);


  return sprites;
}

function generateInitialState() {
  return {
    wheel: new Wheel(),
    player: new Player(),
    level: new Level(),
  };
}