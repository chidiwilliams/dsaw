// Maximum number of points that can be held in a node
const NODE_CAPACITY = 4;

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
 * Each node can contain points up until `Quadtree.NODE_CAPACITY`,
 * after which the node will be further subdivided into four children.
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
 * @returns
 */
function insert(node, point) {
  if (!contains(node.boundary, point)) {
    return false;
  }

  // If this node has not yet reached its capacity and has not
  // yet been subdivided, insert the point into this node
  if (node.points.length < NODE_CAPACITY && !node.topLeftChild) {
    node.points.push(point);
    return true;
  }

  // At this point, the node has either already been subdivided,
  // or has reached its capacity but hasn't been subdivided

  // If the node has reached its capacity,
  // but hasn't been subdivided, subdivide
  if (!node.topLeftChild) {
    subdivide(node);
  }

  // Insert the point into its correct child node. We can try inserting into all the child nodes
  // The wrong ones (where the point's position is outside the child node's boundary) would
  // simply return false, until we find the correct child node.
  if (insert(node.topLeftChild, point)) return true;
  if (insert(node.bottomLeftChild, point)) return true;
  if (insert(node.topRightChild, point)) return true;
  if (insert(node.bottomRightChild, point)) return true;

  // We shouldn't ever get to this point
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
 */
function subdivide(node) {
  // Create the four child nodes
  const { topLeft, bottomRight } = node.boundary;
  const midPoint = {
    x: (topLeft.x + bottomRight.x) / 2,
    y: (topLeft.y + bottomRight.y) / 2,
  };

  node.topLeftChild = {
    boundary: {
      topLeft: { x: topLeft.x, y: topLeft.y },
      bottomRight: { x: midPoint.x, y: midPoint.y },
    },
    points: [],
  };
  node.bottomLeftChild = {
    boundary: {
      topLeft: { x: topLeft.x, y: midPoint.y },
      bottomRight: { x: midPoint.x, y: bottomRight.y },
    },
    points: [],
  };
  node.topRightChild = {
    boundary: {
      topLeft: { x: midPoint.x, y: topLeft.y },
      bottomRight: { x: bottomRight.x, y: midPoint.y },
    },
    points: [],
  };
  node.bottomRightChild = {
    boundary: {
      topLeft: { x: midPoint.x, y: midPoint.y },
      bottomRight: { x: bottomRight.x, y: bottomRight.y },
    },
    points: [],
  };

  // Move the points in the node to the child node that should contain the point.
  // Again, we can try inserting each point into all the child nodes. The wrong ones
  // (where the point's position is outside the child node's boundary) would simply
  // return false, until we find the correct child node.
  node.points.forEach((point) => {
    if (insert(node.topLeftChild, point)) return;
    if (insert(node.bottomLeftChild, point)) return;
    if (insert(node.topRightChild, point)) return;
    if (insert(node.bottomRightChild, point)) return;
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
  // If this node does not intersect with the search boundary, the nodes
  // (and all its child nodes) do not have any points to offer the query
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
 * Returns the closest point to the given point
 *
 * @param {Quadtree} node
 * @param {Point} point
 * @param {{point: Point, distance: number} | undefined} closestPoint
 * @returns
 */
function closest(
  node,
  point,
  closestPoint = {
    point: null,
    distance: distance(node.boundary.topLeft, node.boundary.bottomRight),
  }
) {
  // If the boundary is farther than the closest point, no need to check here or any of the subtrees
  if (
    Math.abs(point.x - node.boundary.topLeft.x) > closestPoint.distance ||
    Math.abs(point.x - node.boundary.bottomRight.x) > closestPoint.distance ||
    Math.abs(point.y - node.boundary.topLeft.y) > closestPoint.distance ||
    Math.abs(point.y - node.boundary.bottomRight.y) > closestPoint.distance
  ) {
    return closestPoint;
  }

  // Not yet subdivided, return the closest point in this node
  if (!node.topLeftChild) {
    node.points.forEach((nodePoint) => {
      const d = distance(nodePoint, point);
      if (d < closestPoint.distance) {
        closestPoint.point = nodePoint;
        closestPoint.distance = d;
      }
    });
    return closestPoint;
  }

  // Since this node has already been subdivided, check all its child nodes
  // But first, sort the child nodes according to their distance from the
  // search point and check the closest ones first. The closer ones will be
  // more likely to have points closer to the search point, which would
  // help us skip larger nodes later on.
  const childNodes = [
    node.topLeftChild,
    node.bottomLeftChild,
    node.topRightChild,
    node.bottomRightChild,
  ];
  childNodes.sort(
    (a, b) => distance(point, midpoint(a.boundary)) - distance(point, midpoint(b.boundary))
  );
  childNodes.forEach((childNode) => {
    closestPoint = closest(childNode, point, closestPoint);
  });
  return closestPoint;
}

/**
 * Returns the distance between two points
 *
 * @param {Point} p1
 * @param {Point} p2
 * @returns
 */
function distance(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

/**
 * Returns the midpoint of the boundary
 *
 * @param {Boundary} boundary
 * @returns
 */
function midpoint(boundary) {
  return {
    x: (boundary.topLeft.x + boundary.bottomRight.x) / 2,
    y: (boundary.topLeft.y + boundary.bottomRight.y) / 2,
  };
}

module.exports = { insert, search, closest };
