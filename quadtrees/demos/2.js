const d3 = require('d3');

const width = 750;
const height = 300;

const data = d3.range(300).map(function () {
  return [Math.random() * width, Math.random() * height];
});

const svg = d3
  .select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .on('click', function (e) {
    const [x, y] = d3.pointer(e, d3.selectAll('svg').node());
    ptr.attr('cx', x).attr('cy', y);
    draw();
  });

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

let rect = svg
  .selectAll('.rect')
  .data([{}])
  .enter()
  .append('rect')
  .attr('class', 'rect')
  .attr('width', s)
  .attr('height', s);

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

let ptr = svg
  .append('circle')
  .attr('id', 'pt')
  .attr('r', 3)
  .attr('cx', width / 2)
  .attr('cy', height / 2)
  .style('fill', 'yellow');

function contains(p, b) {
  const [x, y] = p;
  const { x1, x2, y1, y2 } = b;
  return x >= x1 && x <= x2 && y >= y1 && y <= y2;
}

function intersects(b1, b2) {
  return (
    b1.x1 <= b2.x2 && // not too right
    b1.x2 >= b2.x1 && // not too left
    b1.y1 <= b2.y2 && // not too down
    b1.y2 >= b2.y1 // not too up
  );
}

function draw() {
  const ptrx = +ptr.attr('cx');
  const ptry = +ptr.attr('cy');

  rect.attr('x', ptrx - s / 2).attr('y', ptry - s / 2);

  const rx = +rect.attr('x');
  const ry = +rect.attr('y');
  const rw = +rect.attr('width');
  const rh = +rect.attr('height');

  points.each((p) => {
    const [x, y] = p;
    p.selected = x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
  });

  points.classed('selected', (p) => p.selected);

  const ints = [];
  sections.each((section) => {
    if (intersects(section, { x1: rx, x2: rx + s, y1: ry, y2: ry + s })) {
      ints.push(section);
    }
  });

  points.each((point) => {
    point.scanned = false;
    ints.forEach((int) => {
      if (contains(point, int)) {
        point.scanned = true;
      }
    });
  });

  points.classed('scanned', (p) => {
    return p.scanned;
  });
}

draw();
