'use strict';

const onml = require('onml');

const html = (str, ...args) => {
  return str.reduce((acc, e, i) => acc + e + (args[i] || ''), '');
};

let wd;
let openSans;
let texterer;


// observable notebook cells for `bxr` in `wavedrom`

// BEGIN cut cell 1
openSans = function () {
  const table = [
      '6.875',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '3.21875',
      '2.65625',
      '3.203125',
      '5.15625',
      '6.6875',
      '6.203125',
      '8.75',
      '8.859375',
      '3.359375',
      '4.21875',
      '6.234375',
      '10.84375',
      '9.046875',
      '9.359375',
      '7.234375',
      '11.109375',
      '3.953125',
      '6.9375',
      '7.359375',
      '7.375',
      '3.046875',
      '4.046875',
      '11.171875',
      '7.25',
      '4.25',
      '6.609375'
    ], baseSize = 12, height = 17, descent = 5.949999999999999, defaultWidth = 9.04296875, re = new RegExp('([1])|([,])|([\\(\\)\\-\\[])|(["/\\\\fr\\{\\}])|([csz])|([\\$\\*\\+023456789<=>STXYZ\\^_egkvxy~])|([#ABCKRV])|([&D])|([%w])|([@])|([!])|([\'])|([\\.:;])|([\\?])|([Ea])|([F])|([GU])|([H])|([I])|([J])|([L])|([M])|([N])|([OQ])|([P])|([W])|([\\]])|([`])|([bdpq])|([hnu])|([il])|([j])|([m])|([o])|([t])|([\\|])');
  return function (fontSize) {
    const ratio = fontSize / baseSize;
    const getIndex = ch => {
      const m = ch.match(re);
      if (m !== null)
        for (let i = 0; i < table.length; i += 1)
          if (m[i + 1] !== undefined)
            return i;
    };
    const getWidth = str => {
      return str.split('').reduce((acc, e) => acc + (table[getIndex(e)] || defaultWidth) * ratio, 0);
    };
    return {
      getHeight: function () {
        return ratio * height;
      },
      getDescent: function () {
        return ratio * descent;
      },
      getWidth: getWidth
    };
  };
};
// END cut cell 1

// BEGIN cut cell 2
texterer = (f, rec) =>
  (e) => {
    if (Array.isArray(e)) {
      return rec(e);
    }
    const style = {
      'font-family': 'Helvetica',
      'text-anchor': 'middle',
      'alignment-baseline': 'middle',
      'font-size': '16px'
    };
    {
      e = e.toString();
      const m = e.match(/^\(rot(?<angle>-?\d+)\)(?<tail>.+)/);
      if (m) {
        const text = m.groups.tail;
        const w = Math.ceil(f.getHeight());
        const h = Math.ceil(f.getWidth(text) + 2);
        return ['g', {w: w, h: h},
          ['text', {
            transform: 'rotate(' + m.groups.angle + ')',
            x: -h >> 1,
            y: w >> 1,
            ...style
          }, text]
        ];
      }
    }
    const w = Math.ceil(f.getWidth(e) + 2);
    const h = Math.ceil(f.getHeight());
    return ['g', {w: w, h: h},
      ['text', {x: w >> 1, y: h >> 1, ...style}, e]
    ];
  };
// END cut cell 2

