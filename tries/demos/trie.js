const d3 = require('d3');
const { parse } = require('../trie');
const { getToD3Tree, updateTree } = require('./d3');

const nodeSpacing = { x: 15, y: 50 };
const toD3Tree = getToD3Tree(0);

const value =
  'fruit\ndrain\ntrip\nanthem\ntake\nsolid\nin\ndock\ntribute\nkick\nsort\nso\nsquare\na\nthrive\n';
d3.select('#input')
  .property('value', value)
  .on('input', (evt) => {
    updateTree(toD3Tree(parse(evt.target.value)), nodeSpacing);
  });

updateTree(toD3Tree(parse(value)), nodeSpacing);
