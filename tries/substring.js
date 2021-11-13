const { insert, hasPrefix } = require('./trie');

// {
//   function contains(str, substr) {
//     // Walking through the characters in `str`...
//     for (let i = 0; i <= str.length - substr.length; i++) {
//       // At each point, we'll keep a flag to say whether the
//       // characters from that point match the substring
//       let sameChars = true;

//       // Check if all the characters in the string
//       // (counting from index `i`) match the substring
//       for (let j = 0; j < substr.length; j++) {
//         if (str[i + j] !== substr[j]) {
//           sameChars = false;
//           break;
//         }
//       }

//       // If all the characters are the same, we have a match! :)
//       if (sameChars) return true;
//     }

//     // We can't find a match :(
//     return false;
//   }

//   console.log(contains('WEFHOIEQFEQW', 'IREW'));
//   console.log(contains('WEFHOIEQFEQW', 'HOIE'));
// }

{
  const word = 'sdajhbflwqelwejlnej';
  const suffixes = Array.from({ length: word.length }, (_, i) => word.substring(i));

  const dictionary = { children: new Array(26) };
  suffixes.forEach((suffix) => {
    insert(dictionary, suffix);
  });

  console.log(hasPrefix(dictionary, 'bfl'));
}
