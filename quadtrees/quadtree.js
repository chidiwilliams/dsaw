class Point {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

class Boundary {
  constructor(topLeft, bottomRight) {
    this.topLeft = topLeft;
    this.bottomRight = bottomRight;
  }

  contains(point) {
    return (
      point.x >= this.topLeft.x &&
      point.x <= this.bottomRight.x &&
      point.y >= this.topLeft.y &&
      point.y <= this.bottomRight.y
    );
  }

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

class Node {
  constructor(position, data) {
    this.position = position;
    this.data = data;
  }
}

class Quadtree {
  static CAPACITY = 4;

  nodes = [];
  topLeftTree = null;
  topRightTree = null;
  bottomLeftTree = null;
  bottomRightTree = null;

  constructor(boundary) {
    this.boundary = boundary;
  }

  insert(node) {
    if (!this.boundary.contains(node.position)) {
      return false;
    }

    if (this.nodes.length < Quadtree.CAPACITY && !this.topLeftTree) {
      this.nodes.push(node);
      return true;
    }

    if (!this.topLeftTree) {
      this.subdivide();
    }

    if (this.topLeftTree.insert(node)) return true;
    if (this.bottomLeftTree.insert(node)) return true;
    if (this.topRightTree.insert(node)) return true;
    if (this.bottomRightTree.insert(node)) return true;
    return false;
  }

  subdivide() {
    // Create sub-trees
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

    // Move existing nodes to sub-trees
    this.nodes.forEach((node) => {
      if (this.topLeftTree.insert(node)) return;
      if (this.bottomLeftTree.insert(node)) return;
      if (this.topRightTree.insert(node)) return;
      if (this.bottomRightTree.insert(node)) return;
    });
    this.nodes = [];
  }

  search(searchBoundary) {
    if (!this.boundary.intersects(searchBoundary)) {
      return [];
    }

    if (!this.topLeftTree) {
      return this.nodes.filter((node) => searchBoundary.contains(node.position));
    }

    return this.topLeftTree
      .search(searchBoundary)
      .concat(this.bottomLeftTree.search(searchBoundary))
      .concat(this.topRightTree.search(searchBoundary))
      .concat(this.bottomRightTree.search(searchBoundary));
  }
}

module.exports = { Quadtree, Node, Point, Boundary };
