/**
 * Returns words in the dictionary that start with the prefix
 * @param {string[]} dictionary
 * @param {string} prefix
 * @returns
 */
function startsWith(dictionary, prefix) {
  const matches = [];

  // For each word in the dictionary...
  for (let i = 0; i < dictionary.length; i++) {
    const word = dictionary[i];

    let prefixed = true;

    // Check each character in the prefix
    for (let j = 0; j < prefix.length; j++) {
      // If the character is not in the correct position in this word...
      if (prefix[j] !== word[j]) {
        // ...then the word does not start with the prefix
        prefixed = false;
      }
    }

    // After checking all the characters in the prefix,
    // if `prefixed` is still true, we have a match!
    if (prefixed) {
      matches.push(word);
    }
  }

  // Return all the correct matches
  return matches;
}

/**
 * Returns true if text contains the substring
 * @param {string} text
 * @param {string} substr
 * @returns {boolean}
 */
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

module.exports = { startsWith, contains };
