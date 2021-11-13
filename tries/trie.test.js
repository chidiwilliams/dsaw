const assert = require('assert');
const { insert, startsWith, contains } = require('./trie');

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

{
  console.log('String - find substring in string');
  assert.deepStrictEqual(contains('WWEIOFNWE', 'WEIO'), true);
  assert.deepStrictEqual(contains('WWEIOFNWE', 'NWE'), true);
  assert.deepStrictEqual(contains('WWEIOFNWE', 'WEO'), false);
  assert.deepStrictEqual(contains('WWEIOFNWE', 'ZLW'), false);
}
