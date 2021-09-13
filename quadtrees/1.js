const d3 = require('d3');

const width = 750;
const height = 300;

const data = d3.range(100).map(function () {
  return [Math.random() * width, Math.random() * height];
});

const svg = d3.select('body').append('svg').attr('width', width).attr('height', height);

const s = 100;
const x1 = Math.random() * (width - s);
const y1 = Math.random() * (height - s);

const rect = svg
  .selectAll('.rect')
  .data([{ x1: x1, x2: x1 + s, y1: y1, y2: y1 + s }])
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
  const [x, y] = p;
  if (x >= x1 && x <= x1 + s && y >= y1 && y <= y1 + s) {
    p.selected = true;
  }
});

points.classed('selected', (p) => {
  return p.selected;
});

// const user = svg
//   .selectAll('.user')
//   .data([[x1 + s / 2, y1 + s / 2]])
//   .enter()
//   .append('circle')
//   .attr('class', 'center')
//   .attr('cx', function (d) {
//     return d[0];
//   })
//   .attr('cy', function (d) {
//     return d[1];
//   })
//   .attr('r', 5);
