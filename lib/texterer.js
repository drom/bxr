'use strict';

const onml = require('onml');

const texterer = (f, rec) => {
  return (e) => {
    if (Array.isArray(e)) {
      return rec(e);
    }
    const style = {
      'font-family': 'Helvetica',
      'text-anchor': 'middle',
      'font-size': '16px'
    };
    e = e.toString();
    let text = e;
    let angle = 0;
    let angleDeg = 0;
    {
      const m = e.match(/^\(rot(?<angle>-?\d+)\)(?<tail>.+)/);
      if (m) {
        text = m.groups.tail;
        angleDeg = parseInt(m.groups.angle);
        angle = angleDeg * Math.PI / 180;
      }
    }
    const w0 = Math.ceil(f.getWidth(text) + 2);
    const h0 = Math.ceil(f.getHeight());
    // outer bounding box of the inner box rotated by angle degrees
    const acosa = Math.abs(Math.cos(angle));
    const asina = Math.abs(Math.sin(angle));
    const w = acosa * w0 + asina * h0;
    const h = acosa * h0 + asina * w0;
    // center the text element inside the outer box
    const x = Math.round(w / 2);
    const y = Math.round(h / 2);
    return ['g', onml.tt(x, y, {w, h}),
      ['text', {
        transform: 'rotate(' + angleDeg + ')',
        y: .25 * h0,
        ...style
      }, text]
    ];
  };
};

module.exports = {texterer};
