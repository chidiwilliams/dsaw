const d3 = require('d3');
const { parse } = require('../group-2');
const { getToD3Tree, updateTree } = require('./d3');

const toD3Tree = getToD3Tree(2);
const nodeSpacing = { x: 15, y: 100 };

const value =
  'fruit\ndrain\ntrip\nanthem\nelbow\nsolid\nin\nappliance\ndock\ntribute\nsort\nso\nsquare\neloquent\na\nthrive\n';
d3.select('#input')
  .property('value', value)
  .on('input', (evt) => {
    updateTree(toD3Tree(parse(evt.target.value)), nodeSpacing);
  });

updateTree(toD3Tree(parse(value)), nodeSpacing);
