const d3 = require('d3');
const { insert } = require('../quadtree');

const width = 750;
const height = 300;

const svg = d3.select('#target').append('svg').attr('width', width).attr('height', height);

let quadtree = {
  boundary: {
    x1: 0,
    y1: 0,
    x2: width,
    y2: height,
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
  rect = svg.selectAll('.node').data(nodes(quadtree), (node) => node.boundary);
  rect.exit().remove();
  rect
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

  svg.selectAll('.node').style('fill', function (d) {
    return color(d.depth);
  });

  pts = svg.selectAll('.point').data(points(quadtree), (p) => p.x);
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
    .attr('r', 3)
    .transition()
    .duration(2000)
    .styleTween('fill', function () {
      return d3.interpolate('red', '#999');
    });
  svg.selectAll('.point').raise();
}

rect = svg
  .selectAll('.node')
  .data(nodes(quadtree), (node) => node.boundary)
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

quadtree = {
  boundary: {
    x1: 0,
    y1: 0,
    x2: width,
    y2: height,
  },
  points: [],
  depth: 1,
};

draw();

const restartButton = document.querySelector('button#restart');
const addPointButton = document.querySelector('button#add');

addPointButton.addEventListener('click', () => {
  insert(quadtree, { x: Math.random() * width, y: Math.random() * height });
  draw();
});

restartButton.addEventListener('click', () => {
  quadtree = {
    boundary: {
      x1: 0,
      y1: 0,
      x2: width,
      y2: height,
    },
    points: [],
    depth: 1,
  };
  draw();
});
