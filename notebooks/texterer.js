import onml from 'onml';

const texterer = (f, rec) =>
  (e) => {
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
    // calculate new width and height of the outer rectangular that fits the inner rectanguale rotated by angle in degrees
    const acosa = Math.abs(Math.cos(angle));
    const asina = Math.abs(Math.sin(angle));
    const w = acosa * w0 + asina * h0;
    const h = acosa * h0 + asina * w0;
    // calculate new x and y of the text element that is in the center of the outer rectangular
    const x = Math.round(w / 2);
    const y = Math.round(h / 2);
    return ['g', onml.tt(x, y, {w, h}),
      ['text', {
        transform: 'rotate(' + angleDeg + ')',
        // x: .25 * h * -asina,
        y: .25 * h0, //  *  acosa,
        ...style
      }, text]
    ];
  };

export {texterer};
