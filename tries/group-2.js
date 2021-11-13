// prettier-ignore
const alphabet = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
  'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
  's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
];

/**
 * A Node in the dictionary
 * @typedef {{children: (Trie[]), isEndOfWord?: boolean}} Trie
 */

/**
 * Creates a new dictionary from the text
 * @param {string} text
 * @returns {Trie}
 */
function parse(text) {
  const words = text.split('\n').filter((t) => t.length > 0);

  const dictionary = { children: new Array(26) };
  words.forEach((word) => {
    insert(dictionary, word);
  });
  return dictionary;
}

/**
 * Adds the word into the dictionary. At the second level
 * of the tree, it adds the word as a child node.
 *
 * @param {Trie} dictionary
 * @param {string} word
 * @returns
 */
function insert(dictionary, word) {
  // As we go deeper into the dictionary, we need to keep track
  // of the current level we're on, starting from the root dictionary
  let current = dictionary;

  // Create a child dictionary for words starting with the first character
  const firstLetterIndex = alphabet.indexOf(word[0]);
  if (!current.children[firstLetterIndex]) {
    // We've added an `isEndOfWord` flag to denote whether this child dictionary is itself a word
    current.children[firstLetterIndex] = { isEndOfWord: false, children: new Array(26) };
  }
  // Update current to point to the child dictionary
  current = current.children[firstLetterIndex];

  // If the word has only one character, then the child dictionary is a word
  if (word.length === 1) {
    current.isEndOfWord = true;
    return;
  }

  // Create a child dictionary for words starting with the second character
  const secondLetterIndex = alphabet.indexOf(word[1]);
  if (!current.children[secondLetterIndex]) {
    current.children[secondLetterIndex] = { isEndOfWord: false, children: new Array(26) };
  }
  current = current.children[secondLetterIndex];

  // If the word has two characters, then the current child dictionary is a word
  if (word.length === 2) {
    current.isEndOfWord = true;
    return;
  }

  // The word has more than two characters, push it to the current child dictionary
  current.children.push(word);
}

module.exports = { insert, parse };
