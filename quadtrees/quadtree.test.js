const { Element, Point, Quadtree, Boundary } = require('./quadtree');
const assert = require('assert');

{
  console.log('Quadtree - returns the searched nodes');
  const tree = new Quadtree(new Boundary(new Point(0, 0), new Point(8, 8)));

  const n1 = new Element(new Point(1, 1), '1');
  const n2 = new Element(new Point(2, 2), '2');
  const n3 = new Element(new Point(4, 4), '3');
  const n4 = new Element(new Point(6, 6), '4');
  const n5 = new Element(new Point(3, 7), '5');

  tree.insert(n1);
  tree.insert(n2);
  tree.insert(n3);
  tree.insert(n4);
  tree.insert(n5);

  assert.deepStrictEqual(tree.search(new Boundary(new Point(3, 3), new Point(5, 5))), [n3]);
  assert.deepStrictEqual(tree.search(new Boundary(new Point(3, 3), new Point(7, 7))), [n3, n5, n4]);
}

{
  console.log('Quadtree - returns the closest node');
  const tree = new Quadtree(new Boundary(new Point(0, 0), new Point(8, 8)));

  const n1 = new Element(new Point(1, 1), '1');
  const n2 = new Element(new Point(2, 2), '2');
  const n3 = new Element(new Point(6, 6), '3');
  const n4 = new Element(new Point(2, 7), '4');
  const n5 = new Element(new Point(2, 3), '5');

  tree.insert(n1);
  tree.insert(n2);
  tree.insert(n3);
  tree.insert(n4);
  tree.insert(n5);

  assert.deepStrictEqual(tree.closest(new Point(2, 3)), { element: n5, distance: 0 });
}
