'use strict';

const upTt = (ml, x, y) => {
  const opto = ml[1];
  const transform = opto.transform;
  if (transform) {
    const m = transform.match(/translate\((?<x>-?\d*\.?\d+)(,(?<y>-?\d*\.?\d+))?\)/);
    if (m) {
      x += parseFloat(m.groups.x || 0);
      y += parseFloat(m.groups.y || 0);
    } else {
      console.error(transform); // eslint-disable-line no-console
    }
  }
  opto.transform = 'translate(' + x + ',' + y + ')';
};

module.exports = {upTt};
