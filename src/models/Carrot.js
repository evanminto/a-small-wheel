export default class Carrot {
  constructor({ position = 0, height = 0}) {
    this.position = position;
    this.height = height;
  }

  getRadianPosition() {
    return this.position * Math.PI;
  }
}
