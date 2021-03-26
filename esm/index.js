const VALUE = Symbol('value');

const {keys} = Object;

const defaultOptions = {ignoreCase: false};

const getNode = (node, key) => {
    for (let {length} = key, i = 0; i < length; i++) {
      if (!(node = node[key[i]]))
        return;
    }
    return node;
};

const pushValues = (node, values) => {
  if (VALUE in node)
    values.push(node[VALUE]);
  for (let k = keys(node), {length} = k, i = 0; i < length; i++)
    pushValues(node[k[i]], values);
};

const pushKeyValues = (node, keyValues) => {
  for (let k = keys(node), {length} = k, i = 0; i < length; i++) {
    const curr = node[k[i]];
    if (VALUE in curr)
      keyValues.push([k[i], curr[VALUE]]);
    pushKeyValues(curr, keyValues);
  }
};

/**
 * @implements Map
 */
export default class TrieMap {

  /**
   * Create a TrieMap with optional ignoreCase.
   * @param {object} options configuration with optional ignoreCase boolean flag
   */
  constructor(options = defaultOptions) {
    this.ignoreCase = !!options.ignoreCase;
    this.root = {};
  }

  /**
   * The amount of key/value pairs in the map.
   * @type {number}
   */
  get size() {
    const all = [];
    pushValues(this.root, all);
    return all.length;
  }

  clear() {
    for (const key in this.root)
      delete this.root[key];
  }

  /**
   * Remove a specific item, if found, or all items with that prefix.
   * @param {string} key the prefix or specific key to remove.
   * @param {boolean} prefix remove all items with `key` as prefix.
   * @returns 
   */
  delete(key, prefix = false) {
    if (this.ignoreCase)
      key = key.toLowerCase();
    let {root} = this;
    let i = 0, {length} = key;
    let nodes = [root];
    while (i < length) {
      if (!(root = root[key[i++]]))
        return false;
      nodes.push(root);
    }
    if (length) {
      if (prefix) {
        for (const key in nodes[--length]) {
          if (nodes[length][key] === root) {
            delete nodes[length][key];
            return true;
          }
        }
        /* c8 ignore next */
      }
      else if (VALUE in root) {
        delete root[VALUE];
        let k = keys(root);
        while (length-- && k.length < 1) {
          k = keys(nodes[length]);
          i = k.length;
          while (i--) {
            if (nodes[length][k[i]] === root) {
              delete nodes[length][k[i]];
              k.splice(i, 1);
              break;
            }
          }
          root = nodes[length];
          if (VALUE in root)
            break;
        }
        return true;
      }
    }
    return false;
  }

  *entries() {
    const all = [];
    pushKeyValues(this.root, all);
    let i = 0;
    while (i < all.length)
      yield all[i++];
  }

  forEach(callback, context) {
    const all = [];
    pushKeyValues(this.root, all);
    for (let {length} = all, i = 0; i < length; i++)
      callback.call(context, all[i][1], all[i][0], this);
  }

  /**
   * Returns a value, if found, or all values for the prefix.
   * @param {string} key the prefix or specific item to search for.
   * @param {boolean} prefix returns an array of values with same prefix.
   * @returns {any[]|any|undefined} Returns the item, if found, or an array of items with same prefix.
   */
  get(key, prefix = false) {
    const node = getNode(this.root, this.ignoreCase ? key.toLowerCase() : key);
    if (prefix) {
      const all = [];
      if (node)
        pushValues(node, all);
      return all;
    }
    return node && node[VALUE];
  }

  /**
   * Search for a specific item or generic prefix.
   * @param {string} key the specific item or prefix to search for.
   * @param {boolean} prefix if true, returns true per prefix, not item.
   * @returns 
   */
  has(key, prefix = false) {
    const node = getNode(this.root, this.ignoreCase ? key.toLowerCase() : key);
    return node ? (prefix || (VALUE in node)) : false;
  }

  keys() {
    const all = [];
    pushKeyValues(this.root, all);
    return all.map(pair => pair[0]);
  }

  set(key, value) {
    if (this.ignoreCase)
      key = key.toLowerCase();
    let {root} = this;
    for (let {length} = key, i = 0; i < length; i++)
      root = root[key[i]] || (root[key[i]] = {});
    root[VALUE] = value;
    return this;
  }

  values() {
    const all = [];
    pushKeyValues(this.root, all);
    return all.map(pair => pair[1]);
  }
};
