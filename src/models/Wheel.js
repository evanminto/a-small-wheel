import Vector from './Vector';

const DIRECTION_NONE = Symbol('none');
const DIRECTION_RIGHT = Symbol('right');
const DIRECTION_LEFT = Symbol('left');

const maxVelocity = 0.1;
const dampingGround = 0.8;
const dampingMidair = 0.95;
const runAcceleration = 0.005;

export default class Wheel {
  constructor() {
    this.direction = DIRECTION_NONE;
    this.runningPaused = false;
    this.rotation = 0;
    this.velocity = 0;
    this.acceleration = 0;
  }

  runRight() {
    this.direction = DIRECTION_RIGHT;
    this.acceleration += runAcceleration;
    this.runningPaused = false;
  }

  runLeft() {
    this.direction = DIRECTION_LEFT;
    this.acceleration -= runAcceleration;
    this.runningPaused = false;
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
