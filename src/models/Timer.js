export default class Timer {
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
