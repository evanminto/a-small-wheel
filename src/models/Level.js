import levelConfig from '../level.json';
import Carrot from './Carrot';
import CarrotTotal from './CarrotTotal';
import Obstacle from './Obstacle';

export default class Level {
  constructor() {
    this.loopPosition = levelConfig.loopPos;
    this.carrotTotal = new CarrotTotal(levelConfig.carrots.length);
  }

  isLoopPosition(rotation) {
    return rotation > this.getLoopPosition();
  }

  getLoopPosition() {
    return this.loopPosition * Math.PI;
  }

  eatCarrot() {
    this.carrotTotal.increment();
  }

  isComplete() {
    return this.carrotTotal.reachedGoal();
  }

  getCarrotGoal() {
    return this.carrotTotal.goal;
  }

  getCarrotTotal() {
    return this.carrotTotal.total;
  }

  getAllCarrots() {
    return levelConfig.carrots.map((config) => {
      return new Carrot({
        height: config.height,
        position: config.pos,
      });
    });
  }

  getAllObstacles() {
    return levelConfig.obstacles.map((config) => {
      return new Obstacle({
        type: config.type,
        size: config.size,
        position: config.pos,
      });
    });
  }
}