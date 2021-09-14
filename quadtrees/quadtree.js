/**
 * A Point holds (x,y) coordinates.
 * @typedef {{x:number, y: number}} Point
 */

/**
 * A Boundary is an enclosed rectangular area.
 * @typedef {{topLeft: Point, bottomRight: Point}} Boundary
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
    point.x >= boundary.topLeft.x &&
    point.x <= boundary.bottomRight.x &&
    point.y >= boundary.topLeft.y &&
    point.y <= boundary.bottomRight.y
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
  const { topLeft, bottomRight } = node.boundary;
  const midPoint = {
    x: (topLeft.x + bottomRight.x) / 2,
    y: (topLeft.y + bottomRight.y) / 2,
  };

  node.topLeftChild = createNode({ x: topLeft.x, y: topLeft.y }, { x: midPoint.x, y: midPoint.y });
  node.bottomLeftChild = createNode(
    { x: topLeft.x, y: midPoint.y },
    { x: midPoint.x, y: bottomRight.y }
  );
  node.topRightChild = createNode(
    { x: midPoint.x, y: topLeft.y },
    { x: bottomRight.x, y: midPoint.y }
  );
  node.bottomRightChild = createNode(
    { x: midPoint.x, y: midPoint.y },
    { x: bottomRight.x, y: bottomRight.y }
  );

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
 * Returns true if the given boundary intersects with this boundary
 *
 * @param {Boundary} b1
 * @param {Boundary} b2
 * @returns
 */
function intersects(b1, b2) {
  return (
    // not too right
    b1.topLeft.x <= b2.bottomRight.x &&
    // not too left
    b1.bottomRight.x >= b2.topLeft.x &&
    // not too down
    b1.topLeft.y <= b2.bottomRight.y &&
    // not too up
    b1.bottomRight.y >= b2.topLeft.y
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
function nearest(
  node,
  location,
  nearestPoint = {
    point: null,
    distance: distance(node.boundary.topLeft, node.boundary.bottomRight),
  }
) {
  // If the boundary is farther than the nearest point, no need to check here or any of the child nodes
  if (
    Math.abs(location.x - node.boundary.topLeft.x) > nearestPoint.distance ||
    Math.abs(location.x - node.boundary.bottomRight.x) > nearestPoint.distance ||
    Math.abs(location.y - node.boundary.topLeft.y) > nearestPoint.distance ||
    Math.abs(location.y - node.boundary.bottomRight.y) > nearestPoint.distance
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

  // True if location is at the top half of this node's boundary
  const tb = location.y < (node.boundary.topLeft.y + node.boundary.bottomRight.y) / 2;
  // True if location is at the left half of this node's boundary
  const lr = location.x < (node.boundary.topLeft.x + node.boundary.bottomRight.x) / 2;

  // containing node
  nearestPoint = nearest(childNodes[2 * (1 - tb) + 1 * (1 - lr)], location, nearestPoint);
  // adjacent node
  nearestPoint = nearest(childNodes[2 * (1 - tb) + 1 * lr], location, nearestPoint);
  // adjacent node
  nearestPoint = nearest(childNodes[2 * tb + 1 * (1 - lr)], location, nearestPoint);
  // opposite node
  nearestPoint = nearest(childNodes[2 * tb + 1 * lr], location, nearestPoint);

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

function createNode(topLeft, bottomRight) {
  return { boundary: { topLeft, bottomRight }, points: [] };
}

module.exports = { insert, search, nearest, contains, distance };
