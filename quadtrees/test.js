function insert(points, point) {
  points.push(point);
}

function search(points, boundary) {
  return points.filter((point) => contains(boundary, point));
}

// Returns true if point falls within boundary
function contains(boundary, point) {
  return (
    point.x >= boundary.x1 &&
    point.x <= boundary.x2 &&
    point.y >= boundary.y1 &&
    point.y <= boundary.y2
  );
}

const points = [];
insert(points, { x: 1, y: 5 });
insert(points, { x: 2, y: 1 });
insert(points, { x: 3, y: 6 });
search(points, { x1: 0, y1: 2, x2: 4, y2: 8 });
// [ { x: 1, y: 5 }, { x: 3, y: 6 } ]
