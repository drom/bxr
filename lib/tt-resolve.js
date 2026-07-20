'use strict';

const {isPlainObject} = require('./is-plain-object.js');
const {ttGet} = require('./tt-get.js');
const {upTt} = require('./up-tt.js');

// ungroup tree
// propagate transform translate offsets
/**
 *
 * @param {*} parrent - parent node
 * @param {*} index - index of node in parent
 * @param {*} px - parent x offset
 * @param {*} py - parent y offset
 * @returns
 */
const ttResolve = (parrent, index, px, py) => {
  const node = parrent[index];
  if (!Array.isArray(node)) {
    return;
  }
  const tag = node[0];
  if (typeof tag !== 'string') {
    return;
  }
  const hasOpto = isPlainObject(node[1]);
  const opto = hasOpto ? node[1] : {};

  // on enter
  if (tag !== 'g' || opto.kind !== 'box') {
    upTt(node, px, py);
    return;
  }

  const {x, y} = ttGet(node);
  const tx = px + x;
  const ty = py + y;

  const startIndex = hasOpto ? 2 : 1;
  if (hasOpto) {
    delete opto.transform;
  }

  for (let i = startIndex; i < node.length; i++) {
    ttResolve(node, i, tx, ty);
  }
};

module.exports = {ttResolve};
