import './vendor/pixi.min.js';

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container.
const app = new PIXI.Application();

// The application will create a canvas element for you that you
// can then insert into the DOM.
document.body.appendChild(app.view);

function keyboard(keyCode) {
  const key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
        key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}

// load the texture we need
PIXI.loader
  .add('wheel', '../assets/images/wheel.jpg')
  .add('characterRight', '../assets/images/characterRight.png')
  .add('characterLeft', '../assets/images/characterLeft.png')
  .load(function(loader, resources) {
    var wheel = new PIXI.Sprite(resources.wheel.texture);

    wheel.x = app.renderer.width / 2;
    wheel.y = app.renderer.height / 2;
    wheel.width = 480;
    wheel.height = 480;
    wheel.anchor.x = 0.5;
    wheel.anchor.y = 0.5;

    // Add the wheel to the scene we are building.
    app.stage.addChild(wheel);

    const characterFloor = app.renderer.height / 2 + wheel.height / 2 - 20;

    var characterRight = new PIXI.Sprite(resources.characterRight.texture);

    characterRight.x = app.renderer.width / 2;
    characterRight.y = characterFloor;

    characterRight.anchor.x = 0.5;
    characterRight.anchor.y = 1;

    var characterLeft = new PIXI.Sprite(resources.characterLeft.texture);

    characterLeft.x = app.renderer.width / 2;
    characterLeft.y = characterFloor;

    characterLeft.anchor.x = 0.5;
    characterLeft.anchor.y = 1;

    app.stage.addChild(characterRight);







    const ACTION_NONE = Symbol('none');
    const ACTION_JUMP = Symbol('jump');
    const ACTION_SLIDE = Symbol('slide');

    const DIRECTION_NONE = Symbol('none');
    const DIRECTION_RIGHT = Symbol('right');
    const DIRECTION_LEFT = Symbol('left');

    let wheelRotationalVelocity = 0;
    const maxWheelRotationalVelocity = 0.15;
    let wheelRotationalAcceleration = 0;
    const wheelRotationalDamping = 0.01;
    const wheelRotationalDampingMidair = 0.002;

    let verticalAcceleration = 0;
    let verticalVelocity = 0;
    let verticalPosition = 0;

    let direction = DIRECTION_NONE;
    let running = DIRECTION_NONE;
    let jumping = false;

    let jumpingDuration = 0;
    const jumpingMaxDuration = 8;

    const rightKey = keyboard(68);
    const leftKey = keyboard(65);
    const upKey = keyboard(87);
    const downKey = keyboard(88);

    rightKey.press = function() {
      if (running !== DIRECTION_RIGHT) {
        wheelRotationalAcceleration = 0.0025;
      }

      running = DIRECTION_RIGHT;
    };

    rightKey.release = function() {
      running = DIRECTION_NONE;
      wheelRotationalAcceleration = 0;
    };

    leftKey.press = function() {
      if (running !== DIRECTION_RIGHT) {
        wheelRotationalAcceleration = -0.0025;
      }

      running = DIRECTION_LEFT;
    };

    leftKey.release = function() {
      running = DIRECTION_NONE;
      wheelRotationalAcceleration = 0;
    };

    upKey.press = function() {
      if (verticalPosition === 0) {
        verticalAcceleration = 10;
        jumping = true;

        if (running === DIRECTION_RIGHT) {
          wheelRotationalAcceleration = 0.1;
        } else if (running === DIRECTION_LEFT) {
          wheelRotationalAcceleration = -0.1;
        }
      }
    };

    upKey.release = function() {
      jumping = false;
    };

    downKey.press = function() {
    };

    downKey.release = function() {
    };







    let character = characterRight;

    // Listen for frame updates
    app.ticker.add(function() {
      if (verticalPosition === 0) {
        wheelRotationalVelocity += wheelRotationalAcceleration;
      }

      if (verticalPosition > 0) {
        if (Math.abs(wheelRotationalVelocity) <= wheelRotationalDamping) {
          wheelRotationalVelocity = 0;
        } else {
          wheelRotationalVelocity -= wheelRotationalDampingMidair * (wheelRotationalVelocity / Math.abs(wheelRotationalVelocity));
        }
      }

      if (running === DIRECTION_NONE && wheelRotationalVelocity) {
        if (Math.abs(wheelRotationalVelocity) <= wheelRotationalDamping) {
          wheelRotationalVelocity = 0;
        } else {
          wheelRotationalVelocity -= wheelRotationalDamping * (wheelRotationalVelocity / Math.abs(wheelRotationalVelocity));
        }
      }

      if (wheelRotationalVelocity < 0) {
        wheelRotationalVelocity = Math.max(wheelRotationalVelocity, -maxWheelRotationalVelocity);
      } else {
        wheelRotationalVelocity = Math.min(wheelRotationalVelocity, maxWheelRotationalVelocity);
      }

      console.log(wheelRotationalVelocity);

      wheel.rotation += wheelRotationalVelocity;

      switch (running) {
        case DIRECTION_RIGHT:
          app.stage.removeChild(characterLeft);
          app.stage.addChild(characterRight);
          character = characterRight;
          break;
        case DIRECTION_LEFT:
          app.stage.removeChild(characterRight);
          app.stage.addChild(characterLeft);
          character = characterLeft;
          break;
      }

      verticalVelocity += verticalAcceleration;
      verticalPosition += verticalVelocity;

      if (verticalPosition < 0) {
        verticalPosition = 0;
        verticalVelocity = 0;
        verticalAcceleration = 0;
      }

      character.y = characterFloor - verticalPosition;

      if (verticalPosition > 0) {
        if (jumping) {
          verticalAcceleration = -0.6;
        } else {
          verticalAcceleration = -2;
        }
      }
    });
  });
