'use strict';

const {upTt} = require('./up-tt.js');

const box = (config) => (w, h, arr, opto) => {
  const {opacity, fill, stroke} = config;
  w = w|0;
  h = h|0;
  const style = {};
  if (opacity !== undefined) {
    style['fill-opacity'] = opacity;
  }
  if (fill !== undefined) {
    style.fill = fill;
  } else {
    style.fill = 'none';
  }
  if (stroke !== undefined) {
    style.stroke = stroke;
  }
  Object.assign(style, opto);
  let multiple = style.multiple;
  if (typeof multiple === 'number') {
    multiple = [multiple, 4, 4];
  }
  if (!Array.isArray(multiple)) {
    multiple = [1, 4, -4];
  }
  arr.map(e => upTt(e,
    ((multiple[1] > 0) ? ((multiple[0] - 1) * multiple[1]) : 0),
    ((multiple[2] > 0) ? ((multiple[0] - 1) * multiple[2]) : 0))
  );
  return ['g',
    {
      w: w + Math.abs((multiple[0] - 1) * multiple[1]),
      h: h + Math.abs((multiple[0] - 1) * multiple[2]),
      kind: 'box'
    },
    ...Array.from({length: multiple[0]}, (e, i) => ['rect', {
      width: w,
      height: h,
      x: i * multiple[1] + ((multiple[1] < 0) ? ((multiple[0] - 1) * -multiple[1]) : 0),
      y: i * multiple[2] + ((multiple[2] < 0) ? ((multiple[0] - 1) * -multiple[2]) : 0),
      ...style
    }]),
    ...arr
  ];
};

module.exports = {box};
