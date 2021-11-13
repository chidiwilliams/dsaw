// Returns words in the dictionary that start with the prefix
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

const dictionary = ['ant', 'antelope', 'bear', 'cat', 'dog'];
startsWith(dictionary, 'ant'); // ['ant', 'antelope']
startsWith(dictionary, 'lion'); // []
