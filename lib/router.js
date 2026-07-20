'use strict';

const {isPlainObject} = require('./is-plain-object.js');

const router = (root) => {
  const routo = {};
  const rec = (node) => {
    if (!Array.isArray(node)) {
      return;
    }
    const tag = node[0];
    if (typeof tag !== 'string') {
      return;
    }
    const hasOpto = isPlainObject(node[1]);
    const opto = hasOpto ? node[1] : {};
    if (opto.input) {
      const o = routo[opto.input] = routo[opto.input] || {inputs: [], outputs: []};
      o.inputs.push(opto);
    }
    if (opto.output) {
      const o = routo[opto.output] = routo[opto.output] || {inputs: [], outputs: []};
      o.outputs.push(opto);
    }
    const startIndex = hasOpto ? 2 : 1;
    for (let i = startIndex; i < node.length; i++) {
      rec(node[i]);
    }
  };
  rec(root);
  return routo;
};

module.exports = {router};
