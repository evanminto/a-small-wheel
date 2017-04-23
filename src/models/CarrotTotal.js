export default class CarrotTotal {
  constructor(goal = 1) {
    this.total = 0;
    this.goal = goal;
  }

  increment() {
    this.total++;
  }

  reachedGoal() {
    return this.total >= this.goal;
  }
}
