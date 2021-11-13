const d3 = require('d3');
const { parse } = require('../group-1');
const { getToD3Tree, updateTree } = require('./d3');

const toD3Tree = getToD3Tree(1);
const nodeSpacing = { x: 15, y: 100 };

const value =
  'railway\nfruit\ndrain\nanthem\nelbow\nappliance\ndock\ntramp\nkick\nsort\nsquare\nthrone\ndaughter\ntub\ndirt\nclam\nwrist\n';
d3.select('#input')
  .property('value', value)
  .on('input', (evt) => {
    updateTree(toD3Tree(parse(evt.target.value)), nodeSpacing);
  });

updateTree(toD3Tree(parse(value)), nodeSpacing);
