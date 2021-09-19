/**
 * A Point holds (x,y) coordinates.
 * @typedef {{x:number, y: number}} Point
 */

/**
 * A Boundary is an enclosed rectangular area.
 * @typedef {{x1:number, x2: number, y1: number, y2: number}} Boundary
 */

/**
 * A Quadtree is a tree where each node has exactly four children.
 * Each node can contain points up until `NODE_CAPACITY`, after
 * which the node will be subdivided into four child nodes.
 *
 * @typedef {{
 *  boundary: Boundary,
 *  points: Point[],
 *  topLeftChild?: Quadtree,
 *  bottomLeftChild?: Quadtree,
 *  topRightChild?: Quadtree,
 *  bottomRightChild?: Quadtree}} Quadtree
 */

/**
 * Inserts a point into the Quadtree node. If the node is already at its maximum
 * capacity, the node will first be subdivided into four child nodes. Then, the new
 * point will be added to the child node it fits into.
 *
 * @param {Quadtree} node
 * @param {Point} point
 * @param {number} nodeCapacity
 * @returns true if the point was inserted into the node or one of its child nodes
 */
function insert(node, point, nodeCapacity = 4) {
  // If the point is outside the node's boundary, return false
  if (!contains(node.boundary, point)) {
    return false;
  }

  // If this node has not yet reached its capacity and has not
  // yet been subdivided, insert the point into this node
  if (node.points.length < nodeCapacity && !node.topLeftChild) {
    node.points.push(point);
    return true;
  }

  // At this point, the node has either already been subdivided,
  // or has reached its capacity but hasn't been subdivided

  // If the node has reached its capacity,
  // but hasn't been subdivided, subdivide
  if (!node.topLeftChild) {
    subdivide(node, nodeCapacity);
  }

  // Insert the point into its correct child node. We can try inserting into all the child nodes
  // The wrong ones (where the point's position is outside the child node's boundary) would
  // simply return false, until we find the correct child node.
  if (insert(node.topLeftChild, point, nodeCapacity)) return true;
  if (insert(node.bottomLeftChild, point, nodeCapacity)) return true;
  if (insert(node.topRightChild, point, nodeCapacity)) return true;
  if (insert(node.bottomRightChild, point, nodeCapacity)) return true;

  // We shouldn't ever get to this point, though
  return false;
}

/**
 * A boundary contains a point if the point is within the (x, y)
 * coordinates of the boundary's top-left and bottom-right corner
 *
 * @param {Boundary} boundary
 * @param {Point} point
 * @returns
 */
function contains(boundary, point) {
  return (
    point.x >= boundary.x1 &&
    point.x <= boundary.x2 &&
    point.y >= boundary.y1 &&
    point.y <= boundary.y2
  );
}

/**
 * Splits a node into four child nodes and moves the
 * points in the node into their correct child nodes.
 *
 * @param {Quadtree} node
 * @param {number} nodeCapacity
 */
function subdivide(node, nodeCapacity) {
  // Create the four child nodes
  const { x1, x2, y1, y2 } = node.boundary;
  const midPoint = {
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2,
  };

  node.topLeftChild = createNode({ x1, y1, x2: midPoint.x, y2: midPoint.y });
  node.bottomLeftChild = createNode({ x1, y1: midPoint.y, x2: midPoint.x, y2 });
  node.topRightChild = createNode({ x1: midPoint.x, y1, x2, y2: midPoint.y });
  node.bottomRightChild = createNode({ x1: midPoint.x, y1: midPoint.y, x2, y2 });

  // Move the points in the node to the child node that should contain the point.
  // Again, we can try inserting each point into all the child nodes. The wrong ones
  // (where the point's position is outside the child node's boundary) would simply
  // return false, until we find the correct child node.
  node.points.forEach((point) => {
    if (insert(node.topLeftChild, point, nodeCapacity)) return;
    if (insert(node.bottomLeftChild, point, nodeCapacity)) return;
    if (insert(node.topRightChild, point, nodeCapacity)) return;
    if (insert(node.bottomRightChild, point, nodeCapacity)) return;
  });

  // We no longer need to keep the points in node
  node.points = [];
}