// BEGIN cut cell 3
wd = (obj) => {

  const isPlainObject = (val) => val && (typeof val === 'object') && !Array.isArray(val);

  const reComponents = (components, config, texter, tt) => {
    const {padding, opacity, fill, stroke} = config;

    const box = (w, h, arr, opto) => {
      w = w|0;
      h = h|0;
      const style = {};
      if (opacity !== undefined) {
        style['fill-opacity'] = opacity;
      }
      if (fill !== undefined) {
        style.fill = fill;
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
      const xOffset = (multiple[1] < 0) ? ((multiple[0] - 1) * -multiple[1]) : 0;
      const yOffset = (multiple[2] < 0) ? ((multiple[0] - 1) * -multiple[2]) : 0;
      return ['g',
        {
          w: w + Math.abs((multiple[0] - 1) * multiple[1]),
          h: h + Math.abs((multiple[0] - 1) * multiple[2])
        },
        ...Array.from({length: multiple[0]}, (e, i) =>
          ['rect', {
            width: w,
            height: h,
            x: i * multiple[1] + ((multiple[1] < 0) ? ((multiple[0] - 1) * -multiple[1]) : 0),
            y: i * multiple[2] + ((multiple[2] < 0) ? ((multiple[0] - 1) * -multiple[2]) : 0),
            ...style
          }]),
          ['g', tt(
            ((multiple[1] > 0) ? ((multiple[0] - 1) * multiple[1]) : 0),
            ((multiple[2] > 0) ? ((multiple[0] - 1) * multiple[2]) : 0)
           ), ...(arr || [])]
      ];
    };

    // const attr = (obj, box) => {
    //   Object.assign(box[1], obj);
    //   return box;
    // };

    const groupper = (dir) => (args, opto) => {
      opto = opto || {};
      let padding = (opto.padding !== undefined) ? opto.padding : config.padding;
      let h = 0;
      let w = 0;
      switch (dir) {
      case 'left':
      case 'right':
      case 'center':
        h = padding;
        break;
      case 'top':
      case 'bottom':
      case 'middle':
        w = padding;
        break;
      }
      const res = [];
      args
        .map(texter)
        .map(e => {
          if (dir === 'left' || dir === 'right' || dir === 'center') {
            w = Math.max(w, e[1].w);
          } else {
            h = Math.max(h, e[1].h);
          }
          return e;
        })
        .map(e => {
          switch(dir) {
          case 'left':
            res.push(['g', tt(padding, h), e]);
            break;
          case 'right':
            res.push(['g', tt(padding + w - e[1].w, h), e]);
            break;
          case 'center':
            res.push(['g', tt(padding + (w - e[1].w) / 2, h), e]);
            break;
          case 'top':
            res.push(['g', tt(w, padding), e]);
            break;
          case 'bottom':
            res.push(['g', tt(w, padding + h - e[1].h), e]);
            break;
          case 'middle':
            res.push(['g', tt(w, padding + (h - e[1].h) / 2), e]);
            break;
          }
          switch (dir) {
          case 'left':
          case 'right':
          case 'center':
            h += (e[1].h + padding);
            break;
          case 'top':
          case 'bottom':
          case 'middle':
            w += (e[1].w + padding);
            break;
          }
        });
      switch (dir) {
      case 'left':
      case 'right':
      case 'center':
        w += padding * 2;
        break;
      case 'top':
      case 'bottom':
      case 'middle':
        h += padding * 2;
        break;
      }
      return box(w, h, res, opto);
    };

    components.left = groupper('left');
    components.center = groupper('center');
    components.right = groupper('right');
    components.top = groupper('top');
    components.middle = groupper('middle');
    components.bottom = groupper('bottom');
    components.box = (args, opto) => {
      const {w, h} = opto;
      return box(w, h, args, opto);
    };
  };

  const config = obj.config || {};
  config.padding = config.padding || 0;

  const tt = onml.tt;
  const components = {};
  const rec = (node) => {
    if (Array.isArray(node)) {
      const tag = node[0];
      if (typeof tag !== 'string') {
        console.error('Unknown tag:', tag); // eslint-disable-line no-console
        throw new Error(`Unknown tag: ${tag}`);
      }
      const component = components[tag];
      if (component) {
        if (isPlainObject(node[1])) {
          return component([...node.slice(2)], node[1]);
        }
        return component([...node.slice(1)], {});
      }
      return node;
    }
    return node.toString();
  };
  const texter = texterer(openSans()(14), rec);
  reComponents(components, config, texter, tt);
  const body = rec(obj.bxr);
  const ml = [...onml.gen.svg(body[1].w + 1, body[1].h + 1),
    // ['style', obj.style],
    ['g', onml.tt(.5, .5), body]
  ];
  return html`${onml.stringify(ml)}`;
} // eslint-disable-line semi
// END cut cell 3

exports.wd = wd;
