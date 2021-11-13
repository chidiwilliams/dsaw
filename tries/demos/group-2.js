const d3 = require('d3');
const { alphabet } = require('../trie');
const { insert } = require('../two-level-word-check');
const { updateTree } = require('./graph');

const dictionary = (() => {
  function parse(text) {
    const words = text.split('\n').filter((t) => t.length > 0);

    const dictionary = { children: new Array(26) };
    words.forEach((word) => {
      insert(dictionary, word);
    });
    return dictionary;
  }

  return { parse };
})();

const svg = d3.select('#chart').append('svg').attr('width', '100%').attr('height', '100%');

function toD3Tree(tree, name = '', d = 0) {
  // At depth 2, the tree is a word
  if (d === 3) {
    return { name: tree, children: [] };
  }

  const node = { name, children: [], isWord: tree.isWord };
  tree.children.forEach((child, i) => {
    node.children.push(toD3Tree(child, alphabet[i], d + 1));
  });
  return node;
}

const nodeSpacing = { x: 15, y: 100 };
let tree = d3.tree().nodeSize([nodeSpacing.x, nodeSpacing.y]);

const value =
  'fruit\ndrain\ntrip\nanthem\nelbow\nsolid\nin\nappliance\ndock\ntribute\nkick\nsort\nso\nsquare\neloquent\na\nthrive\n';
d3.select('#input')
  .property('value', value)
  .on('input', (evt) => {
    updateTree(evt.target.value, tree, toD3Tree, dictionary, nodeSpacing, svg);
  });

updateTree(value, tree, toD3Tree, dictionary, nodeSpacing, svg);
