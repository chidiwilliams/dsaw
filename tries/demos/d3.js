const d3 = require('d3');
const { alphabet } = require('../trie');

/**
 * @typedef {{name: string, children: D3Tree[], isEndOfWord?: boolean, checked?: boolean}} D3Tree
 */

const svg = d3.select('#chart').append('svg').attr('width', '100%').attr('height', '100%');

/**
 * Returns a function that converts a tree to a D3-friendly version
 * @param {number} maxDepth Maximum depth where to put the full words (should be 0 for a regular prefix)
 * @returns {(tree: any, name?: string, depth?: number) => D3Tree}
 */
function getToD3Tree(maxDepth = 0) {
  return function toD3Tree(tree, name = '', depth = 0) {
    if (maxDepth && depth === maxDepth + 1) {
      return { name: tree, children: [] };
    }

    const node = { name, children: [], isEndOfWord: tree.isEndOfWord, checked: tree.checked };
    (maxDepth === 1 ? tree : tree.children).forEach((child, i) => {
      node.children.push(toD3Tree(child, alphabet[i], depth + 1));
    });
    return node;
  };
}

/**
 * Renders the tree
 * @param {D3Tree} tree
 * @param {{x:number, y:number}} nodeSpacing
 */
function updateTree(tree, nodeSpacing) {
  const root = d3.tree().nodeSize([nodeSpacing.x, nodeSpacing.y])(d3.hierarchy(tree));

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
    .attr('transform', () => `translate(${20},${(3 / 5) * height})`);
  graph.exit().remove();

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

  const nodes = newGraph
    .selectAll('g.node')
    .data(
      root.descendants(),
      (d) => `${d.data.name}-${d.data.isEndOfWord}-${d.depth}-${d.data.checked}`
    );

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
    .classed('word', (d) => !!d.data.isEndOfWord)
    .classed('checked-passed', (d) => d.data.checked === 'passed')
    .classed('checked-failed', (d) => d.data.checked === 'failed')
    .attr('transform', (d) => `translate(${d.y},${d.x})`);
  nodes.exit().remove();
}

module.exports = { updateTree, getToD3Tree };
