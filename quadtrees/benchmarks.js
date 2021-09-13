const { contains, insert, search } = require('./quadtree');

function insertList(points, point) {
  points.push(point);
}

function searchList(points, boundary) {
  return points.filter((point) => contains(boundary, point));
}

function testList(n) {
  const points = [];

  const w = 1000;
  const h = 1000;

  console.time(`insert-list-${n}`);
  for (let i = 0; i < n; i++) {
    insertList(points, { x: Math.random() * w, y: Math.random() * h });
  }
  console.timeEnd(`insert-list-${n}`);

  console.time(`search-list-${n}`);
  for (let i = 0; i < n; i++) {
    const topLeft = {
      x: Math.random() * w,
      y: Math.random() * h,
    };
    searchList(points, {
      topLeft,
      bottomRight: {
        x: topLeft.x + Math.random() * (w - topLeft.x),
        y: topLeft.y + Math.random() * (h - topLeft.y),
      },
    });
  }
  console.timeEnd(`search-list-${n}`);
}

function testQT(n) {
  const w = 100;
  const h = 100;

  const quadtree = {
    boundary: {
      topLeft: { x: 0, y: 0 },
      bottomRight: { x: w, y: h },
    },
    points: [],
  };

  console.time(`insert-tree-${n}`);
  for (let i = 0; i < n; i++) {
    insert(quadtree, { x: Math.random() * w, y: Math.random() * h });
  }
  console.timeEnd(`insert-tree-${n}`);

  console.time(`search-tree-${n}`);
  for (let i = 0; i < n; i++) {
    const topLeft = {
      x: Math.random() * w,
      y: Math.random() * h,
    };
    search(quadtree, {
      topLeft,
      bottomRight: {
        x: topLeft.x + Math.random() * (w - topLeft.x),
        y: topLeft.y + Math.random() * (h - topLeft.y),
      },
    });
  }
  console.timeEnd(`search-tree-${n}`);
}

for (let i = 1000; i < 20000; i += 1000) {
  testList(i);
  testQT(i);
}
