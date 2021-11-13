// prettier-ignore
const alphabet = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
  'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
  's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
];

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

function startsWith(dictionary, prefix) {
  const matches = [];

  let current = dictionary;

  if (prefix.length > 2) {
    const grandChild =
      dictionary.children[alphabet.indexOf(prefix[0])].children[alphabet.indexOf(prefix[1])];
    return getMatches(grandChild, prefix);
  }

  return matches;
}

// Returns the prefix matches from a list
function getMatches(dictionary, prefix) {
  const matches = [];

  for (let i = 0; i < dictionary.length; i++) {
    const word = dictionary[i];

    let prefixed = true;
    for (let j = 0; j < prefix.length; j++) {
      if (prefix[j] !== word[j]) prefixed = false;
    }

    if (prefixed) matches.push(word);
  }

  return matches;
}

module.exports = { insert };
