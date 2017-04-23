import Vector from './Vector';

const DIRECTION_NONE = Symbol('none');
const DIRECTION_RIGHT = Symbol('right');
const DIRECTION_LEFT = Symbol('left');

const maxVelocity = 0.06;
const dampingGround = 0.85;
const dampingMidair = 0.98;
const runAcceleration = 0.0125;

export default class Wheel {
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
