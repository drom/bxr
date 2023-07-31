'use strict';

const tt = require('onml/tt');

const box = (w, h, arr) => {
  w = w|0;
  h = h|0;
  return ['g', {w, h},
    ['rect', {width: w, height: h}]
  ].concat(arr || []);
};

const attr = (obj, box) => {
  Object.assign(box[1], obj);
  return box;
};

const bxr = config => {
  const {texter} = config;

  function left () {
    let h = config.padding;
    let w = 0;
    const res = [];
    Array
      .from(arguments)
      .map(texter)
      .map(e => { w = Math.max(w, e[1].w); return e; })
      .map(e => {
        res.push(['g', tt(config.padding, h), e]);
        h += (e[1].h + config.padding);
      });
    w += config.padding * 2;
    return box(w, h, res);
  }

  function right () {
    let h = config.padding;
    let w = 0;
    const res = [];
    Array
      .from(arguments)
      .map(texter)
      .map(e => { w = Math.max(w, e[1].w); return e; })
      .map(e => {
        res.push(['g', tt(config.padding + w - e[1].w, h), e]);
        h += (e[1].h + config.padding);
      });
    w += config.padding * 2;
    return box(w, h, res);
  }

  function center () {
    let h = config.padding;
    let w = 0;
    const res = [];
    Array
      .from(arguments)
      .map(texter)
      .map(e => { w = Math.max(w, e[1].w); return e; })
      .map(e => {
        res.push(['g', tt(config.padding + (w - e[1].w) / 2, h), e]);
        h += (e[1].h + config.padding);
      });
    w += config.padding * 2;
    return box(w, h, res);
  }

  function top () {
    let h = 0;
    let w = config.padding;
    const res = [];
    Array
      .from(arguments)
      .map(texter)
      .map(e => { h = Math.max(h, e[1].h); return e; })
      .map(e => {
        res.push(['g', tt(w, config.padding), e]);
        w += (e[1].w + config.padding);
      });
    h += config.padding * 2;
    return box(w, h, res);
  }

  function bottom () {
    let h = 0;
    let w = config.padding;
    const res = [];
    Array
      .from(arguments)
      .map(texter)
      .map(e => { h = Math.max(h, e[1].h); return e; })
      .map(e => {
        res.push(['g', tt(w, config.padding + h - e[1].h), e]);
        w += e[1].w + config.padding;
      });
    h += config.padding * 2;
    return box(w, h, res);
  }

  function middle () {
    let h = 0;
    let w = config.padding;
    const res = [];
    Array
      .from(arguments)
      .map(texter)
      .map(e => { h = Math.max(h, e[1].h); return e; })
      .map(e => {
        res.push(['g', tt(w, config.padding + (h - e[1].h) / 2), e]);
        w += e[1].w + config.padding;
      });
    h += config.padding * 2;
    return box(w, h, res);
  }

  return {
    left, center, right,
    top, bottom, middle,
    box, attr
  };
};

module.exports = bxr;
