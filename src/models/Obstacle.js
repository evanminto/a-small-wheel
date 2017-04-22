export default class Obstacle {
  constructor({ type, size, position }) {
    this.type = type;
    this.size = size;
    this.position = position;
  }

  isPillar() {
    return this.type === 'pillar';
  }

  isSmall() {
    return this.size === 's';
  }

  isMedium() {
    return this.size === 'm';
  }

  isLarge() {
    return this.size === 'l';
  }

  getRadianPosition() {
    return this.position * Math.PI;
  }
}