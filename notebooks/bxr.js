import onml from 'onml';
import {texterer} from './texterer.js';
import {openSans} from './open-sans.js';

const bxr = (obj) => {

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
    ['g', onml.tt(.5, .5), body]
  ];
  return onml.stringify(ml);
} // eslint-disable-line semi

const wd = (obj) => {
  const el = document.createElement('div');
  el.innerHTML = bxr(obj);
  return el;
};

export {bxr, wd};
