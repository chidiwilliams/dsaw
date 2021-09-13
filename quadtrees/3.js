const d3 = require('d3');
const { insert } = require('./quadtree');

const width = 750;
const height = 300;

const svg = d3.select('body').append('svg').attr('width', width).attr('height', height);

const quadtree = {
  boundary: {
    topLeft: { x: 0, y: 0 },
    bottomRight: { x: width, y: height },
  },
  points: [],
  depth: 1,
};

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

let pts;
let rect;

function draw() {
  rect = rect.data(nodes(quadtree));
  rect.exit().remove();
  rect
    .enter()
    .append('rect')
    .attr('class', 'node')
    .attr('x', function (d) {
      return d.boundary.topLeft.x;
    })
    .attr('y', function (d) {
      return d.boundary.topLeft.y;
    })
    .attr('width', function (d) {
      return d.boundary.bottomRight.x - d.boundary.topLeft.x;
    })
    .attr('height', function (d) {
      return d.boundary.bottomRight.y - d.boundary.topLeft.y;
    });

  pts = pts.data(points(quadtree));
  pts.exit().remove();
  pts
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

  svg.selectAll('.node').style('fill', function (d) {
    return color(d.depth);
    // return d.visited ? color(d.depth) : 'none';
  });
}

rect = svg
  .selectAll('.node')
  .data(nodes(quadtree))
  .enter()
  .append('rect')
  .attr('class', 'node')
  .attr('x', function (d) {
    return d.boundary.topLeft.x;
  })
  .attr('y', function (d) {
    return d.boundary.topLeft.y;
  })
  .attr('width', function (d) {
    return d.boundary.bottomRight.x - d.boundary.topLeft.x;
  })
  .attr('height', function (d) {
    return d.boundary.bottomRight.y - d.boundary.topLeft.y;
  });

pts = svg
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

for (let i = 0; i < 300; i++) {
  insert(quadtree, { x: Math.random() * width, y: Math.random() * height });
}

draw();

// setInterval(() => {
//   insert(quadtree, { x: Math.random() * width, y: Math.random() * height });
//   draw();
// }, 100);
