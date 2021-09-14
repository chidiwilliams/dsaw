const { contains, insert, search, distance, nearest } = require('./quadtree');

function insertList(points, point) {
  points.push(point);
}

function searchList(points, boundary) {
  return points.filter((point) => contains(boundary, point));
}

function nearestList(points, location) {
  let nearestPoint;
  let nearestPointDistance = Number.MAX_VALUE;

  points.forEach((point) => {
    const d = distance(point, location);
    if (d < nearestPointDistance) {
      nearestPoint = point;
      nearestPointDistance = d;
    }
  });

  return nearestPoint;
}

const w = 1000;
const h = 1000;

function runSearchList(n) {
  const points = [];

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

function runSearchQT(n) {
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

function runNearestList(n) {
  const points = [];

  console.time(`insert-list-${n}`);
  for (let i = 0; i < n; i++) {
    insertList(points, { x: Math.random() * w, y: Math.random() * h });
  }
  console.timeEnd(`insert-list-${n}`);

  console.time(`nearest-list-${n}`);
  for (let i = 0; i < n; i++) {
    nearestList(points, { x: Math.random() * w, y: Math.random() * h });
  }
  console.timeEnd(`nearest-list-${n}`);
}

function runNearestQT(n) {
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

  console.time(`nearest-tree-${n}`);
  for (let i = 0; i < n; i++) {
    nearest(quadtree, {
      x: Math.random() * w,
      y: Math.random() * h,
    });
  }
  console.timeEnd(`nearest-tree-${n}`);
}

for (let n = 1000; n < 20000; n += 1000) {
  // runSearchList(i);
  // runSearchQT(i);
  // runNearestList(i);
  // runNearestQT(i);
}
