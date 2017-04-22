import levelConfig from '../level.json';
import Obstacle from './Obstacle';

export default class Level {
  constructor() {
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