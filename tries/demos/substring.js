const d3 = require('d3');
const { insertAll, hasPrefix } = require('../trie');
const { getToD3Tree, updateTree } = require('./d3');

const nodeSpacing = { x: 12, y: 25 };
const toD3Tree = getToD3Tree(0);

let text = 'entrepreneurship';
let search = 'rshi';

d3.select('#text')
  .property('value', text)
  .on('input', (evt) => {
    text = evt.target.value;
    update(text, search);
  });

const searchInput = d3
  .select('#search')
  .property('value', search)
  .on('input', (evt) => {
    search = evt.target.value;
    update(text, search);
  });

function update(text, search) {
  const trie = insertAll(getSuffixes(text));
  const matched = hasPrefix(trie, search);
  updateTree(toD3Tree(trie), nodeSpacing);
  searchInput.classed('matched', () => matched);
}

function getSuffixes(text) {
  return Array.from({ length: text.length }, (_, i) => text.substring(i));
}

update(text, search);
