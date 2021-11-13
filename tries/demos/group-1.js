const d3 = require('d3');
const { alphabet } = require('../trie');
const { updateTree } = require('./graph');

const dictionary = (() => {
  function parse(text) {
    const words = text.split('\n').filter((t) => t.length > 0);

    const dictionary = new Array(26);
    words.forEach((word) => {
      insert(dictionary, word);
    });
    return dictionary;
  }

  // Adds a new word to the dictionary
  function insert(dictionary, word) {
    // Get the index of the first character in the alphabet.
    // `index` will be a number from 0 to 25.
    const index = alphabet.indexOf(word[0]);

    // If a group has not been made for this letter, create it
    if (!dictionary[index]) {
      dictionary[index] = [];
    }

    // Push the word to its bucket
    dictionary[index].push(word);
  }

  return { parse };
})();

const svg = d3.select('#chart').append('svg').attr('width', '100%').attr('height', '100%');

function toD3Tree(tree, name = '', d = 0) {
  // At depth 2, the tree is a word
  if (d === 2) {
    return { name: tree, children: [] };
  }

  const node = { name };
  node.children = [];
  tree.forEach((child, i) => {
    node.children.push(toD3Tree(child, alphabet[i], d + 1));
  });

  return node;
}

const nodeSpacing = { x: 15, y: 100 };
let tree = d3.tree().nodeSize([nodeSpacing.x, nodeSpacing.y]);

const value =
  'railway\nfruit\ndrain\nanthem\nelbow\nappliance\ndock\ntramp\nkick\nsort\nsquare\nthrone\ndaughter\ntub\ndirt\nclam\nwrist\n';
d3.select('#input')
  .property('value', value)
  .on('input', (evt) => {
    updateTree(evt.target.value, tree, toD3Tree, dictionary, nodeSpacing, svg);
  });

updateTree(value, tree, toD3Tree, dictionary, nodeSpacing, svg);
