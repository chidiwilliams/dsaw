// prettier-ignore
const alphabet = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
  'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
  's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
];

/**
 * @typedef {{children: Trie[], isEndOfWord?: boolean, checked?: string }} Trie
 */

/**
 * Creates a new dictionary from the text
 * @param {string} text
 * @returns {Trie}
 */
function parse(text) {
  const words = text.split('\n').filter((t) => t.length > 0);
  return insertAll(words);
}

/**
 * Creates a new dictionary from a list of words
 * @param {string[]} words
 * @returns {Trie}
 */
function insertAll(words) {
  const dictionary = { children: new Array(26) };
  words.forEach((word) => {
    insert(dictionary, word);
  });
  return dictionary;
}

/**
 * Adds a word to the dictionary
 * @param {Trie} dictionary
 * @param {string} word
 */
function insert(dictionary, word) {
  let current = dictionary;

  // For each character in the word...
  for (let i = 0; i < word.length; i++) {
    // Create a new child dictionary for this character
    const index = alphabet.indexOf(word[i]);
    if (!current.children[index]) {
      current.children[index] = { isEndOfWord: false, children: new Array(26) };
    }

    // Update the current child dictionary
    current = current.children[index];
  }

  // The deepest child dictionary represents the last character in the word
  current.isEndOfWord = true;
}

/**
 * Returns true if the tree contains the prefix
 * @param {Trie} tree
 * @param {string} prefix
 * @returns
 */
function hasPrefix(tree, prefix) {
  let node = tree;

  // For each character in the prefix...
  for (let i = 0; i < prefix.length; i++) {
    const index = alphabet.indexOf(prefix[i]);

    // If there is no child tree, there
    // are no words starting with the prefix
    if (!node.children[index]) {
      node.checked = 'failed';
      return false;
    }

    node = node.children[index];
    node.checked = 'passed';
  }

  // If child trees exist till the end of the
  // prefix, then the tree contains the prefix!
  return true;
}

/**
 * Returns all the words in the dictionary that start with the prefix
 * @param {Trie} dictionary
 * @param {string} prefix
 * @returns
 */
function startsWith(dictionary, prefix) {
  let current = dictionary;

  // For each character in the prefix...
  for (let i = 0; i < prefix.length; i++) {
    const index = alphabet.indexOf(prefix[i]);

    // If there is no child dictionary, there
    // are no words starting with the prefix
    if (!current.children[index]) return [];

    current = current.children[index];
  }

  // At the end of the prefix, we collect the words
  // in the current child dictionary and its children
  const matches = [];
  collectWords(current, prefix, matches);
  return matches;
}

/**
 * Collects all the words in the dictionary, prefixing them with `currentWord`
 * @param {Trie} dictionary
 * @param {string} currentWord
 * @param {string[]} words
 */
function collectWords(dictionary, currentWord, words) {
  // If the current dictionary is the end of the word, collect the word
  if (dictionary.isEndOfWord) words.push(currentWord);

  // Collect the words from each child dictionary
  dictionary.children.forEach((childNode, i) => {
    collectWords(childNode, currentWord + alphabet[i], words);
  });
}

module.exports = { insert, startsWith, hasPrefix, alphabet, parse, insertAll };
