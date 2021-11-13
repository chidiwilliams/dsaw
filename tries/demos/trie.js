const d3 = require('d3');
const { updateTree } = require('./graph');
const { dictionary, toD3Tree } = require('./trie-fns');

const svg = d3.select('#chart').append('svg').attr('width', '100%').attr('height', '100%');

const nodeSpacing = { x: 15, y: 50 };

const value =
  'fruit\ndrain\ntrip\nanthem\nsolid\nin\ndock\ntribute\nkick\nsort\nso\nsquare\na\nthrive\n';
d3.select('#input')
  .property('value', value)
  .on('input', (evt) => {
    updateTree(dictionary.parse(evt.target.value), toD3Tree, nodeSpacing, svg);
  });

updateTree(dictionary.parse(value), toD3Tree, nodeSpacing, svg);
