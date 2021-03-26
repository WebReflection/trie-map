const TrieMap = require('../cjs');

let tm = new TrieMap;

console.assert(tm.size === 0);
console.assert(tm.has('a') === false);
console.assert(tm.get('a') === void 0);
console.assert(tm.delete('a') === false);
console.assert(tm.set('a', 1) === tm);
console.assert(tm.has('a') === true);
console.assert(tm.get('a') === 1);
console.assert(tm.set('aaa', 3) === tm);
console.assert(tm.size === 2);
console.assert(tm.get('a', true).join(',') === '1,3');
console.assert(tm.delete('ab', true) === false);
console.assert(tm.delete('a', true) === true);
console.assert(tm.size === 0);
console.assert(tm.set('a', 1) === tm);

tm.forEach((value, key) => {
  console.assert(key === 'a');
  console.assert(value === 1);
});

tm.keys().forEach(key => {
  console.assert(key === 'a');
});

tm.values().forEach(value => {
  console.assert(value === 1);
});

for (const [key, value] of tm.entries()) {
  console.assert(key === 'a');
  console.assert(value === 1);
}

tm.delete('');
tm.set('aaa', 3);
tm.delete('aaa');
tm.clear();

tm = new TrieMap({ignoreCase: true});
tm.set('a', 1);
console.assert(tm.has('a'));
console.assert(tm.get('a') === 1);
tm.delete('a');
