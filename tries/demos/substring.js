const d3 = require('d3');
const { alphabet } = require('../trie');
const { updateTree } = require('./graph');
const { toD3Tree, dictionary } = require('./trie-fns');

const svg = d3.select('#chart').append('svg').attr('width', '100%').attr('height', '100%');
const nodeSpacing = { x: 12, y: 25 };

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
  const trie = dictionary.insertAll(getSuffixes(text));
  const matched = checkPrefix(trie, search);
  updateTree(trie, toD3Tree, nodeSpacing, svg);
  searchInput.classed('matched', () => matched);
}

function getSuffixes(text) {
  return Array.from({ length: text.length }, (_, i) => text.substring(i));
}

function checkPrefix(root, prefix) {
  let node = root;
  for (let i = 0; i < prefix.length; i++) {
    const index = alphabet.indexOf(prefix[i]);
    if (!node.children[index]) {
      node.checked = 'failed';
      return false;
    }

    node = node.children[index];
    node.checked = 'passed';
  }

  return true;
}

update(text, search);
