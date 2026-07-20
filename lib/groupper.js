'use strict';

const {box} = require('./box.js');
const {upTt} = require('./up-tt.js');

const groupper = (dir, config, texter) => (args, opto) => {
  opto = opto || {};
  const padding = (opto.padding !== undefined) ? opto.padding : config.padding;
  const reverse = opto.reverse;
  let h = 0;
  let w = 0;
  const isHorizontal = (dir === 'left' || dir === 'center' || dir === 'right');
  if (isHorizontal) {
    h = padding;
  } else {
    w = padding;
  }
  const res = [];

  if (reverse) {
    args = args.reverse();
  }

  args
    .map(texter)
    .map(e => {
      if (isHorizontal) {
        w = Math.max(w, e[1].w);
      } else {
        h = Math.max(h, e[1].h);
      }
      return e;
    })
    .map(e => {
      switch (dir) {
      case 'left':
        upTt(e, padding, h);
        break;
      case 'right':
        upTt(e, padding + w - e[1].w, h);
        break;
      case 'center':
        upTt(e, padding + (w - e[1].w) / 2, h);
        break;
      case 'top':
        upTt(e, w, padding);
        break;
      case 'bottom':
        upTt(e, w, padding + h - e[1].h);
        break;
      case 'middle':
        upTt(e, w, padding + (h - e[1].h) / 2);
        break;
      }
      res.push(e);
      if (isHorizontal) {
        h += (e[1].h + padding);
      } else {
        w += (e[1].w + padding);
      }
    });
  if (isHorizontal) {
    w += padding * 2;
  } else {
    h += padding * 2;
  }
  return box(config)(w, h, res, opto);
};

module.exports = {groupper};
