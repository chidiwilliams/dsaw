const { alphabet, insert } = require('../trie');

const dictionary = (() => {
  function parse(text) {
    const words = text.split('\n').filter((t) => t.length > 0);
    return insertAll(words);
  }

  function insertAll(words) {
    const dictionary = { children: new Array(26) };
    words.forEach((word) => {
      insert(dictionary, word);
    });
    return dictionary;
  }

  return { parse, insertAll };
})();

function toD3Tree(tree, name = '', d = 0) {
  const node = { name, children: [], isEndOfWord: tree.isEndOfWord, checked: tree.checked };
  tree.children.forEach((child, i) => {
    node.children.push(toD3Tree(child, alphabet[i], d + 1));
  });
  return node;
}

module.exports = { dictionary, toD3Tree };
