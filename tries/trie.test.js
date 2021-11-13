const assert = require('assert');
const { insert, startsWith } = require('./trie');

{
  console.log('Trie - find words starting with a prefix');
  const dictionary = { children: new Array(26) };
  insert(dictionary, 'a');
  insert(dictionary, 'abe');
  insert(dictionary, 'abelt');
  insert(dictionary, 'eba');
  assert.deepStrictEqual(startsWith(dictionary, 'ab'), ['abe', 'abelt']);
  assert.deepStrictEqual(startsWith(dictionary, 'abe'), ['abe', 'abelt']);
}
