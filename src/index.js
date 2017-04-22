import './vendor/pixi.min.js';
import Wheel from './models/Wheel';
import Player from './models/Player';
import Vector from './models/Vector';
import Key from './models/Key';

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container.
const app = new PIXI.Application();

// The application will create a canvas element for you that you
// can then insert into the DOM.
document.body.appendChild(app.view);

// load the texture we need
PIXI.loader
  .add('wheel', '../assets/images/wheel.jpg')
  .add('characterRight', '../assets/images/characterRight.png')
  .add('characterLeft', '../assets/images/characterLeft.png')
  .load(function(loader, resources) {
    const state = generateInitialState();
    const sprites = generateSprites(resources);







    const rightKey = new Key(68);
    const leftKey = new Key(65);
    const upKey = new Key(87);
    const downKey = new Key(88);

    rightKey.press = function() {
      state.player.turnRight();
      state.wheel.runRight();
    };

    rightKey.release = function() {
      if (leftKey.isUp) {
        state.wheel.stopRunning();
      }
    };

    leftKey.press = function() {
      state.player.turnLeft();
      state.wheel.runLeft();
    };

    leftKey.release = function() {
      if (rightKey.isUp) {
        state.wheel.stopRunning();
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




    const characterBaseY = sprites.characterRight.y;

    // Listen for frame updates
    app.ticker.add(function() {
      // Update state
      state.wheel.update();
      state.player.update();

      if (state.player.isOnGround()) {
        state.wheel.continueRunning();
      }

      // Update view
      sprites.wheel.rotation = state.wheel.rotation;

      let character;

      if (state.player.facingRight()) {
        app.stage.removeChild(sprites.characterLeft);
        app.stage.addChild(sprites.characterRight);
        character = sprites.characterRight;
      } else {
        app.stage.removeChild(sprites.characterRight);
        app.stage.addChild(sprites.characterLeft);
        character = sprites.characterLeft;
      }

      character.y = characterBaseY - state.player.jumpPosition;
    });
  });






function generateSprites(resources) {
  const sprites = {
    wheel: new PIXI.Sprite(resources.wheel.texture),
    characterRight: new PIXI.Sprite(resources.characterRight.texture),
    characterLeft: new PIXI.Sprite(resources.characterLeft.texture),
  };

  const center = new Vector(
    app.renderer.width / 2,
    app.renderer.height / 2
  );

  sprites.wheel.x = center.x;
  sprites.wheel.y = center.y;
  sprites.wheel.width = 480;
  sprites.wheel.height = 480;
  sprites.wheel.anchor.x = 0.5;
  sprites.wheel.anchor.y = 0.5;

  app.stage.addChild(sprites.wheel);

  const characterFloor = center.y + sprites.wheel.height / 2 - 20;

  sprites.characterRight.x = center.x;
  sprites.characterRight.y = characterFloor;

  sprites.characterRight.anchor.x = 0.5;
  sprites.characterRight.anchor.y = 1;

  sprites.characterLeft.x = center.x;
  sprites.characterLeft.y = characterFloor;

  sprites.characterLeft.anchor.x = 0.5;
  sprites.characterLeft.anchor.y = 1;

  app.stage.addChild(sprites.characterRight);

  return sprites;
}

function generateInitialState() {
  return {
    wheel: new Wheel(),
    player: new Player(),
  };
}
