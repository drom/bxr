'use strict';

// get translate offsets from transform
const {isPlainObject} = require('./is-plain-object.js');

const ttGet = (ml) => {
  const opto = ml[1];
  if (!isPlainObject(opto)) {
    return {x: 0, y: 0};
  }
  const transform = opto.transform;
  if (transform) {
    const m = transform.match(/translate\((?<x>-?\d*\.?\d+)(,(?<y>-?\d*\.?\d+))?\)/);
    if (m) {
      return {
        x: parseFloat(m.groups.x || 0),
        y: parseFloat(m.groups.y || 0)
      };
    }
  }
  return {x: 0, y: 0};
};

module.exports = {ttGet};
