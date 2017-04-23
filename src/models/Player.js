const DIRECTION_RIGHT = Symbol('right');
const DIRECTION_LEFT = Symbol('left');

const jumpGravityAcceleration = -0.5;
const freefallGravityAcceleration = -1.2;
const jumpInitialVelocity = 10;

export default class Player {
  constructor() {
    this.direction = DIRECTION_RIGHT;
    this.jumpPosition = 0;
    this.jumpVelocity = 0;
    this.jumpAcceleration = 0;
    this.jumping = false;
    this.fallBlocked = false;
    this.jumpBlocked = false;
  }

  turnLeft() {
    this.direction = DIRECTION_LEFT;
  }

  turnRight() {
    this.direction = DIRECTION_RIGHT;
  }

  facingLeft() {
    return this.direction === DIRECTION_LEFT;
  }

  facingRight() {
    return this.direction === DIRECTION_RIGHT;
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
