const { insert, search, nearest } = require('./quadtree');
const assert = require('assert');

{
  console.log('Quadtree - searches for points within a boundary');
  const quadtree = {
    boundary: {
      x1: 0,
      x2: 8,
      y1: 0,
      y2: 8,
    },
    points: [],
  };

  const p1 = { x: 1, y: 1 };
  const p2 = { x: 2, y: 2 };
  const p3 = { x: 4, y: 4 };
  const p4 = { x: 6, y: 6 };
  const p5 = { x: 3, y: 7 };

  insert(quadtree, p1);
  insert(quadtree, p2);
  insert(quadtree, p3);
  insert(quadtree, p4);
  insert(quadtree, p5);

  assert.deepStrictEqual(
    search(quadtree, {
      x1: 3,
      y1: 3,
      x2: 5,
      y2: 5,
    }),
    [p3]
  );
  assert.deepStrictEqual(
    search(quadtree, {
      x1: 3,
      y1: 3,
      x2: 7,
      y2: 7,
    }),
    [p3, p5, p4]
  );
}

{
  console.log('Quadtree - returns the nearest point');
  const quadtree = {
    boundary: {
      x1: 0,
      y1: 0,
      x2: 8,
      y2: 8,
    },
    points: [],
  };

  const p1 = { x: 1, y: 1 };
  const p2 = { x: 2, y: 2 };
  const p3 = { x: 6, y: 6 };
  const p4 = { x: 2, y: 7 };
  const p5 = { x: 2, y: 3 };

  insert(quadtree, p1);
  insert(quadtree, p2);
  insert(quadtree, p3);
  insert(quadtree, p4);

  assert.deepStrictEqual(nearest(quadtree, { x: 2, y: 3 }), { point: p2, distance: 1 });

  insert(quadtree, p5);

  assert.deepStrictEqual(nearest(quadtree, { x: 2, y: 3 }), { point: p5, distance: 0 });
}
