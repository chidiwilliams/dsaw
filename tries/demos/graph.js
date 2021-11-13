const d3 = require('d3');

function updateTree(text, tree, toD3Tree, dictionary, nodeSpacing, svg) {
  const root = tree(d3.hierarchy(toD3Tree(dictionary.parse(text))));

  // The tree is 90 deg. rotated, so the x, y values are reversed from here on

  let minX = Infinity;
  let maxX = -minX;
  root.each((d) => {
    if (d.x < minX) minX = d.x;
    if (d.x > maxX) maxX = d.x;
  });

  const height = maxX - minX + nodeSpacing.x / 2;

  let graph = svg.selectAll('g.graph').data([true]);
  const newGraph = graph
    .enter()
    .append('g')
    .classed('graph', () => true)
    .merge(graph)
    .attr('transform', () => `translate(${20},${20 + height / 2})`);
  graph.exit().remove();

  const nodes = newGraph
    .selectAll('g.node')
    .data(root.descendants(), (d) => `${d.data.name}-${d.depth}`);

  const newNodes = nodes
    .enter()
    .append('g')
    .classed('node', () => true);
  newNodes.append('circle').attr('fill', '#aaa').attr('r', 3);
  newNodes
    .append('text')
    .text((d) => d.data.name)
    .attr('dy', '0.32em')
    .attr('x', (d) => (d.children ? -6 : 6))
    .attr('text-anchor', (d) => (d.children ? 'end' : 'start'));
  newNodes
    .merge(nodes)
    .classed('word', (d) => !!d.data.isWord)
    .attr('transform', (d) => `translate(${d.y},${d.x})`);
  nodes.exit().remove();

  const links = newGraph.selectAll('path').data(root.links());
  links
    .enter()
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', '#aaa')
    .attr('stroke-opacity', 0.4)
    .attr('stroke-width', 1.5)
    .merge(links)
    .attr(
      'd',
      d3
        .linkHorizontal()
        .x((d) => d.y)
        .y((d) => d.x)
    );
  links.exit().remove();
}

module.exports = { updateTree };
