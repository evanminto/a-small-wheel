// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container.
const app = new PIXI.Application();

// The application will create a canvas element for you that you
// can then insert into the DOM.
document.body.appendChild(app.view);

const center = new Vector(
  app.renderer.width / 2,
  app.renderer.height / 2
);

// load the texture we need
PIXI.loader
  .add('wheel', '../assets/images/wheel.jpg')
  .add('characterRight', '../assets/images/characterRight.png')
  .add('characterLeft', '../assets/images/characterLeft.png')
  .add('obstacle', '../assets/images/obstacleTemp.jpg')
  .load(function(loader, resources) {
    const state = generateInitialState();
    const sprites = generateSprites(state, resources);







    const rightKey = new Key(68);
    const leftKey = new Key(65);
    const upKey = new Key(87);
    const downKey = new Key(88);

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




    const characterBaseY = sprites.character.y;

    // Listen for frame updates
    app.ticker.add(function() {

      state.wheel.unblockRight();
      state.wheel.unblockLeft();

      // Update view
      sprites.obstacles.forEach((obstacle) => {
        const rotationDelta = Math.abs(obstacle.rotation + sprites.wheel.rotation);

        if (rotationDelta > Math.PI) {
          obstacle.visible = false;
        } else {
          obstacle.visible = true;
        }

        let collision = Collisions.detectCircleRect(sprites.character, obstacle);

        if (collision.right) {
          state.wheel.blockRight();
        }

        if (collision.left) {
          state.wheel.blockLeft();
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
    });
  });






function generateSprites(state, resources) {
  const sprites = {
    wheel: new PIXI.Container(),
    character: new PIXI.Container(),
  };



  const baseWheel = new PIXI.Sprite(resources.wheel.texture);

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
    const sprite = new PIXI.Sprite(resources.obstacle.texture);

    if (obstacle.isPillar()) {
      if (obstacle.isSmall()) {
        sprite.x = baseWheel.width / 2;
        sprite.y = baseWheel.height / 2;
        console.log(baseWheel.width, baseWheel.height);
        sprite.width = 16;
        sprite.height = 40;
        sprite.pivot.x = 100; // TODO: What the heck?
        sprite.pivot.y = -100 * (baseWheel.height - sprite.height * 2 - 30) / sprite.height;
        sprite.rotation = -obstacle.getRadianPosition();
      }
    }

    return sprite;
  });

  sprites.obstacles = obstacleSprites;

  obstacleSprites.forEach((obstacle) => {
    sprites.wheel.addChild(obstacle);
  });




  const characterRight = new PIXI.Sprite(resources.characterRight.texture);
  const characterLeft = new PIXI.Sprite(resources.characterLeft.texture);

  characterLeft.visible = false;

  sprites.character.addChild(characterLeft);
  sprites.character.addChild(characterRight);

  sprites.character.x = center.x;
  sprites.character.y = characterFloor;

  sprites.character.pivot.x = characterRight.width / 2;
  sprites.character.pivot.y = characterRight.height / 2;



  app.stage.addChild(sprites.wheel);
  app.stage.addChild(sprites.character);


  return sprites;
}

function generateInitialState() {
  return {
    wheel: new Wheel(),
    player: new Player(),
    level: new Level(),
  };
}