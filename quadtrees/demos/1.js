const d3 = require('d3');

const width = 750;
const height = 300;

const data = d3.range(300).map(function () {
  return [Math.random() * width, Math.random() * height];
});

const s = 100;

let ptr;

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

ptr = svg
  .append('circle')
  .attr('id', 'pt')
  .attr('r', 3)
  .attr('cx', width / 2)
  .attr('cy', height / 2)
  .style('fill', 'yellow');

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
}

draw();
