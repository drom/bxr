'use strict';

const {isPlainObject} = require('./is-plain-object.js');
const {wire} = require('./wire.js');

// built-in macro definitions
const builtins = {wire};

/**
 * @param {Object} [userMacros] - extra macros merged over the built-ins
 * @returns {Function} recursive expander (parent, index)
 */
const expandMacros = (userMacros) => {
  const macros = {...builtins, ...(userMacros || {})};

  /**
   * @param {Array} parent - parent node
   * @param {Number} index - index of the node in the parent array
   */
  const rec = (parent, index) => {
    const node = parent[index];
    if (!Array.isArray(node)) {
      return;
    }

    const tag = node[0];
    if (typeof tag !== 'string') {
      console.error('Unknown tag:', tag); // eslint-disable-line no-console
      throw new Error(`Unknown tag: ${tag}`);
    }

    const hasOpto = isPlainObject(node[1]);
    const opto = hasOpto ? node[1] : {};
    const startIndex = hasOpto ? 2 : 1;
    const args = node.slice(startIndex);

    // on enter: recursive macro expansion
    if (macros[tag]?.enter) {
      const updated = macros[tag].enter(opto, args);
      if (Array.isArray(updated) && (updated !== node)) {
        parent[index] = updated;
        // expand the replacement subtree (this expands `args` in place,
        // giving child macros their output ids) then link pins on leave.
        // Return so the original children are not expanded a second time.
        rec(parent, index);
        if (macros[tag]?.leave) {
          macros[tag].leave(opto, args);
        }
        return;
      }
    }

    // recurse into children
    for (let i = startIndex; i < node.length; i++) {
      rec(node, i);
    }

    // on leave
    if (macros[tag]?.leave) {
      macros[tag].leave(opto, args);
    }
  };

  return rec;
};

module.exports = {expandMacros};
