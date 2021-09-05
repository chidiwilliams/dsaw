/**
 * A Point holds (x,y) coordinates.
 *
 * @class Point
 */
class Point {
  /**
   * Creates an instance of Point.
   * @param {number} x
   * @param {number} y
   * @memberof Point
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

/**
 * A Boundary is an enclosed rectangular area.
 *
 * @class Boundary
 */
class Boundary {
  /**
   * Creates an instance of Boundary.
   * @param {Point} topLeft The top-left corner of the Boundary
   * @param {Point} bottomRight The bottom-right corner of the Boundary
   * @memberof Boundary
   */
  constructor(topLeft, bottomRight) {
    this.topLeft = topLeft;
    this.bottomRight = bottomRight;
  }

  /**
   * Returns true if the given point is within the Boundary
   *
   * @param {Point} point
   * @returns
   * @memberof Boundary
   */
  contains(point) {
    return (
      point.x >= this.topLeft.x &&
      point.x <= this.bottomRight.x &&
      point.y >= this.topLeft.y &&
      point.y <= this.bottomRight.y
    );
  }

  /**
   * Returns true if the given boundary intersects with this boundary
   *
   * @param {Boundary} boundary
   * @returns
   * @memberof Boundary
   */
  intersects(boundary) {
    return (
      // not too right
      boundary.topLeft.x <= this.bottomRight.x &&
      // not too left
      boundary.bottomRight.x >= this.topLeft.x &&
      // not too down
      boundary.topLeft.y <= this.bottomRight.y &&
      // not too up
      boundary.bottomRight.y >= this.topLeft.y
    );
  }
}

/**
 * An Element is a unit of spatial information.
 *
 * @class Element
 */
class Element {
  /**
   * Creates an instance of Element.
   *
   * @param {Point} position
   * @param {any} data
   * @memberof Element
   */
  constructor(position, data) {
    this.position = position;
    this.data = data;
  }
}

/**
 * A Quadtree is a tree where each node has exactly four children.
 * Each node can contain elements up until `Quadtree.NODE_CAPACITY`,
 * after which the node will be further subdivided into four children.
 *
 * @class Quadtree
 */
class Quadtree {
  /**
   * Maximum number of elements that can be held in this Quadtree node
   * @static
   * @memberof Quadtree
   */
  static NODE_CAPACITY = 4;

  /**
   * Elements held in this Quadtree node
   * @type {Element[]}
   * @memberof Quadtree
   */
  elements = [];

  /**
   * Child node in thje top-left corner
   * @type Quadtree
   * @memberof Quadtree
   */
  topLeftTree = null;

  /**
   * Child node in thje top-right corner
   * @type Quadtree
   * @memberof Quadtree
   */
  topRightTree = null;

  /**
   * Child node in thje bottom-left corner
   * @type Quadtree
   * @memberof Quadtree
   */
  bottomLeftTree = null;

  /**
   * Child node in thje bottom-right corner
   * @type Quadtree
   * @memberof Quadtree
   */
  bottomRightTree = null;

  /**
   * Creates an instance of Quadtree.
   * @param {Boundary} boundary
   * @memberof Quadtree
   */
  constructor(boundary) {
    this.boundary = boundary;
  }

  /**
   * Inserts an element into the Quadtree node. If the node is already at its maximum
   * capacity, the node will first be subdivided into four child nodes. Then, the new
   * element will be added to the child node it fits into.
   *
   * @param {Element} element
   * @returns true if the element has been inserted into this node or one of its child nodes
   * @memberof Quadtree
   */
  insert(element) {
    if (!this.boundary.contains(element.position)) {
      return false;
    }

    // If this node has not yet reached its capacity and has not
    // yet been subdivided, insert the element into this node
    if (this.elements.length < Quadtree.NODE_CAPACITY && !this.topLeftTree) {
      this.elements.push(element);
      return true;
    }

    // At this point, the node has either already been subdivided,
    // or has reached its capacity but hasn't been subdivided

    // If the node has reached its capacity,
    // but hasn't been subdivided, subdivide
    if (!this.topLeftTree) {
      this.subdivide();
    }

    // Insert the element into its correct child node. We can try inserting into all the sub-trees
    // The wrong ones (where the element's position is outside the sub-tree's boundary) would
    // simply return false, until we find the correct sub-tree.
    if (this.topLeftTree.insert(element)) return true;
    if (this.bottomLeftTree.insert(element)) return true;
    if (this.topRightTree.insert(element)) return true;
    if (this.bottomRightTree.insert(element)) return true;

    // We shouldn't ever get to this point
    return false;
  }

  /**
   * Breaks this node into four child nodes and moves the
   * elements in the node into their correct child nodes.
   *
   * @memberof Quadtree
   */
  subdivide() {
    // Create the four sub-trees
    const { topLeft, bottomRight } = this.boundary;
    const midPoint = new Point((topLeft.x + bottomRight.x) / 2, (topLeft.y + bottomRight.y) / 2);
    this.topLeftTree = new Quadtree(
      new Boundary(new Point(topLeft.x, topLeft.y), new Point(midPoint.x, midPoint.y))
    );
    this.bottomLeftTree = new Quadtree(
      new Boundary(new Point(topLeft.x, midPoint.y), new Point(midPoint.x, bottomRight.y))
    );
    this.topRightTree = new Quadtree(
      new Boundary(new Point(midPoint.x, topLeft.y), new Point(bottomRight.x, midPoint.y))
    );
    this.bottomRightTree = new Quadtree(
      new Boundary(new Point(midPoint.x, midPoint.y), new Point(bottomRight.x, bottomRight.y))
    );

    // Move the elements in the node to the child node that should contain the element.
    // Again, we can try inserting each element into all the sub-trees. The wrong ones
    // (where the element's position is outside the sub-tree's boundary) would simply
    // return false, until we find the correct sub-tree.
    this.elements.forEach((element) => {
      if (this.topLeftTree.insert(element)) return;
      if (this.bottomLeftTree.insert(element)) return;
      if (this.topRightTree.insert(element)) return;
      if (this.bottomRightTree.insert(element)) return;
    });

    // We no longer need to keep the elements in this node
    this.elements = [];
  }

  /**
   * Returns all the elements within the given boundary
   *
   * @param {Boundary} searchBoundary
   * @returns {Element[]}
   * @memberof Quadtree
   */
  search(searchBoundary) {
    // If this node does not intersect with the search boundary, the nodes
    // (and all its child nodes) do not have any elements to offer the query
    if (!this.boundary.intersects(searchBoundary)) {
      return [];
    }

    // If this node has not yet been subdivided, return
    // all the elements within the search boundary
    if (!this.topLeftTree) {
      return this.elements.filter((node) => searchBoundary.contains(node.position));
    }

    // If the node has been subdivided, search all
    // the child nodes and merge the results
    return this.topLeftTree
      .search(searchBoundary)
      .concat(this.bottomLeftTree.search(searchBoundary))
      .concat(this.topRightTree.search(searchBoundary))
      .concat(this.bottomRightTree.search(searchBoundary));
  }
}

module.exports = { Quadtree, Element, Point, Boundary };
