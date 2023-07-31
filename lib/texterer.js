'use strict';

module.exports = f => {
  return e => {
    if (typeof e !== 'string') {
      return e;
    }
    {
      const m = e.match(/^\(rot(?<angle>-?\d+)\)(?<tail>.+)/);
      if (m) {
        const text = m.groups.tail;
        const w = Math.ceil(f.getHeight());
        const h = Math.ceil(f.getWidth(text) + 2);
        return ['g', {w: w, h: h},
          ['text', {transform: 'rotate(' + m.groups.angle + ')', x: -h >> 1, y: w >> 1}, text]
        ];
      }
    }
    const w = Math.ceil(f.getWidth(e) + 2);
    const h = Math.ceil(f.getHeight());
    return ['g', {w: w, h: h},
      ['text', {x: w >> 1, y: h >> 1}, e]
    ];
  };
};
