const { insert, search, nearest } = require('./quadtree');
const assert = require('assert');

const nodeCapacity = 4;

{
  console.log('Quadtree - searches for points within a boundary');
  const quadtree = {
    boundary: {
      topLeft: { x: 0, y: 0 },
      bottomRight: { x: 8, y: 8 },
    },
    points: [],
  };

  const p1 = { x: 1, y: 1 };
  const p2 = { x: 2, y: 2 };
  const p3 = { x: 4, y: 4 };
  const p4 = { x: 6, y: 6 };
  const p5 = { x: 3, y: 7 };

  insert(quadtree, p1, nodeCapacity);
  insert(quadtree, p2, nodeCapacity);
  insert(quadtree, p3, nodeCapacity);
  insert(quadtree, p4, nodeCapacity);
  insert(quadtree, p5, nodeCapacity);

  assert.deepStrictEqual(
    search(quadtree, {
      topLeft: { x: 3, y: 3 },
      bottomRight: { x: 5, y: 5 },
    }),
    [p3]
  );
  assert.deepStrictEqual(
    search(quadtree, {
      topLeft: { x: 3, y: 3 },
      bottomRight: { x: 7, y: 7 },
    }),
    [p3, p5, p4]
  );
}

{
  console.log('Quadtree - returns the nearest point');
  const quadtree = {
    boundary: {
      topLeft: { x: 0, y: 0 },
      bottomRight: { x: 8, y: 8 },
    },
    points: [],
  };

  const p1 = { x: 1, y: 1 };
  const p2 = { x: 2, y: 2 };
  const p3 = { x: 6, y: 6 };
  const p4 = { x: 2, y: 7 };
  const p5 = { x: 2, y: 3 };

  insert(quadtree, p1, nodeCapacity);
  insert(quadtree, p2, nodeCapacity);
  insert(quadtree, p3, nodeCapacity);
  insert(quadtree, p4, nodeCapacity);

  assert.deepStrictEqual(nearest(quadtree, { x: 2, y: 3 }), { point: p2, distance: 1 });

  insert(quadtree, p5, nodeCapacity);

  assert.deepStrictEqual(nearest(quadtree, { x: 2, y: 3 }), { point: p5, distance: 0 });
}
