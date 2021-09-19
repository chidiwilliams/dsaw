const d3 = require('d3');
const { insert, distance, distanceToBoundary } = require('../quadtree');

const width = Math.min(window.innerWidth, 750);
const height = 300;

const data = d3
  .range((width * height) / 600)
  .map(() => [Math.random() * width, Math.random() * height]);

const quadtree = {
  boundary: {
    x1: 0,
    y1: 0,
    x2: width,
    y2: height,
  },
  points: [],
  depth: 1,
};
data.forEach(([x, y]) => {
  insert(quadtree, { x, y });
});

const svg = d3
  .select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .on('click', function (e) {
    const [x, y] = d3.pointer(e, d3.selectAll('svg').node());
    svg.selectAll('#pt').attr('cx', x).attr('cy', y);
    draw();
  });

let rect = svg
  .selectAll('.node')
  .data(nodes(quadtree))
  .enter()
  .append('rect')
  .attr('class', 'node')
  .attr('x', function (d) {
    return d.boundary.x1;
  })
  .attr('y', function (d) {
    return d.boundary.y1;
  })
  .attr('width', function (d) {
    return d.boundary.x2 - d.boundary.x1;
  })
  .attr('height', function (d) {
    return d.boundary.y2 - d.boundary.y1;
  });

let pts = svg
  .selectAll('.point')
  .data(points(quadtree))
  .enter()
  .append('circle')
  .attr('class', 'point')
  .attr('cx', function (d) {
    return d.x;
  })
  .attr('cy', function (d) {
    return d.y;
  })
  .attr('r', 3);

let ptr = svg
  .append('circle')
  .attr('id', 'pt')
  .attr('r', 3)
  .attr('cx', width / 2)
  .attr('cy', height / 2)
  .style('fill', 'yellow');

const color = d3.scaleLinear().domain([0, 8]).range(['#efe', '#060']);

function nodes(quadtree) {
  quadtree.depth = 0;

  const nodes = [];
  visit(quadtree, (node) => {
    nodes.push(node);
  });
  return nodes;
}

function points(quadtree) {
  return nodes(quadtree).flatMap((node) => node.points);
}

function visit(node, cb) {
  cb(node);

  if (node.topLeftChild) {
    node.topLeftChild.depth = node.depth + 1;
    visit(node.topLeftChild, cb);

    node.topRightChild.depth = node.depth + 1;
    visit(node.topRightChild, cb);

    node.bottomLeftChild.depth = node.depth + 1;
    visit(node.bottomLeftChild, cb);

    node.bottomRightChild.depth = node.depth + 1;
    visit(node.bottomRightChild, cb);
  }
}

function draw() {
  ptr = d3.selectAll('#pt');
  const x = +ptr.attr('cx');
  const y = +ptr.attr('cy');

  pts.each((d) => {
    d.scanned = d.selected = false;
  });
  rect.each((d) => {
    d.visited = false;
  });

  const nearestPoint = nearest(quadtree, { x, y });
  nearestPoint.point.selected = true;

  pts.classed('scanned', (d) => d.scanned);
  pts.classed('selected', (d) => d.selected);
  rect.style('fill', (d) => (d.visited ? color(d.depth) : 'none'));
}

function nearest(node, location, nearestPoint = { point: null, distance: Number.MAX_VALUE }) {
  node.visited = true;

  if (distanceToBoundary(location, node.boundary) > nearestPoint.distance) {
    return nearestPoint;
  }

  if (!node.topLeftChild) {
    node.points.forEach((point) => {
      point.scanned = true;
      const d = distance(location, point);
      if (d < nearestPoint.distance) {
        nearestPoint.point = point;
        nearestPoint.distance = d;
      }
    });
    return nearestPoint;
  }

  const childNodes = [
    node.topLeftChild,
    node.topRightChild,
    node.bottomLeftChild,
    node.bottomRightChild,
  ];

  const isTop = location.y < (node.boundary.y1 + node.boundary.y2) / 2;
  const isLeft = location.x < (node.boundary.x1 + node.boundary.x2) / 2;

  nearestPoint = nearest(childNodes[2 * (1 - isTop) + 1 * (1 - isLeft)], location, nearestPoint);
  nearestPoint = nearest(childNodes[2 * (1 - isTop) + 1 * isLeft], location, nearestPoint);
  nearestPoint = nearest(childNodes[2 * isTop + 1 * (1 - isLeft)], location, nearestPoint);
  nearestPoint = nearest(childNodes[2 * isTop + 1 * isLeft], location, nearestPoint);
  return nearestPoint;
}

draw();