/**
 * Returns all the points within the given boundary
 *
 * @param {Quadtree} node
 * @param {Boundary} boundary
 * @returns
 */
function search(node, boundary) {
  // If this node does not intersect with the search boundary,
  // we know that the node and all its child nodes do not
  // contain any points that fall into the search boundary
  if (!intersects(node.boundary, boundary)) {
    return [];
  }

  // If this node has not yet been subdivided, return
  // all the points within the search boundary
  if (!node.topLeftChild) {
    return node.points.filter((point) => contains(boundary, point));
  }

  // If the node has been subdivided, search all
  // the child nodes and merge the results
  return search(node.topLeftChild, boundary)
    .concat(search(node.bottomLeftChild, boundary))
    .concat(search(node.topRightChild, boundary))
    .concat(search(node.bottomRightChild, boundary));
}

/**
 * Returns true if two boundaries interesect
 *
 * @param {Boundary} b1
 * @param {Boundary} b2
 * @returns
 */
function intersects(b1, b2) {
  return (
    // not too right
    b1.x1 <= b2.x2 &&
    // not too left
    b1.x2 >= b2.x1 &&
    // not too down
    b1.y1 <= b2.y2 &&
    // not too up
    b1.y2 >= b2.y1
  );
}

/**
 * Returns the nearest point to the given point
 *
 * @param {Quadtree} node
 * @param {Point} location
 * @param {{point: Point, distance: number} | undefined} nearestPoint
 * @returns
 */
function nearest(node, location, nearestPoint = { point: null, distance: Number.MAX_VALUE }) {
  // If this node is farther away than the nearest point, no need to check here or any of its child nodes
  if (
    location.x < node.boundary.x1 - nearestPoint.distance || // location too left
    location.x > node.boundary.x2 + nearestPoint.distance || // location too right
    location.y < node.boundary.y1 - nearestPoint.distance || // location too top
    location.y > node.boundary.y2 + nearestPoint.distance // location too bottom
  ) {
    return nearestPoint;
  }

  // Not yet subdivided, return the nearest point in this node
  if (!node.topLeftChild) {
    node.points.forEach((point) => {
      const d = distance(point, location);
      if (d < nearestPoint.distance) {
        nearestPoint.point = point;
        nearestPoint.distance = d;
      }
    });
    return nearestPoint;
  }

  // Since this node has already been subdivided, check all its child nodes.
  // Check the child node where the location falls first, before checking
  // the adjacent nodes, and then the opposite node.

  const childNodes = [
    node.topLeftChild,
    node.topRightChild,
    node.bottomLeftChild,
    node.bottomRightChild,
  ];

  const isTop = location.y < (node.boundary.y1 + node.boundary.y2) / 2;
  const isLeft = location.x < (node.boundary.x1 + node.boundary.x2) / 2;

  // containing node
  nearestPoint = nearest(childNodes[2 * (1 - isTop) + 1 * (1 - isLeft)], location, nearestPoint);
  // adjacent node
  nearestPoint = nearest(childNodes[2 * (1 - isTop) + 1 * isLeft], location, nearestPoint);
  // adjacent node
  nearestPoint = nearest(childNodes[2 * isTop + 1 * (1 - isLeft)], location, nearestPoint);
  // opposite node
  nearestPoint = nearest(childNodes[2 * isTop + 1 * isLeft], location, nearestPoint);

  return nearestPoint;
}

/**
 * Returns the Euclidean distance between two points
 *
 * @param {Point} p1
 * @param {Point} p2
 * @returns
 */
function distance(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function createNode(boundary) {
  return { boundary, points: [] };
}

module.exports = { insert, search, nearest, contains, distance };
