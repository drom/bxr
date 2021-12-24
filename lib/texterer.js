'use strict';

module.exports = fontomer => {
  const f = fontomer()(14);
  return e => {
    if (typeof e !== 'string') {
      return e;
    }
    const w = Math.ceil(f.getWidth(e) + 2);
    const h = Math.ceil(f.getHeight());
    return ['g', {w: w, h: h},
      ['text', {x: w >> 1, y: 0.8 * h}, e]
    ];
  };
};
