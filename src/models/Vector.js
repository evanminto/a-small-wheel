export default class Vector {
  static center(v1, v2) {
    return v1.add(v2).multiply(0.5).normalize();
  }

  static difference(v1, v2) {
    return v1.subtract(v2).normalize();
  }

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  getLength() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  add(v) {
    return new Vector(
      this.x + v.x,
      this.y + v.y
    );
  }

  subtract(v) {
    return this.add(v.invert());
  }

  multiply(scalar) {
    return new Vector(
      this.x * scalar,
      this.y * scalar
    );
  }

  invert() {
    return new Vector(
      -this.x,
      -this.y
    );
  }

  normalize() {
    return new Vector(
      Math.abs(this.x),
      Math.abs(this.y)
    );
  }

  clamp(vMin, vMax) {
    return new Vector(
      Math.max(vMin.x, Math.min(vMax.x, this.x)),
      Math.max(vMin.y, Math.min(vMax.y, this.y))
    );
  }

  clone() {
    return Object.assign({}, this);
  }
}