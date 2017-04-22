const DIRECTION_RIGHT = Symbol('right');
const DIRECTION_LEFT = Symbol('left');

const jumpGravityAcceleration = -0.5;
const freefallGravityAcceleration = -1.25;

export default class Player {
  constructor() {
    this.direction = DIRECTION_RIGHT;
    this.jumpPosition = 0;
    this.jumpVelocity = 0;
    this.jumpAcceleration = 0;
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

  canJump() {
    return this.jumpPosition === 0;
  }

  jump() {
    this.jumpVelocity = 12;
    this.jumpAcceleration = jumpGravityAcceleration;
  }

  isJumping() {
    return this.jumpAcceleration === jumpGravityAcceleration;
  }

  isFalling() {
    return this.jumpAcceleration === freefallGravityAcceleration;
  }

  stopJumping() {
    this.jumpAcceleration = freefallGravityAcceleration;
  }

  isOnGround() {
    return this.jumpPosition === 0;
  }

  update() {
    this.jumpVelocity += this.jumpAcceleration;
    this.jumpPosition += this.jumpVelocity;

    if (this.jumpPosition <= 0) {
      this.jumpPosition = 0;
      this.jumpAcceleration = 0;
      this.jumpVelocity = 0;
    }
  }
}
