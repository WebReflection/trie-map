self.trieMap = (function (exports) {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var VALUE = Symbol('value');
  var keys = Object.keys;
  var defaultOptions = {
    ignoreCase: false
  };

  var getNode = function getNode(node, key) {
    for (var length = key.length, i = 0; i < length; i++) {
      if (!(node = node[key[i]])) return;
    }

    return node;
  };

  var pushValues = function pushValues(node, values) {
    if (VALUE in node) values.push(node[VALUE]);

    for (var k = keys(node), length = k.length, i = 0; i < length; i++) {
      pushValues(node[k[i]], values);
    }
  };

  var pushKeyValues = function pushKeyValues(node, keyValues) {
    for (var k = keys(node), length = k.length, i = 0; i < length; i++) {
      var curr = node[k[i]];
      if (VALUE in curr) keyValues.push([k[i], curr[VALUE]]);
      pushKeyValues(curr, keyValues);
    }
  };
  /**
   * @implements Map
   */


  var TrieMap = /*#__PURE__*/function () {
    /**
     * Create a TrieMap with optional ignoreCase.
     * @param {object} options configuration with optional ignoreCase boolean flag
     */
    function TrieMap() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultOptions;

      _classCallCheck(this, TrieMap);

      this.ignoreCase = !!options.ignoreCase;
      this.root = {};
    }
    /**
     * The amount of key/value pairs in the map.
     * @type {number}
     */


    _createClass(TrieMap, [{
      key: "size",
      get: function get() {
        var all = [];
        pushValues(this.root, all);
        return all.length;
      }
    }, {
      key: "clear",
      value: function clear() {
        for (var key in this.root) {
          delete this.root[key];
        }
      }
      /**
       * Remove a specific item, if found, or all items with that prefix.
       * @param {string} key the prefix or specific key to remove.
       * @param {boolean} prefix remove all items with `key` as prefix.
       * @returns 
       */

    }, {
      key: "delete",
      value: function _delete(key) {
        var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        if (this.ignoreCase) key = key.toLowerCase();
        var root = this.root;
        var i = 0,
            _key = key,
            length = _key.length;
        var nodes = [root];

        while (i < length) {
          if (!(root = root[key[i++]])) return false;
          nodes.push(root);
        }

        if (length) {
          if (prefix) {
            for (var _key2 in nodes[--length]) {
              if (nodes[length][_key2] === root) {
                delete nodes[length][_key2];
                return true;
              }
            }
            /* c8 ignore next */

          } else if (VALUE in root) {
            delete root[VALUE];
            var k = keys(root);

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
              if (VALUE in root) break;
            }

            return true;
          }
        }

        return false;
      }
    }, {
      key: "entries",
      value: /*#__PURE__*/regeneratorRuntime.mark(function entries() {
        var all, i;
        return regeneratorRuntime.wrap(function entries$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                all = [];
                pushKeyValues(this.root, all);
                i = 0;

              case 3:
                if (!(i < all.length)) {
                  _context.next = 8;
                  break;
                }

                _context.next = 6;
                return all[i++];

              case 6:
                _context.next = 3;
                break;

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, entries, this);
      })
    }, {
      key: "forEach",
      value: function forEach(callback, context) {
        var all = [];
        pushKeyValues(this.root, all);

        for (var length = all.length, i = 0; i < length; i++) {
          callback.call(context, all[i][1], all[i][0], this);
        }
      }
      /**
       * Returns a value, if found, or all values for the prefix.
       * @param {string} key the prefix or specific item to search for.
       * @param {boolean} prefix returns an array of values with same prefix.
       * @returns {any[]|any|undefined} Returns the item, if found, or an array of items with same prefix.
       */

    }, {
      key: "get",
      value: function get(key) {
        var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var node = getNode(this.root, this.ignoreCase ? key.toLowerCase() : key);

        if (prefix) {
          var all = [];
          if (node) pushValues(node, all);
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

    }, {
      key: "has",
      value: function has(key) {
        var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var node = getNode(this.root, this.ignoreCase ? key.toLowerCase() : key);
        return node ? prefix || VALUE in node : false;
      }
    }, {
      key: "keys",
      value: function keys() {
        var all = [];
        pushKeyValues(this.root, all);
        return all.map(function (pair) {
          return pair[0];
        });
      }
    }, {
      key: "set",
      value: function set(key, value) {
        if (this.ignoreCase) key = key.toLowerCase();
        var root = this.root;

        for (var _key3 = key, length = _key3.length, i = 0; i < length; i++) {
          root = root[key[i]] || (root[key[i]] = {});
        }

        root[VALUE] = value;
        return this;
      }
    }, {
      key: "values",
      value: function values() {
        var all = [];
        pushKeyValues(this.root, all);
        return all.map(function (pair) {
          return pair[1];
        });
      }
    }]);

    return TrieMap;
  }();

  exports.default = TrieMap;

  return exports;

}({}).default);
