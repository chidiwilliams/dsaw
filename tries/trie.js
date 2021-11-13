// prettier-ignore
const alphabet = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
  'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
  's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
];

function insert(dictionary, word) {
  let current = dictionary;

  // For each character in the word...
  for (let i = 0; i < word.length; i++) {
    // Create a new child dictionary for this character
    const index = alphabet.indexOf(word[i]);
    if (!current.children[index]) {
      current.children[index] = { isWord: false, children: new Array(26) };
    }

    // Update the current child dictionary
    current = current.children[index];
  }

  // The deepest child dictionary represents the last character in the word
  current.isWord = true;
}

function hasPrefix(tree, prefix) {
  let current = tree;

  // For each character in the prefix...
  for (let i = 0; i < prefix.length; i++) {
    const index = alphabet.indexOf(prefix[i]);

    // If there is no child tree, there
    // are no words starting with the prefix
    if (!current.children[index]) return false;

    current = current.children[index];
  }

  // If child trees exist till the end of the
  // prefix, then the tree contains the prefix!
  return true;
}

function hasPrefix(root, prefix) {
  let node = root;
  for (let i = 0; i < prefix.length; i++) {
    const index = alphabet.indexOf(prefix[i]);
    if (!node.children[index]) return false;
    node = node.children[index];
  }

  return true;
}

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

// Collects the words in the dictionary and its children into `words`
function collectWords(dictionary, currentWord, words) {
  // If the current dictionary is the end of the word, collect the word
  if (dictionary.isWord) words.push(currentWord);

  // Collect the words from each child dictionary
  dictionary.children.forEach((childNode, i) => {
    collectWords(childNode, currentWord + alphabet[i], words);
  });
}

function contains(text, substr) {
  for (let i = 0; i <= text.length - substr.length; i++) {
    let j = 0;

    for (j = 0; j < substr.length; j++) {
      if (text[i + j] !== substr[j]) {
        break;
      }
    }

    if (j === substr.length) {
      return true;
    }
  }

  return false;
}

module.exports = { insert, startsWith, contains, hasPrefix, alphabet };
