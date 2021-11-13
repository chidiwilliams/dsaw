// prettier-ignore
const alphabet = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
  'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
  's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
];

/**
 * @typedef {string[][]} Trie
 */

/**
 * Creates a new dictionary from the text
 * @param {string} text
 * @returns {Trie}
 */
function parse(text) {
  const words = text.split('\n').filter((t) => t.length > 0);

  const dictionary = new Array(26);
  words.forEach((word) => {
    insert(dictionary, word);
  });
  return dictionary;
}

/**
 * Adds a new word to the dictionary
 * @param {Trie} dictionary
 * @param {string} word
 */
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

module.exports = { parse };
