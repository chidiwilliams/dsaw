const d3 = require('d3');

const width = 750;
const height = 300;

const data = d3.range(100).map(function () {
  return [Math.random() * width, Math.random() * height];
});

const svg = d3.select('body').append('svg').attr('width', width).attr('height', height);

const midX = width / 2;
const midY = height / 2;

const sections = svg
  .selectAll('.node')
  .data([
    { x1: 0, x2: midX, y1: 0, y2: midY },
    { x1: midX, x2: width, y1: 0, y2: midY },
    { x1: 0, x2: midX, y1: midY, y2: height },
    { x1: midX, x2: width, y1: midY, y2: height },
  ])
  .enter()
  .append('rect')
  .attr('class', 'node')
  .attr('x', function (d) {
    return d.x1;
  })
  .attr('y', function (d) {
    return d.y1;
  })
  .attr('width', function (d) {
    return d.x2 - d.x1;
  })
  .attr('height', function (d) {
    return d.y2 - d.y1;
  });

const s = 100;
const x1 = Math.random() * (width - s);
const y1 = Math.random() * (height - s);

const sb = { x1: x1, x2: x1 + s, y1: y1, y2: y1 + s };

const searchBoundary = svg
  .selectAll('.rect')
  .data([sb])
  .enter()
  .append('rect')
  .attr('class', 'rect')
  .attr('x', function (d) {
    return d.x1;
  })
  .attr('y', function (d) {
    return d.y1;
  })
  .attr('width', function (d) {
    return d.x2 - d.x1;
  })
  .attr('height', function (d) {
    return d.y2 - d.y1;
  });

const points = svg
  .selectAll('.point')
  .data(data)
  .enter()
  .append('circle')
  .attr('class', 'point')
  .attr('cx', function (d) {
    return d[0];
  })
  .attr('cy', function (d) {
    return d[1];
  })
  .attr('r', 3);

points.each((p) => {
  if (contains(p, { x1, x2: x1 + s, y1, y2: y1 + s })) {
    p.selected = true;
  }
});

function contains(p, b) {
  const [x, y] = p;
  const { x1, x2, y1, y2 } = b;
  return x >= x1 && x <= x2 && y >= y1 && y <= y2;
}

points.classed('selected', (p) => {
  return p.selected;
});

// Get sections that intersect with sb
const ints = [];
sections.each((section) => {
  if (intersects(section, sb)) {
    ints.push(section);
  }
});

points.each((point) => {
  ints.forEach((int) => {
    if (contains(point, int)) {
      point.searched = true;
    }
  });
});

points.classed('searched', (p) => {
  return p.searched;
});

function intersects(b1, b2) {
  return (
    b1.x1 <= b2.x2 && // not too right
    b1.x2 >= b2.x1 && // not too left
    b1.y1 <= b2.y2 && // not too down
    b1.y2 >= b2.y1 // not too up
  );
}
