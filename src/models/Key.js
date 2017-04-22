export default class Key {
  constructor(keyCode) {
    this.code = keyCode;
    this.isDown = false;
    this.isUp = true;
    this.press = undefined;
    this.release = undefined;

    //Attach event listeners
    window.addEventListener('keydown', this.downHandler.bind(this), false);
    window.addEventListener('keyup', this.upHandler.bind(this), false);
  }

  downHandler(event) {
    if (event.keyCode === this.code) {
      if (this.isUp && this.press) {
        this.press();
      }

      this.isDown = true;
      this.isUp = false;
    }
    event.preventDefault();
  }

  upHandler(event) {
    if (event.keyCode === this.code) {
      if (this.isDown && this.release) {
        this.release();
      }

      this.isDown = false;
      this.isUp = true;
    }
    event.preventDefault();
  }
}
