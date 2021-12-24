'use strict';

const tt = require('onml/tt');

const box = (w, h) => {
  w = w|0;
  h = h|0;
  return ['g', {w, h}, ['rect', {width: w, height: h}]];
};

const bxr = config => {
  const {texter} = config;

  const left = function () {
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
    return box(w, h).concat(res);
  };

  const right = function () {
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
    return box(w, h).concat(res);
  };

  const center = function () {
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
    return box(w, h).concat(res);
  };

  const top = function () {
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
    return box(w, h).concat(res);
  };

  const bottom = function () {
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
    return box(w, h).concat(res);
  };

  return {
    left, center, right,
    top, bottom,
    box
  };
};

module.exports = bxr;
