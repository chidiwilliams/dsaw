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
    const x1 = Math.random() * w;
    const y1 = Math.random() * h;

    searchList(points, {
      x1,
      y1,
      x2: x1 + Math.random() * (w - x1),
      y2: y1 + Math.random() * (h - y1),
    });
  }
  console.timeEnd(`search-list-${n}`);
}

function runSearchQT(n) {
  const quadtree = {
    boundary: {
      x1: 0,
      y1: 0,
      x2: w,
      y2: h,
    },
    points: [],
  };
  const nodeCapacity = 400;

  console.time(`insert-tree-${n}`);
  for (let i = 0; i < n; i++) {
    insert(quadtree, { x: Math.random() * w, y: Math.random() * h }, nodeCapacity);
  }
  console.timeEnd(`insert-tree-${n}`);

  console.time(`search-tree-${n}`);
  for (let i = 0; i < n; i++) {
    const x1 = Math.random() * w;
    const y1 = Math.random() * h;

    search(quadtree, {
      x1,
      y1,
      x2: x1 + Math.random() * (w - x1),
      y2: y1 + Math.random() * (h - y1),
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
      x1: 0,
      y1: 0,
      x2: w,
      y2: h,
    },
    points: [],
  };
  const nodeCapacity = 400;

  console.time(`insert-tree-${n}`);
  for (let i = 0; i < n; i++) {
    insert(quadtree, { x: Math.random() * w, y: Math.random() * h }, nodeCapacity);
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
  runSearchList(n);
  runSearchQT(n);
  runNearestList(n);
  runNearestQT(n);
}
