import levelConfig from '../level.json';
import Carrot from './Carrot';
import Obstacle from './Obstacle';

export default class Level {
  constructor() {
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