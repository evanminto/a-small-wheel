import Vector from '../models/Vector';

class Collision {
  constructor(distance) {
    this.top = false;
    this.right = false;
    this.bottom = false;
    this.left = false;

    let axis = distance.x >= distance.y ? 'horizontal' : 'vertical';
    axis = 'horizontal';

    if (axis === 'horizontal') {
      this.right = distance.x < 0;
      this.left = distance.x > 0;
    } else if (axis === 'vertical') {
      this.top = distance.y > 0;
      this.bottom = distance.y < 0;
    }
  }
}

export default {
  detectCircleRect(circle, rectangle) {
    const rectBounds = calculateWorldBounds(rectangle);

    const rectCenter = Vector.center(
      Vector.center(rectBounds[0], rectBounds[1]),
      Vector.center(rectBounds[2], rectBounds[3])
    );

    const circleCenter = new Vector(circle.x, circle.y);

    const diff = circleCenter.subtract(rectCenter);

    const halfExtent = new Vector(rectangle.width / 2, rectangle.height / 2);

    const edgeDiff = diff.clamp(new Vector(0, 0), halfExtent);
    const edgePoint = rectCenter.add(edgeDiff);
    const edgeDistance = circleCenter.subtract(edgePoint);

    if (edgeDistance.getLength() <= circle.width / 2) {
      return new Collision(edgeDistance);
    }

    return false;
  }
};

function calculateWorldBounds(object) {
  const bounds = object.getLocalBounds();
  const wt = object.transform.worldTransform;
  const tx = (wt.a * bounds.x) + (wt.c * bounds.y) + wt.tx;
  const ty = (wt.b * bounds.x) + (wt.d * bounds.y) + wt.ty;

  return [
    new Vector(tx, ty),
    new Vector(
      (wt.a * bounds.width) + tx,
      (wt.b * bounds.width) + ty
    ),
    new Vector(
      (wt.a * bounds.width) + (wt.c * bounds.height) + tx,
      (wt.d * bounds.height) + (wt.b * bounds.width) + ty
    ),
    new Vector(
      (wt.c * bounds.height) + tx,
      (wt.d * bounds.height) + ty
    ),
  ];
}
